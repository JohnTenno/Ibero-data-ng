import type { MouseEvent } from 'react';
import { Button } from 'sectei-library';
import { PageHeader } from '../shared/page-header/PageHeader';
import { useOrganizationDetail } from './useOrganizationDetail';
import './organization-detail.css';

function visibilityLabel(visibility: string): string {
  if (visibility === 'PUBLIC') return 'Público';
  if (visibility === 'PRIVATE') return 'Privado';
  return visibility;
}

export function OrganizationDetail() {
  const {
    organizationId,
    organization,
    datasets,
    loading,
    error,
    removingId,
    removeDataset,
    crumbs,
  } = useOrganizationDetail();

  return (
    <div className="c-organization-detail">
      <PageHeader
        title="Datasets"
        intro={
          organization
            ? `Datasets publicados por ${organization.name}.`
            : 'Datasets de esta organización.'
        }
        crumbs={crumbs}
        action={
          <Button
            type="button"
            variant="primary"
            icon="pictogram-add"
            href={`/organizations/${organizationId}/datasets/new`}
          >
            Nuevo dataset
          </Button>
        }
      />

      <section className="container width-fixed c-organization-detail__body" aria-label="Listado">
        {error ? <p className="c-organization-detail__error">{error}</p> : null}

        {loading ? (
          <p className="c-organization-detail__empty">Cargando…</p>
        ) : datasets.length === 0 ? (
          <p className="c-organization-detail__empty">
            Todavía no hay datasets en esta organización.
          </p>
        ) : (
          <ul className="c-organization-detail__grid">
            {datasets.map((dataset) => (
              <li key={dataset.id}>
                <article className="tarjeta c-organization-detail__card">
                  <div className="c-organization-detail__tags">
                    <span className="c-organization-detail__chip">
                      {visibilityLabel(dataset.visibility)}
                    </span>
                    {dataset.survey ? (
                      <span className="c-organization-detail__chip">{dataset.survey}</span>
                    ) : null}
                    {dataset.year ? (
                      <span className="c-organization-detail__chip">{dataset.year}</span>
                    ) : null}
                    {dataset.revision > 1 ? (
                      <span className="c-organization-detail__chip">v{dataset.revision}</span>
                    ) : null}
                  </div>

                  <p className="card-title c-organization-detail__title">{dataset.title}</p>

                  {dataset.supersededById ? (
                    <p className="c-organization-detail__meta">
                      Hay una revisión más reciente
                    </p>
                  ) : null}

                  <div className="c-organization-detail__actions">
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      icon="pictogram-eye-view"
                      href={`/organizations/${organizationId}/datasets/${dataset.id}`}
                    >
                      Ver
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      icon="pictogram-delete"
                      aria-label={`Eliminar dataset ${dataset.title}`}
                      disabled={removingId === dataset.id}
                      onClick={(event) => void removeDataset(dataset, event as MouseEvent)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
