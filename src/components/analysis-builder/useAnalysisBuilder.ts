import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { analysesService } from '../../core/services/analyses.service';
import { mensajeDeError } from '../../core/api/http';
import type {
  Analysis,
  OpCatalog,
  OpName,
  PreviewResult,
  Step,
} from '../../core/models/analysis.model';
import type { DatasetVisibility } from '../../core/models/dataset.model';
import type { Resource, ResourceColumn } from '../../core/models/resource.model';

export const OP_LABELS: Record<OpName, string> = {
  join: 'Cruzar con otro recurso',
  group_by: 'Agrupar por',
  aggregate: 'Calcular (suma/promedio/…)',
  compute: 'Crear columna (multiplicar)',
  percentage: 'Convertir a porcentaje',
  filter: 'Filtrar filas',
  sort: 'Ordenar',
  limit: 'Limitar filas (top N)',
};

export const AGG_FUNCS = ['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'MEDIAN'];
export const OPERATORS = ['=', '!=', '<', '<=', '>', '>='];
export const JOIN_TYPES = ['inner', 'left'];

const PARAMS_POR_DEFECTO: Record<OpName, Record<string, unknown>> = {
  join: { resourceId: '', alias: '', type: 'inner', onLeft: '', onRight: '' },
  group_by: { columns: [] },
  aggregate: { func: 'SUM', column: '', as: '', distinct: false },
  compute: { left: '', right: '', as: '' },
  percentage: { of: '', as: '' },
  filter: { column: '', operator: '=', value: '' },
  sort: { column: '', dir: 'desc' },
  limit: { n: 100 },
};

export interface OpcionesAnalysisBuilder {
  organizationId: string;
  datasetId: string;
  resourceId: string;
  resourceColumns?: ResourceColumn[] | null;
  datasetResources?: Resource[];
  editingAnalysis?: Analysis | null;
  onEditingConsumed?: () => void;
}

export function useAnalysisBuilder({
  organizationId,
  datasetId,
  resourceId,
  resourceColumns = null,
  datasetResources = [],
  editingAnalysis = null,
  onEditingConsumed,
}: OpcionesAnalysisBuilder) {
  const [opCatalog, setOpCatalog] = useState<OpCatalog | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [newOp, setNewOp] = useState<OpName>('group_by');

  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [roundDecimals, setRoundDecimals] = useState('');

  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAnalysis, setSavedAnalysis] = useState<Analysis | null>(null);
  const [editingAnalysisId, setEditingAnalysisId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [folder, setFolder] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<DatasetVisibility>('PRIVATE');

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [openAnalysisId, setOpenAnalysisId] = useState<string | null>(null);
  const [openAnalysisData, setOpenAnalysisData] = useState<PreviewResult | null>(null);

  const [openingVizCanvasId, setOpeningVizCanvasId] = useState<string | null>(null);
  const [vizCanvasError, setVizCanvasError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const reloadAnalyses = useCallback(async () => {
    setLoadingAnalyses(true);
    try {
      setAnalyses(await analysesService.list(organizationId, datasetId));
    } finally {
      setLoadingAnalyses(false);
    }
  }, [organizationId, datasetId]);

  useEffect(() => {
    void analysesService.operations(organizationId, datasetId).then(setOpCatalog);
    void reloadAnalyses();
  }, [organizationId, datasetId, reloadAnalyses]);

  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    setSteps([]);
    setPreviewResult(null);
  }, [resourceId]);

  useEffect(() => {
    if (!editingAnalysis) return;
    setEditingAnalysisId(editingAnalysis.id);
    setSteps(editingAnalysis.recipe);
    setTitle(editingAnalysis.title);
    setSlug(editingAnalysis.slug);
    setFolder(editingAnalysis.folder);
    setDescription(editingAnalysis.description ?? '');
    setVisibility(editingAnalysis.visibility);
    setRoundDecimals('');
    setShowSaveForm(true);
    setPreviewResult(null);
    setPreviewError(null);
    setSaveError(null);
    setSavedAnalysis(null);
    onEditingConsumed?.();
  }, [editingAnalysis, onEditingConsumed]);

  const otherResources = useMemo(
    () => datasetResources.filter((r) => r.id !== resourceId),
    [datasetResources, resourceId],
  );

  const columnsForResource = useCallback(
    (id: string) => (datasetResources.find((r) => r.id === id)?.columns ?? []).map((c) => c.name),
    [datasetResources],
  );

  const availableColumns = useMemo<string[]>(() => {
    const base = (resourceColumns ?? []).map((c) => c.name);
    const derived: string[] = [];
    const joined: string[] = [];
    for (const step of steps) {
      if (step.op === 'compute' && typeof step.params['as'] === 'string') {
        derived.push(step.params['as']);
      }
      if (step.op === 'aggregate' && typeof step.params['as'] === 'string') {
        derived.push(step.params['as']);
      }
      if (step.op === 'join' && typeof step.params['resourceId'] === 'string') {
        joined.push(...columnsForResource(step.params['resourceId']));
      }
    }
    return [...new Set([...base, ...joined, ...derived])];
  }, [resourceColumns, steps, columnsForResource]);

  const aggregateAliases = useMemo<string[]>(
    () =>
      steps
        .filter((s) => s.op === 'aggregate' && typeof s.params['as'] === 'string')
        .map((s) => s.params['as'] as string),
    [steps],
  );

  const setParam = useCallback((index: number, clave: string, valor: unknown) => {
    setSteps((previos) =>
      previos.map((step, i) =>
        i === index ? { ...step, params: { ...step.params, [clave]: valor } } : step,
      ),
    );
  }, []);

  const onJoinResourceChange = (index: number, step: Step, nuevoResourceId: string) => {
    const recurso = datasetResources.find((r) => r.id === nuevoResourceId);
    const alias =
      step.params['alias'] ||
      (recurso ? recurso.filename.replace(/\.[^./]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_') : '');
    setSteps((previos) =>
      previos.map((s, i) =>
        i === index ? { ...s, params: { ...s.params, resourceId: nuevoResourceId, alias } } : s,
      ),
    );
  };

  const addStep = () => {
    setSteps((previos) => [...previos, { op: newOp, params: { ...PARAMS_POR_DEFECTO[newOp] } }]);
    setPreviewResult(null);
  };

  const removeStep = (index: number) => {
    setSteps((previos) => previos.filter((_, i) => i !== index));
    setPreviewResult(null);
  };

  const toggleGroupByColumn = (index: number, step: Step, column: string) => {
    const cols = (step.params['columns'] as string[]) ?? [];
    setParam(
      index,
      'columns',
      cols.includes(column) ? cols.filter((c) => c !== column) : [...cols, column],
    );
  };

  const isGroupByColumnSelected = (step: Step, column: string) =>
    ((step.params['columns'] as string[]) ?? []).includes(column);

  const runPreview = async () => {
    if (steps.length === 0) return;
    setPreviewing(true);
    setPreviewError(null);
    try {
      setPreviewResult(
        await analysesService.preview(
          organizationId,
          datasetId,
          resourceId,
          steps,
          roundDecimals === '' ? undefined : Number(roundDecimals),
        ),
      );
    } catch (err) {
      setPreviewError(mensajeDeError(err, 'El preview falló.'));
    } finally {
      setPreviewing(false);
    }
  };

  const cancelEdit = () => {
    setEditingAnalysisId(null);
    setSteps([]);
    setShowSaveForm(false);
    setTitle('');
    setSlug('');
    setFolder('');
    setDescription('');
    setPreviewResult(null);
    setSaveError(null);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !slug || !folder) return;
    setSaving(true);
    setSaveError(null);
    const payload = {
      resourceId,
      title,
      slug,
      folder,
      description: description || undefined,
      visibility,
      steps,
      roundDecimals: roundDecimals === '' ? undefined : Number(roundDecimals),
    };
    try {
      const analysis = editingAnalysisId
        ? await analysesService.update(organizationId, datasetId, editingAnalysisId, payload)
        : await analysesService.create(organizationId, datasetId, payload);
      setSavedAnalysis(analysis);
      setShowSaveForm(false);
      setEditingAnalysisId(null);
      setTitle('');
      setSlug('');
      setFolder('');
      setDescription('');
      setSteps([]);
      await reloadAnalyses();
    } catch (err) {
      setSaveError(
        mensajeDeError(
          err,
          editingAnalysisId
            ? 'No se pudo actualizar el análisis.'
            : 'No se pudo guardar el análisis.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const openAnalysis = async (analysis: Analysis) => {
    if (openAnalysisId === analysis.id) {
      setOpenAnalysisId(null);
      setOpenAnalysisData(null);
      return;
    }
    setOpenAnalysisId(analysis.id);
    setOpenAnalysisData(null);
    if (analysis.status === 'DONE') {
      setOpenAnalysisData(await analysesService.getData(organizationId, datasetId, analysis.id));
    }
  };

  const openInVizCanvas = async (analysis: Analysis, event: MouseEvent) => {
    event.stopPropagation();
    setOpeningVizCanvasId(analysis.id);
    setVizCanvasError(null);
    try {
      const { url } = await analysesService.vizcanvasHandoff(
        organizationId,
        datasetId,
        analysis.id,
      );
      window.location.href = url;
    } catch (err) {
      setVizCanvasError(mensajeDeError(err, 'No se pudo abrir en VizCanvas.'));
      setOpeningVizCanvasId(null);
    }
  };

  const removeAnalysis = async (analysis: Analysis, event: MouseEvent) => {
    event.stopPropagation();
    if (!confirm(`¿Borrar el análisis "${analysis.title}"? Esto no se puede deshacer.`)) {
      return;
    }
    setRemovingId(analysis.id);
    setVizCanvasError(null);
    try {
      await analysesService.remove(organizationId, datasetId, analysis.id);
      if (openAnalysisId === analysis.id) {
        setOpenAnalysisId(null);
        setOpenAnalysisData(null);
      }
      await reloadAnalyses();
    } catch (err) {
      setVizCanvasError(mensajeDeError(err, 'No se pudo borrar el análisis.'));
    } finally {
      setRemovingId(null);
    }
  };

  return {
    opCatalog,
    opNames: opCatalog ? (Object.keys(opCatalog) as OpName[]) : [],
    steps,
    newOp,
    setNewOp,
    addStep,
    removeStep,
    setParam,
    onJoinResourceChange,
    toggleGroupByColumn,
    isGroupByColumnSelected,
    otherResources,
    columnsForResource,
    availableColumns,
    aggregateAliases,
    previewing,
    previewError,
    previewResult,
    roundDecimals,
    setRoundDecimals,
    runPreview,
    showSaveForm,
    setShowSaveForm,
    saving,
    saveError,
    savedAnalysis,
    editingAnalysisId,
    cancelEdit,
    save,
    formulario: {
      title,
      setTitle,
      slug,
      setSlug,
      folder,
      setFolder,
      description,
      setDescription,
      visibility,
      setVisibility,
    },
    analyses,
    loadingAnalyses,
    openAnalysisId,
    openAnalysisData,
    openAnalysis,
    openingVizCanvasId,
    vizCanvasError,
    removingId,
    openInVizCanvas,
    removeAnalysis,
  };
}
