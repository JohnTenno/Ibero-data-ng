import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { datasetsService } from '../../core/services/datasets.service';
import { organizationsService } from '../../core/services/organizations.service';
import type { Dataset, Organization } from '../../core/models/dataset.model';
import type { Crumb } from '../shared/page-header/PageHeader';

export function useOrganizationDetail() {
  const { organizationId = '' } = useParams();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Dataset | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [org, list] = await Promise.all([
        organizationsService.get(organizationId),
        datasetsService.list(organizationId),
      ]);
      setOrganization(org);
      setDatasets(list);
    } catch {
      setError('No se pudieron cargar los datasets.');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const crumbs: Crumb[] = useMemo(
    () => [
      { label: 'Inicio', href: '/dashboard' },
      { label: 'Organizaciones', href: '/organizations' },
      { label: organization?.name ?? 'Organización' },
    ],
    [organization?.name],
  );

  const requestRemoveDataset = (dataset: Dataset, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setPendingDelete(dataset);
  };

  const cancelRemoveDataset = () => setPendingDelete(null);

  const confirmRemoveDataset = async () => {
    if (!pendingDelete) return;
    const dataset = pendingDelete;
    setRemovingId(dataset.id);
    setError(null);
    try {
      await datasetsService.remove(organizationId, dataset.id);
      await reload();
    } catch {
      setError('No se pudo borrar el dataset.');
    } finally {
      setRemovingId(null);
      setPendingDelete(null);
    }
  };

  return {
    organizationId,
    organization,
    datasets,
    loading,
    error,
    removingId,
    pendingDelete,
    requestRemoveDataset,
    cancelRemoveDataset,
    confirmRemoveDataset,
    crumbs,
  };
}
