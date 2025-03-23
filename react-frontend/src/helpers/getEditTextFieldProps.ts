export function getEditTextFieldProps(
  field: string,
  validationErrors: Record<string, string | undefined>,
  setValidationErrors: (
    value: React.SetStateAction<Record<string, string | undefined>>,
  ) => void,
) {
  return {
    required: true,
    error: !!validationErrors?.[field],
    helperText: validationErrors?.[field],
    onFocus: () =>
      setValidationErrors({
        ...validationErrors,
        [field]: undefined,
      }),
  };
}
