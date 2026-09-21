import { useId } from 'react';

export function usePortalSearchSection({ className }: { className: string }) {
  const autoId = useId();
  const titleId = `search-section-title-${autoId}`;
  const classes = ['search-section', className].filter(Boolean).join(' ');

  return { titleId, classes };
}
