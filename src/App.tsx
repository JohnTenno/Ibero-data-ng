import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { MenuAccesibilidad } from './components/shared/menu-accesibilidad/MenuAccesibilidad';
import { AppRoutes } from './routes';
import './app.scss';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuAccesibilidad />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
