import { useEffect, useMemo, useState } from 'react';
import type { Crumb } from '../shared/page-header/PageHeader';
import type { Organization } from '../../core/models/dataset.model';
import {
  ORGANIZATION_FILTERS,
  mapFilterOptions,
  organizationMatchesFilters,
} from '../../data/organization-filters';
import type { OrganizationCardProps } from '../shared/organization-card/OrganizationCard';

/* inicio mock */
import {
  MOCK_ORGANIZATION_CARDS,
  type MockOrganizationCard,
} from '../../data/mock-organizations';
/* fin mock */

/* inicio api
import { organizationsService } from '../../core/services/organizations.service';
fin api */

export type SortOrder =
  | 'recent'
  | 'name-asc'
  | 'name-desc'
  | 'datasets-desc'
  | 'members-desc';

export type OrganizationListItem = OrganizationCardProps & {
  id: string;
  createdAt?: string;
  type?: string;
  scope?: string;
};

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Organizaciones' },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'name-asc', label: 'Nombre (A–Z)' },
  { value: 'name-desc', label: 'Nombre (Z–A)' },
  { value: 'datasets-desc', label: 'Más conjuntos' },
  { value: 'members-desc', label: 'Más miembros' },
];

const PAGE_SIZE = 4;

const OPTIONS_BY_ID = mapFilterOptions(ORGANIZATION_FILTERS.sections);

export function organizationToCardProps(org: Organization): OrganizationListItem {
  return {
    id: org.id,
    name: org.name,
    description: org.description ?? undefined,
    datasets: org._count?.datasets ?? 0,
    members: org._count?.members ?? 0,
    href: `/organizations/${org.id}`,
    createdAt: org.createdAt,
  };
}

function sortList(list: OrganizationListItem[], criteria: SortOrder): OrganizationListItem[] {
  const copy = [...list];
  const byName = (a: OrganizationListItem, b: OrganizationListItem) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), 'es', { sensitivity: 'base' });

  switch (criteria) {
    case 'name-asc':
      return copy.sort(byName);
    case 'name-desc':
      return copy.sort((a, b) => byName(b, a));
    case 'datasets-desc':
      return copy.sort(
        (a, b) => Number(b.datasets ?? 0) - Number(a.datasets ?? 0) || byName(a, b),
      );
    case 'members-desc':
      return copy.sort(
        (a, b) => Number(b.members ?? 0) - Number(a.members ?? 0) || byName(a, b),
      );
    case 'recent':
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime() ||
          byName(a, b),
      );
    default:
      return copy;
  }
}

function mockToListItem(card: MockOrganizationCard): OrganizationListItem {
  return { ...card };
}

export function useOrganizationsList() {
  /* inicio mock */
  const mockCards = useMemo(() => MOCK_ORGANIZATION_CARDS.map(mockToListItem), []);
  const [catalog] = useState<OrganizationListItem[]>(mockCards);
  const [searchFiltered, setSearchFiltered] = useState<OrganizationListItem[]>(mockCards);
  const [loading] = useState(false);
  /* fin mock */

  /* inicio api
  const [catalog, setCatalog] = useState<OrganizationListItem[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<OrganizationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await organizationsService.list();
        if (!active) return;
        const cards = list.map(organizationToCardProps);
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
  fin api */

  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const visible = useMemo(() => {
    const filtered = searchFiltered.filter((card) =>
      organizationMatchesFilters(card, activeFilters, OPTIONS_BY_ID),
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

  const onFilterChange = (items: OrganizationListItem[]) => {
    setSearchFiltered(items);
  };

  const onSortChange = (value: SortOrder) => {
    setSortOrder(value);
  };

  return {
    organizations: catalog,
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
