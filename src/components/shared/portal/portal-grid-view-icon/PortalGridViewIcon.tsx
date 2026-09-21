import type { HTMLAttributes } from 'react';

export function PortalGridViewIcon({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={['grid-view-icon', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      {...rest}
    />
  );
}
