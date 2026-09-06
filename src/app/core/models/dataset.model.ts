export type DatasetVisibility = 'PUBLIC' | 'PRIVATE';

export type Survey = 'ENIGH' | 'ENOE' | 'INPC' | 'ENADID' | 'ENVIPE' | 'CENSO' | 'ENDUTIH' | 'OTRA';

export const SURVEY_OPTIONS: { value: Survey; label: string }[] = [
  { value: 'ENIGH', label: 'ENIGH — Encuesta Nacional de Ingresos y Gastos de los Hogares' },
  { value: 'ENOE', label: 'ENOE — Encuesta Nacional de Ocupación y Empleo' },
  { value: 'INPC', label: 'INPC — Índice Nacional de Precios al Consumidor' },
  { value: 'ENADID', label: 'ENADID — Encuesta Nacional de la Dinámica Demográfica' },
  { value: 'ENVIPE', label: 'ENVIPE — Encuesta Nacional de Victimización y Percepción de Seguridad' },
  { value: 'CENSO', label: 'Censo de Población y Vivienda' },
  { value: 'ENDUTIH', label: 'ENDUTIH — Encuesta sobre Disponibilidad y Uso de TIC en Hogares' },
  { value: 'OTRA', label: 'Otra encuesta / programa' },
];

export type PeriodType = 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'BIANNUAL' | 'ONE_TIME' | 'MULTIYEAR';

export const PERIOD_TYPE_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'ANNUAL', label: 'Anual' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'BIANNUAL', label: 'Semestral' },
  { value: 'ONE_TIME', label: 'Único (levantamiento puntual)' },
  { value: 'MULTIYEAR', label: 'Multi-año' },
];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  _count?: { datasets: number; members: number };
}

export interface DatasetRef {
  id: string;
  title: string;
  slug: string;
  revision: number;
}

export interface Dataset {
  id: string;
  organizationId: string;
  ownerId: string;
  title: string;
  slug: string;
  description?: string | null;
  visibility: DatasetVisibility;

  survey?: Survey | null;
  year?: number | null;
  periodType?: PeriodType | null;
  sourceOrg?: string | null;
  sourceUrl?: string | null;
  tags: string[];
  licenseId?: string | null;

  revision: number;
  revisionOfId?: string | null;
  revisionOf?: DatasetRef | null;
  revisions?: DatasetRef[];
  changelog?: string | null;
  supersededById?: string | null;
  supersededBy?: DatasetRef | null;

  createdAt: string;
  updatedAt: string;
  organization?: { id: string; name: string; slug: string };
}
