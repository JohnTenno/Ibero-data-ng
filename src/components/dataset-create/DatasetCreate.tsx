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
  const { organizationId, saving, error, revisionOf, campos, submit } = useDatasetCreate();

  return (
    <div className="c-dataset-create">
      <div className="pagina">
        <Link to={`/organizations/${organizationId}`} className="volver">
          &larr; Organización
        </Link>

        <h1>Nuevo dataset</h1>
        {revisionOf && (
          <p className="nota-revision">
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
              value={campos.title}
              onChange={(e) => campos.setTitle(e.target.value)}
              name="title"
              placeholder="Ej: ENIGH 2024 — Encuesta Nacional de Ingresos y Gastos"
            />

            <label htmlFor="slug">URL del dataset *</label>
            <input
              id="slug"
              type="text"
              value={campos.slug}
              onChange={(e) => campos.setSlug(e.target.value)}
              name="slug"
              placeholder="ej. enigh_2024_v1"
            />

            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              rows={3}
              value={campos.description}
              onChange={(e) => campos.setDescription(e.target.value)}
              name="description"
              placeholder="Qué contiene el dataset, metodología, fuente y notas relevantes."
            />
          </fieldset>

          <fieldset>
            <legend>Clasificación temática</legend>

            <label htmlFor="survey">Programa / Encuesta</label>
            <select
              id="survey"
              value={campos.survey}
              onChange={(e) => campos.setSurvey(e.target.value as Survey | '')}
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
              value={campos.year}
              onChange={(e) => campos.setYear(e.target.value)}
              name="year"
              placeholder="2024"
            />

            <label htmlFor="periodType">Tipo de periodo</label>
            <select
              id="periodType"
              value={campos.periodType}
              onChange={(e) => campos.setPeriodType(e.target.value as PeriodType | '')}
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
              value={campos.sourceOrg}
              onChange={(e) => campos.setSourceOrg(e.target.value)}
              name="sourceOrg"
              placeholder="Ej: INEGI, CONEVAL, SEP. Vacío si es interno."
            />

            <label htmlFor="sourceUrl">URL de la fuente original</label>
            <input
              id="sourceUrl"
              type="url"
              value={campos.sourceUrl}
              onChange={(e) => campos.setSourceUrl(e.target.value)}
              name="sourceUrl"
              placeholder="https://www.inegi.org.mx/programas/enigh/2024/"
            />

            <label htmlFor="tags">Etiquetas</label>
            <input
              id="tags"
              type="text"
              value={campos.tagsText}
              onChange={(e) => campos.setTagsText(e.target.value)}
              name="tags"
              placeholder="encuesta, hogares, ingreso"
            />

            <label htmlFor="licenseId">Licencia</label>
            <input
              id="licenseId"
              type="text"
              value={campos.licenseId}
              onChange={(e) => campos.setLicenseId(e.target.value)}
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
                value={campos.changelog}
                onChange={(e) => campos.setChangelog(e.target.value)}
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
              value={campos.visibility}
              onChange={(e) => campos.setVisibility(e.target.value as DatasetVisibility)}
              name="visibility"
            >
              <option value="PRIVATE">Privado</option>
              <option value="PUBLIC">Público</option>
            </select>
          </fieldset>

          {error && <p className="ayuda-error">{error}</p>}

          <div className="form-acciones">
            <Link className="boton boton-secundario" to={`/organizations/${organizationId}`}>
              Cancelar
            </Link>
            <button type="submit" className="boton boton-primario" disabled={saving}>
              {saving ? 'Creando…' : 'Crear dataset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
