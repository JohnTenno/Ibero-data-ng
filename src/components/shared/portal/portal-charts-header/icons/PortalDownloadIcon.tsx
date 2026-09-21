import type { HTMLAttributes } from 'react';

export function PortalDownloadIcon({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={['charts-header__pictogram', 'charts-header__pictogram--download', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
      {...rest}
    />
  );
}
