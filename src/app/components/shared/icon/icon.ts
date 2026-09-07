import { Component, Input } from '@angular/core';

/** Alias internos → clases Sisdai (`pictograma-*`). */
const PICTOGRAMAS: Record<string, string> = {
  compass: 'pictograma-explorar',
  layers: 'pictograma-capas',
  users: 'pictograma-grupo',
  user: 'pictograma-persona',
  search: 'pictograma-buscar',
  x: 'pictograma-cerrar',
  'chevron-left': 'pictograma-angulo-izquierdo',
  'chevron-right': 'pictograma-angulo-derecho',
  'log-out': 'pictograma-cerrar-sesion',
  plus: 'pictograma-agregar',
  trash: 'pictograma-eliminar',
  accessibility: 'pictograma-accesibilidad',
  type: 'pictograma-cambio-tipografia',
  link: 'pictograma-enlace-subrayado',
  'align-left': 'pictograma-vista-simplificada',
  moon: 'pictograma-contraste',
  database: 'pictograma-documento',
  'bar-chart': 'pictograma-nivel',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<span [class]="clase" aria-hidden="true"></span>`,
  host: {
    '[style.font-size.px]': 'size',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
      color: inherit;
    }

    :host > span {
      padding: 0;
      font-size: 1em;
      line-height: 1;
    }
  `,
})
export class Icon {
  @Input() name = 'compass';
  @Input() size = 20;

  get clase(): string {
    if (this.name.startsWith('pictograma-')) {
      return this.name;
    }
    return PICTOGRAMAS[this.name] ?? 'pictograma-ayuda';
  }
}
