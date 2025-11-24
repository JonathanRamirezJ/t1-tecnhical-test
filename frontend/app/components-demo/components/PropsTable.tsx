import React from 'react';
import { Card } from '../../../lib';

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

interface PropsTableProps {
  props: PropInfo[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ props }) => {
  return (
    <Card variant="outlined" padding="lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Props</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requerido
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Por Defecto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {props.map((prop, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {prop.name}
                  </code>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {prop.type}
                  </code>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      prop.required
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prop.required ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prop.defaultValue ? (
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {prop.defaultValue}
                    </code>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
