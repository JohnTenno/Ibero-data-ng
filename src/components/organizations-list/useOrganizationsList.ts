import { useCallback, useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { organizationsService } from '../../core/services/organizations.service';
import type { Organization } from '../../core/models/dataset.model';
import type { Crumb } from '../shared/page-header/PageHeader';

export type SortOrder = 'nombre' | 'reciente';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Organizaciones' },
];

export function useOrganizationsList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchFiltered, setSearchFiltered] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('reciente');

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await organizationsService.list();
      setOrganizations(list);
      setSearchFiltered(list);
    } catch {
      setError('No se pudieron cargar las organizaciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const list = [...searchFiltered];
    if (sortOrder === 'nombre') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [searchFiltered, sortOrder]);

  const createOrganization = async (event: FormEvent) => {
    event.preventDefault();
    if (!newName || !newSlug) return;
    setCreating(true);
    setError(null);
    try {
      await organizationsService.create(newName, newSlug);
      setNewName('');
      setNewSlug('');
      setShowCreateForm(false);
      await reload();
    } catch {
      setError('No se pudo crear la organización (¿el slug ya existe?).');
    } finally {
      setCreating(false);
    }
  };

  const removeOrganization = async (org: Organization, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !confirm(
        `¿Borrar la organización "${org.name}"? Se borran TODOS sus datasets, resources y análisis. Esto no se puede deshacer.`,
      )
    ) {
      return;
    }
    setRemovingId(org.id);
    setError(null);
    try {
      await organizationsService.remove(org.id);
      await reload();
    } catch {
      setError('No se pudo borrar la organización.');
    } finally {
      setRemovingId(null);
    }
  };

  return {
    organizations,
    filtered,
    loading,
    error,
    creating,
    showCreateForm,
    setShowCreateForm,
    removingId,
    sortOrder,
    setSortOrder,
    newName,
    setNewName,
    newSlug,
    setNewSlug,
    setSearchFiltered,
    createOrganization,
    removeOrganization,
  };
}
