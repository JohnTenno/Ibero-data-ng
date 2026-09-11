import { useRef, useState, type FormEvent } from 'react';

export function normalizeText(text: unknown): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function filterCatalog<T extends object>(
  catalog: T[],
  text: string,
  searchProperty = 'name',
): T[] {
  const query = text.trim();
  if (query.length < 1) {
    return catalog;
  }

  const normalizedQuery = normalizeText(query);
  return catalog.filter((item) =>
    normalizeText((item as Record<string, unknown>)[searchProperty]).includes(normalizedQuery),
  );
}

interface Options<T extends object> {
  catalog: T[];
  searchProperty: string;
  disabled: boolean;
  onFilter?: (filtered: T[]) => void;
  onSearch?: (result: { text: string; filtered: T[] }) => void;
}

export function useSearchField<T extends object>({
  catalog,
  searchProperty,
  disabled,
  onFilter,
  onSearch,
}: Options<T>) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getFiltered = (value: string) => filterCatalog(catalog, value, searchProperty);

  const handleChange = (value: string) => {
    if (disabled) return;
    setText(value);
    onFilter?.(getFiltered(value));
  };

  const clear = () => {
    if (disabled) return;
    setText('');
    onFilter?.(getFiltered(''));
    inputRef.current?.focus();
  };

  const search = (event: FormEvent) => {
    event.preventDefault();
    if (disabled) return;
    const filtered = getFiltered(text);
    onFilter?.(filtered);
    onSearch?.({ text, filtered });
  };

  return { text, inputRef, handleChange, clear, search, showClear: text.trim().length > 0 };
}
