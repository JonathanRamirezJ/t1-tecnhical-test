'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '../../../lib';
import { CodeBlock } from './CodeBlock';
import { PropsTable, PropInfo } from './PropsTable';

interface ComponentPageProps {
  title: string;
  description: string;
  examples: React.ReactNode;
  codeExamples: Array<{
    title: string;
    code: string;
  }>;
  props: PropInfo[];
}

export const ComponentPage: React.FC<ComponentPageProps> = ({
  title,
  description,
  examples,
  codeExamples,
  props,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => router.push('/components-demo')}
          >
            ← Volver al Style Guide
          </Button>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl">{description}</p>
        </div>

        {/* Examples Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Ejemplos
          </h2>
          <Card variant="outlined" padding="lg">
            {examples}
          </Card>
        </div>

        {/* Code Examples Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Código</h2>
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <CodeBlock
                key={index}
                title={example.title}
                code={example.code}
                language="tsx"
              />
            ))}
          </div>
        </div>

        {/* Props Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Documentación
          </h2>
          <PropsTable props={props} />
        </div>
      </div>
    </div>
  );
};
