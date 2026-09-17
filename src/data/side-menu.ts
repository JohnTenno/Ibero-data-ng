import type { SideMenuItem } from '../components/shared/side-menu/SideMenu';

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    href: '/dashboard',
    pictogram: 'pictogram-explore',
  },
  {
    id: 'datasets',
    label: 'Conjuntos de datos',
    href: '/datasets',
    pictogram: 'pictogram-layers',
  },
  {
    id: 'organizations',
    label: 'Organizaciones',
    href: '/organizations',
    pictogram: 'pictogram-group',
  },
  {
    id: 'profile',
    label: 'Configuración de perfil',
    href: '/profile',
    pictogram: 'pictogram-person',
  },
];
