import React from 'react';
import { Practical } from '../types';
import { ArrowRight, Cpu, Bookmark } from 'lucide-react';

interface PracticalCardProps {
  practical: Practical;
  onOpen: (id: number) => void;
  onStartPractice: (id: number) => void;
}

export const PracticalCard: React.FC<PracticalCardProps> = ({
  practical,
  onOpen,
  onStartPractice,
}) => {
  const isCombinational = practical.category === 'combinational';

  return (
    <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
      <div>
        {/* Top badges: Practical No & Category badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
              isCombinational 
                ? 'bg-blue-900/60 text-blue-300 border border-blue-700/60' 
                : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
            }`}>
              {practical.officialNumber}
            </span>
            <span className={`text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isCombinational
                ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
            }`}>
              {isCombinational ? 'Combinational' : 'Sequential'}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {practical.coMapped.map((co) => (
              <span
                key={co}
                className="text-[10px] font-medium bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
              >
                {co}
              </span>
            ))}
          </div>
        </div>

        {/* Practical Title */}
        <h3 className="font-semibold text-slate-100 text-base mb-2 line-clamp-2 leading-snug">
          {practical.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {practical.aim}
        </p>

        {/* Verified ICs list */}
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5 flex items-center">
            <Cpu className="w-3 h-3 mr-1" />
            Key ICs & Components
          </div>
          <div className="flex flex-wrap gap-1.5">
            {practical.requiredICs.slice(0, 2).map((ic, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700/80 font-mono"
              >
                {ic.split('(')[0].trim()}
              </span>
            ))}
            {practical.requiredICs.length > 2 && (
              <span className="text-xs bg-slate-900/60 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                +{practical.requiredICs.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpen(practical.id)}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600/70"
        >
          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
          <span>Lab Details</span>
        </button>

        <button
          onClick={() => onStartPractice(practical.id)}
          className={`flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-white transition-all shadow-sm ${
            isCombinational
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
          }`}
        >
          <span>Practice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
