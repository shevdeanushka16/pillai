import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer } from './components/layout/ToastContainer';
import { SitrepModal } from './components/common/SitrepModal';
import { DecisionEngineModal } from './components/common/DecisionEngineModal';
import { BeforeAfter } from './components/command/BeforeAfter';
import { MobilePassModal } from './components/common/MobilePassModal';
import { EventSwitcherModal } from './components/common/EventSwitcherModal';
import { TelemetrySlidersDrawer } from './components/common/TelemetrySlidersDrawer';
import { OrbitCopilotDrawer } from './components/command/OrbitCopilotDrawer';
import { CivicActuationModal } from './components/command/CivicActuationModal';
import { AutoPilotDemoDirector } from './components/common/AutoPilotDemoDirector';
import { CommandCenter } from './pages/CommandCenter';
import { CrowdAnalytics } from './pages/CrowdAnalytics';
import { Accommodation } from './pages/Accommodation';
import { Transportation } from './pages/Transportation';
import { VisitorGuidance } from './pages/VisitorGuidance';
import { MobilePass } from './pages/MobilePass';

const AppContent: React.FC = () => {
  const { activePage } = useApp();
  const [isPassMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      return search.includes('mode=pass') || search.includes('pass=') || hash.includes('pass');
    }
    return false;
  });

  if (isPassMode) {
    return <MobilePass />;
  }

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
        <MobilePassModal />
        <EventSwitcherModal />
        <TelemetrySlidersDrawer />
        <OrbitCopilotDrawer />
        <CivicActuationModal />
        <AutoPilotDemoDirector />
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
