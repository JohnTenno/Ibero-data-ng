import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { AccessibilityMenu } from './components/shared/accessibility-menu/AccessibilityMenu';
import { AppRoutes } from './routes';
import './app.scss';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityMenu />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
