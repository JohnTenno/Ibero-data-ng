import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { useOrganizationDetail } from './useOrganizationDetail';
import './organization-detail.scss';

export function OrganizationDetail() {
  const { organizationId, datasets, loading, error, removingId, removeDataset } =
    useOrganizationDetail();

  return (
    <div className="c-organization-detail">
      <div className="pagina">
        <Link to="/organizations" className="volver">
          &larr; Organizaciones
        </Link>

        <div className="encabezado">
          <h1>Datasets</h1>
          <Link to={`/organizations/${organizationId}/datasets/new`} className="boton">
            + Nuevo dataset
          </Link>
        </div>

        {error && <p className="ayuda-error">{error}</p>}

        {loading ? (
          <p>Cargando…</p>
        ) : datasets.length === 0 ? (
          <p>Todavía no hay datasets en esta organización.</p>
        ) : (
          <div className="tarjetas">
            {datasets.map((dataset) => (
              <Link
                key={dataset.id}
                className="tarjeta"
                to={`/organizations/${organizationId}/datasets/${dataset.id}`}
              >
                <button
                  type="button"
                  className="boton-pictograma boton-borrar-tarjeta"
                  aria-label="Borrar dataset"
                  disabled={removingId === dataset.id}
                  onClick={(e) => void removeDataset(dataset, e)}
                >
                  <Icon name="trash" size={14} />
                </button>
                <div className="tarjeta-etiquetas">
                  <span className="chip">{dataset.visibility}</span>
                  {dataset.survey && <span className="chip">{dataset.survey}</span>}
                  {dataset.year && <span className="chip">{dataset.year}</span>}
                  {dataset.revision > 1 && <span className="chip">v{dataset.revision}</span>}
                </div>
                <p className="titulo">{dataset.title}</p>
                {dataset.supersededById && <p className="meta">⚠ Hay una revisión más reciente</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
