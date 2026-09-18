import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HarmonizerService } from '../../core/services/harmonizer.service';
import {
  CANONICAL_PREFIX,
  NEW_OPTION,
  type CanonicalVariable,
  type HarmonizerDataset,
  type MappingChoice,
  type MappingColumn,
} from '../../core/models/harmonizer.model';

/** Estado editable de una fila del formulario de mapeo. */
interface ColumnRow {
  column: MappingColumn;
  /** `''` (sin mapear), `cv:<id>` o `__new__`. */
  choice: string;
  newName: string;
}

const SUGGESTION_LABEL: Record<'history' | 'name', string> = {
  history: 'histórico',
  name: 'por nombre',
};

@Component({
  selector: 'app-harmonizer-mapping',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './harmonizer-mapping.html',
  styleUrl: './harmonizer-mapping.scss',
})
export class HarmonizerMapping implements OnInit {
  readonly datasetId: string;
  readonly newOption = NEW_OPTION;
  readonly canonicalPrefix = CANONICAL_PREFIX;
  readonly suggestionLabel = SUGGESTION_LABEL;

  readonly dataset = signal<HarmonizerDataset | null>(null);
  readonly canonicalVariables = signal<CanonicalVariable[]>([]);
  readonly rows = signal<ColumnRow[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  constructor(
    route: ActivatedRoute,
    private readonly router: Router,
    private readonly harmonizerService: HarmonizerService,
  ) {
    this.datasetId = route.snapshot.paramMap.get('datasetId')!;
  }

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const info = await this.harmonizerService.mapping(this.datasetId);
      this.dataset.set(info.dataset);
      this.canonicalVariables.set(info.canonicalVariables);
      this.rows.set(
        info.columns.map((column) => ({
          column,
          choice: column.selectedCanonicalId
            ? `${CANONICAL_PREFIX}${column.selectedCanonicalId}`
            : '',
          newName: '',
        })),
      );
    } catch (err: any) {
      this.loadError.set(err?.error?.message ?? 'No se pudo cargar el mapeo.');
    } finally {
      this.loading.set(false);
    }
  }

  mappedCount(): number {
    return this.rows().filter(
      (r) => r.choice !== '' && (r.choice !== NEW_OPTION || r.newName.trim() !== ''),
    ).length;
  }

  clearAll(): void {
    for (const row of this.rows()) {
      row.choice = '';
      row.newName = '';
    }
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const columns: MappingChoice[] = this.rows().map((r) => ({
        column: r.column.name,
        choice: r.choice,
        newName: r.choice === NEW_OPTION ? r.newName.trim() : undefined,
      }));
      await this.harmonizerService.saveMapping(this.datasetId, columns);
      await this.router.navigate(['/harmonizer', 'datasets', this.datasetId, 'harmonized']);
    } catch (err: any) {
      this.saveError.set(err?.error?.message ?? 'No se pudo guardar el mapeo.');
    } finally {
      this.saving.set(false);
    }
  }
}
