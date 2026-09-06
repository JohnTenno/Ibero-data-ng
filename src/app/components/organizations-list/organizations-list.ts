import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { OrganizationsService } from '../../core/services/organizations.service';
import type { Organization } from '../../core/models/dataset.model';

type Orden = 'nombre' | 'reciente';

@Component({
  selector: 'app-organizations-list',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './organizations-list.html',
  styleUrl: './organizations-list.scss',
})
export class OrganizationsList implements OnInit {
  readonly organizations = signal<Organization[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly creating = signal(false);
  readonly showCreateForm = signal(false);

  query = '';
  orden: Orden = 'reciente';

  newName = '';
  newSlug = '';

  readonly filtered = computed(() => {
    const q = this.query.trim().toLowerCase();
    let list = this.organizations();
    if (q) {
      list = list.filter((org) => org.name.toLowerCase().includes(q));
    }
    list = [...list];
    if (this.orden === 'nombre') {
      list.sort((a, b) => a.name.localeCompare(b.name));
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
      this.organizations.set(await this.organizationsService.list());
    } catch {
      this.error.set('No se pudieron cargar las organizaciones.');
    } finally {
      this.loading.set(false);
    }
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
}
