import { useId } from 'react';

export function usePortalTopicsSection({ className }: { className: string }) {
  const autoId = useId();
  const titleId = `topics-section-title-${autoId}`;
  const classes = ['topics-section', className].filter(Boolean).join(' ');

  return { titleId, classes };
}
