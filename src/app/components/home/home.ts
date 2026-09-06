import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { OrganizationsService } from '../../core/services/organizations.service';
import { DatasetsService } from '../../core/services/datasets.service';
import type { Dataset, Organization } from '../../core/models/dataset.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  readonly loading = signal(true);
  readonly recentDatasets = signal<Dataset[]>([]);
  readonly recentOrganizations = signal<Organization[]>([]);
  readonly totalDatasets = signal(0);
  readonly totalOrganizations = signal(0);

  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly datasetsService: DatasetsService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [allOrgs, recentDatasets, recentOrgs] = await Promise.all([
        this.organizationsService.list(),
        this.datasetsService.listAll(4),
        this.organizationsService.recent(),
      ]);
      this.totalOrganizations.set(allOrgs.length);
      this.totalDatasets.set(allOrgs.reduce((sum, org) => sum + (org._count?.datasets ?? 0), 0));
      this.recentDatasets.set(recentDatasets);
      this.recentOrganizations.set(recentOrgs.slice(0, 2));
    } finally {
      this.loading.set(false);
    }
  }
}
