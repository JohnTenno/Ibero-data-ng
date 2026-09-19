import type { Dataset, Organization } from '../core/models/dataset.model';
import { MOCK_DATASET_CARDS } from './mock-datasets';
import { MOCK_ORGANIZATION_CARDS } from './mock-organizations';

export type MockHomeOrganization = Organization & {
  coverSrc?: string;
  coverAlt?: string;
};

const ORG_BY_ID: Record<string, { id: string; name: string; slug: string }> = {
  'social-data-ibero': {
    id: 'social-data-ibero',
    name: 'Social Data Ibero',
    slug: 'social-data-ibero',
  },
  'centro-geo': { id: 'centro-geo', name: 'CentroGeo', slug: 'centro-geo' },
  'osc-demo': { id: 'osc-demo', name: 'OSC Demo México', slug: 'osc-demo' },
  'ibero-cdmx': {
    id: 'ibero-cdmx',
    name: 'Universidad Iberoamericana',
    slug: 'ibero-cdmx',
  },
};

const DATASET_ORG_IDS = [
  'social-data-ibero',
  'centro-geo',
  'social-data-ibero',
  'centro-geo',
  'ibero-cdmx',
  'osc-demo',
] as const;

/** Totals for AccesoWidget meta. */
export const MOCK_HOME_TOTALS = {
  totalDatasets: MOCK_DATASET_CARDS.length,
  totalOrganizations: MOCK_ORGANIZATION_CARDS.length,
};

/** Recent datasets for HorizontalCard compact preview (2 rows). */
export const MOCK_HOME_DATASETS: Dataset[] = MOCK_DATASET_CARDS.slice(0, 2).map(
  (card, index) => {
    const orgId = DATASET_ORG_IDS[index] ?? 'social-data-ibero';
    const org = ORG_BY_ID[orgId];
    const updatedAt = '2025-01-15T12:00:00.000Z';

    return {
      id: card.id,
      organizationId: orgId,
      ownerId: 'mock-owner',
      title: card.title ?? 'Dataset',
      slug: card.id,
      description: null,
      visibility: index % 2 === 0 ? 'PUBLIC' : 'PRIVATE',
      survey: null,
      year: typeof card.year === 'number' ? card.year : null,
      periodType: null,
      sourceOrg: card.source ?? null,
      sourceUrl: null,
      tags: card.label ? [card.label] : [],
      licenseId: null,
      revision: 1,
      createdAt: updatedAt,
      updatedAt,
      organization: org,
    };
  },
);

/** Recent organizations for OrganizationCard horizontal compact (2 rows). */
export const MOCK_HOME_ORGANIZATIONS: MockHomeOrganization[] =
  MOCK_ORGANIZATION_CARDS.slice(0, 2).map((card) => ({
    id: card.id,
    name: card.name,
    slug: card.id,
    description: card.description ?? null,
    createdAt: '2025-01-10T12:00:00.000Z',
    _count: {
      datasets: card.datasets ?? 0,
      members: card.members ?? 0,
    },
    coverSrc: card.coverSrc,
    coverAlt: card.coverAlt,
  }));
