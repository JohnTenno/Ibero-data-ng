import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from '../icon/Icon';
import { SearchField } from '../search-field/SearchField';
import { useAppShell } from './useAppShell';
import './app-shell.scss';

export function AppShell() {
  const { currentUser, logout, navItems, filteredItems, setFilteredItems } = useAppShell();

  return (
    <div className="c-app-shell">
      <a className="skip-content" href="#contenido-principal">
        Ir a contenido principal
      </a>

      <header className="header-bar">
        <div className="header-bar-brand">
          <span className="header-bar-logo">Ibero Data MX</span>
        </div>
        <div className="header-bar-user">
          {currentUser && (
            <>
              <span className="avatar">{currentUser.fullName.charAt(0)}</span>
              <span className="header-bar-name">{currentUser.fullName}</span>
            </>
          )}
          <button type="button" className="button-icon" onClick={logout} aria-label="Cerrar sesión">
            <Icon name="log-out" size={18} />
          </button>
        </div>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-menu-search">
            <SearchField
              catalog={navItems}
              searchProperty="label"
              placeholder='Busca "conjuntos", "análisis"…'
              fieldId="sidebar-search"
              onFilter={setFilteredItems}
            />
          </div>

          <nav className="nav-sidebar" aria-label="Menú secundario">
            <ul>
              {filteredItems.length === 0 && (
                <li className="sidebar-menu-empty">
                  <span>Sin resultados</span>
                </li>
              )}
              {filteredItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="content" id="contenido-principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
