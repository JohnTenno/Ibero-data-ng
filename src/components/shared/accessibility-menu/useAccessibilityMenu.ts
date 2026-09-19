import { useCallback, useEffect, useState } from 'react';

/** Accessibility classes aligned with sectei-library. */
export type A11yMode =
  | 'a11y-typography'
  | 'a11y-hyperlinks'
  | 'a11y-simplified'
  | 'a11y-dark';

export interface A11yOption {
  id: A11yMode;
  title: string;
  icon: string;
}

const STORAGE_KEY = 'ibero-a11y-modes';

const LEGACY_MODE_MAP: Record<string, A11yMode> = {
  'mode-readable-font': 'a11y-typography',
  'mode-underline-links': 'a11y-hyperlinks',
  'mode-text-only': 'a11y-simplified',
  'mode-dark': 'a11y-dark',
};

export const OPTIONS: A11yOption[] = [
  {
    id: 'a11y-typography',
    title: 'Cambio de fuente',
    icon: 'pictogram-change-typography',
  },
  {
    id: 'a11y-hyperlinks',
    title: 'Enlaces subrayados',
    icon: 'pictogram-link-underline',
  },
  {
    id: 'a11y-simplified',
    title: 'Mostrar solo texto',
    icon: 'pictogram-view-simplified',
  },
  {
    id: 'a11y-dark',
    title: 'Vista oscura',
    icon: 'pictogram-contrast',
  },
];

const ALL_MODES = OPTIONS.map((o) => o.id);

function normalizeMode(value: string): A11yMode | null {
  if (ALL_MODES.includes(value as A11yMode)) return value as A11yMode;
  return LEGACY_MODE_MAP[value] ?? null;
}

function readSaved(): A11yMode[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('ibero-a11y-modos');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => (typeof v === 'string' ? normalizeMode(v) : null))
      .filter((v): v is A11yMode => v != null);
  } catch {
    return [];
  }
}

function applyToDocument(active: Set<A11yMode>): void {
  const { body, documentElement } = document;

  // Clear legacy html.mode-* classes from older sessions.
  for (const legacy of Object.keys(LEGACY_MODE_MAP)) {
    documentElement.classList.remove(legacy);
  }

  for (const mode of ALL_MODES) {
    body.classList.toggle(mode, active.has(mode));
  }

  const theme = active.has('a11y-dark') ? 'dark' : 'light';
  body.setAttribute('data-theme', theme);
  body.setAttribute('data-profile', body.getAttribute('data-profile') ?? 'default');
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
      if (!active.has('a11y-dark') && localStorage.getItem('ibero-a11y-theme') === 'auto') {
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
        if (id === 'a11y-dark') localStorage.setItem('ibero-a11y-theme', 'light');
      } else {
        next.add(id);
        if (id === 'a11y-dark') localStorage.setItem('ibero-a11y-theme', 'dark');
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
