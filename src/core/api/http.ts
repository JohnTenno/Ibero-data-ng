import { environment } from '../../environments/environment';

const TOKEN_KEY = 'ibero_access_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: { message?: string } | null,
  ) {
    super(body?.message ?? `Error ${status}`);
    this.name = 'ApiError';
  }
}

export function mensajeDeError(err: unknown, respaldo: string): string {
  return err instanceof ApiError && err.body?.message ? err.body.message : respaldo;
}

interface Opciones {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(ruta: string, { method = 'GET', body, signal }: Opciones = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const esFormData = body instanceof FormData;
  if (body !== undefined && !esFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${environment.apiUrl}${ruta}`, {
    method,
    headers,
    signal,
    body: body === undefined ? undefined : esFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    let cuerpo: { message?: string } | null = null;
    try {
      cuerpo = (await res.json()) as { message?: string };
    } catch {
    }
    throw new ApiError(res.status, cuerpo);
  }

  if (res.status === 204) return undefined as T;
  const texto = await res.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

export const http = {
  get: <T>(ruta: string, signal?: AbortSignal) => request<T>(ruta, { signal }),
  post: <T>(ruta: string, body?: unknown) => request<T>(ruta, { method: 'POST', body }),
  patch: <T>(ruta: string, body?: unknown) => request<T>(ruta, { method: 'PATCH', body }),
  delete: <T>(ruta: string) => request<T>(ruta, { method: 'DELETE' }),
};
