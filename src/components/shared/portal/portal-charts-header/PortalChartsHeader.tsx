import type { HTMLAttributes, ReactNode } from 'react';
import { PortalTabs } from '../portal-tabs/PortalTabs';
import { usePortalChartsHeader } from './usePortalChartsHeader';
import type { PortalChartBlockProps } from './PortalChartBlock';
import './portal-charts-header.css';

export interface PortalChartsHeaderTab {
  id: string;
  label: string;
  disabled?: boolean;
  charts?: PortalChartBlockProps[];
  content?: ReactNode;
}

export interface PortalChartsHeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  titleHighlight?: string;
  tabs?: PortalChartsHeaderTab[];
  activeId?: string;
  initialActive?: string;
  onTabChange?: (id: string, index: number) => void;
  onAction?: (detail: { action: string; tabId: string; chartId?: string }) => void;
  className?: string;
  id?: string;
}

export function PortalChartsHeader({
  title = '',
  titleHighlight = '',
  tabs = [],
  activeId,
  initialActive,
  onTabChange,
  onAction,
  className = '',
  id: idProp,
  ...rest
}: PortalChartsHeaderProps) {
  const { baseId, titleId, items, titleNode } = usePortalChartsHeader({
    title,
    titleHighlight,
    tabs,
    onAction,
    idProp,
  });

  const classes = ['charts-header', className].filter(Boolean).join(' ');

  return (
    <section id={baseId} className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      {titleNode ? (
        <h2 id={titleId} className="charts-header__title">
          {titleNode}
        </h2>
      ) : null}

      <PortalTabs
        id={`${baseId}-tabs`}
        idAriaLabelledby={title ? titleId : undefined}
        ariaLabel={title ? undefined : 'Periodos'}
        items={items}
        activeId={activeId}
        initialActive={initialActive}
        onChange={onTabChange}
        className="charts-header__tabs"
      />
    </section>
  );
}
