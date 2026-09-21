import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEW_OPTION } from '../../../core/models/harmonizer.model';
import {
  harmonizerService,
  useHarmonizerSurveys,
} from '../../../core/services/harmonizer.service';
import type { Crumb } from '../../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador', href: '/harmonizer' },
  { label: 'Subir CSV' },
];

export function useHarmonizerUpload() {
  const navigate = useNavigate();
  const { surveys, updateSurveys } = useHarmonizerSurveys();

  const [datasetName, setDatasetName] = useState('');
  const [datasetYear, setDatasetYear] = useState<number | ''>(new Date().getFullYear());
  const [uploadSurveyId, setUploadSurveyId] = useState(
    () => surveys[0]?.id ?? NEW_OPTION,
  );
  const [newSurveyName, setNewSurveyName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      let surveyId = uploadSurveyId;
      let datasetId = '';

      updateSurveys((prev) => {
        let next = prev;
        if (uploadSurveyId === NEW_OPTION) {
          surveyId = harmonizerService.nextId('survey');
          next = [
            ...prev,
            {
              id: surveyId,
              name: newSurveyName.trim(),
              description: null,
              datasets: [],
            },
          ];
        }

        datasetId = harmonizerService.nextId('ds');
        return next.map((survey) =>
          survey.id === surveyId
            ? {
                ...survey,
                datasets: [
                  ...survey.datasets,
                  {
                    id: datasetId,
                    name: datasetName.trim(),
                    year: Number(datasetYear),
                    rowCount: 0,
                    mappedColumns: 0,
                    totalColumns: 0,
                  },
                ],
              }
            : survey,
        );
      });

      setUploading(false);
      void navigate(`/harmonizer/datasets/${datasetId}/mapping`);
    },
    [
      canUpload,
      file,
      datasetYear,
      uploadSurveyId,
      newSurveyName,
      datasetName,
      updateSurveys,
      navigate,
    ],
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
