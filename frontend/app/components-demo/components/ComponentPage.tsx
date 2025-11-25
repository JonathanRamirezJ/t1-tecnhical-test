'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../../lib';
import { CodeBlock } from './CodeBlock';
import { PropsTable, PropInfo } from './PropsTable';
import { Sidebar, Header } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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
  const { user } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState('components');

  // Handle initial sidebar state based on screen size
  React.useEffect(() => {
    if (isDesktop) {
      setSidebarCollapsed(false); // Expand on desktop by default
    } else {
      setSidebarCollapsed(true); // Collapse on mobile by default
    }
  }, [isDesktop]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    router.push(`/dashboard?section=${section}`);
  };

  const handleBackToComponents = () => {
    router.push('/dashboard?section=components');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-64'
        }`}
      >
        {/* Header */}
        <Header
          title={title}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          showBackButton={true}
          backButtonText="← Volver a Guía de Estilos"
          backButtonAction={handleBackToComponents}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Component Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
              <p className="text-lg text-gray-600 max-w-4xl">{description}</p>
            </div>

            {/* Examples Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Ejemplos Interactivos
              </h3>
              <Card variant="outlined" padding="lg">
                {examples}
              </Card>
            </div>

            {/* Code Examples Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Código de Ejemplo
              </h3>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Documentación de Props
              </h3>
              <PropsTable props={props} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
