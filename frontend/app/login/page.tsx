'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Card, Button, Input } from '../../lib';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../schemas/authSchemas';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Valores iniciales del formulario
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  // Función para manejar el submit del formulario
  const handleSubmit = async (
    values: LoginFormData,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      setFieldError(
        'password',
        'Credenciales inválidas. Por favor, verifica tu email y contraseña.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
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
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="tu@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={touched.email && errors.email ? errors.email : ''}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={
                      touched.password && errors.password ? errors.password : ''
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
