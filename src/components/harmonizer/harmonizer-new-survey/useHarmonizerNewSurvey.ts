import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { harmonizerService } from '../../../core/services/harmonizer.service';
import { errorMessage, fieldErrors } from '../../../core/api/http';
import type { Crumb } from '../../shared/page-header/PageHeader';

export const CRUMBS: Crumb[] = [
  { label: 'Inicio', href: '/dashboard' },
  { label: 'Armonizador', href: '/harmonizer' },
  { label: 'Nueva encuesta' },
];

export function useHarmonizerNewSurvey() {
  const navigate = useNavigate();
  const [surveyName, setSurveyName] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorName, setErrorName] = useState('');

  const submit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setErrorName('');
      setError(null);

      const name = surveyName.trim();
      if (!name) {
        setErrorName('El nombre de la encuesta es obligatorio.');
        return;
      }
      if (name.length < 2) {
        setErrorName('El nombre debe tener al menos 2 caracteres.');
        return;
      }

      setCreating(true);

      void (async () => {
        try {
          await harmonizerService.createSurvey(name, surveyDescription.trim() || undefined);
          setSurveyName('');
          setSurveyDescription('');
          void navigate('/harmonizer');
        } catch (err) {
          const matched = fieldErrors(err, ['name']);
          if (matched.name) {
            setErrorName(matched.name);
          } else {
            setError(errorMessage(err, 'No se pudo crear la encuesta.'));
          }
        } finally {
          setCreating(false);
        }
      })();
    },
    [surveyName, surveyDescription, navigate],
  );

  return {
    surveyName,
    setSurveyName,
    surveyDescription,
    setSurveyDescription,
    creating,
    error,
    errorName,
    submit,
  };
}
