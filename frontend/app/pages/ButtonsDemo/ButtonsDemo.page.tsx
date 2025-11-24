import { useState } from "react";
import { PhoneIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { Button, Card } from "../../../lib";

export const ButtonsDemo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Card header="Button Component" padding="lg">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Variantes</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Estados</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="md"
            >
              default
            </Button>
            <Button
              variant="primary"
              loading={isLoading}
              size="md"
              onClick={() => setIsLoading(!isLoading)}
            >
              Loading
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Iconos</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="primary" size="md" icon={<PhoneIcon className="w-5 h-5" />} iconPosition="left">
              Phone icon left
            </Button>
            <Button variant="primary" size="md" icon={<CalendarIcon className="w-5 h-5" />} iconPosition="right">
              Calendar icon right
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-2">Tamaños</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>
      </div>
    </Card >
  );
};