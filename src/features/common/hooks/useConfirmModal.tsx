'use client';

import Modal, { ModalProps } from '@/components/Modal/Modal';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, Text } from '@chakra-ui/react';
import { cloneElement, isValidElement, ReactElement, ReactNode, useState } from 'react';
import { useModal } from './useModal';

export type ConfirmModalRenderProps<T = unknown> = ModalProps & {
  value?: T;
  // Handlers can optionally receive a value; when omitted, the original value is used
  onConfirm: (value?: T) => Promise<void>;
  onCancel: (value?: T) => void;
};

export type ConfirmModalContent<T> = ReactElement | ((props: ConfirmModalRenderProps<T>) => ReactNode);

// Bivariant handler to allow passing functions with narrower or wider parameter types
type Handler<T> = { handler(value: T | undefined): void | Promise<void> }['handler'];

interface UseConfirmModalProps<T = unknown> {
  handler?: Handler<T>;
  onCancelHandler?: Handler<T>;
  content?: ConfirmModalContent<T>;
  closeOnConfirm?: boolean;
}

/**
 * Custom hook to manage confirmation modals with flexible content and handlers.
 * @param handler - Function to execute on confirmation.
 * @param onCancelHandler - Optional function to execute on cancellation.
 * @param content - Content of the modal, can be a React element or a function returning a React node.
 * @param closeOnConfirm - Whether to close the modal after confirmation.
 */
export function useConfirmModal<T>({
  handler,
  onCancelHandler,
  content,
  closeOnConfirm = true,
}: UseConfirmModalProps<T>) {
  const modal = useModal();

  return (value?: T) => {
    modal.open<ModalProps>((modalProps) => {
      const onCancel = (cancelValue?: T) => {
        onCancelHandler?.(cancelValue);
        modal.close();
      };

      const onConfirm = async (confirmValue?: T) => {
        const resolvedValue = confirmValue ?? value;
        if (handler) await handler(resolvedValue);
        if (closeOnConfirm) modal.close();
      };

      const injected: ConfirmModalRenderProps<T> = {
        ...modalProps,
        value,
        onConfirm,
        onCancel,
      };

      if (typeof content === 'function') {
        return (content as (p: ConfirmModalRenderProps<T>) => ReactNode)(injected);
      }

      if (content && isValidElement(content)) {
        return cloneElement(content as ReactElement, injected);
      }

      return <DefaultConfirmModal {...injected} />;
    });
  };
}

export default useConfirmModal;

function DefaultConfirmModal<T>({ onConfirm, onCancel, ...props }: ConfirmModalRenderProps<T>) {
  const { t } = useTranslations('common', 'modal');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      title={t('Confirm', 'modal.confirm.title')}
      body={<Text>{t('Are you sure you want to confirm this action?', 'modal.confirm.body')}</Text>}
      footer={
        <>
          <Button mr={3} onClick={handleConfirm} loading={loading}>
            {t('Yes, confirm', 'modal.confirm.button')}
          </Button>
          <Button variant='outline' onClick={() => onCancel()} disabled={loading}>
            {t('No, cancel', 'modal.confirm.cancel')}
          </Button>
        </>
      }
    />
  );
}
