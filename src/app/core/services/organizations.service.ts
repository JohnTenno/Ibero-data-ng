import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Organization } from '../models/dataset.model';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<Organization[]> {
    return firstValueFrom(this.http.get<Organization[]>(`${environment.apiUrl}/organizations`));
  }

  recent(): Promise<Organization[]> {
    return firstValueFrom(this.http.get<Organization[]>(`${environment.apiUrl}/organizations/recent`));
  }

  get(organizationId: string): Promise<Organization> {
    return firstValueFrom(
      this.http.get<Organization>(`${environment.apiUrl}/organizations/${organizationId}`),
    );
  }

  create(name: string, slug: string, description?: string): Promise<Organization> {
    return firstValueFrom(
      this.http.post<Organization>(`${environment.apiUrl}/organizations`, { name, slug, description }),
    );
  }

  remove(organizationId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/organizations/${organizationId}`));
  }
}
