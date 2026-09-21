import type { HTMLAttributes } from 'react';

export function PortalChartIcon({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={['charts-header__pictogram', 'charts-header__pictogram--chart', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
      {...rest}
    />
  );
}
