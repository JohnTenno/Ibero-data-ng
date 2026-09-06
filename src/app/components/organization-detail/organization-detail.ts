import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './organization-detail.html',
  styleUrl: './organization-detail.scss',
})
export class OrganizationDetail implements OnInit {
  readonly organizationId: string;
  readonly datasets = signal<Dataset[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

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
}
