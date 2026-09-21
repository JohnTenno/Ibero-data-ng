import { useEffect, useState } from 'react';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function usePortalRequest<T>(
  request: (options: { signal: AbortSignal }) => Promise<T>,
  deps: unknown[] = [],
): RequestState<T> {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    request({ signal: controller.signal })
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active || (error as { name?: string })?.name === 'AbortError') return;
        setState({ data: null, loading: false, error: error as Error });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
