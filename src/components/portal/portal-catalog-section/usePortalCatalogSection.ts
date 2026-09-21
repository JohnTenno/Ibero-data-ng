import { useId, useMemo, useState } from 'react';

export const SORT_AZ = 'az';
export const SORT_ZA = 'za';

export function usePortalCatalogSection<T extends Record<string, unknown>>({
  catalog,
  sortProperty,
  disabled,
  className,
}: {
  catalog: T[];
  sortProperty: string;
  disabled: boolean;
  className: string;
}) {
  const sortId = useId();
  const [filtered, setFiltered] = useState<T[]>(catalog);
  const [sort, setSort] = useState(SORT_AZ);

  const visible = useMemo(() => {
    const list = [...filtered].sort((a, b) =>
      String(a[sortProperty] ?? '').localeCompare(String(b[sortProperty] ?? ''), 'es', { sensitivity: 'base' }),
    );
    if (sort === SORT_ZA) list.reverse();
    return list;
  }, [filtered, sort, sortProperty]);

  const classes = ['catalog-section', 'container', 'width-fixed', className].filter(Boolean).join(' ');

  return { sortId, sort, setSort, setFiltered, visible, classes, disabled, SORT_AZ, SORT_ZA };
}
