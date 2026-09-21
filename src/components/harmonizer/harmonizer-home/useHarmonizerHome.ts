import { useEffect, useState } from 'react';
import { harmonizerService } from '../../../core/services/harmonizer.service';
import { errorMessage } from '../../../core/api/http';
import type { HarmonizerSurvey } from '../../../core/models/harmonizer.model';
import type { Crumb } from '../../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador' },
];

export function useHarmonizerHome() {
  const [surveys, setSurveys] = useState<HarmonizerSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    (async () => {
      try {
        const list = await harmonizerService.listSurveys(controller.signal);
        if (!active) return;
        setSurveys(list);
      } catch (err) {
        if (!active) return;
        setLoadError(errorMessage(err, 'No se pudieron cargar las encuestas.'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { surveys, loading, loadError };
}
