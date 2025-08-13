'use client';

import Toaster from '@/components/Toaster/Toaster';
import { createToaster, CreateToasterProps } from '@chakra-ui/react';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

type CreateToasterReturn = ReturnType<typeof createToaster>;

export type ToastOptions = Parameters<CreateToasterReturn['create']>[0];

export interface ToasterContextReturn {
  /** Create a generic toast and return your ID */
  open: (options: ToastOptions) => string;
  /** Create a toast linked to a promise */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: ToastOptions;
      success: ToastOptions;
      error: ToastOptions;
    }
  ) => void;
  /** Close a specific toast or all if no ID is passed */
  dismiss: (id?: string) => void;
  /** Pause the timeout of a specific toast */
  pause: (id: string) => void;
  /** Resume the timeout of a specific toast */
  resume: (id: string) => void;
}

export const ToasterContext = createContext<ToasterContextReturn | null>(null);

const defaultProps: CreateToasterProps = {
  placement: 'bottom-end',
  pauseOnPageIdle: true,
};

interface ToasterProviderProps {
  children?: ReactNode;
  config?: CreateToasterProps;
}

export const ToasterProvider = ({ children, config }: ToasterProviderProps) => {
  // Toaster instance
  const toaster = useMemo(() => createToaster({ ...defaultProps, ...config }), [config]);

  // Functions to handle toasts
  const open = useCallback((options: ToastOptions) => toaster.create(options), [toaster]);
  const dismiss = useCallback((id?: string) => toaster.dismiss(id), [toaster]);
  const pause = useCallback((id: string) => toaster.pause(id), [toaster]);
  const resume = useCallback((id: string) => toaster.resume(id), [toaster]);
  const promise = useCallback(
    <T,>(
      promise: Promise<T>,
      options: {
        loading: ToastOptions;
        success: ToastOptions;
        error: ToastOptions;
      }
    ) => toaster.promise(promise, options),
    [toaster]
  );

  const value = useMemo<ToasterContextReturn>(
    () => ({ open, promise, dismiss, pause, resume }),
    [open, promise, dismiss, pause, resume]
  );

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <Toaster toaster={toaster} />
    </ToasterContext.Provider>
  );
};
