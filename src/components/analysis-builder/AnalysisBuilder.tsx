import type { Analysis, Step } from '../../core/models/analysis.model';
import type { Resource, ResourceColumn } from '../../core/models/resource.model';
import type { DatasetVisibility } from '../../core/models/dataset.model';
import {
  AGG_FUNCS,
  JOIN_TYPES,
  OPERATORS,
  OP_LABELS,
  useAnalysisBuilder,
} from './useAnalysisBuilder';
import './analysis-builder.scss';

interface Props {
  organizationId: string;
  datasetId: string;
  resourceId: string;
  resourceColumns?: ResourceColumn[] | null;
  datasetResources?: Resource[];
  editingAnalysis?: Analysis | null;
  onRequestEditResource?: (analysis: Analysis) => void;
  onEditingConsumed?: () => void;
}

export function AnalysisBuilder({
  organizationId,
  datasetId,
  resourceId,
  resourceColumns = null,
  datasetResources = [],
  editingAnalysis = null,
  onRequestEditResource,
  onEditingConsumed,
}: Props) {
  const b = useAnalysisBuilder({
    organizationId,
    datasetId,
    resourceId,
    resourceColumns,
    datasetResources,
    editingAnalysis,
    onEditingConsumed,
  });

  const { form: f } = b;

  const renderFields = (step: Step, index: number) => {
    switch (step.op) {
      case 'join':
        return (
          <div className="step-fields">
            <select
              value={(step.params['resourceId'] as string) ?? ''}
              onChange={(e) => b.onJoinResourceChange(index, step, e.target.value)}
            >
              <option value="">recurso a cruzar…</option>
              {b.otherResources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.filename}
                </option>
              ))}
            </select>
            <select
              value={(step.params['type'] as string) ?? 'inner'}
              onChange={(e) => b.setParam(index, 'type', e.target.value)}
            >
              {JOIN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'inner' ? 'inner (solo con match)' : 'left (conserva todo este lado)'}
                </option>
              ))}
            </select>
            <select
              value={(step.params['onLeft'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'onLeft', e.target.value)}
            >
              <option value="">columna de este recurso…</option>
              {(resourceColumns ?? []).map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
            <span>=</span>
            <select
              value={(step.params['onRight'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'onRight', e.target.value)}
            >
              <option value="">columna del otro recurso…</option>
              {b.columnsForResource(step.params['resourceId'] as string).map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="alias (ej: expansion)"
              value={(step.params['alias'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'alias', e.target.value)}
            />
          </div>
        );

      case 'group_by':
        return (
          <div className="chips-select">
            {b.availableColumns.map((col) => (
              <button
                key={col}
                type="button"
                className={`chip-toggle${b.isGroupByColumnSelected(step, col) ? ' active' : ''}`}
                onClick={() => b.toggleGroupByColumn(index, step, col)}
              >
                {col}
              </button>
            ))}
          </div>
        );

      case 'aggregate':
        return (
          <div className="step-fields">
            <select
              value={(step.params['func'] as string) ?? 'SUM'}
              onChange={(e) => b.setParam(index, 'func', e.target.value)}
            >
              {AGG_FUNCS.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
            <select
              value={(step.params['column'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'column', e.target.value)}
            >
              <option value="">columna…</option>
              <option value="*">* (todas las filas)</option>
              {b.availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="nombre del resultado"
              value={(step.params['as'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'as', e.target.value)}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={Boolean(step.params['distinct'])}
                onChange={(e) => b.setParam(index, 'distinct', e.target.checked)}
              />
              distinct
            </label>
          </div>
        );

      case 'compute':
        return (
          <div className="step-fields">
            <select
              value={(step.params['left'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'left', e.target.value)}
            >
              <option value="">columna A…</option>
              {b.availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <span>×</span>
            <select
              value={(step.params['right'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'right', e.target.value)}
            >
              <option value="">columna B (o número)…</option>
              {b.availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="o escribe un número en 'columna B'"
              value={(step.params['right'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'right', e.target.value)}
            />
            <input
              type="text"
              placeholder="nombre del resultado"
              value={(step.params['as'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'as', e.target.value)}
            />
          </div>
        );

      case 'percentage':
        return (
          <div className="step-fields">
            <span>% de</span>
            <select
              value={(step.params['of'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'of', e.target.value)}
            >
              <option value="">agregado…</option>
              {b.aggregateAliases.map((alias) => (
                <option key={alias} value={alias}>
                  {alias}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="nombre del resultado"
              value={(step.params['as'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'as', e.target.value)}
            />
          </div>
        );

      case 'filter':
        return (
          <div className="step-fields">
            <select
              value={(step.params['column'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'column', e.target.value)}
            >
              <option value="">columna…</option>
              {b.availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select
              value={(step.params['operator'] as string) ?? '='}
              onChange={(e) => b.setParam(index, 'operator', e.target.value)}
            >
              {OPERATORS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="valor"
              value={(step.params['value'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'value', e.target.value)}
            />
          </div>
        );

      case 'sort':
        return (
          <div className="step-fields">
            <select
              value={(step.params['column'] as string) ?? ''}
              onChange={(e) => b.setParam(index, 'column', e.target.value)}
            >
              <option value="">columna…</option>
              {b.availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
              {b.aggregateAliases.map((alias) => (
                <option key={`alias-${alias}`} value={alias}>
                  {alias}
                </option>
              ))}
            </select>
            <select
              value={(step.params['dir'] as string) ?? 'desc'}
              onChange={(e) => b.setParam(index, 'dir', e.target.value)}
            >
              <option value="asc">ascendente</option>
              <option value="desc">descendente</option>
            </select>
          </div>
        );

      case 'limit':
        return (
          <div className="step-fields">
            <input
              type="number"
              min="1"
              value={(step.params['n'] as number) ?? 100}
              onChange={(e) => b.setParam(index, 'n', Number(e.target.value))}
            />
            <span>filas</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="c-analysis-builder">
      <div className="builder">
        {b.steps.length > 0 && (
          <ol className="steps">
            {b.steps.map((step, index) => (
              // eslint-disable-next-line react/no-array-index-key -- steps are identified by position, as in the original
              <li className="step" key={index}>
                <div className="step-header">
                  <span className="step-num">{index + 1}</span>
                  <strong>{OP_LABELS[step.op]}</strong>
                  <button
                    type="button"
                    className="remove"
                    onClick={() => b.removeStep(index)}
                    aria-label="Quitar paso"
                  >
                    ✕
                  </button>
                </div>
                {renderFields(step, index)}
              </li>
            ))}
          </ol>
        )}

        <div className="add-step">
          <select
            value={b.newOp}
            onChange={(e) => b.setNewOp(e.target.value as typeof b.newOp)}
            name="newOp"
          >
            {b.opNames.map((op) => (
              <option key={op} value={op}>
                {OP_LABELS[op]}
              </option>
            ))}
          </select>
          <button type="button" className="button button-secondary" onClick={b.addStep}>
            + Agregar paso
          </button>
        </div>
        {b.opCatalog && b.newOp && <p className="op-hint">{b.opCatalog[b.newOp].description}</p>}

        {b.editingAnalysisId && (
          <p className="edit-note">
            ✎ Editando análisis existente — al confirmar se sobrescribe (no se crea uno nuevo).
          </p>
        )}

        {b.steps.length > 0 && (
          <>
            <div className="preview-row">
              <label className="rounding">
                Redondear a
                <input
                  type="number"
                  min="0"
                  max="15"
                  placeholder="sin redondeo"
                  value={b.roundDecimals}
                  onChange={(e) => b.setRoundDecimals(e.target.value)}
                />
                decimales
              </label>
              <button
                type="button"
                className="button"
                onClick={b.runPreview}
                disabled={b.previewing}
              >
                {b.previewing ? 'Probando…' : 'Probar (preview)'}
              </button>
            </div>

            {b.previewError && <p className="error-hint">{b.previewError}</p>}

            {b.previewResult && (
              <>
                <div className="table-container">
                  <p className="note">{b.previewResult.rowCount} filas (muestra)</p>
                  <table>
                    <thead>
                      <tr>
                        {b.previewResult.columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.previewResult.rows.map((row, i) => (
                        // eslint-disable-next-line react/no-array-index-key -- rows have no stable id
                        <tr key={i}>
                          {b.previewResult!.columns.map((col) => (
                            <td key={col}>{String(row[col] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="save">
                  {!b.showSaveForm ? (
                    <button type="button" className="button" onClick={() => b.setShowSaveForm(true)}>
                      {b.editingAnalysisId ? 'Actualizar este análisis' : 'Guardar este análisis'}
                    </button>
                  ) : (
                    <>
                      <form onSubmit={b.save} noValidate className="save-form">
                        <input
                          type="text"
                          placeholder="Título"
                          value={f.title}
                          onChange={(e) => f.setTitle(e.target.value)}
                          name="title"
                        />
                        <input
                          type="text"
                          placeholder="slug-en-minusculas"
                          value={f.slug}
                          onChange={(e) => f.setSlug(e.target.value)}
                          name="slug"
                        />
                        <input
                          type="text"
                          placeholder="Carpeta (ej: enigh)"
                          value={f.folder}
                          onChange={(e) => f.setFolder(e.target.value)}
                          name="folder"
                        />
                        <textarea
                          rows={2}
                          placeholder="Descripción (opcional)"
                          value={f.description}
                          onChange={(e) => f.setDescription(e.target.value)}
                          name="description"
                        />
                        <select
                          value={f.visibility}
                          onChange={(e) => f.setVisibility(e.target.value as DatasetVisibility)}
                          name="visibility"
                        >
                          <option value="PRIVATE">Privado</option>
                          <option value="PUBLIC">Público</option>
                        </select>
                        <button type="submit" className="button" disabled={b.saving}>
                          {b.saving
                            ? b.editingAnalysisId
                              ? 'Actualizando…'
                              : 'Guardando…'
                            : b.editingAnalysisId
                              ? 'Actualizar'
                              : 'Confirmar'}
                        </button>
                        {b.editingAnalysisId && (
                          <button
                            type="button"
                            className="button button-secondary"
                            onClick={b.cancelEdit}
                          >
                            Cancelar edición
                          </button>
                        )}
                      </form>
                      {b.saveError && <p className="error-hint">{b.saveError}</p>}
                    </>
                  )}
                </div>
              </>
            )}

            {b.savedAnalysis && (
              <p className="confirmation">
                ✓ Análisis "{b.savedAnalysis.title}" guardado en la carpeta "
                {b.savedAnalysis.folder}".
              </p>
            )}
          </>
        )}

        <div className="saved-analyses">
          <h3>Análisis guardados</h3>
          {b.vizCanvasError && <p className="error-hint">{b.vizCanvasError}</p>}
          {b.loadingAnalyses ? (
            <p>Cargando…</p>
          ) : b.analyses.length === 0 ? (
            <p className="note">Todavía no hay análisis guardados para este dataset.</p>
          ) : (
            <ul>
              {b.analyses.map((analysis) => (
                <li className="analysis-row-container" key={analysis.id}>
                  <div className="analysis-row-header">
                    <button
                      type="button"
                      className="analysis-row"
                      onClick={() => void b.openAnalysis(analysis)}
                    >
                      <span className="chip">{analysis.folder}</span>
                      <span className="title">{analysis.title}</span>
                      <span className={`status ${analysis.status.toLowerCase()}`}>
                        {analysis.status}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestEditResource?.(analysis);
                      }}
                    >
                      Editar
                    </button>
                    {analysis.status === 'DONE' && (
                      <button
                        type="button"
                        className="button button-secondary button-small"
                        onClick={(e) => void b.openInVizCanvas(analysis, e)}
                        disabled={b.openingVizCanvasId === analysis.id}
                      >
                        {b.openingVizCanvasId === analysis.id ? 'Abriendo…' : 'Abrir en VizCanvas'}
                      </button>
                    )}
                    <button
                      type="button"
                      className="button button-secondary button-small button-delete"
                      onClick={(e) => void b.removeAnalysis(analysis, e)}
                      disabled={b.removingId === analysis.id}
                    >
                      {b.removingId === analysis.id ? 'Borrando…' : 'Borrar'}
                    </button>
                  </div>

                  {b.openAnalysisId === analysis.id &&
                    (analysis.status === 'FAILED' ? (
                      <p className="error-hint">{analysis.errorMessage}</p>
                    ) : b.openAnalysisData ? (
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              {b.openAnalysisData.columns.map((col) => (
                                <th key={col}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.openAnalysisData.rows.map((row, i) => (
                              // eslint-disable-next-line react/no-array-index-key -- rows have no stable id
                              <tr key={i}>
                                {b.openAnalysisData!.columns.map((col) => (
                                  <td key={col}>{String(row[col] ?? '')}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="note">Cargando resultado…</p>
                    ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
