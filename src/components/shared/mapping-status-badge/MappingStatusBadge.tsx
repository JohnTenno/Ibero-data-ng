import { StatusBadge } from '../status-badge/StatusBadge';

interface Props {
  mappedColumns: number;
  totalColumns: number;
}

export function MappingStatusBadge({ mappedColumns, totalColumns }: Props) {
  if (mappedColumns === 0) {
    return <StatusBadge variant="warning">sin mapeo</StatusBadge>;
  }

  const complete = mappedColumns === totalColumns && totalColumns > 0;

  return (
    <StatusBadge variant={complete ? 'success' : 'neutral'}>
      {mappedColumns}/{totalColumns} columnas
    </StatusBadge>
  );
}
