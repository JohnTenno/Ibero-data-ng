import { http } from '../api/http';
import type { TableColumn, TableData } from '../utils/portal-charts';

export interface CatalogOrganization {
  id: string;
  name: string;
  title?: string;
  description?: string | null;
}

export interface CatalogResource {
  id: string;
  parquet_schema?: unknown;
  [key: string]: unknown;
}

export interface CatalogPackage {
  id: string;
  name: string;
  title?: string;
  type?: string;
  notes?: string;
  metadata_modified?: string;
  metadata_created?: string;
  organization?: CatalogOrganization;
  resources?: CatalogResource[];
  recipe?: unknown;
  [key: string]: unknown;
}

export interface SearchPackagesResult {
  total: number;
  packages: CatalogPackage[];
}

export const portalCatalogService = {
  searchPackages: async (
    { q = '', rows = 24, offset = 0 }: { q?: string; rows?: number; offset?: number } = {},
    signal?: AbortSignal,
  ): Promise<SearchPackagesResult> => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('limit', String(rows));
    params.set('offset', String(offset));
    const result = await http.get<{ total?: number; items?: CatalogPackage[] }>(
      `/public/catalog?${params.toString()}`,
      signal,
    );
    return { total: result.total ?? 0, packages: result.items ?? [] };
  },

  viewPackage: async (name: string, signal?: AbortSignal): Promise<CatalogPackage> => {
    const r = await http.get<{ pkg: CatalogPackage; resources?: CatalogResource[]; recipe?: unknown }>(
      `/public/catalog/${encodeURIComponent(name)}`,
      signal,
    );
    return { ...r.pkg, resources: r.resources ?? [], recipe: r.recipe ?? null };
  },

  listOrganizations: (signal?: AbortSignal) =>
    http.get<CatalogOrganization[]>('/public/organizations', signal),

  organizationCounts: (signal?: AbortSignal) =>
    http.get<Record<string, { sources: number; charts: number }>>('/public/organizations/count', signal),

  readTable: async (
    resource: CatalogResource | null | undefined,
    { limit = 500 }: { limit?: number } = {},
    signal?: AbortSignal,
  ): Promise<TableData> => {
    if (!resource?.id) throw new Error('readTable: resource has no id');
    const schema = Array.isArray(resource.parquet_schema) ? resource.parquet_schema : [];
    const types = Object.fromEntries(
      schema.map((c: { name: string; type: string }) => [c.name, c.type]),
    );

    const result = await http.get<{ columns?: string[]; rows?: Record<string, unknown>[] }>(
      `/public/catalog/${encodeURIComponent(resource.id)}/preview?limit=${limit}`,
      signal,
    );
    const columns: string[] = result.columns ?? [];
    const rows = result.rows ?? [];

    return {
      columns: columns.map((name): TableColumn => ({ id: name, type: types[name] ?? 'VARCHAR' })),
      rows,
      total: rows.length,
      source: 'duckdb',
    };
  },

  openInVizCanvas: async (name: string, signal?: AbortSignal): Promise<string> => {
    const { url } = await http.get<{ url: string }>(
      `/public/catalog/${encodeURIComponent(name)}/vizcanvas-handoff`,
      signal,
    );
    return url;
  },
};

export function mainResource(pkg: CatalogPackage | null | undefined): CatalogResource | null {
  return pkg?.resources?.[0] ?? null;
}
