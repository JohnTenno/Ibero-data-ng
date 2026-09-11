import { useState } from 'react';
import { useAuth } from '../../../core/auth/useAuth';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', icon: 'pictograma-explorar', path: '/dashboard' },
  { label: 'Conjuntos de datos', icon: 'pictograma-capas', path: '/datasets' },
  { label: 'Organizaciones', icon: 'pictograma-grupo', path: '/organizations' },
  { label: 'Configuración de perfil', icon: 'pictograma-persona', path: '/profile' },
];

export function useAppShell() {
  const { currentUser, logout } = useAuth();
  const [filteredItems, setFilteredItems] = useState<NavItem[]>(NAV_ITEMS);

  return { currentUser, logout, navItems: NAV_ITEMS, filteredItems, setFilteredItems };
}
