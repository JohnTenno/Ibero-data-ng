import { Icon } from '../../shared/icon/Icon';
import { PageHeader } from '../../shared/page-header/PageHeader';
import { PortalCatalogSection } from '../portal-catalog-section/PortalCatalogSection';
import { usePortalTopics } from './usePortalTopics';

export default function PortalTopics() {
  const { catalog, total, loading, error, sort, setSort, setQuery, page, totalPages, goTo } = usePortalTopics();

  return (
    <main id="main-content">
      <PageHeader
        title="Temas"
        intro="Los temas son las categorías en las que se han agrupado los datos para facilitar su consulta. Cada tema tiene una o más fuentes de datos asociadas. Busca por tema o por fuente de datos:"
        crumbs={[{ label: 'Inicio', href: '/' }, { label: 'Temas' }]}
      />

      {error ? (
        <section className="container width-fixed" style={{ paddingBlock: '2rem' }}>
          <p role="alert" className="text-color-secondary">
            No se pudieron cargar los temas: {error.message}
          </p>
        </section>
      ) : loading ? (
        <section className="container width-fixed" style={{ paddingBlock: '2rem' }}>
          <p aria-live="polite" className="text-color-secondary">
            Cargando temas…
          </p>
        </section>
      ) : (
        <>
          <PortalCatalogSection
            items={catalog}
            total={total}
            sort={sort}
            onSortChange={setSort}
            onSearch={setQuery}
            searchLabel="Buscar tema"
            countLabel="Temas"
          />

          {totalPages > 1 ? (
            <nav className="paginator container width-fixed" aria-label="Paginación" style={{ paddingBlock: '1rem 2rem' }}>
              <button
                type="button"
                className="paginator__control"
                aria-label="Página anterior"
                disabled={page <= 1}
                onClick={() => goTo(page - 1)}
              >
                <Icon name="chevron-left" size={16} />
              </button>

              <span className="paginator__page paginator__page--current" aria-current="page">
                {page}
              </span>
              <span className="text-color-secondary"> de {totalPages}</span>

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
          ) : null}
        </>
      )}
    </main>
  );
}
