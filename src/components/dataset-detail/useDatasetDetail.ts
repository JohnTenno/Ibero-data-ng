import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { resourcesService } from '../../core/services/resources.service';
import { datasetsService } from '../../core/services/datasets.service';
import { errorMessage } from '../../core/api/http';
import type { Resource } from '../../core/models/resource.model';
import type { Dataset } from '../../core/models/dataset.model';
import type { Analysis } from '../../core/models/analysis.model';

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
    onFileSelected,
    onRequestEditResource,
    openInVizCanvas,
  };
}
