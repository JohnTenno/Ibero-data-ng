import { useId } from 'react';
import { Button, SearchField } from 'sectei-library';
import { Icon } from '../shared/icon/Icon';
import { PageHeader } from '../shared/page-header/PageHeader';
import { Filters } from '../shared/filters/Filters';
import { OrganizationCard } from '../shared/organization-card/OrganizationCard';
import { ORGANIZATION_FILTERS } from '../../data/organization-filters';
import { CRUMBS, SORT_OPTIONS, useOrganizationsList, type SortOrder } from './useOrganizationsList';
import '../shared/cards-section/cards-section.css';
import './organizations-list.css';

export function OrganizationsList() {
  const sortId = useId();
  const {
    organizations,
    loading,
    sortOrder,
    page,
    totalPages,
    pageItems,
    pageNumbers,
    goTo,
    onFilterChange,
    onSortChange,
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    setActiveFilters,
  } = useOrganizationsList();

  return (
    <div className="c-organizations-list cards-section">
      <PageHeader
        title="Organizaciones"
        intro="Organizaciones que publican y administran datasets en la plataforma."
        crumbs={CRUMBS}
        action={
          <Button type="button" variant="primary" icon="pictogram-add">
            Agregar organización
          </Button>
        }
      />

      <section
        className="container width-fixed cards-section__body"
        aria-labelledby="organizations-subtitle"
      >
        <h2 id="organizations-subtitle" className="cards-section__subtitle m-t-0">
          Organizaciones registradas
        </h2>

        <div className="cards-section__tools">
          <div className="cards-section__search">
            <SearchField
              catalog={organizations}
              searchProperty="name"
              placeholder='Busca por nombre, por ejemplo "Ibero"…'
              id="search-organizations"
              onFilter={onFilterChange}
            />
          </div>

          <div className="cards-section__bar">
            <div className="cards-section__actions">
              <Button
                type="button"
                variant="secondary"
                icon="pictogram-filter"
                onClick={() => setFiltersOpen(true)}
              >
                Filtros
                {activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
              </Button>
            </div>

            <div className="cards-section__sort">
              <label htmlFor={sortId}>Ordenar por</label>
              <select
                id={sortId}
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
          <p className="text-color-secondary m-0">Cargando…</p>
        ) : pageItems.length === 0 ? (
          <p className="text-color-secondary m-0">No hay elementos para mostrar.</p>
        ) : (
          <>
            <ul className="cards-section__grid">
              {pageItems.map(({ id, createdAt: _createdAt, type: _type, scope: _scope, ...card }) => (
                <li key={id}>
                  <OrganizationCard {...card} />
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

      <Filters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={ORGANIZATION_FILTERS.title}
        sections={ORGANIZATION_FILTERS.sections}
        values={activeFilters}
        onChange={setActiveFilters}
        onApply={setActiveFilters}
        onClear={() => setActiveFilters([])}
      />
    </div>
  );
}
