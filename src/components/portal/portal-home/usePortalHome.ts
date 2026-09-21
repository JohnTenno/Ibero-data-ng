import cardMotif1 from '../../../assets/card-motif-1.png';
import cardMotif2 from '../../../assets/card-motif-2.png';
import cardMotif3 from '../../../assets/card-motif-3.png';
import type { PortalTopicCard } from '../portal-topics-section/PortalTopicsSection';

const TOPIC_CARDS: PortalTopicCard[] = [
  {
    id: 'educacion',
    imageSrc: cardMotif1,
    title: 'Educación',
    sources: 2,
    charts: 48,
    description: 'Asistencia escolar, motivo de abandono, alfabetismo, nivel, becas, crédito educativo.',
    sourcesLabel: 'ENADIS • ENIGH',
    buttonText: 'Ir a los datos',
  },
  {
    id: 'discapacidad',
    imageSrc: cardMotif2,
    title: 'Discapacidad',
    sources: 2,
    charts: 48,
    description: 'Dificultades funcionales y sus causas.',
    sourcesLabel: 'ENIGH',
    buttonText: 'Ir a los datos',
  },
  {
    id: 'discriminacion',
    imageSrc: cardMotif3,
    title: 'Discriminación percibida',
    sources: 2,
    charts: 48,
    description: 'Justificación de conductas, acuerdos políticos, política migratoria, conflictos vecinales.',
    sourcesLabel: 'ENADIS • ENIGH',
    buttonText: 'Ir a los datos',
  },
];

export function usePortalHome() {
  return { topicCards: TOPIC_CARDS };
}
