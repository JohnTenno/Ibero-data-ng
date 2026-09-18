import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../shared/icon/icon';
import { HarmonizerService } from '../../core/services/harmonizer.service';
import { NEW_OPTION, type HarmonizerSurvey } from '../../core/models/harmonizer.model';

@Component({
  selector: 'app-harmonizer-home',
  standalone: true,
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './harmonizer-home.html',
  styleUrl: './harmonizer-home.scss',
})
export class HarmonizerHome implements OnInit {
  readonly newOption = NEW_OPTION;

  readonly surveys = signal<HarmonizerSurvey[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  surveyName = '';
  surveyDescription = '';
  readonly creatingSurvey = signal(false);
  readonly createSurveyError = signal<string | null>(null);

  datasetName = '';
  datasetYear: number | null = new Date().getFullYear();
  uploadSurveyId: string = NEW_OPTION;
  newSurveyName = '';
  file: File | null = null;
  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  constructor(
    private readonly harmonizerService: HarmonizerService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const surveys = await this.harmonizerService.listSurveys();
      this.surveys.set(surveys);
      if (this.uploadSurveyId === NEW_OPTION && surveys.length > 0) {
        this.uploadSurveyId = surveys[0].id;
      }
    } catch (err: any) {
      this.loadError.set(err?.error?.message ?? 'No se pudieron cargar las encuestas.');
    } finally {
      this.loading.set(false);
    }
  }

  async createSurvey(): Promise<void> {
    const name = this.surveyName.trim();
    if (!name) {
      return;
    }
    this.creatingSurvey.set(true);
    this.createSurveyError.set(null);
    try {
      await this.harmonizerService.createSurvey(name, this.surveyDescription.trim() || undefined);
      this.surveyName = '';
      this.surveyDescription = '';
      await this.reload();
    } catch (err: any) {
      this.createSurveyError.set(err?.error?.message ?? 'No se pudo crear la encuesta.');
    } finally {
      this.creatingSurvey.set(false);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  canUpload(): boolean {
    if (!this.file || !this.datasetName.trim() || !this.datasetYear) {
      return false;
    }
    return this.uploadSurveyId !== NEW_OPTION || this.newSurveyName.trim() !== '';
  }

  async upload(): Promise<void> {
    if (!this.canUpload() || !this.file || !this.datasetYear) {
      return;
    }
    this.uploading.set(true);
    this.uploadError.set(null);
    try {
      const { datasetId } = await this.harmonizerService.upload({
        name: this.datasetName.trim(),
        year: this.datasetYear,
        surveyId: this.uploadSurveyId,
        newSurvey: this.uploadSurveyId === NEW_OPTION ? this.newSurveyName.trim() : undefined,
        file: this.file,
      });
      await this.router.navigate(['/harmonizer', 'datasets', datasetId, 'mapping']);
    } catch (err: any) {
      this.uploadError.set(err?.error?.message ?? 'No se pudo subir el CSV.');
    } finally {
      this.uploading.set(false);
    }
  }
}
