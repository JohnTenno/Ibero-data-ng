import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEW_OPTION, type HarmonizerSurvey } from '../../../core/models/harmonizer.model';
import { harmonizerService } from '../../../core/services/harmonizer.service';
import { errorMessage } from '../../../core/api/http';
import type { Crumb } from '../../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador', href: '/harmonizer' },
  { label: 'Subir CSV' },
];

export function useHarmonizerUpload() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<HarmonizerSurvey[]>([]);

  const [datasetName, setDatasetName] = useState('');
  const [datasetYear, setDatasetYear] = useState<number | ''>(new Date().getFullYear());
  const [uploadSurveyId, setUploadSurveyId] = useState(NEW_OPTION);
  const [newSurveyName, setNewSurveyName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    (async () => {
      try {
        const list = await harmonizerService.listSurveys(controller.signal);
        if (!active) return;
        setSurveys(list);
        if (list.length > 0) setUploadSurveyId((current) => (current === NEW_OPTION ? list[0].id : current));
      } catch {
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const canUpload = useMemo(() => {
    if (!file || !datasetName.trim() || datasetYear === '') return false;
    return uploadSurveyId !== NEW_OPTION || newSurveyName.trim() !== '';
  }, [file, datasetName, datasetYear, uploadSurveyId, newSurveyName]);

  const onFileSelected = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  }, []);

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!canUpload || !file || datasetYear === '') return;

      setUploading(true);
      setError(null);

      void (async () => {
        try {
          const { datasetId } = await harmonizerService.uploadDataset(
            {
              name: datasetName.trim(),
              year: Number(datasetYear),
              surveyId: uploadSurveyId,
              newSurvey: uploadSurveyId === NEW_OPTION ? newSurveyName.trim() : undefined,
            },
            file,
          );
          void navigate(`/harmonizer/datasets/${datasetId}/mapping`);
        } catch (err) {
          setError(errorMessage(err, 'No se pudo subir el archivo.'));
        } finally {
          setUploading(false);
        }
      })();
    },
    [canUpload, file, datasetYear, uploadSurveyId, newSurveyName, datasetName, navigate],
  );

  return {
    surveys,
    datasetName,
    setDatasetName,
    datasetYear,
    setDatasetYear,
    uploadSurveyId,
    setUploadSurveyId,
    newSurveyName,
    setNewSurveyName,
    onFileSelected,
    uploading,
    error,
    canUpload,
    submit,
    newOption: NEW_OPTION,
  };
}
