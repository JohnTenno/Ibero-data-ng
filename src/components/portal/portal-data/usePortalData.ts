import { useMemo, useState } from 'react';
import { portalCatalogService, type CatalogPackage } from '../../../core/services/portal-catalog.service';
import { usePortalRequest } from '../../../core/hooks/usePortalRequest';
import cardMotif1 from '../../../assets/card-motif-1.png';
import cardMotif2 from '../../../assets/card-motif-2.png';
import cardMotif3 from '../../../assets/card-motif-3.png';
import type { PortalDataResultItem } from '../portal-data-results-section/PortalDataResultsSection';
import type { PortalSortOption } from '../portal-search-header/usePortalSearchHeader';

const IMAGES = [cardMotif1, cardMotif2, cardMotif3];

const SORT_OPTIONS: PortalSortOption[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'az', label: 'De la A a la Z' },
  { value: 'za', label: 'De la Z a la A' },
];

function yearOf(pkg: CatalogPackage): number | null {
  const date = pkg.metadata_modified ?? pkg.metadata_created;
  const year = date ? new Date(date).getFullYear() : null;
  return Number.isFinite(year) ? year : null;
}

function lastUpdatedOf(packages: CatalogPackage[]): string {
  const dates = packages.map((p) => p.metadata_modified).filter(Boolean).sort();
  const last = dates.at(-1);
  if (!last) return '';
  return new Date(last).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function packageToCard(pkg: CatalogPackage, index: number): PortalDataResultItem {
  const organization = pkg.organization ?? { id: '', name: '' };
  const isAnalysis = pkg.type === 'analysis';

  return {
    id: pkg.id,
    imageSrc: IMAGES[index % IMAGES.length],
    imageAlt: '',
    title: pkg.title || pkg.name,
    label: isAnalysis ? 'Análisis' : 'Datos',
    source: organization.title || organization.name || 'Sin organización',
    year: yearOf(pkg) ?? undefined,
    institutions: pkg.notes ? pkg.notes.slice(0, 60) : undefined,
    href: `/datos/vista-datos?id=${encodeURIComponent(pkg.name)}`,
  };
}

export function usePortalData() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('relevancia');

  const { data, loading, error } = usePortalRequest(
    ({ signal }) => portalCatalogService.searchPackages({ q: query }, signal),
    [query],
  );

  const packages = useMemo(() => data?.packages ?? [], [data]);

  const items = useMemo(() => {
    const list = [...packages];
    if (sort === 'az' || sort === 'za') {
      list.sort((a, b) =>
        String(a.title ?? a.name).localeCompare(String(b.title ?? b.name), 'es', { sensitivity: 'base' }),
      );
      if (sort === 'za') list.reverse();
    }
    return list.map(packageToCard);
  }, [packages, sort]);

  return {
    query,
    setQuery,
    sort,
    setSort,
    loading,
    error,
    items,
    sortOptions: SORT_OPTIONS,
    lastUpdated: lastUpdatedOf(packages),
  };
}
