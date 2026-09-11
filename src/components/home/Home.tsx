import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { useHome } from './useHome';
import './home.scss';

export function Home() {
  const { loading, recentDatasets, recentOrganizations, totalDatasets, totalOrganizations } =
    useHome();

  return (
    <div className="c-home">
      <div className="home">
        <p className="crumb"></p>
        <h1>Inicio</h1>
        <p className="subtitle">
          Banco de bases de datos de Social Data Ibero. Datasets abiertos y privados, con acceso
          programático vía DuckDB.
        </p>

        <section className="section section-how" aria-labelledby="inicio-como-funciona">
          <div className="content-band">
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

        <section className="section section-shortcuts" aria-labelledby="inicio-accesos">
          <h2 id="inicio-accesos" className="section-subtitle">
            Accesos rápidos
          </h2>
          <div className="access-cards">
            <Link to="/datasets" className="access-card">
              <Icon name="layers" size={24} />
              <p className="title">Conjuntos de datos</p>
              <p className="description">Explora, filtra y agrega datasets del catálogo.</p>
              <p className="datum">{totalDatasets} conjuntos</p>
            </Link>
            <Link to="/organizations" className="access-card">
              <Icon name="users" size={24} />
              <p className="title">Organizaciones</p>
              <p className="description">Consulta organizaciones, conjuntos y miembros.</p>
              <p className="datum">{totalOrganizations} organizaciones</p>
            </Link>
            <Link to="/profile" className="access-card">
              <Icon name="user" size={24} />
              <p className="title">Configuración de perfil</p>
              <p className="description">Actualiza tus datos, imagen y contraseña.</p>
              <p className="datum">Datos de tu cuenta</p>
            </Link>
          </div>
        </section>

        {!loading && (
          <section className="section recent" aria-label="Contenido reciente">
            <div className="column">
              <div className="column-header">
                <h2>Conjuntos de datos recientes</h2>
                <Link to="/datasets">Ver todos</Link>
              </div>
              {recentDatasets.length === 0 && <p className="empty">Todavía no hay datasets.</p>}
              {recentDatasets.map((dataset) => (
                <Link
                  key={dataset.id}
                  className="dataset-card"
                  to={`/organizations/${dataset.organizationId}/datasets/${dataset.id}`}
                >
                  <p className="title">{dataset.title}</p>
                  <span className="chip">{dataset.visibility}</span>
                  {dataset.organization && (
                    <p className="meta">
                      <strong>Organización:</strong> {dataset.organization.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <div className="divider"></div>

            <div className="column">
              <div className="column-header">
                <h2>Organizaciones recientes</h2>
                <Link to="/organizations">Ver todas</Link>
              </div>
              {recentOrganizations.length === 0 && (
                <p className="empty">Todavía no hay organizaciones.</p>
              )}
              {recentOrganizations.map((org) => (
                <Link key={org.id} className="org-card" to={`/organizations/${org.id}`}>
                  <div className="org-card-body">
                    <p className="title">{org.name}</p>
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
