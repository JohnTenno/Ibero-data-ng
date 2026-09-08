import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';

export function useOrganizationDetail() {
  const { organizationId = '' } = useParams();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDatasets(await datasetsService.list(organizationId));
    } catch {
      setError('No se pudieron cargar los datasets.');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const removeDataset = async (dataset: Dataset, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !confirm(
        `¿Borrar el dataset "${dataset.title}"? Se borran también sus resources y análisis. Esto no se puede deshacer.`,
      )
    ) {
      return;
    }
    setRemovingId(dataset.id);
    setError(null);
    try {
      await datasetsService.remove(organizationId, dataset.id);
      await reload();
    } catch {
      setError('No se pudo borrar el dataset.');
    } finally {
      setRemovingId(null);
    }
  };

  return { organizationId, datasets, loading, error, removingId, removeDataset };
}
