import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { useOrganizationDetail } from './useOrganizationDetail';
import './organization-detail.scss';

export function OrganizationDetail() {
  const { organizationId, datasets, loading, error, removingId, removeDataset } =
    useOrganizationDetail();

  return (
    <div className="c-organization-detail">
      <div className="page">
        <Link to="/organizations" className="back">
          &larr; Organizaciones
        </Link>

        <div className="header">
          <h1>Datasets</h1>
          <Link to={`/organizations/${organizationId}/datasets/new`} className="button">
            + Nuevo dataset
          </Link>
        </div>

        {error && <p className="error-hint">{error}</p>}

        {loading ? (
          <p>Cargando…</p>
        ) : datasets.length === 0 ? (
          <p>Todavía no hay datasets en esta organización.</p>
        ) : (
          <div className="cards">
            {datasets.map((dataset) => (
              <Link
                key={dataset.id}
                className="card"
                to={`/organizations/${organizationId}/datasets/${dataset.id}`}
              >
                <button
                  type="button"
                  className="button-pictogram button-delete-card"
                  aria-label="Borrar dataset"
                  disabled={removingId === dataset.id}
                  onClick={(e) => void removeDataset(dataset, e)}
                >
                  <Icon name="trash" size={14} />
                </button>
                <div className="card-tags">
                  <span className="chip">{dataset.visibility}</span>
                  {dataset.survey && <span className="chip">{dataset.survey}</span>}
                  {dataset.year && <span className="chip">{dataset.year}</span>}
                  {dataset.revision > 1 && <span className="chip">v{dataset.revision}</span>}
                </div>
                <p className="title">{dataset.title}</p>
                {dataset.supersededById && <p className="meta">⚠ Hay una revisión más reciente</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
