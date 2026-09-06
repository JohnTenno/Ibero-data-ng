import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { IntermediarioSurveySummary } from '../models/intermediario.model';
import type { Resource } from '../models/resource.model';

export interface ImportFromIntermediarioPayload {
  kind: 'survey' | 'dataset';
  sourceId: number;
  filename: string;
}

@Injectable({ providedIn: 'root' })
export class IntermediarioService {
  constructor(private readonly http: HttpClient) {}

  private base(organizationId: string, datasetId: string): string {
    return `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/intermediario`;
  }

  catalog(organizationId: string, datasetId: string): Promise<IntermediarioSurveySummary[]> {
    return firstValueFrom(
      this.http.get<IntermediarioSurveySummary[]>(`${this.base(organizationId, datasetId)}/catalog`),
    );
  }

  import(
    organizationId: string,
    datasetId: string,
    payload: ImportFromIntermediarioPayload,
  ): Promise<Resource> {
    return firstValueFrom(this.http.post<Resource>(`${this.base(organizationId, datasetId)}/import`, payload));
  }
}
