import { useEffect, useMemo, useState } from 'react';
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';
import type { Crumb } from '../shared/page-header/PageHeader';

export type SortOrder = 'recientes' | 'titulo-asc' | 'titulo-desc' | 'anio-desc' | 'anio-asc';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Conjuntos de datos' },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'titulo-asc', label: 'Título (A–Z)' },
  { value: 'titulo-desc', label: 'Título (Z–A)' },
  { value: 'anio-desc', label: 'Año (más reciente)' },
  { value: 'anio-asc', label: 'Año (más antiguo)' },
];

const PAGE_SIZE = 3;

function sortList(list: Dataset[], criteria: SortOrder): Dataset[] {
  const copy = [...list];
  const byTitle = (a: Dataset, b: Dataset) =>
    a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });

  switch (criteria) {
    case 'titulo-asc':
      return copy.sort(byTitle);
    case 'titulo-desc':
      return copy.sort((a, b) => b.title.localeCompare(a.title, 'es', { sensitivity: 'base' }));
    case 'anio-asc':
      return copy.sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || byTitle(a, b));
    case 'anio-desc':
      return copy.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || byTitle(a, b));
    case 'recientes':
    default:
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

export function useDatasetsList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('recientes');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await datasetsService.listAll();
        if (!active) return;
        setDatasets(list);
        setSearchFiltered(list);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => sortList(searchFiltered, sortOrder), [searchFiltered, sortOrder]);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const current = Math.min(page, totalPages);
    const start = (current - 1) * PAGE_SIZE;
    return visible.slice(start, start + PAGE_SIZE);
  }, [visible, page, totalPages]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goTo = (target: number) => setPage(Math.min(Math.max(1, target), totalPages));

  const onFilterChange = (items: Dataset[]) => {
    setSearchFiltered(items);
    setPage(1);
  };

  const onSortChange = (value: SortOrder) => {
    setSortOrder(value);
    setPage(1);
  };

  return {
    datasets,
    loading,
    sortOrder,
    page,
    totalPages,
    pageItems,
    pageNumbers,
    goTo,
    onFilterChange,
    onSortChange,
  };
}
