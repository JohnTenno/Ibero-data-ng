import { useEffect, useId, useState, type HTMLAttributes } from 'react';
import { Button } from 'sectei-library';
import './filters.css';

export interface FilterOption {
  id: string;
  label: string;
  field?: string;
  value?: string;
}

export interface FilterSubsection {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterSection {
  id: string;
  label: string;
  subsections: FilterSubsection[];
}

export interface FiltersProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'title'> {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  sections?: FilterSection[];
  values?: string[];
  initialValues?: string[];
  onChange?: (ids: string[]) => void;
  onApply?: (ids: string[]) => void;
  onClear?: () => void;
}

/**
 * Side filter panel: sections → subsections → checkboxes.
 * (from prototipo-intermediario)
 */
export function Filters({
  open = false,
  onClose,
  title = 'Filtros',
  sections = [],
  values: valuesProp,
  initialValues = [],
  onChange,
  onApply,
  onClear,
  className = '',
  ...rest
}: FiltersProps) {
  const autoId = useId().replace(/:/g, '');
  const idBase = `filters-${autoId}`;
  const titleId = `${idBase}-title`;
  const panelId = `${idBase}-panel`;
  const controlled = valuesProp !== undefined;
  const [internalValues, setInternalValues] = useState(initialValues);
  const selected = controlled ? valuesProp : internalValues;

  useEffect(() => {
    if (!open) return undefined;

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', onKey);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  function setSelected(next: string[]) {
    if (!controlled) setInternalValues(next);
    onChange?.(next);
  }

  function toggleOption(optionId: string) {
    const already = selected.includes(optionId);
    const next = already
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId];
    setSelected(next);
  }

  function close() {
    onClose?.();
  }

  function clear() {
    setSelected([]);
    onClear?.();
  }

  function apply() {
    onApply?.(selected);
    close();
  }

  const classes = ['filters', 'menu-side-bg', open ? 'filters--open' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <button
        type="button"
        className={['filters__backdrop', open ? 'filters__backdrop--visible' : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Cerrar filtros"
        tabIndex={open ? 0 : -1}
        onClick={close}
      />

      <aside
        id={panelId}
        className={classes}
        aria-labelledby={titleId}
        aria-hidden={!open}
        {...rest}
      >
        <div className="filters__container">
          <div className="filters__header">
            <h2 id={titleId} className="filters__title">
              {title}
            </h2>
            <button
              type="button"
              className="button-pictogram button-bare-secondary"
              aria-label="Cerrar filtros"
              tabIndex={open ? undefined : -1}
              onClick={close}
            >
              <span className="pictogram-close" aria-hidden="true" />
            </button>
          </div>

          <div className="filters__body">
            {sections.length === 0 ? (
              <p className="text-color-secondary m-0">No hay filtros disponibles.</p>
            ) : (
              sections.map((section) => (
                <fieldset key={section.id} className="filters__section">
                  <legend className="filters__section-title">{section.label}</legend>

                  {(section.subsections ?? []).map((sub) => (
                    <div key={sub.id} className="filters__subsection">
                      <p className="filters__subsection-title">{sub.label}</p>
                      <ul className="checkboxes-nested filters__options">
                        {(sub.options ?? []).map((option) => {
                          const inputId = `${idBase}-${option.id}`;
                          return (
                            <li key={option.id}>
                              <input
                                type="checkbox"
                                id={inputId}
                                name={`${section.id}-${sub.id}`}
                                value={option.id}
                                checked={selected.includes(option.id)}
                                tabIndex={open ? undefined : -1}
                                onChange={() => toggleOption(option.id)}
                              />
                              <label htmlFor={inputId}>{option.label}</label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </fieldset>
              ))
            )}
          </div>

          <div className="filters__footer">
            <Button
              type="button"
              variant="bare-secondary"
              tabIndex={open ? undefined : -1}
              onClick={clear}
            >
              Limpiar
            </Button>
            <Button
              type="button"
              variant="primary"
              tabIndex={open ? undefined : -1}
              onClick={apply}
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
