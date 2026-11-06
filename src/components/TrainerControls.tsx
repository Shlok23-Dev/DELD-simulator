import React from 'react';
import { Power, Zap, Clock } from 'lucide-react';

interface TrainerControlsProps {
  powerOn: boolean;
  onTogglePower: () => void;
  switches: (0 | 1)[];
  onToggleSwitch: (index: number) => void;
  clock: 0 | 1;
  onPulseClock: () => void;
  autoClock: boolean;
  onToggleAutoClock: () => void;
  activeWiringSource: string | null;
  onSelectTerminal: (termId: string) => void;
  isSequential: boolean;
  recommendedInputs?: { name: string; swIndex: number }[];
}

export const TrainerControls: React.FC<TrainerControlsProps> = ({
  powerOn,
  onTogglePower,
  switches,
  onToggleSwitch,
  clock,
  onPulseClock,
  autoClock,
  onToggleAutoClock,
  activeWiringSource,
  onSelectTerminal,
  isSequential,
  recommendedInputs
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-4">
      {/* Top Console Deck */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: DC Power Supply Block with wireable +5V and GND terminals */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
          {/* Main Power Switch */}
          <button
            onClick={onTogglePower}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
              powerOn
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 ring-2 ring-red-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Power: {powerOn ? 'ON (+5V)' : 'OFF'}</span>
          </button>

          {/* Wireable Power Supply Terminals */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <span className="text-[11px] font-mono font-semibold text-slate-400 mr-1">
              DC Bus Pins:
            </span>

            {/* +5V Terminal Pin */}
            <button
              onClick={() => onSelectTerminal('pwr:vcc')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md border text-xs font-mono font-bold transition-all ${
                activeWiringSource === 'pwr:vcc'
                  ? 'bg-red-600 border-white text-white ring-2 ring-red-400 scale-105'
                  : 'bg-red-950/60 hover:bg-red-900/60 border-red-700 text-red-300'
              }`}
              title="Click to route +5V Power jumper wire"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
              <span>+5V Pin</span>
            </button>

            {/* GND Terminal Pin */}
            <button
              onClick={() => onSelectTerminal('pwr:gnd')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md border text-xs font-mono font-bold transition-all ${
                activeWiringSource === 'pwr:gnd'
                  ? 'bg-blue-600 border-white text-white ring-2 ring-blue-400 scale-105'
                  : 'bg-blue-950/60 hover:bg-blue-900/60 border-blue-700 text-blue-300'
              }`}
              title="Click to route Ground (0V) jumper wire"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
              <span>GND Pin</span>
            </button>
          </div>
        </div>

        {/* Right: Clock Pulse Controls (for Sequential practicals) */}
        {isSequential && (
          <div className="flex items-center space-x-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center mr-1">
              <Clock className="w-3.5 h-3.5 mr-1 text-pink-400" />
              Clock Pulse:
            </span>

            {/* Manual pulse button */}
            <button
              onClick={onPulseClock}
              disabled={!powerOn}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-bold text-xs text-white transition-transform active:scale-95 ${
                powerOn
                  ? 'bg-pink-600 hover:bg-pink-500 shadow-md shadow-pink-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              title="Apply single clock pulse (Falling edge triggers flip-flops)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Step Pulse</span>
            </button>

            {/* Auto clock toggle */}
            <button
              onClick={onToggleAutoClock}
              disabled={!powerOn}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                autoClock
                  ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto 1Hz: {autoClock ? 'ON' : 'OFF'}
            </button>

            {/* Clock Terminal Socket */}
            <button
              onClick={() => onSelectTerminal('clk')}
              className={`px-2.5 py-1.5 rounded-md border text-xs font-mono font-bold flex items-center space-x-1 transition-all ${
                activeWiringSource === 'clk'
                  ? 'bg-pink-600 border-white text-white ring-2 ring-pink-400 scale-105'
                  : 'bg-pink-950/60 hover:bg-pink-900/60 border-pink-700 text-pink-300'
              }`}
              title="Wire from Clock Socket"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${clock === 1 ? 'bg-pink-400 shadow-[0_0_6px_#ec4899]' : 'bg-slate-600'}`} />
              <span>CLK Pin</span>
            </button>
          </div>
        )}
      </div>

      {/* Logic Input Switches Panel (SW0 .. SW7) with Wireable Female Header Pins */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Logic Input Switches (SW0 – SW7)
          </span>
          <span className="text-[11px] text-slate-400">
            Click toggle to switch 0/1 • Click female header pin below to wire to breadboard
          </span>
        </div>

        <div className="grid grid-cols-8 gap-2">
          {switches.map((val, idx) => {
            const termId = `sw:${idx}`;
            const isSelected = activeWiringSource === termId;
            const recLabel = recommendedInputs?.find(r => r.swIndex === idx)?.name;

            return (
              <div key={idx} className="flex flex-col items-center bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {/* Switch Label */}
                <div className="text-[11px] font-mono font-bold text-slate-300 mb-1">
                  SW{idx}
                </div>

                {/* Physical Toggle Lever */}
                <button
                  onClick={() => onToggleSwitch(idx)}
                  className={`w-full py-2.5 rounded-md font-mono font-bold text-sm flex flex-col items-center justify-center border transition-all shadow-inner ${
                    val === 1
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-950'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Toggle SW${idx}: Currently ${val}`}
                >
                  <span>{val}</span>
                </button>

                {/* Wireable Female Header Pin */}
                <div className="mt-2 w-full pt-1.5 border-t border-slate-800 flex flex-col items-center">
                  <button
                    onClick={() => onSelectTerminal(termId)}
                    className={`w-full py-1 px-1 text-[10px] font-mono font-bold rounded flex items-center justify-center space-x-1 border transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-white text-black ring-2 ring-amber-400 scale-105 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                    }`}
                    title={`Click female header pin to route jumper wire from SW${idx}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span>PIN {idx}</span>
                  </button>
                </div>

                {recLabel && (
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full text-center" title={recLabel}>
                    {recLabel.split(' ')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
