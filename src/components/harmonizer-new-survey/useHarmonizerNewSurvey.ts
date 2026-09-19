import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  harmonizerService,
  useHarmonizerSurveys,
} from '../../core/services/harmonizer.service';
import type { Crumb } from '../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador', href: '/harmonizer' },
  { label: 'Nueva encuesta' },
];

export function useHarmonizerNewSurvey() {
  const navigate = useNavigate();
  const { updateSurveys } = useHarmonizerSurveys();
  const [surveyName, setSurveyName] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const name = surveyName.trim();
      if (!name) return;

      setCreating(true);
      setError(null);

      const id = harmonizerService.nextId('survey');
      updateSurveys((prev) => [
        ...prev,
        {
          id,
          name,
          description: surveyDescription.trim() || null,
          datasets: [],
        },
      ]);
      setSurveyName('');
      setSurveyDescription('');
      setCreating(false);
      void navigate('/harmonizer');
    },
    [surveyName, surveyDescription, updateSurveys, navigate],
  );

  return {
    surveyName,
    setSurveyName,
    surveyDescription,
    setSurveyDescription,
    creating,
    error,
    submit,
  };
}
