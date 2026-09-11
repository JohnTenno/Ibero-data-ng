import { useCallback, useEffect, useState } from 'react';

export type A11yMode =
  | 'mode-readable-font'
  | 'mode-underline-links'
  | 'mode-text-only'
  | 'mode-dark';

export interface A11yOption {
  id: A11yMode;
  title: string;
  icon: string;
}

const STORAGE_KEY = 'ibero-a11y-modos';

export const OPTIONS: A11yOption[] = [
  {
    id: 'mode-readable-font',
    title: 'Cambio de fuente',
    icon: 'pictograma-cambio-tipografia',
  },
  {
    id: 'mode-underline-links',
    title: 'Enlaces subrayados',
    icon: 'pictograma-enlace-subrayado',
  },
  {
    id: 'mode-text-only',
    title: 'Mostrar solo texto',
    icon: 'pictograma-vista-simplificada',
  },
  {
    id: 'mode-dark',
    title: 'Vista oscura',
    icon: 'pictograma-contraste',
  },
];

const ALL_MODES = OPTIONS.map((o) => o.id);

function readSaved(): A11yMode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is A11yMode => ALL_MODES.includes(v as A11yMode));
  } catch {
    return [];
  }
}

function applyToDocument(active: Set<A11yMode>): void {
  const root = document.documentElement;
  for (const mode of ALL_MODES) {
    root.classList.toggle(mode, active.has(mode));
  }
  root.dataset['theme'] = active.has('mode-dark') ? 'dark' : 'light';
}

export function useAccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<A11yMode>>(() => new Set(readSaved()));

  useEffect(() => {
    applyToDocument(active);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...active]));
  }, [active]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!active.has('mode-dark') && localStorage.getItem('ibero-a11y-theme') === 'auto') {
        applyToDocument(active);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [active]);

  const togglePanel = useCallback(() => setOpen((v) => !v), []);

  const toggleOption = useCallback((id: A11yMode) => {
    setActive((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
        if (id === 'mode-dark') localStorage.setItem('ibero-a11y-theme', 'light');
      } else {
        next.add(id);
        if (id === 'mode-dark') localStorage.setItem('ibero-a11y-theme', 'dark');
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.setItem('ibero-a11y-theme', 'light');
    setActive(new Set());
  }, []);

  return {
    options: OPTIONS,
    open,
    active,
    canReset: active.size > 0,
    togglePanel,
    toggleOption,
    reset,
  };
}
