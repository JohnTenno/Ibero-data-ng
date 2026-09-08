import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { PageHeader } from '../shared/page-header/PageHeader';
import { CampoBusqueda } from '../shared/campo-busqueda/CampoBusqueda';
import { MIGAS, OPCIONES_ORDEN, useDatasetsList, type Orden } from './useDatasetsList';
import './datasets-list.scss';

export function DatasetsList() {
  const {
    datasets,
    loading,
    orden,
    pagina,
    totalPaginas,
    paginaItems,
    numerosPagina,
    irA,
    alFiltrar,
    alCambiarOrden,
  } = useDatasetsList();

  return (
    <div className="c-datasets-list">
      <div className="seccion-tarjetas">
        <PageHeader
          titulo="Conjuntos de datos"
          intro="Catálogo de datasets abiertos y privados. Explora, filtra y abre fichas para consultar recursos."
          migas={MIGAS}
        />

        <section className="seccion-tarjetas__cuerpo" aria-labelledby="datasets-subtitulo">
          <h2 id="datasets-subtitulo" className="seccion-tarjetas__subtitulo">
            Conjuntos de datos recientes
          </h2>

          <div className="seccion-tarjetas__herramientas">
            <div className="seccion-tarjetas__busqueda">
              <CampoBusqueda
                catalogo={datasets}
                propiedadBusqueda="title"
                etiqueta='Busca por título, por ejemplo "ENADIS"…'
                idCampo="busqueda-conjuntos"
                onFiltrar={alFiltrar}
              />
            </div>

            <div className="seccion-tarjetas__barra">
              <div className="seccion-tarjetas__orden">
                <label htmlFor="orden-conjuntos">Ordenar por</label>
                <select
                  id="orden-conjuntos"
                  name="orden"
                  value={orden}
                  onChange={(e) => alCambiarOrden(e.target.value as Orden)}
                >
                  {OPCIONES_ORDEN.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="seccion-tarjetas__vacio">Cargando…</p>
          ) : paginaItems.length === 0 ? (
            <p className="seccion-tarjetas__vacio">No hay elementos para mostrar.</p>
          ) : (
            <>
              <ul className="seccion-tarjetas__lista">
                {paginaItems.map((dataset) => (
                  <li key={dataset.id}>
                    <Link
                      className="fila"
                      to={`/organizations/${dataset.organizationId}/datasets/${dataset.id}`}
                    >
                      <div>
                        <p className="titulo">{dataset.title}</p>
                        {dataset.organization && (
                          <p className="meta">{dataset.organization.name}</p>
                        )}
                      </div>
                      <span className="chip">{dataset.visibility}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {totalPaginas > 1 && (
                <nav className="paginador" aria-label="Paginación">
                  <button
                    type="button"
                    className="paginador__control"
                    aria-label="Página anterior"
                    disabled={pagina <= 1}
                    onClick={() => irA(pagina - 1)}
                  >
                    <Icon name="chevron-left" size={16} />
                  </button>

                  <ul className="paginador__lista">
                    {numerosPagina.map((numero) => (
                      <li key={numero}>
                        <button
                          type="button"
                          className={`paginador__pagina${
                            numero === pagina ? ' paginador__pagina--actual' : ''
                          }`}
                          aria-label={`Página ${numero}`}
                          aria-current={numero === pagina ? 'page' : undefined}
                          onClick={() => irA(numero)}
                        >
                          {numero}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="paginador__control"
                    aria-label="Página siguiente"
                    disabled={pagina >= totalPaginas}
                    onClick={() => irA(pagina + 1)}
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
