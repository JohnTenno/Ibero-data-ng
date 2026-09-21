import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Crumb } from '../../shared/page-header/PageHeader';
import {
  CANONICAL_PREFIX,
  NEW_OPTION,
  type MappingColumn,
} from '../../../core/models/harmonizer.model';
import { MOCK_MAPPING_BY_DATASET } from '../../../data/mock-harmonizer';

export interface ColumnRow {
  column: MappingColumn;
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
  const info = MOCK_MAPPING_BY_DATASET[datasetId] ?? {
    dataset: {
      id: datasetId,
      name: 'Edición de ejemplo',
      year: new Date().getFullYear(),
      surveyId: 'survey-new',
      surveyName: 'Encuesta nueva',
    },
    canonicalVariables: [
      { id: 'cv-age', name: 'edad' },
      { id: 'cv-sex', name: 'sexo' },
      { id: 'cv-income', name: 'ingreso_trimestral' },
    ],
    columns: [
      {
        name: 'col_a',
        selectedCanonicalId: null,
        suggested: 'edad',
        suggestionSource: 'name' as const,
      },
      {
        name: 'col_b',
        selectedCanonicalId: null,
        suggested: null,
        suggestionSource: null,
      },
    ],
  };

  const [rows, setRows] = useState<ColumnRow[]>(() =>
    info.columns.map((column) => ({
      column,
      choice: column.selectedCanonicalId ? `${CANONICAL_PREFIX}${column.selectedCanonicalId}` : '',
      newName: '',
    })),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadError = null;
  const dataset = info.dataset;
  const canonicalVariables = info.canonicalVariables;
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
      setSaving(false);
      void navigate(`/harmonizer/datasets/${datasetId}/harmonized`);
    },
    [datasetId, navigate],
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
