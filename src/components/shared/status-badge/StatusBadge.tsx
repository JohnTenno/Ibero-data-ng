import type { HTMLAttributes, ReactNode } from 'react';
import './status-badge.css';

export type StatusBadgeVariant = 'success' | 'warning' | 'neutral';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  variant?: StatusBadgeVariant;
}

export function StatusBadge({
  children,
  variant = 'neutral',
  className = '',
  ...rest
}: StatusBadgeProps) {
  const classes = ['status-badge', `status-badge--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
