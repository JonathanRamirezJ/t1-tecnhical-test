import { useState } from 'react';
import { Card, Input } from '../../../lib';

export const InputsDemo = () => {
  const [password, setPassword] = useState<string>('');

  return (
    <Card header="Input Component" padding="lg">
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-700 mb-2">
          Tipos de inputs
        </h4>
        <Input
          id="demo-text"
          type="text"
          label="Input text"
          placeholder="Texto"
          helperText="Ingresa tu texto"
        />

        <Input
          id="demo-email"
          type="email"
          label="Input email"
          placeholder="usuario@ejemplo.com"
          helperText="Ingresa tu correo electrónico"
        />

        <Input
          id="demo-password"
          type="password"
          label="Input password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={
            password.length > 0 && password.length < 8
              ? 'Mínimo 8 caracteres'
              : ''
          }
          success={password.length >= 8 ? 'Contraseña válida' : ''}
        />

        <h4 className="text-sm font-bold text-gray-700 mb-2">
          Estados de validación inputs
        </h4>

        <Input
          id="demo-password-default"
          type="text"
          label="Default"
          placeholder=""
        />

        <Input
          id="demo-password-error"
          type="text"
          label="Error"
          placeholder=""
          error="Error message"
          helperText="Error message"
        />

        <Input
          id="demo-password-success"
          type="text"
          label="Success"
          placeholder=""
          success="Success message"
          helperText="Success message"
        />

        <h4 className="text-sm font-bold text-gray-700 mb-2">
          Estados del input
        </h4>

        <Input
          id="demo-disabled"
          type="text"
          label="Disabled"
          placeholder="Disabled"
          disabled
          value="Disabled"
        />
      </div>
    </Card>
  );
};
