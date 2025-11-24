'use client';

import { Card, Button } from '../../../lib';
import { ComponentPage } from '../components/ComponentPage';
import { PropInfo } from '../components/PropsTable';
import ProtectedRoute from '../../components/ProtectedRoute';

// Card component examples
const CardExamples = () => (
  <div className="space-y-8">
    {/* Variants */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Variantes - Estilos de borde
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" padding="md">
          <h5 className="font-semibold mb-2">Default</h5>
          <p className="text-gray-600">Card con estilo por defecto</p>
        </Card>
        <Card variant="outlined" padding="md">
          <h5 className="font-semibold mb-2">Outlined</h5>
          <p className="text-gray-600">Card con borde</p>
        </Card>
        <Card variant="elevated" padding="md">
          <h5 className="font-semibold mb-2">Elevated</h5>
          <p className="text-gray-600">Card con sombra elevada</p>
        </Card>
      </div>
    </div>

    {/* Padding */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Padding</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="outlined" padding="sm">
          <p>Padding pequeño</p>
        </Card>
        <Card variant="outlined" padding="md">
          <p>Padding mediano</p>
        </Card>
        <Card variant="outlined" padding="lg">
          <p>Padding grande</p>
        </Card>
      </div>
    </div>

    {/* With complex content */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Con Contenido
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">JS</span>
            </div>
            <div>
              <h5 className="font-semibold">Dogger Dog</h5>
              <p className="text-gray-600 text-sm">Desarrollador Frontend</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Especialista en React y TypeScript con 5 años de experiencia.
          </p>
          <p className="mb-4">
            <img src="https://picsum.photos/id/237/600/300" alt="Perfil" />
          </p>
          <Button variant="primary" size="sm">
            Ver Perfil
          </Button>
        </Card>

        <Card variant="outlined" padding="lg">
          <h5 className="font-semibold mb-3">Estadísticas</h5>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Proyectos:</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commits:</span>
              <span className="font-semibold">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Issues:</span>
              <span className="font-semibold">89</span>
            </div>
            <p className="mb-4">
              <img
                src="https://picsum.photos/seed/picsum/600/300"
                alt="Perfil"
              />
            </p>
          </div>
        </Card>
      </div>
    </div>

    {/* Interactive */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Interactivo</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="outlined" padding="md" hoverable>
          <h5 className="font-semibold mb-2">Card Hoverable</h5>
          <p className="text-gray-600">
            Pasa el mouse por encima para ver el efecto
          </p>
        </Card>
        <Card
          variant="elevated"
          padding="md"
          hoverable
          onClick={() => alert('Card clickeada!')}
        >
          <h5 className="font-semibold mb-2">Card Clickeable</h5>
          <p className="text-gray-600">Haz click para interactuar</p>
        </Card>
      </div>
    </div>
  </div>
);

// Code examples
const codeExamples = [
  {
    title: 'Uso básico',
    code: `import { Card } from '../lib';

<Card variant="default" padding="md">
  <h3>Mi Card</h3>
  <p>Contenido de la card</p>
</Card>`,
  },
  {
    title: 'Variantes disponibles',
    code: `<Card variant="default">Default</Card>
<Card variant="outlined">Outlined</Card>
<Card variant="elevated">Elevated</Card>`,
  },
  {
    title: 'Diferentes tamaños de padding',
    code: `<Card padding="sm">Padding pequeño</Card>
<Card padding="md">Padding mediano</Card>
<Card padding="lg">Padding grande</Card>`,
  },
  {
    title: 'Card interactiva',
    code: `<Card 
  variant="elevated"
  hoverable
  onClick={() => console.log('Clicked!')}
>
  <h3>Card Clickeable</h3>
  <p>Haz click para interactuar</p>
</Card>`,
  },
];

// Props documentation
const cardProps: PropInfo[] = [
  {
    name: 'variant',
    type: "'default' | 'outlined' | 'elevated'",
    required: false,
    defaultValue: "'default'",
    description: 'Estilo visual de la card',
  },
  {
    name: 'padding',
    type: "'sm' | 'md' | 'lg'",
    required: false,
    defaultValue: "'md'",
    description: 'Espaciado interno de la card',
  },
  {
    name: 'hoverable',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    description: 'Añade efectos hover',
  },
  {
    name: 'onClick',
    type: '() => void',
    required: false,
    description: 'Función que se ejecuta al hacer click',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Clases CSS adicionales',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Contenido de la card',
  },
];

function CardPageContent() {
  return (
    <ComponentPage
      title="Card"
      description="Componente contenedor flexible para agrupar y mostrar contenido relacionado. Ideal para crear layouts organizados con diferentes estilos y niveles de interactividad."
      examples={<CardExamples />}
      codeExamples={codeExamples}
      props={cardProps}
    />
  );
}

export default function CardPage() {
  return (
    <ProtectedRoute>
      <CardPageContent />
    </ProtectedRoute>
  );
}
