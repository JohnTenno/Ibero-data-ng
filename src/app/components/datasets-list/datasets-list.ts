import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icon } from '../shared/icon/icon';
import { PageHeader } from '../shared/page-header/page-header';
import { CampoBusqueda } from '../shared/campo-busqueda/campo-busqueda';
import { DatasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';

type Orden = 'recientes' | 'titulo-asc' | 'titulo-desc' | 'anio-desc' | 'anio-asc';

@Component({
  selector: 'app-datasets-list',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon, PageHeader, CampoBusqueda],
  templateUrl: './datasets-list.html',
  styleUrl: './datasets-list.scss',
})
export class DatasetsList implements OnInit {
  readonly migas = [
    { etiqueta: 'Inicio', href: '/dashboard' },
    { etiqueta: 'Conjuntos de datos' },
  ];

  readonly opcionesOrden: { valor: Orden; etiqueta: string }[] = [
    { valor: 'recientes', etiqueta: 'Más recientes' },
    { valor: 'titulo-asc', etiqueta: 'Título (A–Z)' },
    { valor: 'titulo-desc', etiqueta: 'Título (Z–A)' },
    { valor: 'anio-desc', etiqueta: 'Año (más reciente)' },
    { valor: 'anio-asc', etiqueta: 'Año (más antiguo)' },
  ];

  readonly porPagina = 3;

  readonly datasets = signal<Dataset[]>([]);
  readonly filtradosBusqueda = signal<Dataset[]>([]);
  readonly loading = signal(true);
  readonly orden = signal<Orden>('recientes');
  readonly pagina = signal(1);

  readonly visibles = computed(() => this.ordenar(this.filtradosBusqueda(), this.orden()));

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.visibles().length / this.porPagina)),
  );

  readonly paginaItems = computed(() => {
    const pagina = Math.min(this.pagina(), this.totalPaginas());
    const inicio = (pagina - 1) * this.porPagina;
    return this.visibles().slice(inicio, inicio + this.porPagina);
  });

  readonly numerosPagina = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1),
  );

  constructor(private readonly datasetsService: DatasetsService) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const lista = await this.datasetsService.listAll();
      this.datasets.set(lista);
      this.filtradosBusqueda.set(lista);
    } finally {
      this.loading.set(false);
    }
  }

  alFiltrar(items: object[]): void {
    this.filtradosBusqueda.set(items as Dataset[]);
    this.pagina.set(1);
  }

  alCambiarOrden(valor: string): void {
    this.orden.set(valor as Orden);
    this.pagina.set(1);
  }

  irA(destino: number): void {
    const siguiente = Math.min(Math.max(1, destino), this.totalPaginas());
    this.pagina.set(siguiente);
  }

  private ordenar(lista: Dataset[], criterio: Orden): Dataset[] {
    const copia = [...lista];
    switch (criterio) {
      case 'titulo-asc':
        return copia.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
      case 'titulo-desc':
        return copia.sort((a, b) => b.title.localeCompare(a.title, 'es', { sensitivity: 'base' }));
      case 'anio-asc':
        return copia.sort(
          (a, b) =>
            (a.year ?? 0) - (b.year ?? 0) ||
            a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }),
        );
      case 'anio-desc':
        return copia.sort(
          (a, b) =>
            (b.year ?? 0) - (a.year ?? 0) ||
            a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }),
        );
      case 'recientes':
      default:
        return copia.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    }
  }
}
