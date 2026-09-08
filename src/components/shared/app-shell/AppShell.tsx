import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from '../icon/Icon';
import { CampoBusqueda } from '../campo-busqueda/CampoBusqueda';
import { useAppShell } from './useAppShell';
import './app-shell.scss';

export function AppShell() {
  const { currentUser, logout, navItems, filtrados, setFiltrados } = useAppShell();

  return (
    <div className="c-app-shell">
      <a className="salto-contenido" href="#contenido-principal">
        Ir a contenido principal
      </a>

      <header className="cabecera">
        <div className="cabecera-marca">
          <span className="cabecera-logo">Ibero Data MX</span>
        </div>
        <div className="cabecera-usuario">
          {currentUser && (
            <>
              <span className="avatar">{currentUser.fullName.charAt(0)}</span>
              <span className="cabecera-nombre">{currentUser.fullName}</span>
            </>
          )}
          <button type="button" className="boton-icono" onClick={logout} aria-label="Cerrar sesión">
            <Icon name="log-out" size={18} />
          </button>
        </div>
      </header>

      <div className="shell">
        <aside className="barra-lateral">
          <div className="menu-lateral-busqueda">
            <CampoBusqueda
              catalogo={navItems}
              propiedadBusqueda="label"
              etiqueta='Busca "conjuntos", "análisis"…'
              idCampo="busqueda-lateral"
              onFiltrar={setFiltrados}
            />
          </div>

          <nav className="nav-lateral" aria-label="Menú secundario">
            <ul>
              {filtrados.length === 0 && (
                <li className="menu-lateral-vacio">
                  <span>Sin resultados</span>
                </li>
              )}
              {filtrados.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'nav-item activo' : 'nav-item')}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="contenido" id="contenido-principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
