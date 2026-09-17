import { useMemo } from 'react';
import { useAuth } from '../../core/auth/useAuth';
import type { Crumb } from '../shared/page-header/PageHeader';
import type { ProfileFormValues } from './ProfileForm';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Configuración de perfil' },
];

export function useProfile() {
  const { currentUser } = useAuth();

  const formValues = useMemo<ProfileFormValues>(() => {
    if (!currentUser) return {};
    const username = currentUser.email.includes('@')
      ? currentUser.email.split('@')[0]
      : currentUser.email;
    return {
      username,
      fullName: currentUser.fullName,
      email: currentUser.email,
      imageUrl: '',
    };
  }, [currentUser]);

  return { currentUser, formValues };
}
