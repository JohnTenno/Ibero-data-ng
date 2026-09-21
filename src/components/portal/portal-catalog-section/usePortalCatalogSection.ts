import { useId } from 'react';

export const SORT_AZ = 'name-asc';
export const SORT_ZA = 'name-desc';

export function usePortalCatalogSection({ className }: { className: string }) {
  const sortId = useId();
  const classes = ['catalog-section', 'container', 'width-fixed', className].filter(Boolean).join(' ');

  return { sortId, classes, SORT_AZ, SORT_ZA };
}
