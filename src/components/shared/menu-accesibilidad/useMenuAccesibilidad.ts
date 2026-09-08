import { useCallback, useEffect, useState } from 'react';

export type ModoAccesibilidad =
  | 'modo-tipografia-legible'
  | 'modo-enlaces-subrayados'
  | 'modo-solo-texto'
  | 'modo-oscuro';

export interface OpcionAccesibilidad {
  id: ModoAccesibilidad;
  titulo: string;
  icono: string;
}

const STORAGE_KEY = 'ibero-a11y-modos';

export const OPCIONES: OpcionAccesibilidad[] = [
  {
    id: 'modo-tipografia-legible',
    titulo: 'Cambio de fuente',
    icono: 'pictograma-cambio-tipografia',
  },
  {
    id: 'modo-enlaces-subrayados',
    titulo: 'Enlaces subrayados',
    icono: 'pictograma-enlace-subrayado',
  },
  {
    id: 'modo-solo-texto',
    titulo: 'Mostrar solo texto',
    icono: 'pictograma-vista-simplificada',
  },
  {
    id: 'modo-oscuro',
    titulo: 'Vista oscura',
    icono: 'pictograma-contraste',
  },
];

const TODOS_LOS_MODOS = OPCIONES.map((o) => o.id);

function leerGuardados(): ModoAccesibilidad[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is ModoAccesibilidad =>
      TODOS_LOS_MODOS.includes(v as ModoAccesibilidad),
    );
  } catch {
    return [];
  }
}

function aplicarAlDocumento(activos: Set<ModoAccesibilidad>): void {
  const root = document.documentElement;
  for (const modo of TODOS_LOS_MODOS) {
    root.classList.toggle(modo, activos.has(modo));
  }
  root.dataset['tema'] = activos.has('modo-oscuro') ? 'oscuro' : 'claro';
}

export function useMenuAccesibilidad() {
  const [abierto, setAbierto] = useState(false);
  const [activos, setActivos] = useState<Set<ModoAccesibilidad>>(() => new Set(leerGuardados()));

  useEffect(() => {
    aplicarAlDocumento(activos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...activos]));
  }, [activos]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!activos.has('modo-oscuro') && localStorage.getItem('ibero-a11y-tema') === 'auto') {
        aplicarAlDocumento(activos);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [activos]);

  const alternarPanel = useCallback(() => setAbierto((v) => !v), []);

  const alternarOpcion = useCallback((id: ModoAccesibilidad) => {
    setActivos((previos) => {
      const siguiente = new Set(previos);
      if (siguiente.has(id)) {
        siguiente.delete(id);
        if (id === 'modo-oscuro') localStorage.setItem('ibero-a11y-tema', 'clara');
      } else {
        siguiente.add(id);
        if (id === 'modo-oscuro') localStorage.setItem('ibero-a11y-tema', 'oscura');
      }
      return siguiente;
    });
  }, []);

  const restablecer = useCallback(() => {
    localStorage.setItem('ibero-a11y-tema', 'clara');
    setActivos(new Set());
  }, []);

  return {
    opciones: OPCIONES,
    abierto,
    activos,
    puedeRestablecer: activos.size > 0,
    alternarPanel,
    alternarOpcion,
    restablecer,
  };
}
