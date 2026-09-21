import { useId, useState } from 'react';

export interface PortalSortOption {
  value: string;
  label: string;
}

export function usePortalSearchHeader({
  sortOptions,
  controlledSort,
  onSortChange,
  className,
}: {
  sortOptions: PortalSortOption[];
  controlledSort?: string;
  onSortChange?: (value: string) => void;
  className: string;
}) {
  const autoId = useId();
  const titleId = `search-header-title-${autoId}`;
  const sortId = `search-header-sort-${autoId}`;

  const [internalSort, setInternalSort] = useState(sortOptions[0]?.value ?? '');
  const sort = controlledSort ?? internalSort;

  function handleSortChange(value: string) {
    if (controlledSort === undefined) setInternalSort(value);
    onSortChange?.(value);
  }

  const classes = ['search-header', className].filter(Boolean).join(' ');

  return { titleId, sortId, sort, handleSortChange, classes };
}
