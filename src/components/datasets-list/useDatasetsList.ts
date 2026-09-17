import { useEffect, useMemo, useState } from 'react';
import type { Crumb } from '../shared/page-header/PageHeader';
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';
import {
  DATASET_FILTERS,
  cardMatchesFilters,
  mapFilterOptions,
} from '../../data/dataset-filters';
import type { HorizontalCardProps } from '../shared/horizontal-card/HorizontalCard';

/* inicio mock
import { MOCK_DATASET_CARDS, type MockDatasetCard } from '../../data/mock-datasets';
fin mock */

export type SortOrder = 'recent' | 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc';

export type DatasetListItem = HorizontalCardProps & {
  id: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
};

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

export function datasetToCardProps(dataset: Dataset): DatasetListItem {
  const updated = dataset.updatedAt
    ? new Date(dataset.updatedAt).toLocaleDateString('es-MX')
    : undefined;

  return {
    id: dataset.id,
    organizationId: dataset.organizationId,
    title: dataset.title,
    label: dataset.tags?.[0] ?? dataset.survey ?? undefined,
    source: dataset.sourceOrg ?? undefined,
    year: dataset.year ?? undefined,
    institution: dataset.organization?.name ?? dataset.sourceOrg ?? undefined,
    updated,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
  };
}

function sortList(list: DatasetListItem[], criteria: SortOrder): DatasetListItem[] {
  const copy = [...list];
  const byTitle = (a: DatasetListItem, b: DatasetListItem) =>
    String(a.title ?? '').localeCompare(String(b.title ?? ''), 'es', { sensitivity: 'base' });

  switch (criteria) {
    case 'title-asc':
      return copy.sort(byTitle);
    case 'title-desc':
      return copy.sort((a, b) => byTitle(b, a));
    case 'year-asc':
      return copy.sort((a, b) => Number(a.year ?? 0) - Number(b.year ?? 0) || byTitle(a, b));
    case 'year-desc':
      return copy.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0) || byTitle(a, b));
    case 'recent':
      return copy.sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
            new Date(a.updatedAt ?? a.createdAt ?? 0).getTime() || byTitle(a, b),
      );
    default:
      return copy;
  }
}

export function useDatasetsList() {
  const [catalog, setCatalog] = useState<DatasetListItem[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<DatasetListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await datasetsService.listAll();
        if (!active) return;
        const cards = list.map(datasetToCardProps);
        setCatalog(cards);
        setSearchFiltered(cards);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  /* inicio mock
  const [catalog] = useState<MockDatasetCard[]>(MOCK_DATASET_CARDS);
  const [searchFiltered, setSearchFiltered] = useState<MockDatasetCard[]>(MOCK_DATASET_CARDS);
  const [loading] = useState(false);
  fin mock */

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

  const onFilterChange = (items: DatasetListItem[]) => {
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
