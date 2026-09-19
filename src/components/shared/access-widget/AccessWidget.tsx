import type { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import './access-widget.css';

export interface AccessWidgetProps extends HTMLAttributes<HTMLAnchorElement> {
  title?: string;
  description?: string;
  meta?: string;
  href?: string;
  pictogram?: string;
}

/**
 * Sisdai quick-access card (Link + .tarjeta / .card-body).
 */
export function AccessWidget({
  title = '',
  description = '',
  meta = '',
  href = '#',
  pictogram = 'pictogram-explore',
  className = '',
  ...rest
}: AccessWidgetProps) {
  const classes = ['tarjeta', 'card-hyperlink-inner', 'access-widget', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={href} className={classes} {...rest}>
      <div className="card-body">
        <span className={`access-widget__pictogram ${pictogram}`} aria-hidden="true" />
        {title ? <p className="card-title">{title}</p> : null}
        {description ? <p className="access-widget__description">{description}</p> : null}
        {meta ? <p className="access-widget__meta">{meta}</p> : null}
      </div>
    </Link>
  );
}
