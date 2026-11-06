import React, { useState } from 'react';
import { PRACTICALS } from '../data/practicals';
import { PracticalCard } from './PracticalCard';
import { Search, BookOpen, Sparkles } from 'lucide-react';

interface HomeProps {
  onOpenPractical: (id: number) => void;
  onStartPractice: (id: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenPractical, onStartPractice }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'combinational' | 'sequential'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const combinationalPracticals = PRACTICALS.filter(p => p.category === 'combinational');
  const sequentialPracticals = PRACTICALS.filter(p => p.category === 'sequential');

  const filteredPracticals = PRACTICALS.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiredICs.some(ic => ic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      `practical ${p.officialNumber}`.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner / Course Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Electronics & Logic Design Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Interactive Breadboard Simulator for DELD Practicals
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Hands-on laboratory practice environment for Digital Electronics &amp; Logic Design practicals. 
            Place standard 74xx ICs, wire circuits on a virtual breadboard, toggle input switches, pulse clocks, and verify truth tables in real time.
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Syllabus Practicals</span>
              <span className="text-slate-100 font-bold text-base">10 Experiments</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Design Categories</span>
              <span className="text-slate-100 font-bold text-base">Comb. & Seq.</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Exam / Termwork</span>
              <span className="text-slate-100 font-bold text-base">25 + 25 Marks</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
              <span className="text-slate-400 block text-[11px]">Interactive Tools</span>
              <span className="text-slate-100 font-bold text-base">Breadboard + VCC/GND</span>
            </div>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1.5" fill="#3b82f6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-3 sm:p-4 rounded-xl">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/80'
            }`}
          >
            All Practicals (10)
          </button>
          <button
            onClick={() => setFilterCategory('combinational')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === 'combinational'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/80'
            }`}
          >
            Combinational (1–5)
          </button>
          <button
            onClick={() => setFilterCategory('sequential')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === 'sequential'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/80'
            }`}
          >
            Sequential (6–10)
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search practicals, IC 7483, K-Map..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Listing */}
      {filterCategory === 'all' && !searchQuery ? (
        <div className="space-y-10">
          {/* Section A: Combinational Logic Design */}
          <div>
            <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                A
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  A. Combinational Logic Design (Practicals 1–5)
                </h2>
                <p className="text-xs text-slate-400">
                  Outputs depend only on current inputs. Code converters, BCD adders, multiplexers, decoders, and parity circuits.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {combinationalPracticals.map((practical) => (
                <PracticalCard
                  key={practical.id}
                  practical={practical}
                  onOpen={onOpenPractical}
                  onStartPractice={onStartPractice}
                />
              ))}
            </div>
          </div>

          {/* Section B: Sequential Logic Design */}
          <div>
            <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                B
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  B. Sequential Logic Design (Practicals 6–10)
                </h2>
                <p className="text-xs text-slate-400">
                  Memory-dependent circuits driven by clock transitions. Asynchronous & synchronous ripple counters, Mod-N counters, sequence detectors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sequentialPracticals.map((practical) => (
                <PracticalCard
                  key={practical.id}
                  practical={practical}
                  onOpen={onOpenPractical}
                  onStartPractice={onStartPractice}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Filtered List */
        <div>
          <div className="mb-4 text-xs text-slate-400">
            Showing {filteredPracticals.length} practical{filteredPracticals.length === 1 ? '' : 's'} matching criteria
          </div>
          {filteredPracticals.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-sm">No practicals found matching "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
                className="mt-3 text-xs text-blue-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPracticals.map((practical) => (
                <PracticalCard
                  key={practical.id}
                  practical={practical}
                  onOpen={onOpenPractical}
                  onStartPractice={onStartPractice}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Syllabus Course Outcomes Quick Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
          Course Outcomes (CO) Mapping Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-blue-400 block mb-1">CO1</span>
            <span className="text-slate-300 text-[11px] leading-tight block">
              Simplify & minimize Boolean expressions using K-Map & Quine-McCluskey method.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-blue-400 block mb-1">CO2</span>
            <span className="text-slate-300 text-[11px] leading-tight block">
              Design and implement combinational circuits using basic AND/OR/XOR logic gates.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-blue-400 block mb-1">CO3</span>
            <span className="text-slate-300 text-[11px] leading-tight block">
              Design & implement combinational circuits using MSI logic (Mux 74153, Decoder 74138).
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-emerald-400 block mb-1">CO4</span>
            <span className="text-slate-300 text-[11px] leading-tight block">
              Explain flip-flop operation, excitation tables, and timing in sequential logic.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-emerald-400 block mb-1">CO5</span>
            <span className="text-slate-300 text-[11px] leading-tight block">
              Design and implement sequential circuits: Asynchronous, Synchronous & Mod-N counters.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
