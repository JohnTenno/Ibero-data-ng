import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { PageHeader } from '../shared/page-header/page-header';
import { CampoBusqueda } from '../shared/campo-busqueda/campo-busqueda';
import { OrganizationsService } from '../../core/services/organizations.service';
import type { Organization } from '../../core/models/dataset.model';

type Orden = 'nombre' | 'reciente';

@Component({
  selector: 'app-organizations-list',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon, PageHeader, CampoBusqueda],
  templateUrl: './organizations-list.html',
  styleUrl: './organizations-list.scss',
})
export class OrganizationsList implements OnInit {
  readonly migas = [
    { etiqueta: 'Inicio', href: '/dashboard' },
    { etiqueta: 'Organizaciones' },
  ];

  readonly organizations = signal<Organization[]>([]);
  readonly filtradosBusqueda = signal<Organization[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly creating = signal(false);
  readonly showCreateForm = signal(false);
  readonly removingId = signal<string | null>(null);
  readonly orden = signal<Orden>('reciente');

  newName = '';
  newSlug = '';

  readonly filtered = computed(() => {
    const list = [...this.filtradosBusqueda()];
    if (this.orden() === 'nombre') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  });

  constructor(private readonly organizationsService: OrganizationsService) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const lista = await this.organizationsService.list();
      this.organizations.set(lista);
      this.filtradosBusqueda.set(lista);
    } catch {
      this.error.set('No se pudieron cargar las organizaciones.');
    } finally {
      this.loading.set(false);
    }
  }

  alFiltrar(items: object[]): void {
    this.filtradosBusqueda.set(items as Organization[]);
  }

  alCambiarOrden(valor: string): void {
    this.orden.set(valor as Orden);
  }

  async createOrganization(): Promise<void> {
    if (!this.newName || !this.newSlug) {
      return;
    }
    this.creating.set(true);
    this.error.set(null);
    try {
      await this.organizationsService.create(this.newName, this.newSlug);
      this.newName = '';
      this.newSlug = '';
      this.showCreateForm.set(false);
      await this.reload();
    } catch {
      this.error.set('No se pudo crear la organización (¿el slug ya existe?).');
    } finally {
      this.creating.set(false);
    }
  }

  async removeOrganization(org: Organization, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (
      !confirm(
        `¿Borrar la organización "${org.name}"? Se borran TODOS sus datasets, resources y análisis. Esto no se puede deshacer.`,
      )
    ) {
      return;
    }
    this.removingId.set(org.id);
    this.error.set(null);
    try {
      await this.organizationsService.remove(org.id);
      await this.reload();
    } catch {
      this.error.set('No se pudo borrar la organización.');
    } finally {
      this.removingId.set(null);
    }
  }
}
