'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { Card, Button, Input } from '../../lib';
import { useAuth } from '../contexts/AuthContext';
import { registerSchema, RegisterFormData } from '../schemas/authSchemas';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form initial values
  const initialValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Function to handle form submission
  const handleSubmit = async (
    values: RegisterFormData,
    { setFieldError }: any
  ) => {
    try {
      setIsSubmitting(true);
      await register(values.name, values.email, values.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
      setFieldError(
        'email',
        'Error al crear la cuenta. El email podría ya estar en uso.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a
            onClick={handleLoginRedirect}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card padding="lg" variant="elevated">
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isValid,
            }) => (
              <Form className="space-y-6">
                <div>
                  <Input
                    id="register-name"
                    label="Nombre Completo"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tu nombre completo"
                    required
                    error={touched.name && errors.name ? errors.name : ''}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    id="register-email"
                    label="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="tu@email.com"
                    required
                    error={touched.email && errors.email ? errors.email : ''}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    id="register-password"
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    error={
                      touched.password && errors.password ? errors.password : ''
                    }
                    disabled={isSubmitting}
                    helperText="Mínimo 6 caracteres, debe incluir mayúscula, minúscula y número"
                  />
                </div>

                <div>
                  <Input
                    id="register-confirm-password"
                    label="Confirmar Contraseña"
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : ''
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Al registrarte, aceptas nuestros{' '}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Términos de Servicio
                  </a>{' '}
                  y{' '}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Política de Privacidad
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  className="w-full"
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
