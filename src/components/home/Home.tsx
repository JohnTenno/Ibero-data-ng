import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { useHome } from './useHome';
import './home.scss';

export function Home() {
  const { loading, recentDatasets, recentOrganizations, totalDatasets, totalOrganizations } =
    useHome();

  return (
    <div className="c-home">
      <div className="inicio">
        <p className="migaja"></p>
        <h1>Inicio</h1>
        <p className="subtitulo">
          Banco de bases de datos de Social Data Ibero. Datasets abiertos y privados, con acceso
          programático vía DuckDB.
        </p>

        <section className="seccion seccion-como" aria-labelledby="inicio-como-funciona">
          <div className="banda-contenido">
            <h2 id="inicio-como-funciona">Cómo funciona</h2>
            <ul>
              <li>
                <strong>Catálogo abierto:</strong> Explora datasets de organizaciones de sociedad
                civil mexicana.
              </li>
              <li>
                <strong>Privacidad:</strong> Cada organización gestiona quién accede a sus datasets.
              </li>
            </ul>
          </div>
        </section>

        <section className="seccion seccion-accesos" aria-labelledby="inicio-accesos">
          <h2 id="inicio-accesos" className="seccion-subtitulo">
            Accesos rápidos
          </h2>
          <div className="tarjetas-acceso">
            <Link to="/datasets" className="tarjeta-acceso">
              <Icon name="layers" size={24} />
              <p className="titulo">Conjuntos de datos</p>
              <p className="descripcion">Explora, filtra y agrega datasets del catálogo.</p>
              <p className="dato">{totalDatasets} conjuntos</p>
            </Link>
            <Link to="/organizations" className="tarjeta-acceso">
              <Icon name="users" size={24} />
              <p className="titulo">Organizaciones</p>
              <p className="descripcion">Consulta organizaciones, conjuntos y miembros.</p>
              <p className="dato">{totalOrganizations} organizaciones</p>
            </Link>
            <Link to="/profile" className="tarjeta-acceso">
              <Icon name="user" size={24} />
              <p className="titulo">Configuración de perfil</p>
              <p className="descripcion">Actualiza tus datos, imagen y contraseña.</p>
              <p className="dato">Datos de tu cuenta</p>
            </Link>
          </div>
        </section>

        {!loading && (
          <section className="seccion recientes" aria-label="Contenido reciente">
            <div className="columna">
              <div className="columna-header">
                <h2>Conjuntos de datos recientes</h2>
                <Link to="/datasets">Ver todos</Link>
              </div>
              {recentDatasets.length === 0 && <p className="vacio">Todavía no hay datasets.</p>}
              {recentDatasets.map((dataset) => (
                <Link
                  key={dataset.id}
                  className="tarjeta-dataset"
                  to={`/organizations/${dataset.organizationId}/datasets/${dataset.id}`}
                >
                  <p className="titulo">{dataset.title}</p>
                  <span className="chip">{dataset.visibility}</span>
                  {dataset.organization && (
                    <p className="meta">
                      <strong>Organización:</strong> {dataset.organization.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <div className="divisor"></div>

            <div className="columna">
              <div className="columna-header">
                <h2>Organizaciones recientes</h2>
                <Link to="/organizations">Ver todas</Link>
              </div>
              {recentOrganizations.length === 0 && (
                <p className="vacio">Todavía no hay organizaciones.</p>
              )}
              {recentOrganizations.map((org) => (
                <Link key={org.id} className="tarjeta-org" to={`/organizations/${org.id}`}>
                  <div className="tarjeta-org-cuerpo">
                    <p className="titulo">{org.name}</p>
                    {org.description && <p className="meta">{org.description}</p>}
                    <p className="stats">
                      <span>
                        <Icon name="layers" size={14} /> {org._count?.datasets ?? 0}
                      </span>
                      <span>
                        <Icon name="users" size={14} /> {org._count?.members ?? 0}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
