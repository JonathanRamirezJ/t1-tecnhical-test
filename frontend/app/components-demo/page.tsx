'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '../../lib';
import ProtectedRoute from '../components/ProtectedRoute';

/* Demo Components */
import { ButtonsDemo } from '../demo-components/ButtonsDemo/ButtonsDemo.page';
import { InputsDemo } from '../demo-components/InputsDemo/InputsDemo.page';
import { ModalDemo } from '../demo-components/ModalDemo/ModalDemo.page';
import { CardDemo } from '../demo-components/CardDemo/CardDemo.page';
import { FormDemo } from '../demo-components/FormDemo/FormDemo.page';

/* Components */
import { Header } from '../components/Header/Header.component';
import { Footer } from '../components/Footer/Footer.component';

function ComponentsDemoContent() {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="secondary" onClick={handleBackToDashboard}>
            ← Volver al Dashboard
          </Button>
        </div>

        {/* Header */}
        <Header />

        {/* Componentes Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Button Examples */}
          <ButtonsDemo />

          {/* Input Examples */}
          <InputsDemo />

          {/* Modal Example */}
          <ModalDemo />

          {/* Card Examples */}
          <CardDemo />
        </div>

        {/* Form Example */}
        <FormDemo />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default function ComponentsDemoPage() {
  return (
    <ProtectedRoute>
      <ComponentsDemoContent />
    </ProtectedRoute>
  );
}
