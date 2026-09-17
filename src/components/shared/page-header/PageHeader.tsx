import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './page-header.css';

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  action?: ReactNode;
}

export function PageHeader({
  title = '',
  intro = '',
  crumbs = [],
  action = null,
  className = '',
  ...rest
}: PageHeaderProps) {
  const autoId = useId();
  const titleId = `page-header-title-${autoId}`;
  const classes = ['page-header', action ? 'page-header--with-action' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      <div className="container width-fixed page-header__frame p-y-3">
        {crumbs.length > 0 ? (
          <nav
            className="header__crumbs text-size-2 m-b-3 hidden-mobile"
            aria-label="Ruta de navegación"
          >
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const content = crumb.href ? (
                <Link to={crumb.href}>{crumb.label}</Link>
              ) : (
                <strong aria-current={isLast ? 'page' : undefined}>{crumb.label}</strong>
              );

              return (
                <span key={`${crumb.label}-${index}`}>
                  {index > 0 ? ' / ' : null}
                  {content}
                </span>
              );
            })}
          </nav>
        ) : null}

        {title || intro || action ? (
          <div
            className={
              action ? 'page-header__row' : 'width-read align-centered text-centered'
            }
          >
            {title || intro ? (
              <div className={action ? 'page-header__text' : undefined}>
                {title ? (
                  <h1 id={titleId} className="m-t-0 m-b-3">
                    {title}
                  </h1>
                ) : null}
                {intro ? (typeof intro === 'string' ? <p className="m-0">{intro}</p> : intro) : null}
              </div>
            ) : null}

            {action ? <div className="page-header__action">{action}</div> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
