import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';
import { DatasetsService } from '../../core/services/datasets.service';
import { IntermediarioService } from '../../core/services/intermediario.service';
import { AnalysisBuilder } from '../analysis-builder/analysis-builder';
import type { Resource } from '../../core/models/resource.model';
import type { Dataset } from '../../core/models/dataset.model';
import type { Analysis } from '../../core/models/analysis.model';
import type { IntermediarioDatasetSummary, IntermediarioSurveySummary } from '../../core/models/intermediario.model';

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

  readonly openingVizCanvas = signal(false);
  readonly vizCanvasError = signal<string | null>(null);
  readonly editingAnalysis = signal<Analysis | null>(null);
  readonly intermediarioSurveys = signal<IntermediarioSurveySummary[] | null>(null);
  readonly loadingIntermediario = signal(false);
  readonly intermediarioError = signal<string | null>(null);
  readonly importingKey = signal<string | null>(null);

  constructor(
    route: ActivatedRoute,
    private readonly resourcesService: ResourcesService,
    private readonly datasetsService: DatasetsService,
    private readonly intermediarioService: IntermediarioService,
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

  onRequestEditResource(analysis: Analysis): void {
    this.selectedResourceId = analysis.sourceResourceId;
    this.editingAnalysis.set(analysis);
  }

  async loadIntermediarioCatalog(): Promise<void> {
    this.loadingIntermediario.set(true);
    this.intermediarioError.set(null);
    try {
      this.intermediarioSurveys.set(await this.intermediarioService.catalog(this.organizationId, this.datasetId));
    } catch (err: any) {
      this.intermediarioError.set(
        err?.error?.message ?? 'No se pudo conectar con el intermediario (sectei-intermediario). ¿Está corriendo?',
      );
    } finally {
      this.loadingIntermediario.set(false);
    }
  }

  private slugify(name: string): string {
    const clean = name
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return clean || 'armonizado';
  }

  async importSurvey(survey: IntermediarioSurveySummary): Promise<void> {
    const key = `survey-${survey.id}`;
    this.importingKey.set(key);
    this.intermediarioError.set(null);
    try {
      await this.intermediarioService.import(this.organizationId, this.datasetId, {
        kind: 'survey',
        sourceId: survey.id,
        filename: `${this.slugify(survey.name)}_armonizado.parquet`,
      });
      await this.reloadResources();
    } catch (err: any) {
      this.intermediarioError.set(err?.error?.message ?? 'No se pudo importar la encuesta.');
    } finally {
      this.importingKey.set(null);
    }
  }

  async importDataset(survey: IntermediarioSurveySummary, ds: IntermediarioDatasetSummary): Promise<void> {
    const key = `dataset-${ds.id}`;
    this.importingKey.set(key);
    this.intermediarioError.set(null);
    try {
      await this.intermediarioService.import(this.organizationId, this.datasetId, {
        kind: 'dataset',
        sourceId: ds.id,
        filename: `${this.slugify(survey.name)}_${ds.year}.parquet`,
      });
      await this.reloadResources();
    } catch (err: any) {
      this.intermediarioError.set(err?.error?.message ?? 'No se pudo importar ese año.');
    } finally {
      this.importingKey.set(null);
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
