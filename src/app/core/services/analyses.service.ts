import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Analysis, OpCatalog, PreviewResult, Step } from '../models/analysis.model';
import type { DatasetVisibility } from '../models/dataset.model';

export interface CreateAnalysisPayload {
  resourceId: string;
  title: string;
  slug: string;
  folder: string;
  description?: string;
  visibility?: DatasetVisibility;
  steps: Step[];
  roundDecimals?: number;
}

@Injectable({ providedIn: 'root' })
export class AnalysesService {
  constructor(private readonly http: HttpClient) {}

  private base(organizationId: string, datasetId: string): string {
    return `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/analyses`;
  }

  operations(organizationId: string, datasetId: string): Promise<OpCatalog> {
    return firstValueFrom(this.http.get<OpCatalog>(`${this.base(organizationId, datasetId)}/operations`));
  }

  list(organizationId: string, datasetId: string): Promise<Analysis[]> {
    return firstValueFrom(this.http.get<Analysis[]>(this.base(organizationId, datasetId)));
  }

  preview(
    organizationId: string,
    datasetId: string,
    resourceId: string,
    steps: Step[],
    roundDecimals?: number,
  ): Promise<PreviewResult> {
    return firstValueFrom(
      this.http.post<PreviewResult>(`${this.base(organizationId, datasetId)}/preview`, {
        resourceId,
        steps,
        roundDecimals,
      }),
    );
  }

  create(organizationId: string, datasetId: string, payload: CreateAnalysisPayload): Promise<Analysis> {
    return firstValueFrom(this.http.post<Analysis>(this.base(organizationId, datasetId), payload));
  }

  update(
    organizationId: string,
    datasetId: string,
    analysisId: string,
    payload: CreateAnalysisPayload,
  ): Promise<Analysis> {
    return firstValueFrom(
      this.http.patch<Analysis>(`${this.base(organizationId, datasetId)}/${analysisId}`, payload),
    );
  }

  getData(organizationId: string, datasetId: string, analysisId: string): Promise<PreviewResult> {
    return firstValueFrom(
      this.http.get<PreviewResult>(`${this.base(organizationId, datasetId)}/${analysisId}/data`),
    );
  }

  vizcanvasHandoff(organizationId: string, datasetId: string, analysisId: string): Promise<{ url: string }> {
    return firstValueFrom(
      this.http.get<{ url: string }>(`${this.base(organizationId, datasetId)}/${analysisId}/vizcanvas-handoff`),
    );
  }
}
