import { PortalSearchHeader } from '../portal-search-header/PortalSearchHeader';
import { PortalDataResultsSection } from '../portal-data-results-section/PortalDataResultsSection';
import { usePortalData } from './usePortalData';

export default function PortalData() {
  const { sort, setSort, setQuery, loading, error, items, sortOptions, lastUpdated } = usePortalData();

  return (
    <main id="main-content">
      <PortalSearchHeader
        title="Buscar datos"
        searchLabel={'Busca por tema "educación", "gasto"...'}
        sortOptions={sortOptions}
        sort={sort}
        onSortChange={setSort}
        onSearch={(text) => setQuery(String(text ?? ''))}
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Datos' }]}
      />

      {error ? (
        <section className="container width-fixed" style={{ paddingBlock: '2rem' }}>
          <p role="alert" className="text-color-secondary">
            No se pudo consultar el catálogo: {error.message}
          </p>
        </section>
      ) : loading ? (
        <section className="container width-fixed" style={{ paddingBlock: '2rem' }}>
          <p aria-live="polite" className="text-color-secondary">
            Cargando el catálogo…
          </p>
        </section>
      ) : (
        <PortalDataResultsSection total={items.length} lastUpdated={lastUpdated} items={items} />
      )}
    </main>
  );
}
