import { http } from '../api/http';
import type { Dataset, DatasetVisibility, PeriodType, Survey } from '../models/dataset.model';

export interface CreateDatasetPayload {
  title: string;
  slug: string;
  description?: string;
  visibility?: DatasetVisibility;
  survey?: Survey;
  year?: number;
  periodType?: PeriodType;
  sourceOrg?: string;
  sourceUrl?: string;
  tags?: string[];
  licenseId?: string;
  revisionOfId?: string;
  changelog?: string;
}

export const datasetsService = {
  list: (organizationId: string) =>
    http.get<Dataset[]>(`/organizations/${organizationId}/datasets`),

  listAll: (limit?: number) => http.get<Dataset[]>(`/datasets${limit ? `?limit=${limit}` : ''}`),

  get: (organizationId: string, datasetId: string) =>
    http.get<Dataset>(`/organizations/${organizationId}/datasets/${datasetId}`),

  create: (organizationId: string, payload: CreateDatasetPayload) =>
    http.post<Dataset>(`/organizations/${organizationId}/datasets`, payload),

  remove: (organizationId: string, datasetId: string) =>
    http.delete<void>(`/organizations/${organizationId}/datasets/${datasetId}`),
};
