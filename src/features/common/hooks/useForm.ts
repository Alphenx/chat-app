import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import useClient from './useClient';

type FormError<T> = Partial<Record<keyof T, boolean | string | ReactNode>>;

interface Props<T> {
  initialValues: T;
  validate?: (values: T) => FormError<T> | Promise<FormError<T>>;
  onSubmit: (values: T) => void | Promise<void>;
}

function useForm<T>({ initialValues, validate, onSubmit }: Props<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, boolean | string | ReactNode>>>({});
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true);

  const isClient = useClient();

  useEffect(() => {
    if (!isClient) return;

    const checkInvalid = async () => {
      const validationErrors = await Promise.resolve(validate?.(values) ?? {});
      setInvalid(Object.keys(validationErrors).length > 0);
    };

    checkInvalid();
  }, [values, validate, isClient]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate ? await Promise.resolve(validate(values)) : {};
    setErrors(validationErrors ?? {});

    if (validationErrors && Object.keys(validationErrors).length === 0) {
      await Promise.resolve(onSubmit(values));
    }
    setLoading(false);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setInvalid(true);
  };

  return { values, errors, loading, invalid, handleChange, handleSubmit, resetForm };
}

export default useForm;
