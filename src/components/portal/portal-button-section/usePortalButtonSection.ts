import { useId } from 'react';

export function usePortalButtonSection({ className }: { className: string }) {
  const autoId = useId();
  const titleId = `button-section-title-${autoId}`;
  const classes = ['button-section', className].filter(Boolean).join(' ');

  return { titleId, classes };
}
