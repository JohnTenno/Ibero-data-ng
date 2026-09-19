import { Button } from 'sectei-library';
import { Link } from 'react-router-dom';
import { PageHeader } from '../shared/page-header/PageHeader';
import { StatusBadge } from '../shared/status-badge/StatusBadge';
import { useHarmonizerView } from './useHarmonizerView';
import './harmonizer-view.css';

export function HarmonizerView() {
  const {
    datasetId,
    datasetView,
    surveyView,
    loadError,
    downloading,
    downloadError,
    headers,
    rows,
    visibleRows,
    title,
    isSelected,
    toggleVariable,
    download,
    crumbs,
    maxVisibleRows,
  } = useHarmonizerView();

  const selectedCount = surveyView?.selectedCount ?? datasetView?.selectedCount ?? 0;
  const availableCount =
    surveyView?.availableVariables.length ?? datasetView?.availableVariables.length ?? 0;

  const intro =
    !loadError && datasetView ? (
      <>
        Edición <strong>{title}</strong> · encuesta <strong>{datasetView.dataset.surveyName}</strong>
      </>
    ) : !loadError && surveyView ? (
      <>
        Encuesta <strong>{title}</strong>
      </>
    ) : (
      'Vista armonizada de ediciones o de toda la encuesta.'
    );

  return (
    <div className="c-harmonizer-view">
      <PageHeader
        title="Vista armonizada"
        intro={intro}
        crumbs={crumbs}
        action={
          <div className="c-harmonizer-view__header-actions" role="group" aria-label="Descargas">
            {datasetView && datasetId ? (
              <Button
                type="button"
                variant="secondary"
                href={`/harmonizer/datasets/${datasetId}/mapping`}
              >
                Editar mapeo
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              icon="pictogram-file-download"
              onClick={() => download('csv')}
              disabled={downloading !== null}
            >
              {downloading === 'csv' ? 'Descargando…' : 'CSV'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon="pictogram-file-download"
              onClick={() => download('parquet')}
              disabled={downloading !== null || headers.length === 0}
            >
              {downloading === 'parquet' ? 'Descargando…' : 'Parquet'}
            </Button>
            <Button
              type="button"
              variant="bare-secondary"
              icon="pictogram-arrow-left"
              href="/harmonizer"
            >
              Armonizador
            </Button>
          </div>
        }
      />

      <div className="container width-fixed c-harmonizer-view__body">
        {loadError ? <p className="c-harmonizer-view__error">{loadError}</p> : null}

        {!loadError ? (
          <>
            <div className="c-harmonizer-view__summary">
              <StatusBadge variant="neutral">
                Variables: {selectedCount}
                {availableCount > 0 ? ` de ${availableCount}` : ''}
              </StatusBadge>
              <StatusBadge variant="neutral">Filas: {rows.length}</StatusBadge>
            </div>

            {downloadError ? <p className="c-harmonizer-view__error">{downloadError}</p> : null}

            {surveyView ? (
              <section className="c-harmonizer-view__panel" aria-labelledby="filter-title">
                <header className="c-harmonizer-view__panel-heading">
                  <h2 id="filter-title" className="c-harmonizer-view__panel-title">
                    Filtrar variables
                  </h2>
                </header>
                <div className="c-harmonizer-view__panel-body">
                  {surveyView.availableVariables.length === 0 ? (
                    <p className="c-harmonizer-view__empty">
                      Ninguna edición de esta encuesta tiene columnas mapeadas todavía.
                    </p>
                  ) : (
                    <ul className="checkboxes-nested c-harmonizer-view__checks">
                      {surveyView.availableVariables.map((variable) => {
                        const id = `var-${variable}`;
                        return (
                          <li key={variable}>
                            <input
                              id={id}
                              type="checkbox"
                              checked={isSelected(variable)}
                              onChange={() => toggleVariable(variable)}
                            />
                            <label htmlFor={id}>{variable}</label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            ) : null}

            {headers.length === 0 ? (
              <p className="c-harmonizer-view__empty">
                No hay columnas mapeadas.
                {datasetId ? (
                  <>
                    {' '}
                    <Link to={`/harmonizer/datasets/${datasetId}/mapping`} className="hyperlink">
                      Mapea las columnas
                    </Link>{' '}
                    para verlas aquí.
                  </>
                ) : null}
              </p>
            ) : (
              <>
                <div className="container-table">
                  <table className="table-condensed">
                    <thead>
                      <tr>
                        {headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className={header.startsWith('_') ? 'text-color-secondary' : undefined}
                          >
                            {header.startsWith('_') ? (
                              <code className="c-harmonizer-view__code">{header}</code>
                            ) : (
                              header
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {headers.map((header) => (
                            <td
                              key={header}
                              className={
                                header.startsWith('_') ? 'text-color-secondary' : undefined
                              }
                            >
                              {row[header] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > maxVisibleRows ? (
                  <p className="text-color-secondary">
                    Mostrando las primeras {maxVisibleRows} de {rows.length} filas. Descarga el
                    archivo para verlas todas.
                  </p>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
