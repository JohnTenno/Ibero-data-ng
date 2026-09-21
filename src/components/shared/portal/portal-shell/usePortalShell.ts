import { useLocation } from 'react-router-dom';

const LINKS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'datos', label: 'Datos', href: '/datos' },
  { id: 'temas', label: 'Temas', href: '/temas' },
];

export function usePortalShell() {
  const { pathname } = useLocation();
  const active = LINKS.find((e) => e.href === pathname)?.id ?? 'inicio';
  const activeSection = LINKS.find((e) => e.id === active)?.label ?? '';

  return { links: LINKS, active, activeSection };
}
