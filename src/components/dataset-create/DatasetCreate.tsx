import { Link } from 'react-router-dom';
import {
  PERIOD_TYPE_OPTIONS,
  SURVEY_OPTIONS,
  type DatasetVisibility,
  type PeriodType,
  type Survey,
} from '../../core/models/dataset.model';
import { useDatasetCreate } from './useDatasetCreate';
import './dataset-create.scss';

export function DatasetCreate() {
  const { organizationId, saving, error, revisionOf, fields, submit } = useDatasetCreate();

  return (
    <div className="c-dataset-create">
      <div className="page">
        <Link to={`/organizations/${organizationId}`} className="back">
          &larr; Organización
        </Link>

        <h1>Nuevo dataset</h1>
        {revisionOf && (
          <p className="revision-note">
            Esta es una <strong>revisión</strong> de <strong>{revisionOf.title}</strong> (v
            {revisionOf.revision}).
          </p>
        )}

        <form onSubmit={submit} noValidate>
          <fieldset>
            <legend>Identificación</legend>

            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={fields.title}
              onChange={(e) => fields.setTitle(e.target.value)}
              name="title"
              placeholder="Ej: ENIGH 2024 — Encuesta Nacional de Ingresos y Gastos"
            />

            <label htmlFor="slug">URL del dataset *</label>
            <input
              id="slug"
              type="text"
              value={fields.slug}
              onChange={(e) => fields.setSlug(e.target.value)}
              name="slug"
              placeholder="ej. enigh_2024_v1"
            />

            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              rows={3}
              value={fields.description}
              onChange={(e) => fields.setDescription(e.target.value)}
              name="description"
              placeholder="Qué contiene el dataset, metodología, fuente y notas relevantes."
            />
          </fieldset>

          <fieldset>
            <legend>Clasificación temática</legend>

            <label htmlFor="survey">Programa / Encuesta</label>
            <select
              id="survey"
              value={fields.survey}
              onChange={(e) => fields.setSurvey(e.target.value as Survey | '')}
              name="survey"
            >
              <option value="">— Selecciona —</option>
              {SURVEY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label htmlFor="year">Año de la encuesta</label>
            <input
              id="year"
              type="number"
              min="1990"
              max="2099"
              value={fields.year}
              onChange={(e) => fields.setYear(e.target.value)}
              name="year"
              placeholder="2024"
            />

            <label htmlFor="periodType">Tipo de periodo</label>
            <select
              id="periodType"
              value={fields.periodType}
              onChange={(e) => fields.setPeriodType(e.target.value as PeriodType | '')}
              name="periodType"
            >
              <option value="">— Selecciona —</option>
              {PERIOD_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>Fuente y descubribilidad (opcional)</legend>

            <label htmlFor="sourceOrg">Organización fuente</label>
            <input
              id="sourceOrg"
              type="text"
              value={fields.sourceOrg}
              onChange={(e) => fields.setSourceOrg(e.target.value)}
              name="sourceOrg"
              placeholder="Ej: INEGI, CONEVAL, SEP. Vacío si es interno."
            />

            <label htmlFor="sourceUrl">URL de la fuente original</label>
            <input
              id="sourceUrl"
              type="url"
              value={fields.sourceUrl}
              onChange={(e) => fields.setSourceUrl(e.target.value)}
              name="sourceUrl"
              placeholder="https://www.inegi.org.mx/programas/enigh/2024/"
            />

            <label htmlFor="tags">Etiquetas</label>
            <input
              id="tags"
              type="text"
              value={fields.tagsText}
              onChange={(e) => fields.setTagsText(e.target.value)}
              name="tags"
              placeholder="encuesta, hogares, ingreso"
            />

            <label htmlFor="licenseId">Licencia</label>
            <input
              id="licenseId"
              type="text"
              value={fields.licenseId}
              onChange={(e) => fields.setLicenseId(e.target.value)}
              name="licenseId"
              placeholder="Ej: cc-by, cc0"
            />
          </fieldset>

          {revisionOf && (
            <fieldset>
              <legend>Versionado</legend>
              <label htmlFor="changelog">Cambios respecto a la versión anterior</label>
              <textarea
                id="changelog"
                rows={2}
                value={fields.changelog}
                onChange={(e) => fields.setChangelog(e.target.value)}
                name="changelog"
                placeholder="Ej: Corrección en columna ingreso_mensual."
              />
            </fieldset>
          )}

          <fieldset>
            <legend>Visibilidad</legend>
            <label htmlFor="visibility">Visibilidad</label>
            <select
              id="visibility"
              value={fields.visibility}
              onChange={(e) => fields.setVisibility(e.target.value as DatasetVisibility)}
              name="visibility"
            >
              <option value="PRIVATE">Privado</option>
              <option value="PUBLIC">Público</option>
            </select>
          </fieldset>

          {error && <p className="error-hint">{error}</p>}

          <div className="form-actions">
            <Link className="button button-secondary" to={`/organizations/${organizationId}`}>
              Cancelar
            </Link>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Creando…' : 'Crear dataset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
