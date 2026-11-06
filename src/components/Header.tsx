import React from 'react';
import { Cpu, ArrowLeft, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'details' | 'workspace';
  activePracticalTitle?: string;
  onNavigateHome: () => void;
  onNavigateDetails?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activePracticalTitle,
  onNavigateHome,
  onNavigateDetails,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding & Course info */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={onNavigateHome}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">
                  DELD Lab Practice Simulator
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-950 text-blue-300 border border-blue-800/60">
                  Virtual Trainer Kit
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Digital Electronics & Logic Design Virtual Lab
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Active location breadcrumb & nav */}
        <div className="flex items-center space-x-2">
          {currentView !== 'home' && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Practicals</span>
            </button>
          )}

          {currentView === 'workspace' && onNavigateDetails && (
            <button
              onClick={onNavigateDetails}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 rounded-md transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lab Manual</span>
            </button>
          )}

          <div className="hidden lg:flex items-center text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Virtual Breadboard Trainer</span>
          </div>
        </div>
      </div>
      {activePracticalTitle && currentView !== 'home' && (
        <div className="bg-slate-950/80 border-t border-slate-800/60 px-4 py-1.5 text-xs text-slate-400 truncate max-w-7xl mx-auto flex items-center space-x-2">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-[11px]">Active Experiment:</span>
          <span className="text-slate-200 font-medium truncate">{activePracticalTitle}</span>
        </div>
      )}
    </header>
  );
};
