import { Icon } from '../icon/Icon';
import { useCampoBusqueda } from './useCampoBusqueda';
import './campo-busqueda.scss';

interface Props<T extends object> {
  catalogo: T[];
  propiedadBusqueda?: string;
  etiqueta?: string;
  idCampo?: string;
  deshabilitado?: boolean;
  onFiltrar?: (filtrados: T[]) => void;
  onBuscar?: (resultado: { texto: string; filtrados: T[] }) => void;
}

export function CampoBusqueda<T extends object>({
  catalogo,
  propiedadBusqueda = 'nombre',
  etiqueta = 'Buscar...',
  idCampo = 'campo-busqueda',
  deshabilitado = false,
  onFiltrar,
  onBuscar,
}: Props<T>) {
  const { texto, entradaRef, alCambiar, limpiar, buscar, mostrarBorrar } = useCampoBusqueda({
    catalogo,
    propiedadBusqueda,
    deshabilitado,
    onFiltrar,
    onBuscar,
  });

  return (
    <div className="c-campo-busqueda">
      <form className="campo-busqueda" onSubmit={buscar}>
        <label className="a11y-solo-lectura" htmlFor={idCampo}>
          Campo de búsqueda
        </label>

        <input
          ref={entradaRef}
          id={idCampo}
          type="search"
          className="campo-busqueda-entrada"
          placeholder={etiqueta}
          value={texto}
          onChange={(e) => alCambiar(e.target.value)}
          name="campo-busqueda"
          autoComplete="off"
          disabled={deshabilitado}
        />

        {mostrarBorrar && (
          <button
            type="button"
            className="boton boton-pictograma boton-sin-contenedor-secundario campo-busqueda-borrar"
            aria-label="Borrar"
            disabled={deshabilitado}
            onClick={limpiar}
          >
            <Icon name="x" size={18} />
          </button>
        )}

        <button
          type="submit"
          className="boton boton-primario boton-pictograma campo-busqueda-buscar"
          aria-label="Buscar"
          disabled={deshabilitado}
        >
          <Icon name="search" size={18} />
        </button>
      </form>
    </div>
  );
}
