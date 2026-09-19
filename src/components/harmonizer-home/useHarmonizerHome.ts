import { useHarmonizerSurveys } from '../../core/services/harmonizer.service';
import type { Crumb } from '../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador' },
];

export function useHarmonizerHome() {
  const { surveys } = useHarmonizerSurveys();
  return { surveys };
}
