import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { QueryResult, Resource } from '../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private readonly http: HttpClient) {}

  list(organizationId: string, datasetId: string): Promise<Resource[]> {
    return firstValueFrom(
      this.http.get<Resource[]>(
        `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/resources`,
      ),
    );
  }

  upload(organizationId: string, datasetId: string, file: File): Promise<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    return firstValueFrom(
      this.http.post<Resource>(
        `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/resources`,
        formData,
      ),
    );
  }

  runQuery(
    organizationId: string,
    datasetId: string,
    resourceId: string,
    sql: string,
  ): Promise<QueryResult> {
    return firstValueFrom(
      this.http.post<QueryResult>(
        `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/resources/${resourceId}/query`,
        { sql },
      ),
    );
  }

  vizcanvasHandoff(organizationId: string, datasetId: string, resourceId: string): Promise<{ url: string }> {
    return firstValueFrom(
      this.http.get<{ url: string }>(
        `${environment.apiUrl}/organizations/${organizationId}/datasets/${datasetId}/resources/${resourceId}/vizcanvas-handoff`,
      ),
    );
  }
}
