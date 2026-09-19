import type {
  DatasetHarmonizedView,
  MappingInfo,
  SurveyHarmonizedView,
  HarmonizerSurvey,
} from '../core/models/harmonizer.model';

export const MOCK_HARMONIZER_SURVEYS: HarmonizerSurvey[] = [
  {
    id: 'survey-enigh',
    name: 'Socioeconómica (ENIGH)',
    description: 'Encuesta nacional de ingresos y gastos de los hogares — variables de edad e ingreso.',
    datasets: [
      {
        id: 'ds-enigh-2020',
        name: 'ENIGH 2020',
        year: 2020,
        rowCount: 4,
        mappedColumns: 3,
        totalColumns: 4,
      },
      {
        id: 'ds-enigh-2022',
        name: 'ENIGH 2022',
        year: 2022,
        rowCount: 4,
        mappedColumns: 2,
        totalColumns: 4,
      },
    ],
  },
  {
    id: 'survey-enadis',
    name: 'Discriminación (ENADIS)',
    description: null,
    datasets: [
      {
        id: 'ds-enadis-2022',
        name: 'ENADIS 2022',
        year: 2022,
        rowCount: 3,
        mappedColumns: 0,
        totalColumns: 3,
      },
    ],
  },
];

export const MOCK_MAPPING_BY_DATASET: Record<string, MappingInfo> = {
  'ds-enigh-2020': {
    dataset: {
      id: 'ds-enigh-2020',
      name: 'ENIGH 2020',
      year: 2020,
      surveyId: 'survey-enigh',
      surveyName: 'Socioeconómica (ENIGH)',
    },
    canonicalVariables: [
      { id: 'cv-age', name: 'edad' },
      { id: 'cv-sex', name: 'sexo' },
      { id: 'cv-income', name: 'ingreso_trimestral' },
      { id: 'cv-entity', name: 'entidad' },
    ],
    columns: [
      {
        name: 'age',
        selectedCanonicalId: 'cv-age',
        suggested: 'edad',
        suggestionSource: 'history',
      },
      {
        name: 'sex',
        selectedCanonicalId: 'cv-sex',
        suggested: 'sexo',
        suggestionSource: 'name',
      },
      {
        name: 'ingreso',
        selectedCanonicalId: 'cv-income',
        suggested: 'ingreso_trimestral',
        suggestionSource: 'history',
      },
      {
        name: 'folio',
        selectedCanonicalId: null,
        suggested: null,
        suggestionSource: null,
      },
    ],
  },
  'ds-enigh-2022': {
    dataset: {
      id: 'ds-enigh-2022',
      name: 'ENIGH 2022',
      year: 2022,
      surveyId: 'survey-enigh',
      surveyName: 'Socioeconómica (ENIGH)',
    },
    canonicalVariables: [
      { id: 'cv-age', name: 'edad' },
      { id: 'cv-sex', name: 'sexo' },
      { id: 'cv-income', name: 'ingreso_trimestral' },
      { id: 'cv-entity', name: 'entidad' },
    ],
    columns: [
      {
        name: 'edad1',
        selectedCanonicalId: 'cv-age',
        suggested: 'edad',
        suggestionSource: 'history',
      },
      {
        name: 'sexo',
        selectedCanonicalId: 'cv-sex',
        suggested: 'sexo',
        suggestionSource: 'name',
      },
      {
        name: 'ing_tot',
        selectedCanonicalId: null,
        suggested: 'ingreso_trimestral',
        suggestionSource: 'history',
      },
      {
        name: 'id_hogar',
        selectedCanonicalId: null,
        suggested: null,
        suggestionSource: null,
      },
    ],
  },
  'ds-enadis-2022': {
    dataset: {
      id: 'ds-enadis-2022',
      name: 'ENADIS 2022',
      year: 2022,
      surveyId: 'survey-enadis',
      surveyName: 'Discriminación (ENADIS)',
    },
    canonicalVariables: [
      { id: 'cv-age', name: 'edad' },
      { id: 'cv-discrimination', name: 'experiencia_discriminacion' },
    ],
    columns: [
      {
        name: 'edad',
        selectedCanonicalId: null,
        suggested: 'edad',
        suggestionSource: 'name',
      },
      {
        name: 'disc_exp',
        selectedCanonicalId: null,
        suggested: null,
        suggestionSource: null,
      },
      {
        name: 'ent',
        selectedCanonicalId: null,
        suggested: null,
        suggestionSource: null,
      },
    ],
  },
};

export const MOCK_DATASET_HARMONIZED: Record<string, DatasetHarmonizedView> = {
  'ds-enigh-2020': {
    dataset: {
      id: 'ds-enigh-2020',
      name: 'ENIGH 2020',
      year: 2020,
      surveyId: 'survey-enigh',
      surveyName: 'Socioeconómica (ENIGH)',
    },
    headers: ['edad', 'sexo', 'ingreso_trimestral'],
    availableVariables: ['edad', 'sexo', 'ingreso_trimestral'],
    selectedCount: 3,
    rows: [
      { edad: '34', sexo: 'M', ingreso_trimestral: '18500' },
      { edad: '28', sexo: 'F', ingreso_trimestral: '12200' },
      { edad: '51', sexo: 'M', ingreso_trimestral: '24800' },
      { edad: '41', sexo: 'F', ingreso_trimestral: '16300' },
    ],
  },
  'ds-enigh-2022': {
    dataset: {
      id: 'ds-enigh-2022',
      name: 'ENIGH 2022',
      year: 2022,
      surveyId: 'survey-enigh',
      surveyName: 'Socioeconómica (ENIGH)',
    },
    headers: ['edad', 'sexo'],
    availableVariables: ['edad', 'sexo'],
    selectedCount: 2,
    rows: [
      { edad: '36', sexo: 'M' },
      { edad: '29', sexo: 'F' },
      { edad: '48', sexo: 'F' },
      { edad: '55', sexo: 'M' },
    ],
  },
  'ds-enadis-2022': {
    dataset: {
      id: 'ds-enadis-2022',
      name: 'ENADIS 2022',
      year: 2022,
      surveyId: 'survey-enadis',
      surveyName: 'Discriminación (ENADIS)',
    },
    headers: [],
    availableVariables: [],
    selectedCount: 0,
    rows: [],
  },
};

export const MOCK_SURVEY_HARMONIZED: Record<string, SurveyHarmonizedView> = {
  'survey-enigh': {
    survey: { id: 'survey-enigh', name: 'Socioeconómica (ENIGH)' },
    headers: ['edad', 'sexo', 'ingreso_trimestral'],
    availableVariables: ['edad', 'sexo', 'ingreso_trimestral'],
    selected: ['edad', 'sexo', 'ingreso_trimestral'],
    selectedCount: 3,
    rows: [
      { _dataset: 'ENIGH 2020', _year: 2020, edad: '34', sexo: 'M', ingreso_trimestral: '18500' },
      { _dataset: 'ENIGH 2020', _year: 2020, edad: '28', sexo: 'F', ingreso_trimestral: '12200' },
      { _dataset: 'ENIGH 2022', _year: 2022, edad: '36', sexo: 'M', ingreso_trimestral: '' },
      { _dataset: 'ENIGH 2022', _year: 2022, edad: '29', sexo: 'F', ingreso_trimestral: '' },
    ],
  },
  'survey-enadis': {
    survey: { id: 'survey-enadis', name: 'Discriminación (ENADIS)' },
    headers: [],
    availableVariables: [],
    selected: [],
    selectedCount: 0,
    rows: [],
  },
};
