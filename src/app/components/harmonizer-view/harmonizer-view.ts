import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { HarmonizerService } from '../../core/services/harmonizer.service';
import type {
  DatasetHarmonizedView,
  ExportFormat,
  HarmonizedRow,
  SurveyHarmonizedView,
} from '../../core/models/harmonizer.model';

/** Columnas de origen que la vista por encuesta antepone a cada fila. */
const SURVEY_ORIGIN_COLUMNS = ['_dataset', '_year'];
const MAX_VISIBLE_ROWS = 500;

/**
 * Vista armonizada. Sirve tanto para una edición (`datasets/:datasetId`) como
 * para toda la encuesta (`surveys/:surveyId`, con filtro de variables en la URL).
 */
@Component({
  selector: 'app-harmonizer-view',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './harmonizer-view.html',
  styleUrl: './harmonizer-view.scss',
})
export class HarmonizerView implements OnInit {
  readonly datasetId: string | null;
  readonly surveyId: string | null;
  readonly maxVisibleRows = MAX_VISIBLE_ROWS;

  readonly datasetView = signal<DatasetHarmonizedView | null>(null);
  readonly surveyView = signal<SurveyHarmonizedView | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly downloading = signal<ExportFormat | null>(null);
  readonly downloadError = signal<string | null>(null);

  /** Variables marcadas en el filtro (vista de encuesta). */
  readonly selectedVariables = signal<string[]>([]);

  readonly headers = computed<string[]>(() => {
    const dataset = this.datasetView();
    if (dataset) return dataset.headers;
    const survey = this.surveyView();
    return survey ? [...SURVEY_ORIGIN_COLUMNS, ...survey.headers] : [];
  });

  readonly rows = computed<HarmonizedRow[]>(
    () => this.datasetView()?.rows ?? this.surveyView()?.rows ?? [],
  );
  readonly visibleRows = computed(() => this.rows().slice(0, MAX_VISIBLE_ROWS));

  readonly title = computed(() => {
    const dataset = this.datasetView();
    if (dataset) return `${dataset.dataset.name} (${dataset.dataset.year})`;
    return this.surveyView()?.survey.name ?? '';
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly harmonizerService: HarmonizerService,
  ) {
    this.datasetId = route.snapshot.paramMap.get('datasetId');
    this.surveyId = route.snapshot.paramMap.get('surveyId');
    this.selectedVariables.set(route.snapshot.queryParamMap.getAll('variables'));
  }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      if (this.datasetId) {
        this.datasetView.set(await this.harmonizerService.datasetHarmonized(this.datasetId));
      } else if (this.surveyId) {
        const view = await this.harmonizerService.surveyHarmonized(
          this.surveyId,
          this.selectedVariables(),
        );
        this.surveyView.set(view);
        this.selectedVariables.set(view.selected);
      }
    } catch (err: any) {
      this.loadError.set(err?.error?.message ?? 'No se pudo cargar la vista armonizada.');
    } finally {
      this.loading.set(false);
    }
  }

  isSelected(variable: string): boolean {
    const selected = this.selectedVariables();
    // Sin filtro explícito, el backend devuelve todas: se muestran como marcadas.
    return selected.length === 0 || selected.includes(variable);
  }

  async toggleVariable(variable: string): Promise<void> {
    const survey = this.surveyView();
    if (!survey) return;
    const current =
      this.selectedVariables().length === 0
        ? [...survey.availableVariables]
        : [...this.selectedVariables()];
    const next = current.includes(variable)
      ? current.filter((v) => v !== variable)
      : [...current, variable];
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { variables: next },
      replaceUrl: true,
    });
    this.selectedVariables.set(next);
    await this.load();
  }

  async download(format: ExportFormat): Promise<void> {
    this.downloading.set(format);
    this.downloadError.set(null);
    try {
      if (this.datasetId && this.datasetView()) {
        const ds = this.datasetView()!.dataset;
        await this.harmonizerService.downloadDataset(
          this.datasetId,
          format,
          `harmonized_${ds.name}_${ds.year}`,
        );
      } else if (this.surveyId && this.surveyView()) {
        await this.harmonizerService.downloadSurvey(
          this.surveyId,
          format,
          this.selectedVariables(),
          `harmonized_${this.surveyView()!.survey.name}`,
        );
      }
    } catch (err: any) {
      this.downloadError.set(
        err?.error?.message ?? `No se pudo descargar el ${format.toUpperCase()}.`,
      );
    } finally {
      this.downloading.set(null);
    }
  }
}
