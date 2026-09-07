import { Component, OnDestroy, OnInit } from '@angular/core';
import { Icon } from '../icon/icon';

export type ModoAccesibilidad =
  | 'modo-tipografia-legible'
  | 'modo-enlaces-subrayados'
  | 'modo-solo-texto'
  | 'modo-oscuro';

interface OpcionAccesibilidad {
  id: ModoAccesibilidad;
  titulo: string;
  icono: string;
}

const STORAGE_KEY = 'ibero-a11y-modos';

const OPCIONES: OpcionAccesibilidad[] = [
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

@Component({
  selector: 'app-menu-accesibilidad',
  standalone: true,
  imports: [Icon],
  templateUrl: './menu-accesibilidad.html',
  styleUrl: './menu-accesibilidad.scss',
})
export class MenuAccesibilidad implements OnInit, OnDestroy {
  readonly opciones = OPCIONES;
  abierto = false;
  activos = new Set<ModoAccesibilidad>();

  private mediaQuery?: MediaQueryList;
  private onMediaChange?: () => void;

  ngOnInit(): void {
    this.activos = new Set(this.leerGuardados());
    this.aplicarAlDocumento();

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.onMediaChange = () => {
      if (!this.activos.has('modo-oscuro') && localStorage.getItem('ibero-a11y-tema') === 'auto') {
        this.aplicarAlDocumento();
      }
    };
    this.mediaQuery.addEventListener('change', this.onMediaChange);
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.onMediaChange) {
      this.mediaQuery.removeEventListener('change', this.onMediaChange);
    }
  }

  get puedeRestablecer(): boolean {
    return this.activos.size > 0;
  }

  alternarPanel(): void {
    this.abierto = !this.abierto;
  }

  estaActivo(id: ModoAccesibilidad): boolean {
    return this.activos.has(id);
  }

  alternarOpcion(id: ModoAccesibilidad): void {
    if (this.activos.has(id)) {
      this.activos.delete(id);
      if (id === 'modo-oscuro') {
        localStorage.setItem('ibero-a11y-tema', 'clara');
      }
    } else {
      this.activos.add(id);
      if (id === 'modo-oscuro') {
        localStorage.setItem('ibero-a11y-tema', 'oscura');
      }
    }
    this.activos = new Set(this.activos);
    this.guardar();
    this.aplicarAlDocumento();
  }

  restablecer(): void {
    this.activos.clear();
    this.activos = new Set();
    localStorage.setItem('ibero-a11y-tema', 'clara');
    this.guardar();
    this.aplicarAlDocumento();
  }

  private leerGuardados(): ModoAccesibilidad[] {
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

  private guardar(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.activos]));
  }

  private aplicarAlDocumento(): void {
    const root = document.documentElement;
    for (const modo of TODOS_LOS_MODOS) {
      root.classList.toggle(modo, this.activos.has(modo));
    }
    root.dataset['tema'] = this.activos.has('modo-oscuro') ? 'oscuro' : 'claro';
  }
}
