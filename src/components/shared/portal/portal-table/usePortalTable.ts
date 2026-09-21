import type { PortalTableAlign, PortalTableColumn } from './PortalTable';

function mapAlign(value: PortalTableAlign | undefined): PortalTableAlign {
  if (value === 'center') return 'center';
  if (value === 'right') return 'right';
  return 'left';
}

export function usePortalTable({
  size,
  align,
  className,
}: {
  size: 'condensed' | 'expanded' | 'general';
  align: PortalTableAlign;
  className: string;
}) {
  const sizeClass = size === 'condensed' ? 'table-condensed' : size === 'expanded' ? 'table-expanded' : '';

  const alignClass =
    align === 'center' ? 'table--align-center' : align === 'right' ? 'table--align-right' : 'table--align-left';

  const classes = ['table', sizeClass, alignClass, className].filter(Boolean).join(' ');

  const columnStyle = (column: PortalTableColumn) => (column.align ? { textAlign: mapAlign(column.align) } : undefined);

  return { classes, columnStyle };
}
