import { portalCatalogService, type CatalogOrganization } from '../../../core/services/portal-catalog.service';
import { usePortalRequest } from '../../../core/hooks/usePortalRequest';
import cardMotif1 from '../../../assets/card-motif-1.png';
import cardMotif2 from '../../../assets/card-motif-2.png';
import cardMotif3 from '../../../assets/card-motif-3.png';
import type { PortalCatalogItem } from '../portal-catalog-section/PortalCatalogSection';

const IMAGES = [cardMotif1, cardMotif2, cardMotif3];

function organizationToTopic(
  organization: CatalogOrganization,
  index: number,
  counts: Record<string, { sources: number; charts: number }>,
): PortalCatalogItem {
  const name = organization.name;
  const title = organization.title || name;
  const count = counts[name] ?? { sources: 0, charts: 0 };

  return {
    id: organization.id,
    name: title,
    title,
    imageSrc: IMAGES[index % IMAGES.length],
    sources: count.sources,
    charts: count.charts,
    description: organization.description || 'Sin descripción registrada en el catálogo.',
    sourcesLabel: title,
    buttonText: 'Ir a los datos',
    variant: 'link-inner',
    href: `/datos?org=${encodeURIComponent(name)}`,
  };
}

export function usePortalTopics() {
  const { data, loading, error } = usePortalRequest(
    ({ signal }) =>
      Promise.all([portalCatalogService.listOrganizations(signal), portalCatalogService.organizationCounts(signal)]).then(
        ([organizations, counts]) => (organizations ?? []).map((organization, index) => organizationToTopic(organization, index, counts)),
      ),
    [],
  );

  return { catalog: data ?? [], loading, error };
}
