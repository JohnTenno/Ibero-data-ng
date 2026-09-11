import { Icon } from '../icon/Icon';
import { useSearchField } from './useSearchField';
import './search-field.scss';

interface Props<T extends object> {
  catalog: T[];
  searchProperty?: string;
  placeholder?: string;
  fieldId?: string;
  disabled?: boolean;
  onFilter?: (filtered: T[]) => void;
  onSearch?: (result: { text: string; filtered: T[] }) => void;
}

export function SearchField<T extends object>({
  catalog,
  searchProperty = 'name',
  placeholder = 'Buscar...',
  fieldId = 'search-field',
  disabled = false,
  onFilter,
  onSearch,
}: Props<T>) {
  const { text, inputRef, handleChange, clear, search, showClear } = useSearchField({
    catalog,
    searchProperty,
    disabled,
    onFilter,
    onSearch,
  });

  return (
    <div className="c-search-field">
      <form className="search-field" onSubmit={search}>
        <label className="a11y-sr-only" htmlFor={fieldId}>
          Campo de búsqueda
        </label>

        <input
          ref={inputRef}
          id={fieldId}
          type="search"
          className="search-field-input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          name="search-field"
          autoComplete="off"
          disabled={disabled}
        />

        {showClear && (
          <button
            type="button"
            className="button button-pictogram button-bare-secondary search-field-clear"
            aria-label="Borrar"
            disabled={disabled}
            onClick={clear}
          >
            <Icon name="x" size={18} />
          </button>
        )}

        <button
          type="submit"
          className="button button-primary button-pictogram search-field-submit"
          aria-label="Buscar"
          disabled={disabled}
        >
          <Icon name="search" size={18} />
        </button>
      </form>
    </div>
  );
}
