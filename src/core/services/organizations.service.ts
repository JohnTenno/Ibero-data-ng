import { http } from '../api/http';
import type { Organization } from '../models/dataset.model';

export const organizationsService = {
  list: () => http.get<Organization[]>('/organizations'),

  recent: () => http.get<Organization[]>('/organizations/recent'),

  get: (organizationId: string) => http.get<Organization>(`/organizations/${organizationId}`),

  create: (name: string, slug: string, description?: string) =>
    http.post<Organization>('/organizations', { name, slug, description }),

  remove: (organizationId: string) => http.delete<void>(`/organizations/${organizationId}`),
};
