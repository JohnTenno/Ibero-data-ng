import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { resourcesService } from '../../core/services/resources.service';
import { datasetsService } from '../../core/services/datasets.service';
import { intermediarioService } from '../../core/services/intermediario.service';
import { errorMessage } from '../../core/api/http';
import type { Resource } from '../../core/models/resource.model';
import type { Dataset } from '../../core/models/dataset.model';
import type { Analysis } from '../../core/models/analysis.model';
import type {
  IntermediarioDatasetSummary,
  IntermediarioSurveySummary,
} from '../../core/models/intermediario.model';

function slugify(name: string): string {
  const clean = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return clean || 'armonizado';
}

export function useDatasetDetail() {
  const { organizationId = '', datasetId = '' } = useParams();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [selectedResourceId, setSelectedResourceId] = useState('');
  const selectedResource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId) ?? null,
    [resources, selectedResourceId],
  );

  const [openingVizCanvas, setOpeningVizCanvas] = useState(false);
  const [vizCanvasError, setVizCanvasError] = useState<string | null>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<Analysis | null>(null);

  const [intermediarioSurveys, setIntermediarioSurveys] = useState<
    IntermediarioSurveySummary[] | null
  >(null);
  const [loadingIntermediario, setLoadingIntermediario] = useState(false);
  const [intermediarioError, setIntermediarioError] = useState<string | null>(null);
  const [importingKey, setImportingKey] = useState<string | null>(null);

  const reloadResources = useCallback(async () => {
    setLoadingResources(true);
    try {
      const list = await resourcesService.list(organizationId, datasetId);
      setResources(list);
      setSelectedResourceId((current) => current || (list.length > 0 ? list[0].id : ''));
    } finally {
      setLoadingResources(false);
    }
  }, [organizationId, datasetId]);

  useEffect(() => {
    void reloadResources();
    void datasetsService.get(organizationId, datasetId).then(setDataset);
  }, [reloadResources, organizationId, datasetId]);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      await resourcesService.upload(organizationId, datasetId, file);
      await reloadResources();
    } catch {
      setUploadError(
        'No se pudo subir el archivo (¿necesitas rol ADMIN/EDITOR? ¿es un .parquet válido?).',
      );
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  const onRequestEditResource = (analysis: Analysis) => {
    setSelectedResourceId(analysis.sourceResourceId);
    setEditingAnalysis(analysis);
  };

  const loadIntermediarioCatalog = async () => {
    setLoadingIntermediario(true);
    setIntermediarioError(null);
    try {
      setIntermediarioSurveys(await intermediarioService.catalog(organizationId, datasetId));
    } catch (err) {
      setIntermediarioError(
        errorMessage(
          err,
          'No se pudo conectar con el intermediario (sectei-intermediario). ¿Está corriendo?',
        ),
      );
    } finally {
      setLoadingIntermediario(false);
    }
  };

  const importSurvey = async (survey: IntermediarioSurveySummary) => {
    setImportingKey(`survey-${survey.id}`);
    setIntermediarioError(null);
    try {
      await intermediarioService.import(organizationId, datasetId, {
        kind: 'survey',
        sourceId: survey.id,
        filename: `${slugify(survey.name)}_armonizado.parquet`,
      });
      await reloadResources();
    } catch (err) {
      setIntermediarioError(errorMessage(err, 'No se pudo importar la encuesta.'));
    } finally {
      setImportingKey(null);
    }
  };

  const importDataset = async (
    survey: IntermediarioSurveySummary,
    ds: IntermediarioDatasetSummary,
  ) => {
    setImportingKey(`dataset-${ds.id}`);
    setIntermediarioError(null);
    try {
      await intermediarioService.import(organizationId, datasetId, {
        kind: 'dataset',
        sourceId: ds.id,
        filename: `${slugify(survey.name)}_${ds.year}.parquet`,
      });
      await reloadResources();
    } catch (err) {
      setIntermediarioError(errorMessage(err, 'No se pudo importar ese año.'));
    } finally {
      setImportingKey(null);
    }
  };

  const openInVizCanvas = async () => {
    if (!selectedResourceId) return;
    setOpeningVizCanvas(true);
    setVizCanvasError(null);
    try {
      const { url } = await resourcesService.vizcanvasHandoff(
        organizationId,
        datasetId,
        selectedResourceId,
      );
      window.location.href = url;
    } catch (err) {
      setVizCanvasError(errorMessage(err, 'No se pudo abrir en VizCanvas.'));
      setOpeningVizCanvas(false);
    }
  };

  return {
    organizationId,
    datasetId,
    dataset,
    resources,
    loadingResources,
    uploading,
    uploadError,
    selectedResourceId,
    setSelectedResourceId,
    selectedResource,
    openingVizCanvas,
    vizCanvasError,
    editingAnalysis,
    setEditingAnalysis,
    intermediarioSurveys,
    loadingIntermediario,
    intermediarioError,
    importingKey,
    onFileSelected,
    onRequestEditResource,
    loadIntermediarioCatalog,
    importSurvey,
    importDataset,
    openInVizCanvas,
  };
}
