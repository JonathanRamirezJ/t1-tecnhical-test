import * as yup from 'yup';

// Schema para el formulario de Login
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El formato del email no es válido')
    .trim(),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Schema para el formulario de Register
export const registerSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El formato del email no es válido')
    .trim(),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

// Tipos TypeScript inferidos de los schemas
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;

// Función helper para validar un schema y retornar errores formateados
export const validateSchema = async (
  schema: yup.AnyObjectSchema,
  data: any
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Error de validación' } };
  }
};

// Función helper para validar un campo específico
export const validateField = async (
  schema: yup.AnyObjectSchema,
  fieldName: string,
  value: any,
  allData: any
): Promise<string | null> => {
  try {
    // Validar solo el campo específico en el contexto de todos los datos
    await schema.validateAt(fieldName, { ...allData, [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Error de validación';
  }
};
