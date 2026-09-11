import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { PageHeader } from '../shared/page-header/PageHeader';
import { SearchField } from '../shared/search-field/SearchField';
import { CRUMBS, SORT_OPTIONS, useDatasetsList, type SortOrder } from './useDatasetsList';
import './datasets-list.scss';

export function DatasetsList() {
  const {
    datasets,
    loading,
    sortOrder,
    page,
    totalPages,
    pageItems,
    pageNumbers,
    goTo,
    onFilterChange,
    onSortChange,
  } = useDatasetsList();

  return (
    <div className="c-datasets-list">
      <div className="cards-section">
        <PageHeader
          title="Conjuntos de datos"
          intro="Catálogo de datasets abiertos y privados. Explora, filtra y abre fichas para consultar recursos."
          crumbs={CRUMBS}
        />

        <section className="cards-section__body" aria-labelledby="datasets-subtitle">
          <h2 id="datasets-subtitle" className="cards-section__subtitle">
            Conjuntos de datos recientes
          </h2>

          <div className="cards-section__tools">
            <div className="cards-section__search">
              <SearchField
                catalog={datasets}
                searchProperty="title"
                placeholder='Busca por título, por ejemplo "ENADIS"…'
                fieldId="search-datasets"
                onFilter={onFilterChange}
              />
            </div>

            <div className="cards-section__bar">
              <div className="cards-section__sort">
                <label htmlFor="sort-datasets">Ordenar por</label>
                <select
                  id="sort-datasets"
                  name="sort"
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value as SortOrder)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="cards-section__empty">Cargando…</p>
          ) : pageItems.length === 0 ? (
            <p className="cards-section__empty">No hay elementos para mostrar.</p>
          ) : (
            <>
              <ul className="cards-section__list">
                {pageItems.map((dataset) => (
                  <li key={dataset.id}>
                    <Link
                      className="row"
                      to={`/organizations/${dataset.organizationId}/datasets/${dataset.id}`}
                    >
                      <div>
                        <p className="title">{dataset.title}</p>
                        {dataset.organization && (
                          <p className="meta">{dataset.organization.name}</p>
                        )}
                      </div>
                      <span className="chip">{dataset.visibility}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <nav className="paginator" aria-label="Paginación">
                  <button
                    type="button"
                    className="paginator__control"
                    aria-label="Página anterior"
                    disabled={page <= 1}
                    onClick={() => goTo(page - 1)}
                  >
                    <Icon name="chevron-left" size={16} />
                  </button>

                  <ul className="paginator__list">
                    {pageNumbers.map((number) => (
                      <li key={number}>
                        <button
                          type="button"
                          className={`paginator__page${
                            number === page ? ' paginator__page--current' : ''
                          }`}
                          aria-label={`Página ${number}`}
                          aria-current={number === page ? 'page' : undefined}
                          onClick={() => goTo(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="paginator__control"
                    aria-label="Página siguiente"
                    disabled={page >= totalPages}
                    onClick={() => goTo(page + 1)}
                  >
                    <Icon name="chevron-right" size={16} />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
