import { useCallback, useState } from 'react';

interface UseListOptions<T> {
  initialItems: T[];
  getId: (item: T) => string | number;
}

export interface UseListActions<T> {
  create: (newItem: T) => void;
  update: (updatedItem: T) => void;
  remove: (itemToDelete: T) => void;
  setAll: (items: T[]) => void;
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

  // Set all items at once, useful for initial load or bulk updates
  const setAll = useCallback((list: T[]) => {
    setItems(list);
  }, []);

  return {
    items,
    create,
    update,
    remove,
    setAll,
  };
}
