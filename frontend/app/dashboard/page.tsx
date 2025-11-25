'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTrackingStats } from '../contexts/TrackingContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  ProtectedRoute,
  ConditionalTrackingProvider,
  Sidebar,
  Header,
  HomeSection,
  ComponentsSection,
  DemoSection,
  AnalyticsSection,
  ExportSection,
} from '../components';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { realTimeStats, isLoading, error, refreshStats, exportData, stats } =
    useTrackingStats();

  const isDesktop = useMediaQuery('(min-width: 1024px)'); // lg breakpoint
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Manejar el estado inicial del sidebar según el tamaño de pantalla
  useEffect(() => {
    if (isDesktop) {
      setSidebarCollapsed(false); // Expandir en desktop por defecto
    } else {
      setSidebarCollapsed(true); // Colapsar en móvil por defecto
    }
  }, [isDesktop]);

  // Manejar parámetros de URL para navegación desde otras páginas
  useEffect(() => {
    const section = searchParams.get('section');
    if (
      section &&
      ['home', 'components', 'demo', 'analytics', 'export'].includes(section)
    ) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <HomeSection
            user={user}
            realTimeStats={realTimeStats}
            stats={stats}
            error={error}
            isLoading={isLoading}
            refreshStats={refreshStats}
          />
        );
      case 'components':
        return <ComponentsSection />;
      case 'demo':
        return <DemoSection />;
      case 'analytics':
        return (
          <AnalyticsSection
            stats={stats || undefined}
            realTimeStats={realTimeStats || undefined}
          />
        );
      case 'export':
        return (
          <ExportSection
            exportData={exportData}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return (
          <HomeSection
            user={user}
            realTimeStats={realTimeStats}
            stats={stats}
            error={error}
            isLoading={isLoading}
            refreshStats={refreshStats}
          />
        );
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'home':
        return 'Dashboard';
      case 'components':
        return 'Guía de componentes';
      case 'demo':
        return 'Tracking';
      case 'analytics':
        return 'Análisis detallado';
      case 'export':
        return 'Exportar datos';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-64'
        }`}
      >
        {/* Header */}
        <Header
          title={getSectionTitle()}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ConditionalTrackingProvider>
        <Suspense fallback={<div>Cargando...</div>}>
          <DashboardContent />
        </Suspense>
      </ConditionalTrackingProvider>
    </ProtectedRoute>
  );
}
