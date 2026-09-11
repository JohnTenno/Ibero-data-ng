import { Link } from 'react-router-dom';
import { Icon } from '../shared/icon/Icon';
import { PageHeader } from '../shared/page-header/PageHeader';
import { SearchField } from '../shared/search-field/SearchField';
import { CRUMBS, useOrganizationsList, type SortOrder } from './useOrganizationsList';
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
    sortOrder,
    setSortOrder,
    newName,
    setNewName,
    newSlug,
    setNewSlug,
    setSearchFiltered,
    createOrganization,
    removeOrganization,
  } = useOrganizationsList();

  return (
    <div className="c-organizations-list">
      <div className="page">
        <PageHeader
          title="Organizaciones"
          intro="Organizaciones que publican y administran datasets en la plataforma."
          crumbs={CRUMBS}
          withAction
        >
          <button type="button" className="button" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Icon name="plus" size={16} />
            Agregar organización
          </button>
        </PageHeader>

        <div className="page__body">
          {showCreateForm && (
            <form className="create-form" onSubmit={createOrganization} noValidate>
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
              <button type="submit" className="button" disabled={creating}>
                {creating ? 'Creando…' : 'Crear'}
              </button>
            </form>
          )}

          {error && <p className="error-hint">{error}</p>}

          <div className="cards-section__tools">
            <div className="cards-section__search">
              <SearchField
                catalog={organizations}
                searchProperty="name"
                placeholder='Busca por nombre, por ejemplo "Ibero"…'
                fieldId="search-organizations"
                onFilter={setSearchFiltered}
              />
            </div>

            <div className="cards-section__bar">
              <div className="cards-section__sort">
                <label htmlFor="sort-organizations">Ordenar por</label>
                <select
                  id="sort-organizations"
                  name="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
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
            <div className="cards">
              {filtered.map((org) => (
                <Link key={org.id} className="org-card" to={`/organizations/${org.id}`}>
                  <button
                    type="button"
                    className="button-pictogram button-delete-card"
                    aria-label="Borrar organización"
                    disabled={removingId === org.id}
                    onClick={(e) => void removeOrganization(org, e)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                  <div className="org-card-cover">{org.name.charAt(0)}</div>
                  <div className="org-card-body">
                    <p className="title">{org.name}</p>
                    {org.description && <p className="description">{org.description}</p>}
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
