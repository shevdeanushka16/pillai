import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer } from './components/layout/ToastContainer';
import { SitrepModal } from './components/common/SitrepModal';
import { DecisionEngineModal } from './components/common/DecisionEngineModal';
import { BeforeAfter } from './components/command/BeforeAfter';
import { CommandCenter } from './pages/CommandCenter';
import { CrowdAnalytics } from './pages/CrowdAnalytics';
import { Accommodation } from './pages/Accommodation';
import { Transportation } from './pages/Transportation';
import { VisitorGuidance } from './pages/VisitorGuidance';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-primary font-sans antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            {activePage === 'command' && <CommandCenter />}
            {activePage === 'crowd' && <CrowdAnalytics />}
            {activePage === 'accommodation' && <Accommodation />}
            {activePage === 'transportation' && <Transportation />}
            {activePage === 'visitor' && <VisitorGuidance />}
          </div>
        </main>

        <ToastContainer />
        <SitrepModal />
        <DecisionEngineModal />
        <BeforeAfter />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
