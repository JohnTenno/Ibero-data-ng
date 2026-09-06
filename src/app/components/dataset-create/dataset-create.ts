import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatasetsService } from '../../core/services/datasets.service';
import {
  PERIOD_TYPE_OPTIONS,
  SURVEY_OPTIONS,
  type Dataset,
  type DatasetVisibility,
  type PeriodType,
  type Survey,
} from '../../core/models/dataset.model';

@Component({
  selector: 'app-dataset-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './dataset-create.html',
  styleUrl: './dataset-create.scss',
})
export class DatasetCreate implements OnInit {
  readonly organizationId: string;
  readonly surveyOptions = SURVEY_OPTIONS;
  readonly periodTypeOptions = PERIOD_TYPE_OPTIONS;

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly revisionOf = signal<Dataset | null>(null);

  title = '';
  slug = '';
  description = '';
  visibility: DatasetVisibility = 'PRIVATE';
  survey: Survey | '' = '';
  year: number | null = null;
  periodType: PeriodType | '' = '';
  sourceOrg = '';
  sourceUrl = '';
  tagsText = '';
  licenseId = '';
  changelog = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datasetsService: DatasetsService,
  ) {
    this.organizationId = route.snapshot.paramMap.get('organizationId')!;
  }

  async ngOnInit(): Promise<void> {
    const revisionOfId = this.route.snapshot.queryParamMap.get('revisionOf');
    if (revisionOfId) {
      const original = await this.datasetsService.get(this.organizationId, revisionOfId);
      this.revisionOf.set(original);
      this.title = `${original.title} (revisión)`;
    }
  }

  async submit(): Promise<void> {
    if (!this.title || !this.slug) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      const tags = this.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const dataset = await this.datasetsService.create(this.organizationId, {
        title: this.title,
        slug: this.slug,
        description: this.description || undefined,
        visibility: this.visibility,
        survey: this.survey || undefined,
        year: this.year ?? undefined,
        periodType: this.periodType || undefined,
        sourceOrg: this.sourceOrg || undefined,
        sourceUrl: this.sourceUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
        licenseId: this.licenseId || undefined,
        revisionOfId: this.revisionOf()?.id,
        changelog: this.changelog || undefined,
      });
      await this.router.navigate(['/organizations', this.organizationId, 'datasets', dataset.id]);
    } catch (err: any) {
      this.error.set(err?.error?.message ?? 'No se pudo crear el dataset (¿el slug ya existe?).');
    } finally {
      this.saving.set(false);
    }
  }
}
