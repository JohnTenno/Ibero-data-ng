import type { Series, SeriesPoint } from 'd3-shape';
import { usePortalChartBars } from './usePortalChartBars';
import type { ChartMargins, ChartScales } from './usePortalChart';
import type { ChartVariable } from '../../../../core/utils/portal-charts';

function barGeometry(
  d: SeriesPoint<Record<string, unknown>>,
  cat: string,
  scales: ChartScales,
  layout: 'stacked' | 'grouped',
  seriesKey: string,
) {
  const { bandScale, linearScale, subBandScale } = scales;
  const stacked = layout === 'stacked';

  return {
    x: stacked ? (bandScale(cat) ?? 0) : (bandScale(cat) ?? 0) + (subBandScale(seriesKey) ?? 0),
    y: stacked ? linearScale(d[1]) : linearScale(d[1] - d[0]),
    height: Math.max(0, linearScale(d[0]) - linearScale(d[1])),
    width: stacked ? bandScale.bandwidth() : subBandScale.bandwidth(),
  };
}

export interface PortalChartBarsProps {
  data: Record<string, unknown>[];
  variables: ChartVariable[];
  indexName: string;
  layout?: 'stacked' | 'grouped';
  scales: ChartScales | null;
  margins: ChartMargins;
}

export function PortalChartBars({ data, variables, indexName, layout = 'stacked', scales, margins }: PortalChartBarsProps) {
  const { colorById, stackedData } = usePortalChartBars({ data, variables });

  if (!scales) return null;

  const categories = scales.bandScale.domain();
  const barsHeight = Math.max(0, ...scales.linearScale.range());

  return (
    <g className="bars-container" transform={`translate(${margins.left}, ${margins.top})`}>
      <g className="bars-background">
        {categories.map((cat) => (
          <rect
            key={`bg-${cat}`}
            className="bar-background"
            x={scales.bandScale(cat)}
            y={0}
            width={scales.bandScale.bandwidth()}
            height={barsHeight}
          />
        ))}
      </g>
      {stackedData.map((series: Series<Record<string, unknown>, string>) => (
        <g key={series.key} className="bars-subcategory" fill={colorById.get(series.key) || undefined}>
          {series.map((d) => {
            const cat = String(d.data[indexName]);
            const { x, y, width, height } = barGeometry(d, cat, scales, layout, series.key);

            return <rect key={`${series.key}-${cat}`} className={`bar ${series.key}`} x={x} y={y} width={width} height={height} />;
          })}
        </g>
      ))}
    </g>
  );
}
