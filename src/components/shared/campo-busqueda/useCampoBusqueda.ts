import { useRef, useState, type FormEvent } from 'react';

export function normalizarTexto(texto: unknown): string {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function filtrarCatalogo<T extends object>(
  catalogo: T[],
  texto: string,
  propiedadBusqueda = 'nombre',
): T[] {
  const consulta = texto.trim();
  if (consulta.length < 1) {
    return catalogo;
  }

  const consultaNorm = normalizarTexto(consulta);
  return catalogo.filter((elemento) =>
    normalizarTexto((elemento as Record<string, unknown>)[propiedadBusqueda]).includes(consultaNorm),
  );
}

interface Opciones<T extends object> {
  catalogo: T[];
  propiedadBusqueda: string;
  deshabilitado: boolean;
  onFiltrar?: (filtrados: T[]) => void;
  onBuscar?: (resultado: { texto: string; filtrados: T[] }) => void;
}

export function useCampoBusqueda<T extends object>({
  catalogo,
  propiedadBusqueda,
  deshabilitado,
  onFiltrar,
  onBuscar,
}: Opciones<T>) {
  const [texto, setTexto] = useState('');
  const entradaRef = useRef<HTMLInputElement>(null);

  const obtenerFiltrados = (valor: string) => filtrarCatalogo(catalogo, valor, propiedadBusqueda);

  const alCambiar = (valor: string) => {
    if (deshabilitado) return;
    setTexto(valor);
    onFiltrar?.(obtenerFiltrados(valor));
  };

  const limpiar = () => {
    if (deshabilitado) return;
    setTexto('');
    onFiltrar?.(obtenerFiltrados(''));
    entradaRef.current?.focus();
  };

  const buscar = (event: FormEvent) => {
    event.preventDefault();
    if (deshabilitado) return;
    const filtrados = obtenerFiltrados(texto);
    onFiltrar?.(filtrados);
    onBuscar?.({ texto, filtrados });
  };

  return { texto, entradaRef, alCambiar, limpiar, buscar, mostrarBorrar: texto.trim().length > 0 };
}
