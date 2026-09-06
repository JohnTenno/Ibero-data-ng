import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { DatasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';

@Component({
  selector: 'app-datasets-list',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './datasets-list.html',
  styleUrl: './datasets-list.scss',
})
export class DatasetsList implements OnInit {
  readonly datasets = signal<Dataset[]>([]);
  readonly loading = signal(true);
  query = '';

  readonly filtered = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return this.datasets();
    }
    return this.datasets().filter(
      (d) => d.title.toLowerCase().includes(q) || d.organization?.name.toLowerCase().includes(q),
    );
  });

  constructor(
    private readonly datasetsService: DatasetsService,
    route: ActivatedRoute,
  ) {
    const initialQuery = route.snapshot.queryParamMap.get('q');
    if (initialQuery) {
      this.query = initialQuery;
    }
  }

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      this.datasets.set(await this.datasetsService.listAll());
    } finally {
      this.loading.set(false);
    }
  }
}
