import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatasetsService } from '../../core/services/datasets.service';
import { Icon } from '../shared/icon/icon';
import type { Dataset } from '../../core/models/dataset.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss',
})
export class OrganizationDetail implements OnInit {
  readonly organizationId: string;
  readonly datasets = signal<Dataset[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly removingId = signal<string | null>(null);

  constructor(
    route: ActivatedRoute,
    private readonly datasetsService: DatasetsService,
  ) {
    this.organizationId = route.snapshot.paramMap.get('organizationId')!;
  }

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.datasets.set(await this.datasetsService.list(this.organizationId));
    } catch {
      this.error.set('No se pudieron cargar los datasets.');
    } finally {
      this.loading.set(false);
    }
  }

  async removeDataset(dataset: Dataset, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`¿Borrar el dataset "${dataset.title}"? Se borran también sus resources y análisis. Esto no se puede deshacer.`)) {
      return;
    }
    this.removingId.set(dataset.id);
    this.error.set(null);
    try {
      await this.datasetsService.remove(this.organizationId, dataset.id);
      await this.reload();
    } catch {
      this.error.set('No se pudo borrar el dataset.');
    } finally {
      this.removingId.set(null);
    }
  }
}
