import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './page-header.scss';

export interface Miga {
  etiqueta: string;
  href?: string;
}

interface Props {
  titulo?: string;
  intro?: string;
  migas?: Miga[];
  conAccion?: boolean;
  children?: ReactNode;
}

export function PageHeader({
  titulo = '',
  intro = '',
  migas = [],
  conAccion = false,
  children,
}: Props) {
  return (
    <div className="c-page-header">
      <header
        className={`page-header${conAccion ? ' page-header--con-accion' : ''}`}
        aria-labelledby={titulo ? 'page-header-titulo' : undefined}
      >
        <div className="page-header__marco">
          {migas.length > 0 && (
            <nav className="page-header__migas" aria-label="Ruta de navegación">
              {migas.map((miga, i) => (
                <span key={miga.etiqueta}>
                  {i > 0 && <span aria-hidden="true"> / </span>}
                  {miga.href ? (
                    <Link to={miga.href}>{miga.etiqueta}</Link>
                  ) : (
                    <strong aria-current={i === migas.length - 1 ? 'page' : undefined}>
                      {miga.etiqueta}
                    </strong>
                  )}
                </span>
              ))}
            </nav>
          )}

          {(titulo || intro || conAccion) && (
            <div className="page-header__fila">
              {(titulo || intro) && (
                <div className="page-header__texto">
                  {titulo && (
                    <h1 id="page-header-titulo" className="page-header__titulo">
                      {titulo}
                    </h1>
                  )}
                  {intro && <p className="page-header__intro">{intro}</p>}
                </div>
              )}

              <div className="page-header__accion" hidden={!conAccion}>
                {children}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
