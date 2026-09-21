import type { HTMLAttributes } from 'react';
import { PortalBreadcrumbs, type PortalBreadcrumbItem } from '../../shared/portal/portal-breadcrumbs/PortalBreadcrumbs';
import { usePortalDatasetHeader } from './usePortalDatasetHeader';
import './portal-dataset-header.css';

export interface PortalDatasetHeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  label?: string;
  source?: string;
  institution?: string;
  dataset?: { label: string; href: string } | null;
  lastUpdated?: string;
  breadcrumbs?: PortalBreadcrumbItem[];
  className?: string;
}

export function PortalDatasetHeader({
  title = '',
  label = '',
  source = '',
  institution = '',
  dataset = null,
  lastUpdated = '',
  breadcrumbs = [],
  className = '',
  ...rest
}: PortalDatasetHeaderProps) {
  const { titleId, classes, hasMeta } = usePortalDatasetHeader({ className, source, institution, dataset, lastUpdated });

  return (
    <header className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      <div className="container width-fixed dataset-header__frame">
        <PortalBreadcrumbs items={breadcrumbs} className="hidden-mobile" />

        <div className="dataset-header__body">
          <div className="dataset-header__main">
            {title ? (
              <div className="dataset-header__title-block">
                <h1 id={titleId} className="dataset-header__title">
                  {title}
                </h1>
                {label ? <span className="dataset-header__label">{label}</span> : null}
              </div>
            ) : label ? (
              <span className="dataset-header__label">{label}</span>
            ) : null}
          </div>

          {hasMeta ? (
            <dl className="dataset-header__meta">
              {source ? (
                <div className="dataset-header__meta-row">
                  <dt>Fuente:</dt>
                  <dd>{source}</dd>
                </div>
              ) : null}
              {institution ? (
                <div className="dataset-header__meta-row">
                  <dt>Institución:</dt>
                  <dd>{institution}</dd>
                </div>
              ) : null}
              {dataset?.label && dataset?.href ? (
                <div className="dataset-header__meta-row">
                  <dt>Dataset:</dt>
                  <dd>
                    <a className="hyperlink dataset-header__dataset" href={dataset.href} target="_blank" rel="noopener noreferrer">
                      {dataset.label}
                      <span className="pictogram-link-external" aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              ) : null}
              {lastUpdated ? (
                <div className="dataset-header__meta-row">
                  <dt>Última actualización:</dt>
                  <dd>{lastUpdated}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
      </div>
    </header>
  );
}
