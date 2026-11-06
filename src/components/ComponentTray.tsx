import React from 'react';
import { IC_CATALOG } from '../data/icPinouts';
import { Plus, RotateCcw, CheckSquare, Sparkles } from 'lucide-react';

interface ComponentTrayProps {
  availableICs: string[]; // e.g. ['7486', '7408', '7432', '7404']
  selectedWireColor: string;
  onSelectWireColor: (color: string) => void;
  onAddIC: (model: string) => void;
  onAddLED?: (color: 'red' | 'green') => void;
  onAddResistor?: (resistance: number) => void;
  onResetBoard: () => void;
  onLoadReferenceCircuit: () => void;
  hasReferenceCircuit: boolean;
  onCheckOutput: () => void;
}

export const WIRE_COLORS = [
  { name: 'Red (+5V)', color: '#ef4444' },
  { name: 'Blue (GND)', color: '#3b82f6' },
  { name: 'Green (Out)', color: '#22c55e' },
  { name: 'Yellow (In)', color: '#eab308' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'White', color: '#e2e8f0' },
];

export const ComponentTray: React.FC<ComponentTrayProps> = ({
  availableICs,
  selectedWireColor,
  onSelectWireColor,
  onAddIC,
  onAddLED,
  onAddResistor,
  onResetBoard,
  onLoadReferenceCircuit,
  hasReferenceCircuit,
  onCheckOutput
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-4">
      {/* Top row: Available ICs, Discrete Components, and Quick Place buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Component Tray (ICs for this Practical)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableICs.map((model) => {
              const def = IC_CATALOG[model];
              return (
                <button
                  key={model}
                  onClick={() => onAddIC(model)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-blue-500/60 text-xs font-mono font-semibold transition-all shadow-sm active:scale-95"
                  title={def?.description || `Add IC ${model}`}
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>IC {model}</span>
                  <span className="text-[10px] text-slate-400">({def?.pinCount || 14}P)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discrete Components (LEDs & Resistors) */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Discrete Components
          </span>
          <div className="flex flex-wrap gap-1.5">
            {onAddLED && (
              <>
                <button
                  onClick={() => onAddLED('red')}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-red-500/60 text-xs font-medium transition-all shadow-sm active:scale-95"
                  title="Add a 5mm Red LED to Breadboard"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] inline-block" />
                  <span>Red LED</span>
                </button>
                <button
                  onClick={() => onAddLED('green')}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/60 text-xs font-medium transition-all shadow-sm active:scale-95"
                  title="Add a 5mm Green LED to Breadboard"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] inline-block" />
                  <span>Green LED</span>
                </button>
              </>
            )}
            {onAddResistor && (
              <button
                onClick={() => onAddResistor(330)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/60 text-xs font-medium transition-all shadow-sm active:scale-95"
                title="Add 330Ω Axial Pull-Down Resistor"
              >
                <span className="px-1 py-0.2 rounded bg-amber-200 text-amber-900 font-mono text-[9px] font-bold">
                  330Ω
                </span>
                <span>Resistor</span>
              </button>
            )}
          </div>
        </div>

        {/* Wire Color Palette */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Jumper Wire Color
          </span>
          <div className="flex items-center space-x-1.5">
            {WIRE_COLORS.map((item) => (
              <button
                key={item.color}
                onClick={() => onSelectWireColor(item.color)}
                style={{ backgroundColor: item.color }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedWireColor === item.color
                    ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                    : 'border-slate-800 hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                title={item.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Check Output Button */}
          <button
            onClick={onCheckOutput}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Check Output</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Load Reference Setup */}
          {hasReferenceCircuit && (
            <button
              onClick={onLoadReferenceCircuit}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/60 text-xs font-medium transition-all"
              title="Place and connect verified reference circuit for study"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Load Reference Setup</span>
            </button>
          )}

          {/* Reset / Clear Board */}
          <button
            onClick={onResetBoard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-800/80 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
