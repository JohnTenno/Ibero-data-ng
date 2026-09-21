import type { ReactNode, TableHTMLAttributes } from 'react';
import { usePortalTable } from './usePortalTable';
import './portal-table.css';

export type PortalTableAlign = 'left' | 'center' | 'right';

export interface PortalTableColumn {
  id: string;
  label: ReactNode;
  align?: PortalTableAlign;
}

export type PortalTableRow = Record<string, ReactNode> & { key?: string; id?: string | number };

export interface PortalTableProps extends TableHTMLAttributes<HTMLTableElement> {
  columns?: PortalTableColumn[];
  rows?: PortalTableRow[];
  footer?: Record<string, ReactNode>;
  size?: 'condensed' | 'expanded' | 'general';
  align?: PortalTableAlign;
  caption?: string;
  className?: string;
  id?: string;
}

export function PortalTable({
  columns = [],
  rows = [],
  footer,
  size = 'condensed',
  align = 'center',
  caption = '',
  className = '',
  id,
  ...rest
}: PortalTableProps) {
  const { classes, columnStyle } = usePortalTable({ size, align, className });

  if (!columns.length) return null;

  return (
    <div className="container-table">
      <table id={id} className={classes} {...rest}>
        {caption ? <caption>{caption}</caption> : null}

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" style={columnStyle(column)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.key ?? String(row.id ?? index)}>
              {columns.map((column) => (
                <td key={column.id} style={columnStyle(column)}>
                  {row[column.id] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {footer ? (
          <tfoot>
            <tr>
              {columns.map((column) => (
                <td key={column.id} style={columnStyle(column)}>
                  {footer[column.id] ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
