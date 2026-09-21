import { PortalAlternativeCover } from '../portal-alternative-cover/PortalAlternativeCover';
import { PortalSearchSection } from '../portal-search-section/PortalSearchSection';
import { PortalButtonSection } from '../portal-button-section/PortalButtonSection';
import { PortalTopicsSection } from '../portal-topics-section/PortalTopicsSection';
import desktopCover from '../../../assets/desktop-cover.png';
import mobileCover from '../../../assets/mobile-cover.png';
import colorMotifs from '../../../assets/color-motifs.png';
import { usePortalHome } from './usePortalHome';
import './portal-home.css';

export default function PortalHome() {
  const { topicCards } = usePortalHome();

  return (
    <>
      <PortalAlternativeCover
        align="left"
        title={'Plataforma\nDigital\nInteractiva'}
        subtitle={'para la Visibilización de las\nComunidades Indígenas Residentes\nen la Ciudad de México'}
        titleMobile={'Plataforma Digital Interactiva'}
        subtitleMobile={'para la Visibilización de las\nComunidades Indígenas\nResidentes en la Ciudad de\nMéxico'}
        imageSrc={desktopCover}
        imageSrcMobile={mobileCover}
        imageAlt=""
      />

      <main id="main-content">
        <div className="home-search-section">
          <img
            className="home-search-section__ornament"
            src={colorMotifs}
            alt=""
            decoding="async"
            aria-hidden="true"
          />
          <PortalSearchSection
            className="home-search-section__section"
            title="Consulta los datos"
            intro="Busca por tema o fuente de datos."
            summary="Nuestra plataforma cuenta con XXX datos de más de XX fuentes de datos listos para consultar, analizar y visualizar."
            searchLabel='Buscar "empleo", "educación"…'
          />
        </div>

        <PortalTopicsSection
          title="Explora los temas"
          intro="¿No sabes por dónde empezar?"
          summary="Comienza explorando los 33 temas que tenemos disponibles. Los temas son las categorías en las que se han agrupado los datos para facilitar su consulta. Cada tema tiene una o más fuentes de datos.."
          buttonText="Ver todos los temas"
          cards={topicCards}
        />

        <div className="home-button-section">
          <img
            className="home-button-section__ornament"
            src={colorMotifs}
            alt=""
            decoding="async"
            aria-hidden="true"
          />
          <PortalButtonSection
            className="home-button-section__section"
            title="Conoce las fuentes de datos"
            intro="Los datos que puedes consultar en esta plataforma provienen de diferentes fuente de datos como censos, encuestas, entre otras."
            buttonText="Ver fuentes de datos"
          />
        </div>
      </main>
    </>
  );
}
