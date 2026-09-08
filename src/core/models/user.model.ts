export interface User {
  id: string;
  email: string;
  fullName: string;
  isSysadmin: boolean;
  createdAt: string;
}

export type OrgRole = 'ADMIN' | 'EDITOR' | 'MEMBER';

export interface OrganizationMembership {
  id: string;
  role: OrgRole;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}
