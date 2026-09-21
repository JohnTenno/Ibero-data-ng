import { useId, useMemo, type ReactNode } from 'react';
import { PortalChartBlock } from './PortalChartBlock';
import type { PortalChartsHeaderTab } from './PortalChartsHeader';

export function usePortalChartsHeader({
  title,
  titleHighlight,
  tabs,
  onAction,
  idProp,
}: {
  title: string;
  titleHighlight: string;
  tabs: PortalChartsHeaderTab[];
  onAction?: (detail: { action: string; tabId: string; chartId?: string }) => void;
  idProp?: string;
}) {
  const autoId = useId().replace(/:/g, '');
  const baseId = idProp || `charts-header-${autoId}`;
  const titleId = `${baseId}-title`;

  const items = useMemo(
    () =>
      tabs.map((tab) => {
        const charts = tab.charts ?? [];
        const hasBlocks = charts.length > 0 || tab.content != null;

        return {
          id: tab.id,
          label: tab.label,
          disabled: tab.disabled,
          content: hasBlocks ? (
            <div className="charts-header__list">
              {charts.map((block, index) => {
                const chartId = block.id || `${tab.id}-chart-${index}`;
                return (
                  <PortalChartBlock
                    key={chartId}
                    id={chartId}
                    title={block.title}
                    description={block.description}
                    chart={block.chart}
                    actions={block.actions}
                    onAction={(action) => onAction?.({ action, tabId: tab.id, chartId })}
                  >
                    {block.children}
                  </PortalChartBlock>
                );
              })}
              {tab.content}
            </div>
          ) : null,
        };
      }),
    [tabs, onAction],
  );

  let titleNode: ReactNode = null;
  if (title) {
    if (titleHighlight && title.startsWith(titleHighlight)) {
      const rest = title.slice(titleHighlight.length);
      titleNode = (
        <>
          <span className="charts-header__title-highlight">{titleHighlight}</span>
          {rest ? <span className="charts-header__title-rest">{rest}</span> : null}
        </>
      );
    } else {
      titleNode = title;
    }
  }

  return { baseId, titleId, items, titleNode };
}
