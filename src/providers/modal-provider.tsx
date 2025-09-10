import { createOverlay } from '@chakra-ui/react';
import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react';

export interface ModalContextReturn {
  /** Open a modal and resolve with the value passed to close(). */
  open: <T = unknown>(
    component: ReactNode | ((props: T) => ReactNode),
    id?: string
  ) => Promise<void>;
  /** Close a modal and resolve its promise with the given result. */
  close: <T = void>(id?: string, result?: T) => void;
  /** Update the props of an already opened modal. */
  update: <T = unknown>(component: ReactNode | ((props: T) => ReactNode), id?: string) => void;
  /** Get the internal overlay instance for inspection. */
  get: (id?: string) => ReturnType<typeof get>;
  /** Unmount a modal without resolving its promise. */
  remove: (id?: string) => void;
  /** Unmount all pending modals. */
  removeAll: () => void;
  /** Wait for a modal to finish its exit animation and get its result. */
  waitForExit: (id: string) => Promise<void>;
  /** Snapshot of all current overlays. */
  getSnapshot: () => ReturnType<typeof getSnapshot>;
}

export const ModalContext = createContext<ModalContextReturn | null>(null);

type ModalChild<T = unknown> = ReactNode | ((props: T) => ReactNode);

const { Viewport, open, close, update, get, remove, removeAll, waitForExit, getSnapshot } =
  createOverlay((props) => {
    const { children, ...rest } = props;
    return typeof children === 'function' ? children(rest) : children;
  });

const DEFAULT_ID = '__singleton_modal__';

export const ModalProvider = ({ children }: { children?: ReactNode }) => {
  const openOverlay = useCallback(
    <T,>(component: ModalChild<T>, id: string = DEFAULT_ID): Promise<void> => {
      return open(id, { children: component });
    },
    []
  );

  const closeOverlay = useCallback(<T,>(id: string = DEFAULT_ID, result?: T): void => {
    close(id, result);
  }, []);

  const updateOverlay = useCallback(
    <T,>(component: ModalChild<T>, id: string = DEFAULT_ID): void => {
      update(id, { children: component });
    },
    []
  );

  const contextValue = useMemo<ModalContextReturn>(
    () => ({
      open: openOverlay,
      close: closeOverlay,
      update: updateOverlay,
      get: (id: string = DEFAULT_ID) => get(id),
      remove: (id: string = DEFAULT_ID) => remove(id),
      removeAll,
      waitForExit,
      getSnapshot,
    }),
    [openOverlay, closeOverlay, updateOverlay]
  );

  useEffect(() => {
    return () => removeAll();
  }, []);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Viewport />
    </ModalContext.Provider>
  );
};
