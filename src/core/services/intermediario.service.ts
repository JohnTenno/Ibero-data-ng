import { http } from '../api/http';
import type { IntermediarioSurveySummary } from '../models/intermediario.model';
import type { Resource } from '../models/resource.model';

export interface ImportFromIntermediarioPayload {
  kind: 'survey' | 'dataset';
  sourceId: number;
  filename: string;
}

const base = (organizationId: string, datasetId: string) =>
  `/organizations/${organizationId}/datasets/${datasetId}/intermediario`;

export const intermediarioService = {
  catalog: (organizationId: string, datasetId: string) =>
    http.get<IntermediarioSurveySummary[]>(`${base(organizationId, datasetId)}/catalog`),

  import: (
    organizationId: string,
    datasetId: string,
    payload: ImportFromIntermediarioPayload,
  ) => http.post<Resource>(`${base(organizationId, datasetId)}/import`, payload),
};
