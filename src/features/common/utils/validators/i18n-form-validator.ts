/** This function validates a form object against a set of rules. */
export function validateForm<T, TranslatorFn>(
  form: T,
  rules: ValidationRule<T, TranslatorFn>[],
  translator: TranslatorFn
): ValidationError<T> {
  return rules.reduce<ValidationError<T>>((errors, { field, label, test }) => {
    if (!test(form)) {
      errors[field] = label(translator);
    }
    return errors;
  }, {});
}
