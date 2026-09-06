import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
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

@Injectable({ providedIn: 'root' })
export class DatasetsService {
  constructor(private readonly http: HttpClient) {}

  list(organizationId: string): Promise<Dataset[]> {
    return firstValueFrom(
      this.http.get<Dataset[]>(`${environment.apiUrl}/organizations/${organizationId}/datasets`),
    );
  }

  listAll(limit?: number): Promise<Dataset[]> {
    const url = `${environment.apiUrl}/datasets${limit ? `?limit=${limit}` : ''}`;
    return firstValueFrom(this.http.get<Dataset[]>(url));
  }

  get(organizationId: string, datasetId: string): Promise<Dataset> {
    return firstValueFrom(
      this.http.get<Dataset>(`${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}`),
    );
  }

  create(organizationId: string, payload: CreateDatasetPayload): Promise<Dataset> {
    return firstValueFrom(
      this.http.post<Dataset>(`${environment.apiUrl}/organizations/${organizationId}/datasets`, payload),
    );
  }
}
