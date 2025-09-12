import { useCallback, useEffect, useRef, useState } from 'react';
import { useList, UseListActions } from './useList';

type RunActionParams<R = unknown> = {
  inLocal?: () => void | Promise<void>;
  inServer?: () => R | Promise<R>;
  onSuccess?: (result: R) => void;
  onError?: (error: Error) => void;
  rollback?: boolean; // default true
};

export interface UseServerListOptions<T> {
  fetchAll: () => Promise<T[]>;
  getId: (item: T) => string | number;
  initialItems?: T[];
}

export interface UseServerListResult<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  runAction: <R = unknown>(params: RunActionParams<R>) => Promise<R | undefined>;
  local: UseListActions<T>;
}

export function useServerList<T>(opts: UseServerListOptions<T>): UseServerListResult<T> {
  const { fetchAll, getId, initialItems } = opts;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const localState = useList<T>({ initialItems: initialItems ?? [], getId });
  const { items, setAll } = localState;

  // TRACKED REFERENCES
  const itemsRef = useRef<T[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const fetchAllRef = useRef(fetchAll);
  useEffect(() => {
    fetchAllRef.current = fetchAll;
  }, [fetchAll]);

  // RUN ACTION
  const runAction = useCallback(
    async <R>({
      inLocal,
      inServer,
      onSuccess,
      onError,
      rollback = true,
    }: RunActionParams<R>): Promise<R | undefined> => {
      const prev = [...itemsRef.current];
      try {
        if (inLocal) await inLocal();
        let result: R | undefined;
        if (inServer) result = await inServer();
        if (onSuccess) onSuccess(result as R);
        return result;
      } catch (error) {
        if (rollback) setAll(prev);
        if (onError) onError(error as Error);
        throw error;
      }
    },
    [setAll]
  );

  // REFRESH
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRef.current();
      setAll(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [setAll]);

  // FIRST RENDER LOAD HANDLER
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setLoading(false);
      return;
    }
    refresh();
  }, [initialItems, refresh]);

  return {
    items,
    loading,
    error,
    refresh,
    runAction,
    local: localState,
  };
}
