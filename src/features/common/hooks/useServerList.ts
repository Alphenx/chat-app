import { useCallback, useEffect, useRef, useState } from 'react';
import { useList } from './useList';

type RunActionParams = {
  inLocal?: () => Promise<unknown>;
  inServer?: () => Promise<unknown>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export interface UseServerListOptions<T> {
  fetchAll: () => Promise<T[]>;
  getId: (item: T) => string | number;
  create?: (item: T) => Promise<T>;
  update?: (item: T) => Promise<T>;
  remove?: (item: T) => Promise<void | boolean>;
}

export interface UseServerListResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (item: T) => Promise<void>;
  update: (item: T) => Promise<void>;
  remove: (item: T) => Promise<void>;
  runAction: (params: RunActionParams) => Promise<void>;
}

export function useServerList<T>(opts: UseServerListOptions<T>): UseServerListResult<T> {
  const {
    fetchAll,
    getId,
    create: createInServer,
    update: updateInServer,
    remove: removeFromServer,
  } = opts;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local state management
  const {
    items,
    create: createInLocal,
    update: updateInLocal,
    remove: removeFromLocal,
    setAll: setAllInLocal,
  } = useList<T>({ initialItems: [], getId });

  // Ref to keep the latest items for rollback
  const itemsRef = useRef<T[]>(items);
  const fetchAllRef = useRef(fetchAll);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    fetchAllRef.current = fetchAll;
  }, [fetchAll]);

  // RUN ACTION - GENERIC
  const runAction = useCallback(
    async ({ inLocal, inServer, onSuccess, onError }: RunActionParams) => {
      const prev = itemsRef.current;
      try {
        if (inLocal) await inLocal();
        if (inServer) await inServer();
        if (onSuccess) onSuccess();
      } catch (error) {
        setAllInLocal(prev); // Rollback
        if (onError) onError(error as Error);
        throw error;
      }
    },
    [setAllInLocal]
  );

  // CREATE
  const create = useCallback(
    async (item: T) => {
      const prev = itemsRef.current;
      createInLocal(item);
      if (!createInServer) return;
      try {
        const created = await createInServer(item);
        updateInLocal(created);
      } catch (error) {
        setAllInLocal(prev); // Rollback
        throw error;
      }
    },
    [createInServer, createInLocal, updateInLocal, setAllInLocal]
  );

  // READ
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRef.current();
      setAllInLocal(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [setAllInLocal]);

  // UPDATE
  const update = useCallback(
    async (item: T) => {
      const prev = itemsRef.current;
      updateInLocal(item);
      if (!updateInServer) return;
      try {
        const updated = await updateInServer(item);
        updateInLocal(updated);
      } catch (error) {
        setAllInLocal(prev); // Rollback
        throw error;
      }
    },
    [updateInServer, updateInLocal, setAllInLocal]
  );

  // DELETE
  const remove = useCallback(
    async (item: T) => {
      const prev = itemsRef.current;
      removeFromLocal(item);
      if (!removeFromServer) return;
      try {
        await removeFromServer(item);
      } catch (error) {
        setAllInLocal(prev); // Rollback
        throw error;
      }
    },
    [removeFromServer, removeFromLocal, setAllInLocal]
  );

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh, create, update, remove, runAction };
}
