import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';

export function normalizarTexto(texto: unknown): string {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function filtrarCatalogo<T extends object>(
  catalogo: T[],
  texto: string,
  propiedadBusqueda = 'nombre',
): T[] {
  const consulta = texto.trim();
  if (consulta.length < 1) {
    return catalogo;
  }

  const consultaNorm = normalizarTexto(consulta);
  return catalogo.filter((elemento) =>
    normalizarTexto((elemento as Record<string, unknown>)[propiedadBusqueda]).includes(
      consultaNorm,
    ),
  );
}

@Component({
  selector: 'app-campo-busqueda',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './campo-busqueda.html',
  styleUrl: './campo-busqueda.scss',
})
export class CampoBusqueda {
  @Input() catalogo: object[] = [];
  @Input() propiedadBusqueda = 'nombre';
  @Input() etiqueta = 'Buscar...';
  @Input() idCampo = 'campo-busqueda';
  @Input() deshabilitado = false;

  @Output() alFiltrar = new EventEmitter<object[]>();
  @Output() alBuscar = new EventEmitter<{ texto: string; filtrados: object[] }>();

  @ViewChild('entrada') private readonly entradaRef?: ElementRef<HTMLInputElement>;

  texto = '';

  get mostrarBorrar(): boolean {
    return this.texto.trim().length > 0;
  }

  private obtenerFiltrados(valor: string): object[] {
    return filtrarCatalogo(this.catalogo, valor, this.propiedadBusqueda);
  }

  alCambiar(valor: string): void {
    if (this.deshabilitado) {
      return;
    }
    this.texto = valor;
    this.alFiltrar.emit(this.obtenerFiltrados(valor));
  }

  limpiar(): void {
    if (this.deshabilitado) {
      return;
    }
    this.texto = '';
    this.alFiltrar.emit(this.obtenerFiltrados(''));
    this.entradaRef?.nativeElement.focus();
  }

  buscar(): void {
    if (this.deshabilitado) {
      return;
    }
    const filtrados = this.obtenerFiltrados(this.texto);
    this.alFiltrar.emit(filtrados);
    this.alBuscar.emit({ texto: this.texto, filtrados });
  }
}
