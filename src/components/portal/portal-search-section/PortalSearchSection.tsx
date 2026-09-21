import type { HTMLAttributes } from 'react';
import { SearchField } from 'sectei-library';
import { usePortalSearchSection } from './usePortalSearchSection';
import './portal-search-section.css';

export interface PortalSearchSectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  intro?: string;
  summary?: string;
  searchLabel?: string;
  catalog?: unknown[];
  disabled?: boolean;
  onFilter?: (filtered: unknown[]) => void;
  onSearch?: (query: string, filtered: unknown[]) => void;
  className?: string;
}

export function PortalSearchSection({
  title = '',
  intro = '',
  summary = '',
  searchLabel = 'Buscar...',
  catalog = [],
  disabled = false,
  onFilter,
  onSearch,
  className = '',
  ...rest
}: PortalSearchSectionProps) {
  const { titleId, classes } = usePortalSearchSection({ className });

  return (
    <section className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      <div className="search-section__content">
        {title ? (
          <h2 id={titleId} className="search-section__title">
            {title}
          </h2>
        ) : null}

        {intro ? <p className="search-section__intro">{intro}</p> : null}

        <div className="search-section__search">
          <SearchField catalog={catalog} placeholder={searchLabel} disabled={disabled} onFilter={onFilter} onSearch={onSearch} />
        </div>

        {summary ? <p className="search-section__summary">{summary}</p> : null}
      </div>
    </section>
  );
}
