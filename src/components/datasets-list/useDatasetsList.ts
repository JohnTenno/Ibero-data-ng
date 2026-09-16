import { useEffect, useMemo, useState } from 'react';
import type { Crumb } from '../shared/page-header/PageHeader';
import {
  DATASET_FILTERS,
  cardMatchesFilters,
  mapFilterOptions,
} from '../../data/dataset-filters';
import { MOCK_DATASET_CARDS, type MockDatasetCard } from '../../data/mock-datasets';

/* inicio api
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';
fin api */

export type SortOrder = 'recent' | 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Conjuntos de datos' },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'title-asc', label: 'Título (A–Z)' },
  { value: 'title-desc', label: 'Título (Z–A)' },
  { value: 'year-desc', label: 'Año (más reciente)' },
  { value: 'year-asc', label: 'Año (más antiguo)' },
];

const PAGE_SIZE = 3;

const OPTIONS_BY_ID = mapFilterOptions(DATASET_FILTERS.sections);

function sortList(list: MockDatasetCard[], criteria: SortOrder): MockDatasetCard[] {
  const copy = [...list];
  const byTitle = (a: MockDatasetCard, b: MockDatasetCard) =>
    String(a.title ?? '').localeCompare(String(b.title ?? ''), 'en', { sensitivity: 'base' });

  switch (criteria) {
    case 'title-asc':
      return copy.sort(byTitle);
    case 'title-desc':
      return copy.sort((a, b) =>
        String(b.title ?? '').localeCompare(String(a.title ?? ''), 'en', { sensitivity: 'base' }),
      );
    case 'year-asc':
      return copy.sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0) || byTitle(a, b));
    case 'year-desc':
      return copy.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0) || byTitle(a, b));
    case 'recent':
    default:
      return copy;
  }
}

/**
 * Ahora usa mock (`src/data/mock-datasets`) para alinear estilos del card con el prototipo.
 * El API quedó comentado solo por eso; no se eliminó.
 *
 * Cómo pasar del mock al API:
 * 1. Comenta el bloque mock (catalog / searchFiltered / loading).
 * 2. Descomenta los dos bloques "inicio api" … "fin api" (imports + fetch).
 * 3. En DatasetsList.tsx, vuelve a usar el Link a la ficha real.
 */
export function useDatasetsList() {
  // Mock (activo)
  const [catalog] = useState<MockDatasetCard[]>(MOCK_DATASET_CARDS);
  const [searchFiltered, setSearchFiltered] = useState<MockDatasetCard[]>(MOCK_DATASET_CARDS);
  const [loading] = useState(false);

  /* inicio api
  const [catalog, setCatalog] = useState<Dataset[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await datasetsService.listAll();
        if (!active) return;
        setCatalog(list);
        setSearchFiltered(list);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  fin api */

  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const visible = useMemo(() => {
    const filtered = searchFiltered.filter((card) =>
      cardMatchesFilters(card, activeFilters, OPTIONS_BY_ID),
    );
    return sortList(filtered, sortOrder);
  }, [searchFiltered, activeFilters, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [searchFiltered, activeFilters, sortOrder]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const current = Math.min(page, totalPages);
    const start = (current - 1) * PAGE_SIZE;
    return visible.slice(start, start + PAGE_SIZE);
  }, [visible, page, totalPages]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goTo = (target: number) => setPage(Math.min(Math.max(1, target), totalPages));

  const onFilterChange = (items: MockDatasetCard[]) => {
    setSearchFiltered(items);
  };

  const onSortChange = (value: SortOrder) => {
    setSortOrder(value);
  };

  return {
    datasets: catalog,
    loading,
    sortOrder,
    page,
    totalPages,
    pageItems,
    pageNumbers,
    goTo,
    onFilterChange,
    onSortChange,
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    setActiveFilters,
  };
}
