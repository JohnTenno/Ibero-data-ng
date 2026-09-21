import type { HTMLAttributes } from 'react';
import { Button } from 'sectei-library';
import { PortalGridViewIcon } from '../../shared/portal/portal-grid-view-icon/PortalGridViewIcon';
import { PortalDataCard, type PortalDataCardProps } from '../../shared/portal/portal-data-card/PortalDataCard';
import { usePortalDataResultsSection } from './usePortalDataResultsSection';
import './portal-data-results-section.css';

export interface PortalDataResultItem extends PortalDataCardProps {
  id?: string | number;
  key?: string;
}

export interface PortalDataResultsSectionProps extends HTMLAttributes<HTMLElement> {
  total?: number;
  lastUpdated?: string;
  items?: PortalDataResultItem[];
  countLabel?: string;
  className?: string;
}

export function PortalDataResultsSection({
  total,
  lastUpdated = '',
  items = [],
  countLabel = 'Datos disponibles',
  className = '',
  ...rest
}: PortalDataResultsSectionProps) {
  const { titleId, count, classes } = usePortalDataResultsSection({ total, items, className });

  return (
    <section className={classes} aria-labelledby={titleId} {...rest}>
      <div className="data-results-section__header">
        <div className="data-results-section__info">
          <h2 id={titleId} className="data-results-section__title">
            {count} {countLabel}
          </h2>
          {lastUpdated ? <p className="data-results-section__updated">Última actualización: {lastUpdated}</p> : null}
        </div>

        <div className="data-results-section__views">
          <Button
            type="button"
            variant="primary"
            size="small"
            iconOnly
            aria-label="Vista de cuadrícula"
            aria-pressed={true}
            className="data-results-section__view data-results-section__view--active"
          >
            <PortalGridViewIcon className="data-results-section__icon" />
          </Button>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="data-results-section__list data-results-section__list--grid">
          {items.map((item, index) => {
            const { id, key, className: cardClassName, ...cardProps } = item;

            return (
              <PortalDataCard
                key={key ?? id ?? `item-${index}`}
                className={['data-results-section__card', cardClassName].filter(Boolean).join(' ')}
                {...cardProps}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-color-secondary" aria-live="polite">
          No hay datos disponibles.
        </p>
      )}
    </section>
  );
}
