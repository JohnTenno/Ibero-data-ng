import { useAuth } from '../../core/auth/useAuth';

export function useProfile() {
  const { currentUser } = useAuth();
  return { currentUser };
}
