import type { HTMLAttributes } from 'react';

export function PortalTableIcon({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={['charts-header__pictogram', 'charts-header__pictogram--table', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      {...rest}
    />
  );
}
