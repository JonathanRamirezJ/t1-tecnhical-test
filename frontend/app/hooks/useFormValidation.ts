import { useState, useCallback } from 'react';
import * as yup from 'yup';
import { validateSchema, validateField } from '../schemas/authSchemas';

interface UseFormValidationProps<T> {
  schema: yup.AnyObjectSchema;
  initialValues: T;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: (
    onSubmit: (values: T) => Promise<void>
  ) => (e: React.FormEvent) => Promise<void>;
  validateForm: () => Promise<boolean>;
  setFieldError: (field: string, error: string) => void;
  resetForm: () => void;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
}: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = {
        ...values,
        [name]: value,
      };

      setValues(newValues);

      // Validar el campo en tiempo real si ya tiene un error
      if (errors[name]) {
        const fieldError = await validateField(schema, name, value, newValues);
        setErrors(prev => ({
          ...prev,
          [name]: fieldError || '',
        }));
      }
    },
    [values, errors, schema]
  );

  const validateFormData = useCallback(async (): Promise<boolean> => {
    const validation = await validateSchema(schema, values);
    setErrors(validation.errors);
    return validation.isValid;
  }, [schema, values]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = await validateFormData();
        if (!isValid) {
          return;
        }

        setIsSubmitting(true);

        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Error en submit:', error);
          throw error;
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateFormData]
  );

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm: validateFormData,
    setFieldError,
    resetForm,
  };
}
