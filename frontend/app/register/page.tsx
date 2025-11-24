'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { Card, Button, Input } from '../../lib';
import { useAuth } from '../contexts/AuthContext';
import { registerSchema, RegisterFormData } from '../schemas/authSchemas';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Valores iniciales del formulario
  const initialValues: RegisterFormData = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Función para manejar el submit del formulario
  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      await register(values.email, values.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
      setFieldError(
        'email',
        'Error al crear la cuenta. El email podría ya estar en uso.'
      );
    } finally {
      setSubmitting(false);
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
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Inicia sesión aquí
          </button>
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
              isSubmitting,
              handleChange,
              handleBlur,
            }) => (
              <Form className="space-y-6">
                <div>
                  <Input
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
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Términos de Servicio
                  </button>{' '}
                  y{' '}
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Política de Privacidad
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
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
