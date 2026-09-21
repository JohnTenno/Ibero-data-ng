import { usePortalChartAxes } from './usePortalChartAxes';
import type { ChartMargins, ChartScales } from './usePortalChart';

export interface PortalChartAxesProps {
  scales: ChartScales | null;
  margins: ChartMargins;
  svgHeight: number;
  visHeight: number;
  svgWidth: number;
  visWidth: number;
  axisYAlign?: 'left' | 'right';
  labelAngleAxisX?: number;
  labelAngleAxisY?: number;
  tickCountY?: number;
}

export function PortalChartAxes({
  scales,
  margins,
  svgHeight,
  visHeight,
  svgWidth,
  visWidth,
  axisYAlign = 'left',
  labelAngleAxisX = 0,
  labelAngleAxisY = 0,
  tickCountY,
}: PortalChartAxesProps) {
  const { axisXRef, axisYLeftRef, axisYRightRef, verticalLines } = usePortalChartAxes({
    scales,
    visWidth,
    visHeight,
    axisYAlign,
    labelAngleAxisX,
    labelAngleAxisY,
    tickCountY,
  });

  return (
    <>
      <g className="vertical-lines" transform={`translate(${margins.left}, ${margins.top})`}>
        {verticalLines?.map(({ key, x }) => (
          <line key={key} className="viz-line-axes" x1={x} y1={0} x2={x} y2={visHeight} />
        ))}
      </g>
      <g ref={axisXRef} className="axis-x-bottom" transform={`translate(${margins.left}, ${svgHeight - margins.bottom})`} />
      <g ref={axisYLeftRef} className="axis-y-left" transform={`translate(${margins.left}, ${margins.top})`} />
      <g ref={axisYRightRef} className="axis-y-right" transform={`translate(${svgWidth - margins.right}, ${margins.top})`} />
    </>
  );
}
