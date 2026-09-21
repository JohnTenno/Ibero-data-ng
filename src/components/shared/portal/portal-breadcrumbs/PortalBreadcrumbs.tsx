import { Link } from 'react-router-dom';
import './portal-breadcrumbs.css';

export interface PortalBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PortalBreadcrumbsProps {
  items?: PortalBreadcrumbItem[];
  className?: string;
}

export function PortalBreadcrumbs({ items = [], className = '' }: PortalBreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav className={['breadcrumbs', className].filter(Boolean).join(' ')} aria-label="Ruta de navegación">
      {items.map((crumb, index) => {
        const isLast = index === items.length - 1;
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
  );
}
