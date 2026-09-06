import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysesService } from '../../core/services/analyses.service';
import type { Analysis, OpCatalog, OpName, PreviewResult, Step } from '../../core/models/analysis.model';
import type { DatasetVisibility } from '../../core/models/dataset.model';
import type { Resource, ResourceColumn } from '../../core/models/resource.model';

const OP_LABELS: Record<OpName, string> = {
  join: 'Cruzar con otro recurso',
  group_by: 'Agrupar por',
  aggregate: 'Calcular (suma/promedio/…)',
  compute: 'Crear columna (multiplicar)',
  percentage: 'Convertir a porcentaje',
  filter: 'Filtrar filas',
  sort: 'Ordenar',
  limit: 'Limitar filas (top N)',
};

const AGG_FUNCS = ['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'MEDIAN'];
const OPERATORS = ['=', '!=', '<', '<=', '>', '>='];
const JOIN_TYPES = ['inner', 'left'];

@Component({
  selector: 'app-analysis-builder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './analysis-builder.html',
  styleUrl: './analysis-builder.scss',
})
export class AnalysisBuilder implements OnInit, OnChanges {
  @Input({ required: true }) organizationId!: string;
  @Input({ required: true }) datasetId!: string;
  @Input({ required: true }) resourceId!: string;
  @Input() resourceColumns: ResourceColumn[] | null = null;
  @Input() datasetResources: Resource[] = [];
  @Input() editingAnalysis: Analysis | null = null;
  @Output() requestEditResource = new EventEmitter<Analysis>();
  @Output() editingConsumed = new EventEmitter<void>();

  readonly opLabels = OP_LABELS;
  readonly aggFuncs = AGG_FUNCS;
  readonly operators = OPERATORS;
  readonly joinTypes = JOIN_TYPES;
  readonly opCatalog = signal<OpCatalog | null>(null);
  readonly opNames = computed<OpName[]>(() =>
    this.opCatalog() ? (Object.keys(this.opCatalog()!) as OpName[]) : [],
  );

  readonly steps = signal<Step[]>([]);
  newOp: OpName = 'group_by';

  readonly availableColumns = computed<string[]>(() => {
    const base = (this.resourceColumns ?? []).map((c) => c.name);
    const derived: string[] = [];
    const joined: string[] = [];
    for (const step of this.steps()) {
      if (step.op === 'compute' && typeof step.params['as'] === 'string') derived.push(step.params['as'] as string);
      if (step.op === 'aggregate' && typeof step.params['as'] === 'string') derived.push(step.params['as'] as string);
      if (step.op === 'join' && typeof step.params['resourceId'] === 'string') {
        joined.push(...this.columnsForResource(step.params['resourceId'] as string));
      }
    }
    return [...new Set([...base, ...joined, ...derived])];
  });

  otherResources(): Resource[] {
    return this.datasetResources.filter((r) => r.id !== this.resourceId);
  }

  columnsForResource(resourceId: string): string[] {
    return (this.datasetResources.find((r) => r.id === resourceId)?.columns ?? []).map((c) => c.name);
  }

  columnsForJoinStep(step: Step): string[] {
    return this.columnsForResource(step.params['resourceId'] as string);
  }

  onJoinResourceChange(step: Step): void {
    const resourceId = step.params['resourceId'] as string;
    if (!step.params['alias']) {
      const resource = this.datasetResources.find((r) => r.id === resourceId);
      if (resource) {
        step.params['alias'] = resource.filename.replace(/\.[^./]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
      }
    }
    this.touchSteps();
  }

  readonly aggregateAliases = computed<string[]>(() =>
    this.steps()
      .filter((s) => s.op === 'aggregate' && typeof s.params['as'] === 'string')
      .map((s) => s.params['as'] as string),
  );

  readonly previewing = signal(false);
  readonly previewError = signal<string | null>(null);
  readonly previewResult = signal<PreviewResult | null>(null);
  roundDecimals: number | null = null;

  readonly showSaveForm = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly savedAnalysis = signal<Analysis | null>(null);
  readonly editingAnalysisId = signal<string | null>(null);
  title = '';
  slug = '';
  folder = '';
  description = '';
  visibility: DatasetVisibility = 'PRIVATE';

  readonly analyses = signal<Analysis[]>([]);
  readonly loadingAnalyses = signal(true);
  readonly openAnalysisId = signal<string | null>(null);
  readonly openAnalysisData = signal<PreviewResult | null>(null);

  readonly openingVizCanvasId = signal<string | null>(null);
  readonly vizCanvasError = signal<string | null>(null);

  constructor(private readonly analysesService: AnalysesService) { }

  async ngOnInit(): Promise<void> {
    this.opCatalog.set(await this.analysesService.operations(this.organizationId, this.datasetId));
    await this.reloadAnalyses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingAnalysis'] && this.editingAnalysis) {
      this.applyEditingAnalysis(this.editingAnalysis);
      return;
    }
    if (changes['resourceId'] && !changes['resourceId'].firstChange) {
      this.steps.set([]);
      this.previewResult.set(null);
    }
  }

  requestEdit(analysis: Analysis): void {
    this.requestEditResource.emit(analysis);
  }

  private applyEditingAnalysis(analysis: Analysis): void {
    this.editingAnalysisId.set(analysis.id);
    this.steps.set(analysis.recipe as Step[]);
    this.title = analysis.title;
    this.slug = analysis.slug;
    this.folder = analysis.folder;
    this.description = analysis.description ?? '';
    this.visibility = analysis.visibility;
    this.roundDecimals = null;
    this.showSaveForm.set(true);
    this.previewResult.set(null);
    this.previewError.set(null);
    this.saveError.set(null);
    this.savedAnalysis.set(null);
    this.editingConsumed.emit();
  }

  cancelEdit(): void {
    this.editingAnalysisId.set(null);
    this.steps.set([]);
    this.showSaveForm.set(false);
    this.title = '';
    this.slug = '';
    this.folder = '';
    this.description = '';
    this.previewResult.set(null);
    this.saveError.set(null);
  }

  async reloadAnalyses(): Promise<void> {
    this.loadingAnalyses.set(true);
    try {
      this.analyses.set(await this.analysesService.list(this.organizationId, this.datasetId));
    } finally {
      this.loadingAnalyses.set(false);
    }
  }

  addStep(): void {
    const defaults: Record<OpName, Record<string, unknown>> = {
      join: { resourceId: '', alias: '', type: 'inner', onLeft: '', onRight: '' },
      group_by: { columns: [] },
      aggregate: { func: 'SUM', column: '', as: '', distinct: false },
      compute: { left: '', right: '', as: '' },
      percentage: { of: '', as: '' },
      filter: { column: '', operator: '=', value: '' },
      sort: { column: '', dir: 'desc' },
      limit: { n: 100 },
    };
    this.steps.update((s) => [...s, { op: this.newOp, params: { ...defaults[this.newOp] } }]);
    this.previewResult.set(null);
  }

  removeStep(index: number): void {
    this.steps.update((s) => s.filter((_, i) => i !== index));
    this.previewResult.set(null);
  }

  touchSteps(): void {
    this.steps.update((s) => [...s]);
  }

  toggleGroupByColumn(step: Step, column: string): void {
    const cols = (step.params['columns'] as string[]) ?? [];
    step.params['columns'] = cols.includes(column) ? cols.filter((c) => c !== column) : [...cols, column];
  }

  isGroupByColumnSelected(step: Step, column: string): boolean {
    return ((step.params['columns'] as string[]) ?? []).includes(column);
  }

  async runPreview(): Promise<void> {
    if (this.steps().length === 0) return;
    this.previewing.set(true);
    this.previewError.set(null);
    try {
      this.previewResult.set(
        await this.analysesService.preview(
          this.organizationId,
          this.datasetId,
          this.resourceId,
          this.steps(),
          this.roundDecimals ?? undefined,
        ),
      );
    } catch (err: any) {
      this.previewError.set(err?.error?.message ?? 'El preview falló.');
    } finally {
      this.previewing.set(false);
    }
  }

  async save(): Promise<void> {
    if (!this.title || !this.slug || !this.folder) return;
    this.saving.set(true);
    this.saveError.set(null);
    const editingId = this.editingAnalysisId();
    const payload = {
      resourceId: this.resourceId,
      title: this.title,
      slug: this.slug,
      folder: this.folder,
      description: this.description || undefined,
      visibility: this.visibility,
      steps: this.steps(),
      roundDecimals: this.roundDecimals ?? undefined,
    };
    try {
      const analysis = editingId
        ? await this.analysesService.update(this.organizationId, this.datasetId, editingId, payload)
        : await this.analysesService.create(this.organizationId, this.datasetId, payload);
      this.savedAnalysis.set(analysis);
      this.showSaveForm.set(false);
      this.editingAnalysisId.set(null);
      this.title = '';
      this.slug = '';
      this.folder = '';
      this.description = '';
      this.steps.set([]);
      await this.reloadAnalyses();
    } catch (err: any) {
      this.saveError.set(
        err?.error?.message ?? (editingId ? 'No se pudo actualizar el análisis.' : 'No se pudo guardar el análisis.'),
      );
    } finally {
      this.saving.set(false);
    }
  }

  async openAnalysis(analysis: Analysis): Promise<void> {
    if (this.openAnalysisId() === analysis.id) {
      this.openAnalysisId.set(null);
      this.openAnalysisData.set(null);
      return;
    }
    this.openAnalysisId.set(analysis.id);
    this.openAnalysisData.set(null);
    if (analysis.status === 'DONE') {
      this.openAnalysisData.set(
        await this.analysesService.getData(this.organizationId, this.datasetId, analysis.id),
      );
    }
  }

  async openInVizCanvas(analysis: Analysis, event: Event): Promise<void> {
    event.stopPropagation();
    this.openingVizCanvasId.set(analysis.id);
    this.vizCanvasError.set(null);
    try {
      const { url } = await this.analysesService.vizcanvasHandoff(this.organizationId, this.datasetId, analysis.id);
      window.location.href = url;
    } catch (err: any) {
      this.vizCanvasError.set(err?.error?.message ?? 'No se pudo abrir en VizCanvas.');
      this.openingVizCanvasId.set(null);
    }
  }
}
