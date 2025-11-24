import { useState } from 'react';
import { Button, Input, Card } from '../../../lib';

export const FormDemo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // simulate loading - 2 seconds
    setTimeout(() => {
      setIsLoading(false);
      alert('Formulario enviado!');
    }, 2000);
  };

  return (
    <>
      <Card
        header="Ejemplo de Formulario Completo"
        padding="lg"
        className="max-w-2xl mx-auto"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Nombre"
              placeholder="Tu nombre"
              required
            />
            <Input
              type="text"
              label="Apellido"
              placeholder="Tu apellido"
              required
            />
          </div>

          <Input
            type="email"
            label="Correo electrónico"
            placeholder="usuario@ejemplo.com"
            required
            helperText="Usaremos este email para contactarte"
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
            helperText="Mínimo 8 caracteres"
          />

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Cancelar</Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
