import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './page-header.scss';

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title?: string;
  intro?: string;
  crumbs?: Crumb[];
  withAction?: boolean;
  children?: ReactNode;
}

export function PageHeader({
  title = '',
  intro = '',
  crumbs = [],
  withAction = false,
  children,
}: Props) {
  return (
    <div className="c-page-header">
      <header
        className={`page-header${withAction ? ' page-header--with-action' : ''}`}
        aria-labelledby={title ? 'page-header-title' : undefined}
      >
        <div className="page-header__frame">
          {crumbs.length > 0 && (
            <nav className="page-header__crumbs" aria-label="Ruta de navegación">
              {crumbs.map((crumb, i) => (
                <span key={crumb.label}>
                  {i > 0 && <span aria-hidden="true"> / </span>}
                  {crumb.href ? (
                    <Link to={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <strong aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                      {crumb.label}
                    </strong>
                  )}
                </span>
              ))}
            </nav>
          )}

          {(title || intro || withAction) && (
            <div className="page-header__row">
              {(title || intro) && (
                <div className="page-header__text">
                  {title && (
                    <h1 id="page-header-title" className="page-header__title">
                      {title}
                    </h1>
                  )}
                  {intro && <p className="page-header__intro">{intro}</p>}
                </div>
              )}

              <div className="page-header__action" hidden={!withAction}>
                {children}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
