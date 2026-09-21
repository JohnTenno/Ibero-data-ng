import { PageHeader } from '../../shared/page-header/PageHeader';
import { PortalCatalogSection } from '../portal-catalog-section/PortalCatalogSection';
import { usePortalTopics } from './usePortalTopics';

export default function PortalTopics() {
  const { catalog, loading, error } = usePortalTopics();

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
        <PortalCatalogSection catalog={catalog} searchLabel="Buscar tema" countLabel="Temas" />
      )}
    </main>
  );
}
