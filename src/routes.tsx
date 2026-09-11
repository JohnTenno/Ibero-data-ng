import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './core/guards/RequireAuth';

const Login = lazy(() => import('./components/login/Login').then((m) => ({ default: m.Login })));
const AppShell = lazy(() =>
  import('./components/shared/app-shell/AppShell').then((m) => ({ default: m.AppShell })),
);
const Home = lazy(() => import('./components/home/Home').then((m) => ({ default: m.Home })));
const DatasetsList = lazy(() =>
  import('./components/datasets-list/DatasetsList').then((m) => ({ default: m.DatasetsList })),
);
const OrganizationsList = lazy(() =>
  import('./components/organizations-list/OrganizationsList').then((m) => ({
    default: m.OrganizationsList,
  })),
);
const OrganizationDetail = lazy(() =>
  import('./components/organization-detail/OrganizationDetail').then((m) => ({
    default: m.OrganizationDetail,
  })),
);
const DatasetCreate = lazy(() =>
  import('./components/dataset-create/DatasetCreate').then((m) => ({ default: m.DatasetCreate })),
);
const DatasetDetail = lazy(() =>
  import('./components/dataset-detail/DatasetDetail').then((m) => ({ default: m.DatasetDetail })),
);
const Profile = lazy(() =>
  import('./components/profile/Profile').then((m) => ({ default: m.Profile })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<p className="loading-route">Cargando…</p>}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/datasets" element={<DatasetsList />} />
            <Route path="/organizations" element={<OrganizationsList />} />
            <Route path="/organizations/:organizationId" element={<OrganizationDetail />} />
            <Route
              path="/organizations/:organizationId/datasets/new"
              element={<DatasetCreate />}
            />
            <Route
              path="/organizations/:organizationId/datasets/:datasetId"
              element={<DatasetDetail />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
