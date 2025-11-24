# Librería de Componentes React

Una librería de componentes React moderna y completa construida con TypeScript, Tailwind CSS y Next.js. Incluye componentes esenciales con un sistema de diseño consistente y tests unitarios completos.

## 🚀 Características

- **TypeScript**: Tipado completo con interfaces detalladas
- **Responsive Design**: Mobile-first con Tailwind CSS
- **Tests Unitarios**: Cobertura mínima del 80% con Jest y Testing Library
- **Design System**: Tokens de diseño centralizados y reutilizables
- **Accesibilidad**: Componentes accesibles siguiendo estándares WCAG
- **Documentación**: Ejemplos de uso y guías de instalación

## 📦 Componentes Incluidos

### Button

Botón versátil con múltiples variantes y estados.

**Variantes**: `primary`, `secondary`, `danger`  
**Estados**: `default`, `loading`, `disabled`  
**Características**: Soporte para iconos, diferentes tamaños

### Input

Campo de entrada con validación y estados visuales.

**Tipos**: `text`, `email`, `password`  
**Estados**: `default`, `error`, `success`, `disabled`  
**Características**: Labels, placeholders, mensajes de ayuda

### Modal

Modal configurable con header, body y footer.

**Tamaños**: `small`, `medium`, `large`  
**Características**: Cierre con overlay, tecla Escape, botón X

### Card

Tarjeta flexible para mostrar contenido estructurado.

**Variantes**: `default`, `outlined`, `elevated`  
**Características**: Header, footer, imágenes, clickeable

## 🛠 Instalación

1. **Instalar dependencias**:

```bash
npm install
```

2. **Ejecutar tests**:

```bash
npm test
```

3. **Ejecutar tests con cobertura**:

```bash
npm run test:coverage
```

4. **Desarrollo**:

```bash
npm run dev
```

## 📖 Uso Básico

### Importación

```typescript
import { Button, Input, Modal, Card } from './lib';
// o importaciones individuales
import { Button } from './lib/components/Button';
```

### Ejemplos de Uso

#### Button

```tsx
import { Button } from './lib';

function App() {
  return (
    <div>
      {/* Botón primario básico */}
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Guardar
      </Button>

      {/* Botón con icono y estado loading */}
      <Button
        variant="secondary"
        loading={true}
        icon={<SaveIcon />}
        iconPosition="left"
      >
        Guardando...
      </Button>

      {/* Botón de peligro deshabilitado */}
      <Button variant="danger" disabled>
        Eliminar
      </Button>
    </div>
  );
}
```

#### Input

```tsx
import { Input } from './lib';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <form>
      {/* Input básico */}
      <Input
        type="email"
        label="Correo electrónico"
        placeholder="usuario@ejemplo.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      {/* Input con error */}
      <Input
        type="password"
        label="Contraseña"
        error="La contraseña debe tener al menos 8 caracteres"
      />

      {/* Input con éxito */}
      <Input
        type="text"
        label="Nombre de usuario"
        success="Nombre de usuario disponible"
        helperText="Solo letras, números y guiones"
      />
    </form>
  );
}
```

#### Modal

```tsx
import { Modal, Button } from './lib';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="medium"
        header="Confirmar acción"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirmar
            </Button>
          </div>
        }
      >
        <p>¿Estás seguro de que quieres realizar esta acción?</p>
      </Modal>
    </>
  );
}
```

#### Card

```tsx
import { Card, Button } from './lib';

function ProductCard() {
  return (
    <Card
      variant="elevated"
      header="Producto Premium"
      image={{
        src: '/product-image.jpg',
        alt: 'Imagen del producto',
        position: 'top',
      }}
      footer={
        <div className="flex justify-between">
          <span className="text-lg font-bold">$99.99</span>
          <Button variant="primary" size="sm">
            Comprar
          </Button>
        </div>
      }
      onClick={() => console.log('Card clicked')}
      hoverable
    >
      <p>Descripción del producto con características principales.</p>
    </Card>
  );
}
```

## 🎨 Design System

### Tokens de Diseño

Los tokens están centralizados en `lib/design-system/design-tokens.ts`:

```typescript
import { designTokens } from './lib';

// Colores
designTokens.colors.primary[500]; // #3b82f6
designTokens.colors.danger[600]; // #dc2626

// Espaciado
designTokens.spacing[4]; // 16px
designTokens.spacing[8]; // 32px

// Tipografía
designTokens.typography.fontSize.lg; // ['18px', { lineHeight: '28px' }]

// Border radius
designTokens.borderRadius.md; // 6px
```

### Personalización

Para personalizar los tokens, modifica el archivo `design-tokens.ts`:

```typescript
export const designTokens = {
  colors: {
    primary: {
      // Tus colores personalizados
      500: '#your-color',
    },
    // ...
  },
  // ...
};
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

### Estructura de Tests

Cada componente incluye tests completos:

- ✅ Renderizado básico
- ✅ Props y variantes
- ✅ Interacciones del usuario
- ✅ Estados (loading, disabled, error)
- ✅ Accesibilidad
- ✅ Eventos de teclado

### Cobertura Mínima

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 📁 Estructura del Proyecto

```
lib/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.tsx
│   │   ├── Input.test.tsx
│   │   └── index.ts
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   ├── Modal.test.tsx
│   │   └── index.ts
│   └── Card/
│       ├── Card.tsx
│       ├── Card.test.tsx
│       └── index.ts
├── design-system/
│   └── design-tokens.ts
└── index.ts
```

## 🔧 Configuración

### Jest

La configuración de Jest está en `jest.config.js` con:

- Entorno jsdom para React
- Setup con Testing Library
- Cobertura configurada
- Soporte para TypeScript

### TypeScript

Configuración estricta con:

- Interfaces completas para todos los props
- Tipos exportados para reutilización
- Strict mode habilitado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Estándares de Código

- Usar TypeScript estricto
- Seguir convenciones de naming
- Escribir tests para nuevos componentes
- Mantener cobertura mínima del 80%
- Documentar props y ejemplos de uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
4. Incluye ejemplos de código cuando sea posible
