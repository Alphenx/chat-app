import { useCallback, useState } from 'react';

interface UseListOptions<T> {
  initialItems: T[];
  getId: (item: T) => string | number;
}

export interface UseListActions<T> {
  create: (newItem: T) => void;
  update: (updatedItem: T) => void;
  remove: (itemToDelete: T) => void;
  setAll: (items: T[] | ((prevItems: T[]) => T[])) => void;
  append: (items: T[]) => void;
  prepend: (items: T[]) => void;
  insertAt: (item: T, index: number) => void;
  replace: (prevItemId: string, newItem: T) => void;
}

interface UseListResult<T> extends UseListActions<T> {
  items: T[];
}

export function useList<T>(options: UseListOptions<T>): UseListResult<T> {
  const { initialItems, getId } = options;
  const [items, setItems] = useState<T[]>(initialItems);

  // CREATE: Add a new item to the end of the array
  const create = useCallback((newItem: T) => {
    setItems((prev) => [...prev, newItem]);
  }, []);

  // UPDATE: Find by ID and replace
  const update = useCallback(
    (updatedItem: T) => {
      setItems((prev) => {
        const idx = prev.findIndex((e) => getId(e) === getId(updatedItem));
        if (idx === -1) return prev;
        const copy = [...prev];
        copy[idx] = updatedItem;
        return copy;
      });
    },
    [getId]
  );

  // DELETE: Find by ID and filter out
  const remove = useCallback(
    (itemToDelete: T) => {
      setItems((prev) => prev.filter((e) => getId(e) !== getId(itemToDelete)));
    },
    [getId]
  );

  const setAll = useCallback((items: T[] | ((prevItems: T[]) => T[])) => {
    setItems((prev) => {
      if (typeof items === 'function') return items(prev);
      return items;
    });
  }, []);

  const append = useCallback((items: T[]) => {
    setItems((prev) => [...prev, ...items]);
  }, []);

  const prepend = useCallback((items: T[]) => {
    setItems((prev) => [...items, ...prev]);
  }, []);

  const insertAt = useCallback((item: T, index: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(index, 0, item);
      return copy;
    });
  }, []);

  const replace = useCallback(
    (prevItemId: string, newItem: T) => {
      setItems((prev) => {
        const idx = prev.findIndex((e) => getId(e) === prevItemId);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy[idx] = newItem;
        return copy;
      });
    },
    [getId]
  );

  return {
    items,
    create,
    update,
    remove,
    setAll,
    append,
    prepend,
    insertAt,
    replace,
  };
}
