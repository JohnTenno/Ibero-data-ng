import { Icon } from '../icon/Icon';
import { useAccessibilityMenu } from './useAccessibilityMenu';
import './accessibility-menu.scss';

export function AccessibilityMenu() {
  const { options, open, active, canReset, togglePanel, toggleOption, reset } =
    useAccessibilityMenu();

  return (
    <div className={`menu-a11y${open ? ' menu-a11y--open' : ''}`}>
      <button
        type="button"
        className="menu-a11y__button"
        aria-expanded={open}
        aria-controls="menu-a11y-panel"
        aria-labelledby="menu-a11y-title"
        onClick={togglePanel}
      >
        <Icon className="menu-a11y__icon-closed" name="pictograma-accesibilidad" size={24} />
        <Icon className="menu-a11y__icon-open" name="pictograma-cerrar" size={22} />
      </button>

      <div className="menu-a11y__panel" id="menu-a11y-panel" aria-hidden={!open}>
        <p className="menu-a11y__title" id="menu-a11y-title">
          Herramientas de accesibilidad
        </p>

        {options.map((option) => (
          <div className="menu-a11y__row" key={option.id}>
            <input
              className="menu-a11y__check"
              type="checkbox"
              id={option.id}
              checked={active.has(option.id)}
              tabIndex={open ? 0 : -1}
              onChange={() => toggleOption(option.id)}
            />
            <label className="menu-a11y__option" htmlFor={option.id}>
              <Icon name={option.icon} size={24} />
              <span>{option.title}</span>
            </label>
          </div>
        ))}

        <button
          type="button"
          className="button button-secondary button-small menu-a11y__reset"
          disabled={!canReset}
          tabIndex={open ? 0 : -1}
          onClick={reset}
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}
