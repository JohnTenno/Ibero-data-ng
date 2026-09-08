import { Icon } from '../icon/Icon';
import { useMenuAccesibilidad } from './useMenuAccesibilidad';
import './menu-accesibilidad.scss';

export function MenuAccesibilidad() {
  const { opciones, abierto, activos, puedeRestablecer, alternarPanel, alternarOpcion, restablecer } =
    useMenuAccesibilidad();

  return (
    <div className={`menu-a11y${abierto ? ' menu-a11y--abierto' : ''}`}>
      <button
        type="button"
        className="menu-a11y__boton"
        aria-expanded={abierto}
        aria-controls="menu-a11y-panel"
        aria-labelledby="menu-a11y-titulo"
        onClick={alternarPanel}
      >
        <Icon className="menu-a11y__icono-cerrado" name="pictograma-accesibilidad" size={24} />
        <Icon className="menu-a11y__icono-abierto" name="pictograma-cerrar" size={22} />
      </button>

      <div className="menu-a11y__panel" id="menu-a11y-panel" aria-hidden={!abierto}>
        <p className="menu-a11y__titulo" id="menu-a11y-titulo">
          Herramientas de accesibilidad
        </p>

        {opciones.map((opcion) => (
          <div className="menu-a11y__fila" key={opcion.id}>
            <input
              className="menu-a11y__check"
              type="checkbox"
              id={opcion.id}
              checked={activos.has(opcion.id)}
              tabIndex={abierto ? 0 : -1}
              onChange={() => alternarOpcion(opcion.id)}
            />
            <label className="menu-a11y__opcion" htmlFor={opcion.id}>
              <Icon name={opcion.icono} size={24} />
              <span>{opcion.titulo}</span>
            </label>
          </div>
        ))}

        <button
          type="button"
          className="boton boton-secundario boton-chico menu-a11y__restablecer"
          disabled={!puedeRestablecer}
          tabIndex={abierto ? 0 : -1}
          onClick={restablecer}
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}
