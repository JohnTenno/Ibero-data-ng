import type { HorizontalCardProps } from '../components/shared/horizontal-card/HorizontalCard';

/**
 * Prototype catalog mock (from prototipo-intermediario `tarjetaHorizontal.js`).
 * Front-end only — does not call the real API.
 * Code/keys in English; visible content in Spanish.
 */
export type MockDatasetCard = HorizontalCardProps & { id: string };

export const MOCK_DATASET_CARDS: MockDatasetCard[] = [
  {
    id: 'enadis-asistencia',
    title: 'Asistencia escolar, motivo de abandono, alfabetismo',
    label: 'Educación',
    source: 'ENADIS (Encuesta Nacional sobre Discriminación)',
    year: 2022,
    institution: 'INEGI, CONAPRED, CNDH',
    dataset: {
      label: 'Encuesta Nacional sobre Discriminación 2022',
      href: 'https://www.inegi.org.mx/',
      external: true,
    },
    updated: '23 de junio 2022',
    visualizations: [
      { type: 'bars', label: 'Gráfica de barras' },
      { type: 'lines', label: 'Gráfica de líneas' },
    ],
  },
  {
    id: 'gasto-hogar',
    title: 'Gasto de los hogares (trimestre)',
    label: 'Economía',
    source: 'ENIGH',
    year: 2022,
    institution: 'INEGI',
    dataset: {
      label: 'Encuesta Nacional de Ingresos y Gastos de los Hogares 2022',
      href: 'https://www.inegi.org.mx/',
      external: true,
    },
    updated: '15 de marzo 2023',
    visualizations: [{ type: 'bars', label: 'Gráfica de barras' }],
  },
  {
    id: 'padron-osc',
    title: 'Padrón de organizaciones de sociedad civil',
    label: 'Sociedad civil',
    source: 'Social Data Ibero',
    year: 2025,
    institution: 'Social Data Ibero',
    dataset: {
      label: 'Padrón OSC México',
      href: 'https://socialdata.ibero.mx',
      external: true,
    },
    updated: '4 de enero 2025',
    visualizations: [
      { type: 'bars', label: 'Gráfica de barras' },
      { type: 'dots', label: 'Gráfica de puntos' },
    ],
  },
  {
    id: 'salud-mental',
    title: 'Indicadores de salud mental y discriminación',
    label: 'Educación',
    source: 'ENADIS',
    year: 2022,
    institution: 'INEGI, CONAPRED',
    dataset: {
      label: 'ENADIS 2022 — módulo salud',
      href: 'https://www.inegi.org.mx/',
      external: true,
    },
    updated: '10 de agosto 2022',
    visualizations: [{ type: 'lines', label: 'Gráfica de líneas' }],
  },
  {
    id: 'empleo-joven',
    title: 'Empleo juvenil y condiciones laborales',
    label: 'Economía',
    source: 'ENOE',
    year: 2023,
    institution: 'INEGI',
    dataset: {
      label: 'ENOE 2023',
      href: 'https://www.inegi.org.mx/',
      external: true,
    },
    updated: '2 de febrero 2024',
    visualizations: [
      { type: 'bars', label: 'Gráfica de barras' },
      { type: 'lines', label: 'Gráfica de líneas' },
    ],
  },
  {
    id: 'vivienda-urbana',
    title: 'Acceso a vivienda en zonas urbanas',
    label: 'Sociedad civil',
    source: 'Social Data Ibero',
    year: 2025,
    institution: 'Social Data Ibero, CNDH',
    dataset: {
      label: 'Vivienda urbana 2025',
      href: 'https://socialdata.ibero.mx',
      external: true,
    },
    updated: '20 de enero 2025',
    visualizations: [{ type: 'dots', label: 'Gráfica de puntos' }],
  },
];
