import React, { useState } from 'react';
import { PRACTICALS } from './data/practicals';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { PracticalDetails } from './components/PracticalDetails';
import { Workspace } from './components/Workspace';

export type ViewMode = 'home' | 'details' | 'workspace';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPracticalId, setSelectedPracticalId] = useState<number>(1);
  const [selectedSubExerciseId, setSelectedSubExerciseId] = useState<string | undefined>();

  const activePractical = PRACTICALS.find((p) => p.id === selectedPracticalId) || PRACTICALS[0];

  const handleOpenPractical = (id: number) => {
    setSelectedPracticalId(id);
    setSelectedSubExerciseId(undefined);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPractice = (id: number, subExerciseId?: string) => {
    setSelectedPracticalId(id);
    setSelectedSubExerciseId(subExerciseId);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDetails = () => {
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Header
        currentView={currentView}
        activePracticalTitle={`Practical ${activePractical.officialNumber}: ${activePractical.shortTitle}`}
        onNavigateHome={handleNavigateHome}
        onNavigateDetails={handleNavigateDetails}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onOpenPractical={handleOpenPractical}
            onStartPractice={handleStartPractice}
          />
        )}

        {currentView === 'details' && (
          <PracticalDetails
            practical={activePractical}
            onBack={handleNavigateHome}
            onStartPractice={handleStartPractice}
          />
        )}

        {currentView === 'workspace' && (
          <Workspace
            practical={activePractical}
            subExerciseId={selectedSubExerciseId}
            onBackToDetails={handleNavigateDetails}
          />
        )}
      </main>

      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <strong>DELD Lab Practice Simulator</strong>
          </div>
          <div className="text-slate-500">
            Digital Electronics &amp; Logic Design Virtual Lab
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
