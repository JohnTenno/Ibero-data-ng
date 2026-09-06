import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/shared/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/home/home').then((m) => m.Home),
      },
      {
        path: 'datasets',
        loadComponent: () => import('./components/datasets-list/datasets-list').then((m) => m.DatasetsList),
      },
      {
        path: 'organizations',
        loadComponent: () =>
          import('./components/organizations-list/organizations-list').then((m) => m.OrganizationsList),
      },
      {
        path: 'organizations/:organizationId',
        loadComponent: () =>
          import('./components/organization-detail/organization-detail').then((m) => m.OrganizationDetail),
      },
      {
        path: 'organizations/:organizationId/datasets/new',
        loadComponent: () => import('./components/dataset-create/dataset-create').then((m) => m.DatasetCreate),
      },
      {
        path: 'organizations/:organizationId/datasets/:datasetId',
        loadComponent: () => import('./components/dataset-detail/dataset-detail').then((m) => m.DatasetDetail),
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile').then((m) => m.Profile),
      },
    ],
  },
];
