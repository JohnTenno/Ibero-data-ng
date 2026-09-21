import { useId, type ComponentType, type HTMLAttributes } from 'react';
import { PortalTableIcon } from './icons/PortalTableIcon';
import { PortalDownloadIcon } from './icons/PortalDownloadIcon';
import { PortalChartIcon } from './icons/PortalChartIcon';

export type PortalChartBlockActionId = 'table' | 'download' | 'chart';

interface ActionDef {
  id: PortalChartBlockActionId;
  label: string;
  Icon: ComponentType<HTMLAttributes<HTMLSpanElement>>;
}

const ACTIONS: ActionDef[] = [
  { id: 'table', label: 'Ver tabla de datos', Icon: PortalTableIcon },
  { id: 'download', label: 'Descargar imagen', Icon: PortalDownloadIcon },
  { id: 'chart', label: 'Editar gráfica', Icon: PortalChartIcon },
];

export function usePortalChartBlock({
  id,
  title,
  actions,
}: {
  id?: string;
  title?: string;
  actions: PortalChartBlockActionId[];
}) {
  const autoId = useId().replace(/:/g, '');
  const titleId = title ? `chart-block-title-${id || autoId}` : undefined;
  const actionIds = new Set(actions);
  const actionList = ACTIONS.filter((a) => actionIds.has(a.id));

  return { titleId, actionList };
}
