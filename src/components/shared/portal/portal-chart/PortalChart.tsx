import type { HTMLAttributes } from 'react';
import { PortalChartBars } from './PortalChartBars';
import { PortalChartAxes } from './PortalChartAxes';
import { usePortalChart, DEFAULT_HEIGHT, type ChartMargins } from './usePortalChart';
import type { ChartVariable } from '../../../../core/utils/portal-charts';
import './portal-chart.css';

export interface PortalChartProps extends HTMLAttributes<HTMLDivElement> {
  data?: Record<string, unknown>[];
  variables?: ChartVariable[];
  indexName: string;
  layout?: 'stacked' | 'grouped';
  titleAxisX?: string;
  titleAxisY?: string;
  showLegend?: boolean;
  height?: number;
  width?: number;
  margins?: Partial<ChartMargins>;
  padding?: number;
  groupPadding?: number;
  axisYAlign?: 'left' | 'right';
  labelAngleAxisX?: number;
  labelAngleAxisY?: number;
  tickCountY?: number;
  domainY?: [number, number];
  id?: string;
}

export function PortalChart({
  data = [],
  variables = [],
  indexName,
  layout = 'stacked',
  titleAxisX = '',
  titleAxisY = '',
  showLegend = true,
  height = DEFAULT_HEIGHT,
  width: fixedWidth,
  margins: marginsProp,
  padding = 0.4,
  groupPadding = 0.1,
  axisYAlign = 'left',
  labelAngleAxisX = 0,
  labelAngleAxisY = 0,
  tickCountY,
  domainY,
  id: idProp,
  className = '',
  ...rest
}: PortalChartProps) {
  const { id, margins, containerRef, svgWidth, svgHeight, visWidth, visHeight, scales, cx, cy } = usePortalChart({
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
  });

  const classes = ['chart', className].filter(Boolean).join(' ');

  return (
    <div id={id} className={classes} {...rest}>
      <div className="chart__canvas" ref={containerRef}>
        <svg
          className="chart__svg"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label={titleAxisY || titleAxisX || 'Gráfica de barras'}
        >
          {titleAxisY ? (
            <text
              className="chart__axis-title viz-title-axes"
              transform={`translate(14, ${cy}) rotate(-90)`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {titleAxisY}
            </text>
          ) : null}

          <PortalChartAxes
            scales={scales}
            margins={margins}
            svgHeight={svgHeight}
            visHeight={visHeight}
            svgWidth={svgWidth}
            visWidth={visWidth}
            axisYAlign={axisYAlign}
            labelAngleAxisX={labelAngleAxisX}
            labelAngleAxisY={labelAngleAxisY}
            tickCountY={tickCountY}
          />

          <PortalChartBars
            data={data}
            variables={variables}
            indexName={indexName}
            layout={layout}
            scales={scales}
            margins={margins}
          />

          {titleAxisX ? (
            <text className="chart__axis-title viz-title-axes" x={cx} y={svgHeight - 4} textAnchor="middle">
              {titleAxisX}
            </text>
          ) : null}
        </svg>
      </div>

      {showLegend && variables.length > 0 ? (
        <div className="chart__legend" role="list">
          {variables.map((v) => (
            <span key={v.id} className="chart__legend-item" role="listitem">
              <span
                className="chart__legend-color"
                style={v.color ? { backgroundColor: v.color } : undefined}
                aria-hidden
              />
              {v.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
