import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Crumb } from '../../shared/page-header/PageHeader';
import {
  CANONICAL_PREFIX,
  NEW_OPTION,
  type CanonicalVariable,
  type HarmonizerDataset,
  type MappingChoice,
} from '../../../core/models/harmonizer.model';
import { harmonizerService } from '../../../core/services/harmonizer.service';
import { errorMessage } from '../../../core/api/http';

export interface ColumnRow {
  column: { name: string; selectedCanonicalId: string | null; suggested: string | null; suggestionSource: 'history' | 'name' | null };
  choice: string;
  newName: string;
}

export const SUGGESTION_LABEL: Record<'history' | 'name', string> = {
  history: 'histórico',
  name: 'por nombre',
};

export function useHarmonizerMapping() {
  const { datasetId = '' } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState<HarmonizerDataset | null>(null);
  const [canonicalVariables, setCanonicalVariables] = useState<CanonicalVariable[]>([]);
  const [rows, setRows] = useState<ColumnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    (async () => {
      try {
        const info = await harmonizerService.getMapping(datasetId, controller.signal);
        if (!active) return;
        setDataset(info.dataset);
        setCanonicalVariables(info.canonicalVariables);
        setRows(
          info.columns.map((column) => ({
            column,
            choice: column.selectedCanonicalId ? `${CANONICAL_PREFIX}${column.selectedCanonicalId}` : '',
            newName: '',
          })),
        );
      } catch (err) {
        if (!active) return;
        setLoadError(errorMessage(err, 'No se pudo cargar el mapeo de este dataset.'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [datasetId]);

  const mappedCount = useMemo(
    () =>
      rows.filter(
        (r) => r.choice !== '' && (r.choice !== NEW_OPTION || r.newName.trim() !== ''),
      ).length,
    [rows],
  );

  const setChoice = useCallback((index: number, choice: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, choice } : row)));
  }, []);

  const setNewName = useCallback((index: number, newName: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, newName } : row)));
  }, []);

  const clearAll = useCallback(() => {
    setRows((prev) => prev.map((row) => ({ ...row, choice: '', newName: '' })));
  }, []);

  const save = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setSaving(true);
      setSaveError(null);

      const columns: MappingChoice[] = rows
        .filter((row) => row.choice !== '')
        .map((row) => ({
          column: row.column.name,
          choice: row.choice,
          newName: row.choice === NEW_OPTION ? row.newName.trim() : undefined,
        }));

      void (async () => {
        try {
          await harmonizerService.saveMapping(datasetId, columns);
          void navigate(`/harmonizer/datasets/${datasetId}/harmonized`);
        } catch (err) {
          setSaveError(errorMessage(err, 'No se pudo guardar el mapeo.'));
        } finally {
          setSaving(false);
        }
      })();
    },
    [datasetId, rows, navigate],
  );

  const crumbs: Crumb[] = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Armonizador', href: '/harmonizer' },
    { label: 'Mapeo' },
  ];

  return {
    datasetId,
    dataset,
    canonicalVariables,
    rows,
    loading,
    loadError,
    saving,
    saveError,
    mappedCount,
    setChoice,
    setNewName,
    clearAll,
    save,
    crumbs,
    newOption: NEW_OPTION,
    canonicalPrefix: CANONICAL_PREFIX,
    suggestionLabel: SUGGESTION_LABEL,
  };
}
