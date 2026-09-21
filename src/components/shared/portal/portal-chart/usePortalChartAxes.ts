import { max } from 'd3-array';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
import { select } from 'd3-selection';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import { useEffect, useMemo, useRef } from 'react';
import type { ChartScales } from './usePortalChart';

function paintAxisX(node: SVGGElement | null, bandScale: ScaleBand<string>, angle: number) {
  if (!node) return;
  const axis = select(node);
  axis.call(axisBottom(bandScale));
  axis.selectAll('path').remove();
  axis.selectAll('line').remove();
  axis
    .selectAll('text')
    .attr('class', 'viz-values-axes')
    .attr('transform', `translate(0,8)rotate(${angle})`)
    .attr('dy', `${-Math.abs(angle / 90)}em`)
    .style('dominant-baseline', angle !== 0 ? 'middle' : 'inherit')
    .style('text-anchor', angle < 0 ? 'end' : angle === 0 ? 'middle' : 'start');
}

function paintAxisY(
  node: SVGGElement | null,
  {
    linearScale,
    align,
    visWidth,
    angle,
    tickCountY,
  }: { linearScale: ScaleLinear<number, number>; align: 'left' | 'right'; visWidth: number; angle: number; tickCountY?: number },
) {
  if (!node) return;
  const axis = select(node);
  const constructor = align === 'left' ? axisLeft : axisRight;
  const axisConfig = constructor(linearScale);
  if (tickCountY) axisConfig.ticks(tickCountY);
  axis.call(axisConfig);
  axis.selectAll('path').remove();
  axis
    .selectAll('text')
    .attr('transform', `translate(${align === 'left' ? '-5' : '5'},0)rotate(${angle})`)
    .attr('dy', '0em')
    .attr('x', '0')
    .attr('class', 'viz-values-axes')
    .style('dominant-baseline', 'middle')
    .text((d) => Number(d).toLocaleString('en'));
  axis
    .selectAll('g.tick line')
    .attr('x1', '0')
    .attr('y1', '0')
    .attr('x2', align === 'left' ? visWidth : -visWidth)
    .attr('y2', '0')
    .attr('class', 'viz-line-axes');
  axis.selectAll('line.viz-line-base').remove();
  axis
    .append('line')
    .attr('class', 'viz-line-base')
    .attr('x1', '0')
    .attr('y1', max(linearScale.range()) ?? 0)
    .attr('x2', align === 'left' ? visWidth : -visWidth)
    .attr('y2', max(linearScale.range()) ?? 0);
}

export interface UsePortalChartAxesOptions {
  scales: ChartScales | null;
  visWidth: number;
  visHeight: number;
  axisYAlign: 'left' | 'right';
  labelAngleAxisX: number;
  labelAngleAxisY: number;
  tickCountY?: number;
}

export function usePortalChartAxes({
  scales,
  visWidth,
  visHeight,
  axisYAlign,
  labelAngleAxisX,
  labelAngleAxisY,
  tickCountY,
}: UsePortalChartAxesOptions) {
  const axisXRef = useRef<SVGGElement>(null);
  const axisYLeftRef = useRef<SVGGElement>(null);
  const axisYRightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!scales) return;

    const { bandScale, linearScale } = scales;
    paintAxisX(axisXRef.current, bandScale, labelAngleAxisX);

    const yOptions = { linearScale, visWidth, angle: labelAngleAxisY, tickCountY };

    if (axisYAlign === 'left') {
      paintAxisY(axisYLeftRef.current, { ...yOptions, align: 'left' });
      if (axisYRightRef.current) select(axisYRightRef.current).selectAll('*').remove();
    } else {
      paintAxisY(axisYRightRef.current, { ...yOptions, align: 'right' });
      if (axisYLeftRef.current) select(axisYLeftRef.current).selectAll('*').remove();
    }
  }, [scales, labelAngleAxisX, labelAngleAxisY, axisYAlign, tickCountY, visWidth]);

  const verticalLines = useMemo(
    () =>
      scales && visHeight > 0
        ? Array.from({ length: scales.bandScale.domain().length + 1 }, (_, i) => ({
            key: `v-${i}`,
            x: i * scales.bandScale.step(),
          }))
        : null,
    [scales, visHeight],
  );

  return { axisXRef, axisYLeftRef, axisYRightRef, verticalLines };
}
