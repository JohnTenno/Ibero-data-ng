import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';
import { DatasetsService } from '../../core/services/datasets.service';
import { AnalysisBuilder } from '../analysis-builder/analysis-builder';
import type { QueryResult, Resource } from '../../core/models/resource.model';
import type { Dataset } from '../../core/models/dataset.model';

@Component({
  selector: 'app-dataset-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, AnalysisBuilder],
  templateUrl: './dataset-detail.html',
  styleUrl: './dataset-detail.scss',
})
export class DatasetDetail implements OnInit {
  readonly organizationId: string;
  readonly datasetId: string;

  readonly dataset = signal<Dataset | null>(null);
  readonly resources = signal<Resource[]>([]);
  readonly loadingResources = signal(true);
  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  selectedResourceId = '';
  readonly selectedResource = computed<Resource | null>(
    () => this.resources().find((r) => r.id === this.selectedResourceId) ?? null,
  );

  sql = 'SELECT * FROM data LIMIT 100';
  readonly running = signal(false);
  readonly queryError = signal<string | null>(null);
  readonly result = signal<QueryResult | null>(null);

  readonly openingVizCanvas = signal(false);
  readonly vizCanvasError = signal<string | null>(null);

  constructor(
    route: ActivatedRoute,
    private readonly resourcesService: ResourcesService,
    private readonly datasetsService: DatasetsService,
  ) {
    this.organizationId = route.snapshot.paramMap.get('organizationId')!;
    this.datasetId = route.snapshot.paramMap.get('datasetId')!;
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.reloadResources(), this.loadDataset()]);
  }

  async loadDataset(): Promise<void> {
    this.dataset.set(await this.datasetsService.get(this.organizationId, this.datasetId));
  }

  async reloadResources(): Promise<void> {
    this.loadingResources.set(true);
    try {
      const resources = await this.resourcesService.list(this.organizationId, this.datasetId);
      this.resources.set(resources);
      if (!this.selectedResourceId && resources.length > 0) {
        this.selectedResourceId = resources[0].id;
      }
    } finally {
      this.loadingResources.set(false);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.uploading.set(true);
    this.uploadError.set(null);
    try {
      await this.resourcesService.upload(this.organizationId, this.datasetId, file);
      await this.reloadResources();
    } catch {
      this.uploadError.set('No se pudo subir el archivo (¿necesitas rol ADMIN/EDITOR? ¿es un .parquet válido?).');
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }

  async runQuery(): Promise<void> {
    if (!this.selectedResourceId || !this.sql.trim()) {
      return;
    }
    this.running.set(true);
    this.queryError.set(null);
    this.result.set(null);
    try {
      this.result.set(
        await this.resourcesService.runQuery(this.organizationId, this.datasetId, this.selectedResourceId, this.sql),
      );
    } catch (err: any) {
      this.queryError.set(err?.error?.message ?? 'La consulta falló.');
    } finally {
      this.running.set(false);
    }
  }

  async openInVizCanvas(): Promise<void> {
    if (!this.selectedResourceId) return;
    this.openingVizCanvas.set(true);
    this.vizCanvasError.set(null);
    try {
      const { url } = await this.resourcesService.vizcanvasHandoff(
        this.organizationId,
        this.datasetId,
        this.selectedResourceId,
      );
      window.location.href = url;
    } catch (err: any) {
      this.vizCanvasError.set(err?.error?.message ?? 'No se pudo abrir en VizCanvas.');
      this.openingVizCanvas.set(false);
    }
  }
}
