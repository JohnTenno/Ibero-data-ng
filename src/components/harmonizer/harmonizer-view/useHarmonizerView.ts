import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { ExportFormat, HarmonizedRow } from '../../../core/models/harmonizer.model';
import {
  MOCK_DATASET_HARMONIZED,
  MOCK_SURVEY_HARMONIZED,
} from '../../../data/mock-harmonizer';
import type { Crumb } from '../../shared/page-header/PageHeader';

const SURVEY_ORIGIN_COLUMNS = ['_dataset', '_year'];
export const MAX_VISIBLE_ROWS = 500;

function downloadCsv(filename: string, headers: string[], rows: HarmonizedRow[]) {
  const escape = (value: string | number) => {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h] ?? '')).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useHarmonizerView() {
  const { datasetId, surveyId } = useParams<{ datasetId?: string; surveyId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const datasetView = datasetId
    ? (MOCK_DATASET_HARMONIZED[datasetId] ?? {
        dataset: {
          id: datasetId,
          name: 'Edición de ejemplo',
          year: new Date().getFullYear(),
          surveyId: 'survey-new',
          surveyName: 'Encuesta nueva',
        },
        headers: [] as string[],
        availableVariables: [] as string[],
        selectedCount: 0,
        rows: [],
      })
    : null;
  const baseSurveyView = surveyId
    ? (MOCK_SURVEY_HARMONIZED[surveyId] ?? {
        survey: { id: surveyId, name: 'Encuesta de ejemplo' },
        headers: [] as string[],
        rows: [],
        availableVariables: [] as string[],
        selected: [] as string[],
        selectedCount: 0,
      })
    : null;

  const selectedFromUrl = searchParams.getAll('variables');
  const [selectedVariables, setSelectedVariables] = useState<string[]>(() =>
    selectedFromUrl.length > 0
      ? selectedFromUrl
      : (baseSurveyView?.selected ?? baseSurveyView?.availableVariables ?? []),
  );

  const [downloading, setDownloading] = useState<ExportFormat | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const loadError = null;

  const surveyView = useMemo(() => {
    if (!baseSurveyView) return null;
    const selected =
      selectedVariables.length === 0
        ? baseSurveyView.availableVariables
        : selectedVariables.filter((v) => baseSurveyView.availableVariables.includes(v));
    const headers = selected;
    const rows = baseSurveyView.rows.map((row) => {
      const next: HarmonizedRow = {
        _dataset: row._dataset,
        _year: row._year,
      };
      for (const header of headers) {
        next[header] = row[header] ?? '';
      }
      return next;
    });
    return {
      ...baseSurveyView,
      headers,
      selected,
      selectedCount: selected.length,
      rows,
    };
  }, [baseSurveyView, selectedVariables]);

  const headers = useMemo(() => {
    if (datasetView) return datasetView.headers;
    if (surveyView) return [...SURVEY_ORIGIN_COLUMNS, ...surveyView.headers];
    return [];
  }, [datasetView, surveyView]);

  const rows = datasetView?.rows ?? surveyView?.rows ?? [];
  const visibleRows = rows.slice(0, MAX_VISIBLE_ROWS);

  const title = datasetView
    ? `${datasetView.dataset.name} (${datasetView.dataset.year})`
    : (surveyView?.survey.name ?? '');

  const isSelected = useCallback(
    (variable: string) =>
      selectedVariables.length === 0 || selectedVariables.includes(variable),
    [selectedVariables],
  );

  const toggleVariable = useCallback(
    (variable: string) => {
      if (!baseSurveyView) return;
      const current =
        selectedVariables.length === 0
          ? [...baseSurveyView.availableVariables]
          : [...selectedVariables];
      const next = current.includes(variable)
        ? current.filter((v) => v !== variable)
        : [...current, variable];
      setSelectedVariables(next);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.delete('variables');
          for (const value of next) params.append('variables', value);
          return params;
        },
        { replace: true },
      );
    },
    [baseSurveyView, selectedVariables, setSearchParams],
  );

  const download = useCallback(
    (format: ExportFormat) => {
      setDownloading(format);
      setDownloadError(null);
      try {
        if (format === 'parquet') {
          setDownloadError('La descarga Parquet es solo de demostración (sin API).');
          return;
        }
        const filename = datasetView
          ? `harmonized_${datasetView.dataset.name}_${datasetView.dataset.year}`
          : `harmonized_${surveyView?.survey.name ?? 'survey'}`;
        downloadCsv(filename.replace(/\s+/g, '_'), headers, rows);
      } finally {
        setDownloading(null);
      }
    },
    [datasetView, surveyView, headers, rows],
  );

  const crumbs: Crumb[] = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Armonizador', href: '/harmonizer' },
    { label: 'Vista armonizada' },
  ];

  return {
    datasetId,
    surveyId,
    datasetView,
    surveyView,
    loadError,
    downloading,
    downloadError,
    headers,
    rows,
    visibleRows,
    title,
    isSelected,
    toggleVariable,
    download,
    crumbs,
    maxVisibleRows: MAX_VISIBLE_ROWS,
  };
}
