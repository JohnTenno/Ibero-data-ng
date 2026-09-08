import './icon.scss';

const PICTOGRAMAS: Record<string, string> = {
  compass: 'pictograma-explorar',
  layers: 'pictograma-capas',
  users: 'pictograma-grupo',
  user: 'pictograma-persona',
  search: 'pictograma-buscar',
  x: 'pictograma-cerrar',
  'chevron-left': 'pictograma-angulo-izquierdo',
  'chevron-right': 'pictograma-angulo-derecho',
  'log-out': 'pictograma-cerrar-sesion',
  plus: 'pictograma-agregar',
  trash: 'pictograma-eliminar',
  accessibility: 'pictograma-accesibilidad',
  type: 'pictograma-cambio-tipografia',
  link: 'pictograma-enlace-subrayado',
  'align-left': 'pictograma-vista-simplificada',
  moon: 'pictograma-contraste',
  database: 'pictograma-documento',
  'bar-chart': 'pictograma-nivel',
};

interface Props {
  name?: string;
  size?: number;
  className?: string;
}

export function Icon({ name = 'compass', size = 20, className }: Props) {
  const clase = name.startsWith('pictograma-') ? name : (PICTOGRAMAS[name] ?? 'pictograma-ayuda');
  return (
    <span
      className={className ? `app-icon ${className}` : 'app-icon'}
      style={{ fontSize: `${size}px` }}
    >
      <span className={clase} aria-hidden="true" />
    </span>
  );
}
