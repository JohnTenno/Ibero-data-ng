import type { ReactNode } from 'react';
import { Card } from 'sectei-library';
import { usePortalDataCard } from './usePortalDataCard';
import './portal-data-card.css';

export interface PortalDataCardProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  label?: string;
  meta?: string;
  source?: string | number;
  year?: string | number;
  institutions?: string | number;
  href?: string;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function PortalDataCard({
  imageSrc,
  imageAlt = '',
  title = '',
  label = '',
  meta,
  source,
  year,
  institutions,
  href = '#',
  className = '',
  children,
  ...rest
}: PortalDataCardProps) {
  const { metaText, classes } = usePortalDataCard({ meta, source, year, institutions, className });

  return (
    <Card variant="link-inner" href={href} imageSrc={imageSrc} imageAlt={imageAlt} className={classes} {...rest}>
      {children ?? (
        <>
          {title ? <p className="card-title">{title}</p> : null}
          {label ? <span className="data-card__label">{label}</span> : null}
          {metaText ? <p className="data-card__meta">{metaText}</p> : null}
        </>
      )}
    </Card>
  );
}
