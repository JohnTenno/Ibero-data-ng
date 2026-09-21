import type { HTMLAttributes } from 'react';
import { SearchField } from 'sectei-library';
import { PortalBreadcrumbs, type PortalBreadcrumbItem } from '../../shared/portal/portal-breadcrumbs/PortalBreadcrumbs';
import { usePortalSearchHeader, type PortalSortOption } from './usePortalSearchHeader';
import './portal-search-header.css';

export interface PortalSearchHeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  breadcrumbs?: PortalBreadcrumbItem[];
  searchLabel?: string;
  catalog?: unknown[];
  onFilter?: (filtered: unknown[]) => void;
  onSearch?: (query: string, filtered: unknown[]) => void;
  sortLabel?: string;
  sortOptions?: PortalSortOption[];
  sort?: string;
  onSortChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PortalSearchHeader({
  title = '',
  breadcrumbs = [],
  searchLabel = 'Buscar...',
  catalog = [],
  onFilter,
  onSearch,
  sortLabel = 'Ordenar por:',
  sortOptions = [
    { value: 'relevancia', label: 'Relevancia' },
    { value: 'az', label: 'De la A a la Z' },
    { value: 'za', label: 'De la Z a la A' },
  ],
  sort: controlledSort,
  onSortChange,
  disabled = false,
  className = '',
  ...rest
}: PortalSearchHeaderProps) {
  const { titleId, sortId, sort, handleSortChange, classes } = usePortalSearchHeader({
    sortOptions,
    controlledSort,
    onSortChange,
    className,
  });

  return (
    <header className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      <div className="container width-fixed search-header__frame">
        <PortalBreadcrumbs items={breadcrumbs} className="text-size-2 m-b-3 hidden-mobile" />

        <div className="search-header__content">
          {title ? (
            <h1 id={titleId} className="search-header__title m-t-0">
              {title}
            </h1>
          ) : null}

          <div className="search-header__controls">
            <div className="search-header__search">
              <SearchField catalog={catalog} placeholder={searchLabel} disabled={disabled} onFilter={onFilter} onSearch={onSearch} />
            </div>

            {sortOptions.length > 0 ? (
              <div className="search-header__sort">
                <label htmlFor={sortId}>{sortLabel}</label>
                <select id={sortId} value={sort} disabled={disabled} onChange={(event) => handleSortChange(event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
