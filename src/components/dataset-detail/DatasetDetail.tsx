import { Link } from 'react-router-dom';
import { AnalysisBuilder } from '../analysis-builder/AnalysisBuilder';
import { useDatasetDetail } from './useDatasetDetail';
import './dataset-detail.scss';

export function DatasetDetail() {
  const {
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
  } = useDatasetDetail();

  return (
    <div className="c-dataset-detail">
      <div className="page">
        <Link to={`/organizations/${organizationId}`} className="back">
          &larr; Datasets
        </Link>

        {dataset && (
          <section className="metadata">
            <div className="metadata-tags">
              <span className="chip">{dataset.visibility}</span>
              {dataset.survey && <span className="chip">{dataset.survey}</span>}
              {dataset.year && <span className="chip">{dataset.year}</span>}
              {dataset.periodType && <span className="chip">{dataset.periodType}</span>}
              <span className="chip">v{dataset.revision}</span>
            </div>
            <h1>{dataset.title}</h1>
            {dataset.description && <p className="description">{dataset.description}</p>}

            <div className="metadata-detail">
              {dataset.sourceOrg && (
                <span>
                  <strong>Fuente:</strong> {dataset.sourceOrg}
                </span>
              )}
              {dataset.licenseId && (
                <span>
                  <strong>Licencia:</strong> {dataset.licenseId}
                </span>
              )}
              {dataset.tags.length > 0 && (
                <span>
                  <strong>Etiquetas:</strong> {dataset.tags.join(', ')}
                </span>
              )}
            </div>

            {dataset.revisionOf && (
              <p className="version-note">
                Revisión de{' '}
                <Link to={`/organizations/${organizationId}/datasets/${dataset.revisionOf.id}`}>
                  {dataset.revisionOf.title}
                </Link>{' '}
                (v{dataset.revisionOf.revision}).
                {dataset.changelog && ` Cambios: ${dataset.changelog}`}
              </p>
            )}
            {dataset.supersededBy && (
              <p className="version-note alert">
                ⚠ Hay una revisión más reciente:{' '}
                <Link to={`/organizations/${organizationId}/datasets/${dataset.supersededBy.id}`}>
                  {dataset.supersededBy.title}
                </Link>{' '}
                (v{dataset.supersededBy.revision}).
              </p>
            )}
            {!dataset.supersededBy && (
              <Link
                className="button button-secondary"
                to={`/organizations/${organizationId}/datasets/new?revisionOf=${dataset.id}`}
              >
                Crear revisión de este dataset
              </Link>
            )}
          </section>
        )}

        <section>
          <h2>Subir archivo Parquet</h2>
          <input type="file" accept=".parquet" onChange={onFileSelected} disabled={uploading} />
          {uploading && <p className="note">Subiendo…</p>}
          {uploadError && <p className="error-hint">{uploadError}</p>}
        </section>

        <section>
          <h2>Recursos</h2>
          {loadingResources ? (
            <p>Cargando…</p>
          ) : resources.length === 0 ? (
            <p>Todavía no hay archivos subidos.</p>
          ) : (
            <>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                name="resource"
              >
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.filename} ({(resource.sizeBytes / 1024).toFixed(1)} KB)
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="button button-secondary"
                onClick={openInVizCanvas}
                disabled={openingVizCanvas || !selectedResourceId}
              >
                {openingVizCanvas ? 'Abriendo…' : 'Abrir en VizCanvas'}
              </button>
              {vizCanvasError && <p className="error-hint">{vizCanvasError}</p>}
            </>
          )}
        </section>

        <section>
          <h2>Importar desde el intermediario</h2>
          <p className="note">
            Trae la vista armonizada del armonizador de encuestas (<code>sectei-intermediario</code>)
            como un recurso nuevo de este dataset.
          </p>

          {intermediarioSurveys === null && (
            <button
              type="button"
              className="button button-secondary"
              onClick={loadIntermediarioCatalog}
              disabled={loadingIntermediario}
            >
              {loadingIntermediario ? 'Conectando…' : 'Ver encuestas disponibles'}
            </button>
          )}

          {intermediarioError && <p className="error-hint">{intermediarioError}</p>}

          {intermediarioSurveys !== null &&
            (intermediarioSurveys.length === 0 ? (
              <p className="note">Todavía no hay encuestas cargadas en el intermediario.</p>
            ) : (
              <ul className="intermediary-list">
                {intermediarioSurveys.map((survey) => (
                  <li key={survey.id}>
                    <div className="intermediary-row">
                      <strong>{survey.name}</strong>
                      {survey.description && <span className="note">— {survey.description}</span>}
                      <button
                        type="button"
                        className="button button-secondary button-small"
                        onClick={() => void importSurvey(survey)}
                        disabled={
                          importingKey === `survey-${survey.id}` || survey.datasets.length === 0
                        }
                      >
                        {importingKey === `survey-${survey.id}`
                          ? 'Importando…'
                          : 'Importar encuesta completa (todos los años)'}
                      </button>
                    </div>
                    {survey.datasets.length > 0 && (
                      <ul className="year-list">
                        {survey.datasets.map((ds) => (
                          <li key={ds.id}>
                            <span>
                              {ds.year} — {ds.name} ({ds.mappedColumns}/{ds.totalColumns} columnas
                              mapeadas, {ds.rowCount} filas)
                            </span>
                            <button
                              type="button"
                              className="button button-secondary button-small"
                              onClick={() => void importDataset(survey, ds)}
                              disabled={importingKey === `dataset-${ds.id}`}
                            >
                              {importingKey === `dataset-${ds.id}`
                                ? 'Importando…'
                                : 'Importar este año'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ))}
        </section>

        {selectedResourceId && (
          <section>
            <h2>Análisis por pasos</h2>
            <AnalysisBuilder
              organizationId={organizationId}
              datasetId={datasetId}
              resourceId={selectedResourceId}
              resourceColumns={selectedResource?.columns ?? null}
              datasetResources={resources}
              editingAnalysis={editingAnalysis}
              onRequestEditResource={onRequestEditResource}
              onEditingConsumed={() => setEditingAnalysis(null)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
