import { Button } from 'sectei-library';
import { PageHeader } from '../../shared/page-header/PageHeader';
import { CRUMBS, useHarmonizerNewSurvey } from './useHarmonizerNewSurvey';
import './harmonizer-new-survey.css';

export function HarmonizerNewSurvey() {
  const {
    surveyName,
    setSurveyName,
    surveyDescription,
    setSurveyDescription,
    creating,
    error,
    errorName,
    submit,
  } = useHarmonizerNewSurvey();

  return (
    <div className="c-harmonizer-new-survey">
      <PageHeader
        title="Nueva encuesta"
        intro="Crea una encuesta para agrupar ediciones (CSV) y armonizar sus variables."
        crumbs={CRUMBS}
        action={
          <Button
            type="button"
            variant="secondary"
            icon="pictogram-arrow-left"
            href="/harmonizer"
          >
            Encuestas
          </Button>
        }
      />

      <div className="container width-fixed c-harmonizer-new-survey__body">
        <form className="c-harmonizer-new-survey__form" onSubmit={submit} noValidate>
          <fieldset className="c-harmonizer-new-survey__section">
            <legend className="c-harmonizer-new-survey__legend">Datos de la encuesta</legend>

            <div className="c-harmonizer-new-survey__field">
              <label htmlFor="survey-name">Nombre *</label>
              <input
                id="survey-name"
                type="text"
                value={surveyName}
                onChange={(e) => setSurveyName(e.target.value)}
                name="surveyName"
                placeholder="Ej: Socioeconómica"
                required
                aria-invalid={!!errorName}
                aria-describedby={errorName ? 'survey-name-error' : undefined}
              />
              {errorName ? (
                <p id="survey-name-error" className="c-harmonizer-new-survey__error" role="alert">
                  {errorName}
                </p>
              ) : null}
            </div>

            <div className="c-harmonizer-new-survey__field">
              <label htmlFor="survey-description">Descripción</label>
              <input
                id="survey-description"
                type="text"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                name="surveyDescription"
              />
            </div>

            {error ? <p className="c-harmonizer-new-survey__error">{error}</p> : null}

            <div className="c-harmonizer-new-survey__actions">
              <Button
                type="submit"
                variant="primary"
                icon="pictogram-add"
                disabled={creating || !surveyName.trim()}
              >
                {creating ? 'Creando…' : 'Crear encuesta'}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
