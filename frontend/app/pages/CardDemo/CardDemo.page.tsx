import { Button, Card } from "../../../lib";

export const CardDemo = () => {
  return (
    <Card header="Card Component" padding="lg">
      <div className="space-y-4">
        <p className="text-gray-600">
          Las tarjetas pueden tener diferentes variantes y ser interactivas.
        </p>

        <h4 className="text-sm font-bold text-gray-700 mb-2">
          Variantes
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Estilo Outlined
          </h4>
          <Card
            variant="outlined"
            padding="sm"
            hoverable
            header="Card outlined - Header Section"
          >
            <p className="text-sm text-gray-600">Card outlined - Content Section</p>
          </Card>

          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Estilo Elevated
          </h4>
          <Card
            variant="elevated"
            padding="sm"
            hoverable
            header="Card elevated - Header Section"
          >
            <p className="text-sm text-gray-700">Card elevated - Content Section</p>
          </Card>

          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Estilo Default
          </h4>
          <Card
            variant="default"
            padding="sm"
            hoverable
            header="Card con footer - Header Section"
            footer={
              <Button variant="primary" size="sm" onClick={() => alert('Click en el botón del footer')}>
                Acción - Footer Section
              </Button>
            }
          >
            <p className="text-sm text-gray-700">Card con footer - Content Section</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Variantes con imagenes
          </h4>
          <Card
            variant="default"
            padding="sm"
            hoverable
          >
            <img src="https://picsum.photos/id/237/600/400" alt="image" />
          </Card>
        </div>
      </div>
    </Card>
  );
};