'use client';

/* Pages*/
import { ButtonsDemo } from './pages/ButtonsDemo/ButtonsDemo.page';
import { InputsDemo } from './pages/InputsDemo/InputsDemo.page';
import { ModalDemo } from './pages/ModalDemo/ModalDemo.page';
import { CardDemo } from './pages/CardDemo/CardDemo.page';
import { FormDemo } from './pages/FormDemo/FormDemo.page';

/* Components */
import { Header } from './components/Header/Header.component';
import { Footer } from './components/Footer/Footer.component';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
