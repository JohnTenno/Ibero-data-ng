import './icon.css';

/** Lucide-style aliases → sectei-library pictogram classes. */
const PICTOGRAMS: Record<string, string> = {
  compass: 'pictogram-explore',
  layers: 'pictogram-layers',
  users: 'pictogram-group',
  user: 'pictogram-person',
  search: 'pictogram-search',
  x: 'pictogram-close',
  'chevron-left': 'pictogram-angle-left',
  'chevron-right': 'pictogram-angle-right',
  'log-out': 'pictogram-close-session',
  plus: 'pictogram-add',
  trash: 'pictogram-delete',
  accessibility: 'pictogram-accessibility',
  type: 'pictogram-change-typography',
  link: 'pictogram-link-underline',
  'align-left': 'pictogram-view-simplified',
  moon: 'pictogram-contrast',
  database: 'pictogram-document',
  'bar-chart': 'pictogram-level',
};

interface Props {
  name?: string;
  size?: number;
  className?: string;
}

export function Icon({ name = 'compass', size = 20, className }: Props) {
  const pictogramClass = name.startsWith('pictogram-')
    ? name
    : (PICTOGRAMS[name] ?? 'pictogram-help');

  return (
    <span
      className={['app-icon', pictogramClass, className].filter(Boolean).join(' ')}
      style={{ fontSize: `${size}px` }}
      aria-hidden="true"
    />
  );
}
