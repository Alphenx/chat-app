type ValidationRule<T, TranslatorFn> = {
  field: keyof T;
  label: (t: TranslatorFn) => ReactNode;
  test: (values: T) => boolean;
};

type ValidationError<T> = Partial<Record<keyof T, ReactNode>>;
