import { max, sum } from 'd3-array';
import { scaleBand, scaleLinear, type ScaleBand, type ScaleLinear } from 'd3-scale';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChartVariable } from '../../../../core/utils/portal-charts';

export const DEFAULT_HEIGHT = 280;

const DEFAULT_MARGINS = { top: 8, bottom: 24, right: 8, left: 36 };

export interface ChartMargins {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

export interface ChartScales {
  bandScale: ScaleBand<string>;
  linearScale: ScaleLinear<number, number>;
  subBandScale: ScaleBand<string>;
}

interface CreateScalesOptions {
  data: Record<string, unknown>[];
  variables: ChartVariable[];
  indexName: string;
  layout: 'stacked' | 'grouped';
  padding: number;
  groupPadding: number;
  visWidth: number;
  visHeight: number;
  domainY?: [number, number];
}

function createScales({
  data,
  variables,
  indexName,
  layout,
  padding,
  groupPadding,
  visWidth,
  visHeight,
  domainY,
}: CreateScalesOptions): ChartScales | null {
  if (!data.length || !variables.length || !indexName || visWidth <= 0) {
    return null;
  }

  const bandScale = scaleBand<string>()
    .domain(data.map((d) => String(d[indexName])))
    .range([0, visWidth])
    .padding(padding);

  const maxY =
    layout === 'stacked'
      ? max(data, (d) => sum(variables, (v) => Number(d[v.id]) || 0))
      : max(data, (d) => max(variables, (v) => Number(d[v.id]) || 0));

  const domain = domainY ?? (maxY === 0 || maxY == null ? [0, 1] : [0, maxY]);

  const linearScale = scaleLinear().domain(domain).range([visHeight, 0]);
  if (!domainY) linearScale.nice();

  const subBandScale = scaleBand<string>()
    .domain(variables.map((v) => v.id))
    .range([0, bandScale.bandwidth()])
    .padding(groupPadding);

  return { bandScale, linearScale, subBandScale };
}

export interface UsePortalChartOptions {
  data: Record<string, unknown>[];
  variables: ChartVariable[];
  indexName: string;
  layout: 'stacked' | 'grouped';
  titleAxisX?: string;
  titleAxisY?: string;
  height: number;
  width?: number;
  margins?: Partial<ChartMargins>;
  padding: number;
  groupPadding: number;
  domainY?: [number, number];
  idProp?: string;
}

export function usePortalChart({
  data,
  variables,
  indexName,
  layout,
  titleAxisX,
  titleAxisY,
  height,
  width: fixedWidth,
  margins: marginsProp,
  padding,
  groupPadding,
  domainY,
  idProp,
}: UsePortalChartOptions) {
  const autoId = useId().replace(/:/g, '');
  const id = idProp || `chart-${autoId}`;
  const margins: ChartMargins = {
    ...DEFAULT_MARGINS,
    bottom: DEFAULT_MARGINS.bottom + (titleAxisX ? 20 : 0),
    left: DEFAULT_MARGINS.left + (titleAxisY ? 22 : 0),
    ...marginsProp,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = () => setContainerWidth(node.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const svgWidth = fixedWidth ?? Math.max(0, containerWidth);
  const svgHeight = height;
  const visWidth = Math.max(0, svgWidth - margins.left - margins.right);
  const visHeight = Math.max(0, svgHeight - margins.top - margins.bottom);

  const scales = useMemo(
    () =>
      createScales({
        data,
        variables,
        indexName,
        layout,
        padding,
        groupPadding,
        visWidth,
        visHeight,
        domainY,
      }),
    [data, variables, indexName, layout, padding, groupPadding, visWidth, visHeight, domainY],
  );

  const cx = margins.left + visWidth / 2;
  const cy = margins.top + visHeight / 2;

  return { id, margins, containerRef, svgWidth, svgHeight, visWidth, visHeight, scales, cx, cy };
}
