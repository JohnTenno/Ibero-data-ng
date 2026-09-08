import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { PageHeader } from '../shared/page-header/PageHeader';
import { CampoBusqueda } from '../shared/campo-busqueda/CampoBusqueda';
import { MIGAS, useOrganizationsList, type Orden } from './useOrganizationsList';
import './organizations-list.scss';

export function OrganizationsList() {
  const {
    organizations,
    filtered,
    loading,
    error,
    creating,
    showCreateForm,
    setShowCreateForm,
    removingId,
    orden,
    setOrden,
    newName,
    setNewName,
    newSlug,
    setNewSlug,
    setFiltradosBusqueda,
    createOrganization,
    removeOrganization,
  } = useOrganizationsList();

  return (
    <div className="c-organizations-list">
      <div className="pagina">
        <PageHeader
          titulo="Organizaciones"
          intro="Organizaciones que publican y administran datasets en la plataforma."
          migas={MIGAS}
          conAccion
        >
          <button type="button" className="boton" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Icon name="plus" size={16} />
            Agregar organización
          </button>
        </PageHeader>

        <div className="pagina__cuerpo">
          {showCreateForm && (
            <form className="formulario-crear" onSubmit={createOrganization} noValidate>
              <input
                type="text"
                placeholder="Nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                name="name"
              />
              <input
                type="text"
                placeholder="slug-en-minusculas"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                name="slug"
              />
              <button type="submit" className="boton" disabled={creating}>
                {creating ? 'Creando…' : 'Crear'}
              </button>
            </form>
          )}

          {error && <p className="ayuda-error">{error}</p>}

          <div className="seccion-tarjetas__herramientas">
            <div className="seccion-tarjetas__busqueda">
              <CampoBusqueda
                catalogo={organizations}
                propiedadBusqueda="name"
                etiqueta='Busca por nombre, por ejemplo "Ibero"…'
                idCampo="busqueda-organizaciones"
                onFiltrar={setFiltradosBusqueda}
              />
            </div>

            <div className="seccion-tarjetas__barra">
              <div className="seccion-tarjetas__orden">
                <label htmlFor="orden-organizaciones">Ordenar por</label>
                <select
                  id="orden-organizaciones"
                  name="orden"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                >
                  <option value="reciente">Más recientes</option>
                  <option value="nombre">Nombre (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Cargando…</p>
          ) : filtered.length === 0 ? (
            <p>No hay organizaciones que coincidan con tu búsqueda.</p>
          ) : (
            <div className="tarjetas">
              {filtered.map((org) => (
                <Link key={org.id} className="tarjeta-org" to={`/organizations/${org.id}`}>
                  <button
                    type="button"
                    className="boton-pictograma boton-borrar-tarjeta"
                    aria-label="Borrar organización"
                    disabled={removingId === org.id}
                    onClick={(e) => void removeOrganization(org, e)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                  <div className="tarjeta-org-portada">{org.name.charAt(0)}</div>
                  <div className="tarjeta-org-cuerpo">
                    <p className="titulo">{org.name}</p>
                    {org.description && <p className="descripcion">{org.description}</p>}
                    <p className="stats">
                      <span>
                        <Icon name="layers" size={14} />
                        {org._count?.datasets ?? 0} conjuntos
                      </span>
                      <span>
                        <Icon name="users" size={14} />
                        {org._count?.members ?? 0} miembros
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
