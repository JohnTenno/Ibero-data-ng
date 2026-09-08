import { useEffect, useMemo, useState } from 'react';
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset } from '../../core/models/dataset.model';
import type { Miga } from '../shared/page-header/PageHeader';

export type Orden = 'recientes' | 'titulo-asc' | 'titulo-desc' | 'anio-desc' | 'anio-asc';

export const MIGAS: Miga[] = [
  { etiqueta: 'Inicio', href: '/dashboard' },
  { etiqueta: 'Conjuntos de datos' },
];

export const OPCIONES_ORDEN: { valor: Orden; etiqueta: string }[] = [
  { valor: 'recientes', etiqueta: 'Más recientes' },
  { valor: 'titulo-asc', etiqueta: 'Título (A–Z)' },
  { valor: 'titulo-desc', etiqueta: 'Título (Z–A)' },
  { valor: 'anio-desc', etiqueta: 'Año (más reciente)' },
  { valor: 'anio-asc', etiqueta: 'Año (más antiguo)' },
];

const POR_PAGINA = 3;

function ordenar(lista: Dataset[], criterio: Orden): Dataset[] {
  const copia = [...lista];
  const porTitulo = (a: Dataset, b: Dataset) =>
    a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });

  switch (criterio) {
    case 'titulo-asc':
      return copia.sort(porTitulo);
    case 'titulo-desc':
      return copia.sort((a, b) => b.title.localeCompare(a.title, 'es', { sensitivity: 'base' }));
    case 'anio-asc':
      return copia.sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || porTitulo(a, b));
    case 'anio-desc':
      return copia.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || porTitulo(a, b));
    case 'recientes':
    default:
      return copia.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

export function useDatasetsList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filtradosBusqueda, setFiltradosBusqueda] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState<Orden>('recientes');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let vigente = true;
    (async () => {
      try {
        const lista = await datasetsService.listAll();
        if (!vigente) return;
        setDatasets(lista);
        setFiltradosBusqueda(lista);
      } finally {
        if (vigente) setLoading(false);
      }
    })();
    return () => {
      vigente = false;
    };
  }, []);

  const visibles = useMemo(() => ordenar(filtradosBusqueda, orden), [filtradosBusqueda, orden]);
  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));

  const paginaItems = useMemo(() => {
    const actual = Math.min(pagina, totalPaginas);
    const inicio = (actual - 1) * POR_PAGINA;
    return visibles.slice(inicio, inicio + POR_PAGINA);
  }, [visibles, pagina, totalPaginas]);

  const numerosPagina = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  const irA = (destino: number) => setPagina(Math.min(Math.max(1, destino), totalPaginas));

  const alFiltrar = (items: Dataset[]) => {
    setFiltradosBusqueda(items);
    setPagina(1);
  };

  const alCambiarOrden = (valor: Orden) => {
    setOrden(valor);
    setPagina(1);
  };

  return {
    datasets,
    loading,
    orden,
    pagina,
    totalPaginas,
    paginaItems,
    numerosPagina,
    irA,
    alFiltrar,
    alCambiarOrden,
  };
}
