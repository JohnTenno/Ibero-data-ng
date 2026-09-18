import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  DatasetHarmonizedView,
  ExportFormat,
  HarmonizerDataset,
  HarmonizerSurvey,
  MappingChoice,
  MappingInfo,
  SurveyHarmonizedView,
} from '../models/harmonizer.model';

export interface UploadDatasetPayload {
  name: string;
  year: number;
  surveyId: string;
  newSurvey?: string;
  file: File;
}

@Injectable({ providedIn: 'root' })
export class HarmonizerService {
  private readonly base = `${environment.apiUrl}/harmonizer`;

  constructor(private readonly http: HttpClient) {}

  listSurveys(): Promise<HarmonizerSurvey[]> {
    return firstValueFrom(this.http.get<HarmonizerSurvey[]>(`${this.base}/surveys`));
  }

  createSurvey(name: string, description?: string): Promise<Omit<HarmonizerSurvey, 'datasets'>> {
    return firstValueFrom(
      this.http.post<Omit<HarmonizerSurvey, 'datasets'>>(`${this.base}/surveys`, {
        name,
        description,
      }),
    );
  }

  upload(
    payload: UploadDatasetPayload,
  ): Promise<{ datasetId: string; dataset: HarmonizerDataset }> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('year', String(payload.year));
    formData.append('surveyId', payload.surveyId);
    if (payload.newSurvey) {
      formData.append('newSurvey', payload.newSurvey);
    }
    formData.append('file', payload.file);
    return firstValueFrom(
      this.http.post<{ datasetId: string; dataset: HarmonizerDataset }>(
        `${this.base}/upload`,
        formData,
      ),
    );
  }

  mapping(datasetId: string): Promise<MappingInfo> {
    return firstValueFrom(this.http.get<MappingInfo>(`${this.base}/datasets/${datasetId}/mapping`));
  }

  saveMapping(
    datasetId: string,
    columns: MappingChoice[],
  ): Promise<{ ok: true; datasetId: string }> {
    return firstValueFrom(
      this.http.put<{ ok: true; datasetId: string }>(`${this.base}/datasets/${datasetId}/mapping`, {
        columns,
      }),
    );
  }

  datasetHarmonized(datasetId: string): Promise<DatasetHarmonizedView> {
    return firstValueFrom(
      this.http.get<DatasetHarmonizedView>(`${this.base}/datasets/${datasetId}/harmonized`),
    );
  }

  surveyHarmonized(surveyId: string, variables: string[]): Promise<SurveyHarmonizedView> {
    return firstValueFrom(
      this.http.get<SurveyHarmonizedView>(`${this.base}/surveys/${surveyId}/harmonized`, {
        params: this.variablesParams(variables),
      }),
    );
  }

  async downloadDataset(
    datasetId: string,
    format: ExportFormat,
    fallbackName: string,
  ): Promise<void> {
    await this.download(
      `${this.base}/datasets/${datasetId}/harmonized.${format}`,
      new HttpParams(),
      `${fallbackName}.${format}`,
    );
  }

  async downloadSurvey(
    surveyId: string,
    format: ExportFormat,
    variables: string[],
    fallbackName: string,
  ): Promise<void> {
    await this.download(
      `${this.base}/surveys/${surveyId}/harmonized.${format}`,
      this.variablesParams(variables),
      `${fallbackName}.${format}`,
    );
  }

  private variablesParams(variables: string[]): HttpParams {
    let params = new HttpParams();
    for (const v of variables) {
      params = params.append('variables', v);
    }
    return params;
  }

  private async download(url: string, params: HttpParams, fallbackName: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.get(url, { params, responseType: 'blob', observe: 'response' }),
    );
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName;
    const objectUrl = URL.createObjectURL(response.body ?? new Blob());
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }
}
