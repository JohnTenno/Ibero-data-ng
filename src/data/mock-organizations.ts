export type MockOrganizationCard = {
  id: string;
  name: string;
  description?: string;
  type?: string;
  scope?: string;
  coverSrc?: string;
  coverAlt?: string;
  datasets?: number;
  members?: number;
  href?: string;
};

export const MOCK_ORGANIZATION_CARDS: MockOrganizationCard[] = [
  {
    id: 'social-data-ibero',
    name: 'Social Data Ibero',
    description:
      'Laboratorio de datos de sociedad civil mexicana. Publica datasets abiertos y privados con acceso vía DuckDB.',
    type: 'Sociedad civil',
    scope: 'Nacional',
    coverSrc:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    datasets: 3,
    members: 12,
    href: '/organizations/social-data-ibero',
  },
  {
    id: 'centro-geo',
    name: 'CentroGeo',
    description:
      'Centro de investigación en ciencias de información geoespacial. Catálogos y análisis espaciales.',
    type: 'Centro de investigación',
    scope: 'Nacional',
    coverSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    datasets: 5,
    members: 8,
    href: '/organizations/centro-geo',
  },
  {
    id: 'osc-demo',
    name: 'OSC Demo México',
    description:
      'Organización de demostración para pruebas de publicación y permisos por rol.',
    type: 'Sociedad civil',
    scope: 'Local',
    coverSrc:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    datasets: 1,
    members: 2,
    href: '/organizations/osc-demo',
  },
  {
    id: 'ibero-cdmx',
    name: 'Universidad Iberoamericana',
    description:
      'Comunidad académica que comparte conjuntos de investigación y recursos docentes.',
    type: 'Academia',
    scope: 'Local',
    coverSrc:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    datasets: 7,
    members: 24,
    href: '/organizations/ibero-cdmx',
  },
];
