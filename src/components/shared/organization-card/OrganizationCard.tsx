import type { HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import './organization-card.css';

function countLabel(count: number, singular: string, plural: string): string {
  const n = Number(count) || 0;
  return `${n} ${n === 1 ? singular : plural}`;
}

export interface OrganizationCardProps extends HTMLAttributes<HTMLElement> {
  name?: string;
  description?: string;
  type?: string;
  scope?: string;
  coverSrc?: string;
  coverAlt?: string;
  datasets?: number;
  members?: number;
  href?: string;
  layout?: 'vertical' | 'horizontal';
  compact?: boolean;
}

export function OrganizationCard({
  name = '',
  description = '',
  type: _type,
  scope: _scope,
  coverSrc = '',
  coverAlt,
  datasets = 0,
  members = 0,
  href,
  layout = 'vertical',
  compact = false,
  className = '',
  ...rest
}: OrganizationCardProps) {
  const isLink = Boolean(href);
  const isHorizontal = layout === 'horizontal';
  const classes = [
    'tarjeta',
    isLink ? 'card-hyperlink-inner' : '',
    'organization-card',
    isHorizontal ? 'organization-card--horizontal' : '',
    compact ? 'organization-card--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const alt = coverAlt === undefined ? '' : coverAlt || `Portada de ${name}`;

  const image = (
    <div className="organization-card__media" aria-hidden={coverSrc ? undefined : true}>
      {coverSrc ? (
        <img className="card-image" src={coverSrc} alt={alt} />
      ) : (
        <span className="card-image organization-card__cover-empty">
          <span className="pictogram-group" />
        </span>
      )}
    </div>
  );

  const metrics = (
    <p className="organization-card__metrics">
      <span
        className="organization-card__metric"
        title={countLabel(datasets, 'conjunto', 'conjuntos')}
      >
        <span className="pictogram-layers" aria-hidden="true" />
        <span className="a11y-sr-only">Conjuntos: </span>
        {Number(datasets) || 0}
      </span>
      <span
        className="organization-card__metric"
        title={countLabel(members, 'miembro', 'miembros')}
      >
        <span className="pictogram-group" aria-hidden="true" />
        <span className="a11y-sr-only">Miembros: </span>
        {Number(members) || 0}
      </span>
    </p>
  );

  const body = isHorizontal ? (
    <div className="card-body">
      <div className="organization-card__header">
        {name ? <p className="card-title organization-card__name">{name}</p> : null}
        {metrics}
      </div>
      {description ? <p className="organization-card__description">{description}</p> : null}
    </div>
  ) : (
    <div className="card-body">
      {name ? <p className="card-title">{name}</p> : null}
      {description ? <p className="organization-card__description">{description}</p> : null}
      <p className="organization-card__stat">
        <span className="pictogram-layers" aria-hidden="true" />
        {countLabel(datasets, 'conjunto', 'conjuntos')}
      </p>
      <p className="organization-card__stat">
        <span className="pictogram-group" aria-hidden="true" />
        {countLabel(members, 'miembro', 'miembros')}
      </p>
    </div>
  );

  const content = (
    <>
      {image}
      {body}
    </>
  );

  if (isLink && href) {
    return (
      <Link to={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <article className={classes} {...rest}>
      {content}
    </article>
  );
}
