import React, { useState, useEffect } from 'react';
import { PlacedIC, PlacedLED, PlacedResistor, Wire } from '../simulation/circuitEngine';
import { IC_CATALOG } from '../data/icPinouts';
import { LogicLevel } from '../simulation/logic';
import { Trash2, X } from 'lucide-react';

interface BreadboardSVGProps {
  placedICs: PlacedIC[];
  placedLEDs: PlacedLED[];
  placedResistors: PlacedResistor[];
  wires: Wire[];
  ledStates: Record<string, boolean>;
  activeWiringSource: string | null;
  selectedWireId: string | null;
  selectedICId: string | null;
  selectedLEDId: string | null;
  selectedResistorId: string | null;
  onSelectTerminal: (termId: string) => void;
  onSelectWire: (wireId: string | null) => void;
  onSelectIC: (icId: string | null) => void;
  onSelectLED: (ledId: string | null) => void;
  onSelectResistor: (resistorId: string | null) => void;
  onDeleteWire: (wireId: string) => void;
  onDeleteIC: (icId: string) => void;
  onDeleteLED: (ledId: string) => void;
  onDeleteResistor: (resistorId: string) => void;
  onMoveIC: (icId: string, newCol: number) => void;
  icPowerStatus: Record<string, boolean>;
  icPinLevels: Record<string, Record<number, LogicLevel>>;
}

export const COLS = 36;
export const COL_WIDTH = 24;
export const MARGIN_LEFT = 40;
export const MARGIN_RIGHT = 30;
export const SVG_WIDTH = MARGIN_LEFT + COLS * COL_WIDTH + MARGIN_RIGHT;
export const SVG_HEIGHT = 430;

export const ROW_Y: Record<string, number> = {
  // Top rails
  vcc_top: 90,
  gnd_top: 110,
  // Upper terminal strip
  A: 145,
  B: 163,
  C: 181,
  D: 199,
  E: 217,
  // Lower terminal strip
  F: 275,
  G: 293,
  H: 311,
  I: 329,
  J: 347,
  // Bottom rails
  vcc_bot: 377,
  gnd_bot: 397,
};

export const getTerminalCoords = (termId: string): { x: number; y: number } => {
  if (termId.startsWith('top:')) {
    const [, colStr, row] = termId.split(':');
    const col = parseInt(colStr, 10);
    return {
      x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2,
      y: ROW_Y[row] || ROW_Y.A
    };
  }
  if (termId.startsWith('bot:')) {
    const [, colStr, row] = termId.split(':');
    const col = parseInt(colStr, 10);
    return {
      x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2,
      y: ROW_Y[row] || ROW_Y.F
    };
  }
  if (termId.startsWith('vcc_top:')) {
    const col = parseInt(termId.split(':')[1], 10);
    return { x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2, y: ROW_Y.vcc_top };
  }
  if (termId.startsWith('gnd_top:')) {
    const col = parseInt(termId.split(':')[1], 10);
    return { x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2, y: ROW_Y.gnd_top };
  }
  if (termId.startsWith('vcc_bot:')) {
    const col = parseInt(termId.split(':')[1], 10);
    return { x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2, y: ROW_Y.vcc_bot };
  }
  if (termId.startsWith('gnd_bot:')) {
    const col = parseInt(termId.split(':')[1], 10);
    return { x: MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2, y: ROW_Y.gnd_bot };
  }

  // Trainer Header Bar Sockets along top (y = 35)
  if (termId === 'pwr:vcc') {
    return { x: 50, y: 35 };
  }
  if (termId === 'pwr:gnd') {
    return { x: 95, y: 35 };
  }
  if (termId.startsWith('sw:')) {
    const idx = parseInt(termId.split(':')[1], 10);
    return { x: 180 + idx * 42, y: 35 };
  }
  if (termId === 'clk') {
    return { x: 550, y: 35 };
  }

  return { x: 50, y: 50 };
};

export const BreadboardSVG: React.FC<BreadboardSVGProps> = ({
  placedICs,
  placedLEDs,
  placedResistors,
  wires,
  ledStates,
  activeWiringSource,
  selectedWireId,
  selectedICId,
  selectedLEDId,
  selectedResistorId,
  onSelectTerminal,
  onSelectWire,
  onSelectIC,
  onSelectLED,
  onSelectResistor,
  onDeleteWire,
  onDeleteIC,
  onDeleteLED,
  onDeleteResistor,
  onMoveIC,
  icPowerStatus,
  icPinLevels
}) => {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);

  // Global Delete / Backspace key listener to delete selected elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          onDeleteWire(selectedWireId);
        } else if (selectedICId) {
          onDeleteIC(selectedICId);
        } else if (selectedLEDId) {
          onDeleteLED(selectedLEDId);
        } else if (selectedResistorId) {
          onDeleteResistor(selectedResistorId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWireId, selectedICId, selectedLEDId, selectedResistorId]);

  return (
    <div className="relative overflow-x-auto bg-slate-900/90 rounded-2xl border border-slate-700/80 p-2 shadow-inner">
      {/* Floating Toolbar for Selected Elements */}
      {selectedWireId && (
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg">
          <span className="text-xs font-semibold text-slate-200">Wire Selected</span>
          <button
            onClick={() => onDeleteWire(selectedWireId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Wire</span>
          </button>
          <button
            onClick={() => onSelectWire(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {selectedICId && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg">
          {(() => {
            const ic = placedICs.find(i => i.id === selectedICId);
            if (!ic) return null;
            return (
              <>
                <span className="text-xs font-mono font-bold text-blue-400">
                  IC {ic.model} (Col {ic.col + 1})
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onMoveIC(ic.id, Math.max(0, ic.col - 1))}
                    disabled={ic.col <= 0}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-40"
                    title="Move Left 1 Column"
                  >
                    ◀ Left
                  </button>
                  <button
                    onClick={() => onMoveIC(ic.id, Math.min(COLS - 8, ic.col + 1))}
                    disabled={ic.col >= COLS - 8}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-40"
                    title="Move Right 1 Column"
                  >
                    Right ▶
                  </button>
                </div>
                <button
                  onClick={() => onDeleteIC(selectedICId)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove IC</span>
                </button>
                <button
                  onClick={() => onSelectIC(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            );
          })()}
        </div>
      )}

      {selectedLEDId && (
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg">
          <span className="text-xs font-semibold text-emerald-400">Physical LED Selected</span>
          <button
            onClick={() => onDeleteLED(selectedLEDId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete LED</span>
          </button>
          <button
            onClick={() => onSelectLED(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {selectedResistorId && (
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg">
          <span className="text-xs font-semibold text-amber-300">330Ω Resistor Selected</span>
          <button
            onClick={() => onDeleteResistor(selectedResistorId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Resistor</span>
          </button>
          <button
            onClick={() => onSelectResistor(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Breadboard SVG Canvas */}
      <svg
        className="breadboard-svg block mx-auto cursor-crosshair select-none"
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      >
        <defs>
          {/* LED bright emission radial gradients */}
          <radialGradient id="led-green-lit" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#dcfce7" />
            <stop offset="30%" stopColor="#4ade80" />
            <stop offset="75%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <radialGradient id="led-green-off" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>

          <radialGradient id="led-red-lit" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fee2e2" />
            <stop offset="30%" stopColor="#f87171" />
            <stop offset="75%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <radialGradient id="led-red-off" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>

          {/* LED intense glow filter */}
          <filter id="led-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
          <filter id="ic-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* 1. TOP TRAINER HEADER BAR (PHYSICAL FEMALE HEADERS: POWER, SWITCHES, CLOCK) */}
        <rect
          x="10"
          y="10"
          width={SVG_WIDTH - 20}
          height="52"
          rx="8"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Power Supply Headers (+5V, GND) */}
        <g>
          <text x="50" y="22" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">+5V</text>
          <circle
            cx="50"
            cy="35"
            r="5"
            fill={activeWiringSource === 'pwr:vcc' ? '#22c55e' : '#ef4444'}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="cursor-pointer"
            onClick={() => onSelectTerminal('pwr:vcc')}
            onMouseEnter={() => setHoveredTerm('+5V Power Terminal')}
            onMouseLeave={() => setHoveredTerm(null)}
          />
          <text x="95" y="22" textAnchor="middle" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">GND</text>
          <circle
            cx="95"
            cy="35"
            r="5"
            fill={activeWiringSource === 'pwr:gnd' ? '#22c55e' : '#3b82f6'}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="cursor-pointer"
            onClick={() => onSelectTerminal('pwr:gnd')}
            onMouseEnter={() => setHoveredTerm('Ground (0V) Terminal')}
            onMouseLeave={() => setHoveredTerm(null)}
          />
        </g>

        {/* Switch Female Header Pins (SW0 to SW7) */}
        <g>
          <text x="140" y="38" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">SWITCHES:</text>
          {Array.from({ length: 8 }).map((_, idx) => {
            const x = 180 + idx * 42;
            const termId = `sw:${idx}`;
            const isActive = activeWiringSource === termId;
            return (
              <g key={idx}>
                <text x={x} y="22" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  SW{idx}
                </text>
                <circle
                  cx={x}
                  cy="35"
                  r="5"
                  fill={isActive ? '#22c55e' : '#1e293b'}
                  stroke={isActive ? '#4ade80' : '#f59e0b'}
                  strokeWidth="1.8"
                  className="cursor-pointer"
                  onClick={() => onSelectTerminal(termId)}
                  onMouseEnter={() => setHoveredTerm(`Switch Socket SW${idx}`)}
                  onMouseLeave={() => setHoveredTerm(null)}
                />
                <circle cx={x} cy="35" r="2" fill="#d97706" />
              </g>
            );
          })}
        </g>

        {/* Clock Socket */}
        <g>
          <text x="550" y="22" textAnchor="middle" fill="#ec4899" fontSize="8" fontFamily="monospace" fontWeight="bold">CLK</text>
          <circle
            cx="550"
            cy="35"
            r="5"
            fill={activeWiringSource === 'clk' ? '#22c55e' : '#ec4899'}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="cursor-pointer"
            onClick={() => onSelectTerminal('clk')}
            onMouseEnter={() => setHoveredTerm('Clock Pulse Socket')}
            onMouseLeave={() => setHoveredTerm(null)}
          />
        </g>

        {/* 2. MAIN BREADBOARD PLASTIC BODY */}
        <rect
          x="10"
          y="72"
          width={SVG_WIDTH - 20}
          height={SVG_HEIGHT - 82}
          rx="12"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Center Ravine / IC Groove */}
        <rect
          x="15"
          y="237"
          width={SVG_WIDTH - 30}
          height="22"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Top Power Rails (Red VCC, Blue GND) */}
        <line
          x1={MARGIN_LEFT}
          y1={ROW_Y.vcc_top}
          x2={MARGIN_LEFT + COLS * COL_WIDTH}
          y2={ROW_Y.vcc_top}
          stroke="#ef4444"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <text x="18" y={ROW_Y.vcc_top + 4} fill="#ef4444" fontSize="11" fontWeight="bold">+</text>

        <line
          x1={MARGIN_LEFT}
          y1={ROW_Y.gnd_top}
          x2={MARGIN_LEFT + COLS * COL_WIDTH}
          y2={ROW_Y.gnd_top}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <text x="20" y={ROW_Y.gnd_top + 4} fill="#3b82f6" fontSize="13" fontWeight="bold">-</text>

        {/* Bottom Power Rails (Red VCC, Blue GND) */}
        <line
          x1={MARGIN_LEFT}
          y1={ROW_Y.vcc_bot}
          x2={MARGIN_LEFT + COLS * COL_WIDTH}
          y2={ROW_Y.vcc_bot}
          stroke="#ef4444"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <text x="18" y={ROW_Y.vcc_bot + 4} fill="#ef4444" fontSize="11" fontWeight="bold">+</text>

        <line
          x1={MARGIN_LEFT}
          y1={ROW_Y.gnd_bot}
          x2={MARGIN_LEFT + COLS * COL_WIDTH}
          y2={ROW_Y.gnd_bot}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <text x="20" y={ROW_Y.gnd_bot + 4} fill="#3b82f6" fontSize="13" fontWeight="bold">-</text>

        {/* Row Letter Labels Left and Right */}
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row) => (
          <g key={row}>
            <text x="25" y={ROW_Y[row] + 4} fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {row}
            </text>
            <text x={SVG_WIDTH - 25} y={ROW_Y[row] + 4} fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {row}
            </text>
          </g>
        ))}

        {/* Column Numbers at Top and Bottom */}
        {Array.from({ length: COLS }).map((_, c) => {
          const colNum = c + 1;
          const showNum = colNum === 1 || colNum % 5 === 0;
          if (!showNum) return null;
          const x = MARGIN_LEFT + c * COL_WIDTH + COL_WIDTH / 2;
          return (
            <g key={c}>
              <text x={x} y="132" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                {colNum}
              </text>
              <text x={x} y="365" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                {colNum}
              </text>
            </g>
          );
        })}

        {/* Breadboard Holes Grid */}
        {Array.from({ length: COLS }).map((_, col) => {
          const x = MARGIN_LEFT + col * COL_WIDTH + COL_WIDTH / 2;

          return (
            <g key={col}>
              {/* Top Rails */}
              <circle
                cx={x}
                cy={ROW_Y.vcc_top}
                r="3.5"
                fill={activeWiringSource === `vcc_top:${col}` ? '#22c55e' : '#334155'}
                stroke="#64748b"
                strokeWidth="1.2"
                className="hover:stroke-emerald-400 cursor-pointer"
                onClick={() => onSelectTerminal(`vcc_top:${col}`)}
                onMouseEnter={() => setHoveredTerm(`vcc_top:${col}`)}
                onMouseLeave={() => setHoveredTerm(null)}
              />
              <circle
                cx={x}
                cy={ROW_Y.gnd_top}
                r="3.5"
                fill={activeWiringSource === `gnd_top:${col}` ? '#22c55e' : '#334155'}
                stroke="#64748b"
                strokeWidth="1.2"
                className="hover:stroke-emerald-400 cursor-pointer"
                onClick={() => onSelectTerminal(`gnd_top:${col}`)}
                onMouseEnter={() => setHoveredTerm(`gnd_top:${col}`)}
                onMouseLeave={() => setHoveredTerm(null)}
              />

              {/* Upper Terminal Strip (Rows A, B, C, D, E) */}
              {['A', 'B', 'C', 'D', 'E'].map((row) => {
                const termId = `top:${col}:${row}`;
                const isActive = activeWiringSource === termId;
                return (
                  <circle
                    key={row}
                    cx={x}
                    cy={ROW_Y[row]}
                    r="3.5"
                    fill={isActive ? '#22c55e' : '#334155'}
                    stroke={isActive ? '#4ade80' : '#64748b'}
                    strokeWidth="1.2"
                    className="hover:stroke-emerald-400 cursor-pointer"
                    onClick={() => onSelectTerminal(termId)}
                    onMouseEnter={() => setHoveredTerm(termId)}
                    onMouseLeave={() => setHoveredTerm(null)}
                  />
                );
              })}

              {/* Lower Terminal Strip (Rows F, G, H, I, J) */}
              {['F', 'G', 'H', 'I', 'J'].map((row) => {
                const termId = `bot:${col}:${row}`;
                const isActive = activeWiringSource === termId;
                return (
                  <circle
                    key={row}
                    cx={x}
                    cy={ROW_Y[row]}
                    r="3.5"
                    fill={isActive ? '#22c55e' : '#334155'}
                    stroke={isActive ? '#4ade80' : '#64748b'}
                    strokeWidth="1.2"
                    className="hover:stroke-emerald-400 cursor-pointer"
                    onClick={() => onSelectTerminal(termId)}
                    onMouseEnter={() => setHoveredTerm(termId)}
                    onMouseLeave={() => setHoveredTerm(null)}
                  />
                );
              })}

              {/* Bottom Rails */}
              <circle
                cx={x}
                cy={ROW_Y.vcc_bot}
                r="3.5"
                fill={activeWiringSource === `vcc_bot:${col}` ? '#22c55e' : '#334155'}
                stroke="#64748b"
                strokeWidth="1.2"
                className="hover:stroke-emerald-400 cursor-pointer"
                onClick={() => onSelectTerminal(`vcc_bot:${col}`)}
                onMouseEnter={() => setHoveredTerm(`vcc_bot:${col}`)}
                onMouseLeave={() => setHoveredTerm(null)}
              />
              <circle
                cx={x}
                cy={ROW_Y.gnd_bot}
                r="3.5"
                fill={activeWiringSource === `gnd_bot:${col}` ? '#22c55e' : '#334155'}
                stroke="#64748b"
                strokeWidth="1.2"
                className="hover:stroke-emerald-400 cursor-pointer"
                onClick={() => onSelectTerminal(`gnd_bot:${col}`)}
                onMouseEnter={() => setHoveredTerm(`gnd_bot:${col}`)}
                onMouseLeave={() => setHoveredTerm(null)}
              />
            </g>
          );
        })}

        {/* 3. PLACED DIP ICS (SITTING ACROSS CENTER GROOVE) */}
        {placedICs.map((ic) => {
          const def = IC_CATALOG[ic.model];
          if (!def) return null;
          const halfPins = def.pinCount / 2;
          const x = MARGIN_LEFT + ic.col * COL_WIDTH + 2;
          const w = halfPins * COL_WIDTH - 4;
          const y = 219;
          const h = 58;
          const isSelected = selectedICId === ic.id;
          const hasPower = icPowerStatus[ic.id] ?? false;

          return (
            <g
              key={ic.id}
              filter="url(#ic-shadow)"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectIC(isSelected ? null : ic.id);
              }}
            >
              {/* Metallic IC DIP Pins into Row E and Row F */}
              {Array.from({ length: halfPins }).map((_, i) => {
                const pinX = MARGIN_LEFT + (ic.col + i) * COL_WIDTH + COL_WIDTH / 2;
                // Standard counter-clockwise DIP orientation (notch on left):
                // Top row (Row E): Pin N down to Pin (N/2)+1 from Left to Right
                // Bottom row (Row F): Pin 1 up to Pin N/2 from Left to Right
                const topPinNum = def.pinCount - i;
                const botPinNum = i + 1;
                const topPinDef = def.pins.find(p => p.pinNumber === topPinNum);
                const botPinDef = def.pins.find(p => p.pinNumber === botPinNum);
                const topLevel = icPinLevels[ic.id]?.[topPinNum] ?? 'Z';
                const botLevel = icPinLevels[ic.id]?.[botPinNum] ?? 'Z';

                return (
                  <g key={i}>
                    {/* Top Pin Leg extending into Row E */}
                    <rect
                      x={pinX - 2.5}
                      y={y - 6}
                      width="5"
                      height="8"
                      fill="#94a3b8"
                      stroke="#475569"
                      strokeWidth="0.8"
                    >
                      <title>{`Pin ${topPinNum} (${topPinDef?.name || ''}): ${topLevel}`}</title>
                    </rect>
                    {/* Bottom Pin Leg extending into Row F */}
                    <rect
                      x={pinX - 2.5}
                      y={y + h - 2}
                      width="5"
                      height="8"
                      fill="#94a3b8"
                      stroke="#475569"
                      strokeWidth="0.8"
                    >
                      <title>{`Pin ${botPinNum} (${botPinDef?.name || ''}): ${botLevel}`}</title>
                    </rect>

                    {/* Pin number text on IC body */}
                    <text
                      x={pinX}
                      y={y + 10}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      {topPinNum}
                    </text>
                    <text
                      x={pinX}
                      y={y + h - 4}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      {botPinNum}
                    </text>
                  </g>
                );
              })}

              {/* Main IC Plastic DIP Body */}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="4"
                fill="#0f172a"
                stroke={isSelected ? '#38bdf8' : hasPower ? '#22c55e' : '#475569'}
                strokeWidth={isSelected ? '2' : '1.5'}
              />

              {/* IC Notch on Left Side */}
              <path
                d={`M ${x} ${y + h / 2 - 6} A 6 6 0 0 1 ${x} ${y + h / 2 + 6}`}
                fill="#1e293b"
                stroke="#334155"
              />

              {/* Pin 1 indicator dot (Bottom-Left, adjacent to Pin 1) */}
              <circle
                cx={x + 7}
                cy={y + h - 8}
                r="2.5"
                fill="#64748b"
              />

              {/* Printed IC Label */}
              <text
                x={x + w / 2}
                y={y + h / 2 - 2}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                SN{ic.model}N
              </text>

              <text
                x={x + w / 2}
                y={y + h / 2 + 10}
                textAnchor="middle"
                fill={hasPower ? '#4ade80' : '#ef4444'}
                fontSize="8"
                fontFamily="monospace"
              >
                {hasPower ? 'POWERED' : 'NO VCC/GND'}
              </text>
            </g>
          );
        })}

        {/* 4. PLACED PHYSICAL 330-OHM AXIAL RESISTORS */}
        {placedResistors.map((resistor) => {
          const pt1 = getTerminalCoords(resistor.fromTerm);
          const pt2 = getTerminalCoords(resistor.toTerm);
          const isSelected = selectedResistorId === resistor.id;

          // Compute midpoint and geometry
          const midX = (pt1.x + pt2.x) / 2;
          const midY = (pt1.y + pt2.y) / 2;
          const isVertical = Math.abs(pt1.x - pt2.x) < 5;

          return (
            <g
              key={resistor.id}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectResistor(isSelected ? null : resistor.id);
              }}
            >
              {/* Wire leads extending into the two breadboard holes */}
              <line
                x1={pt1.x}
                y1={pt1.y}
                x2={pt2.x}
                y2={pt2.y}
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Ceramic beige resistor body */}
              {isVertical ? (
                <g transform={`translate(${midX - 4.5}, ${midY - 12})`}>
                  <rect
                    width="9"
                    height="24"
                    rx="3"
                    fill="#d8c29d"
                    stroke={isSelected ? '#38bdf8' : '#b09670'}
                    strokeWidth={isSelected ? '2' : '1'}
                  />
                  {/* 4 Color bands: Orange (3), Orange (3), Brown (*10), Gold (5%) */}
                  <rect x="0" y="3" width="9" height="2" fill="#ea580c" />
                  <rect x="0" y="7" width="9" height="2" fill="#ea580c" />
                  <rect x="0" y="11" width="9" height="2" fill="#78350f" />
                  <rect x="0" y="18" width="9" height="2.5" fill="#eab308" />
                </g>
              ) : (
                <g transform={`translate(${midX - 12}, ${midY - 4.5})`}>
                  <rect
                    width="24"
                    height="9"
                    rx="3"
                    fill="#d8c29d"
                    stroke={isSelected ? '#38bdf8' : '#b09670'}
                    strokeWidth={isSelected ? '2' : '1'}
                  />
                  <rect x="3" y="0" width="2" height="9" fill="#ea580c" />
                  <rect x="7" y="0" width="2" height="9" fill="#ea580c" />
                  <rect x="11" y="0" width="2" height="9" fill="#78350f" />
                  <rect x="18" y="0" width="2.5" height="9" fill="#eab308" />
                </g>
              )}

              {/* Small label */}
              <text
                x={midX + 8}
                y={midY + 3}
                fill="#64748b"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                330Ω
              </text>
            </g>
          );
        })}

        {/* 5. PLACED PHYSICAL 5MM GLOWING LEDS */}
        {placedLEDs.map((led) => {
          const xAnode = MARGIN_LEFT + led.anodeCol * COL_WIDTH + COL_WIDTH / 2;
          const xCathode = MARGIN_LEFT + led.cathodeCol * COL_WIDTH + COL_WIDTH / 2;
          const xMid = (xAnode + xCathode) / 2;
          const yBase = ROW_Y[led.rowAnode] || ROW_Y.G;
          const isLit = ledStates[led.id] ?? false;
          const isSelected = selectedLEDId === led.id;

          const litGrad = led.color === 'red' ? 'url(#led-red-lit)' : 'url(#led-green-lit)';
          const offGrad = led.color === 'red' ? 'url(#led-red-off)' : 'url(#led-green-off)';
          const glowColor = led.color === 'red' ? '#ef4444' : '#22c55e';

          return (
            <g
              key={led.id}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectLED(isSelected ? null : led.id);
              }}
            >
              {/* Metal Lead Legs into Anode and Cathode holes */}
              <line x1={xAnode} y1={yBase} x2={xMid - 4} y2={yBase - 8} stroke="#94a3b8" strokeWidth="2" />
              <line x1={xCathode} y1={yBase} x2={xMid + 4} y2={yBase - 8} stroke="#94a3b8" strokeWidth="2" />

              {/* Cathode flat lead notch indicator */}
              <circle cx={xAnode} cy={yBase} r="2" fill="#22c55e">
                <title>Anode (+)</title>
              </circle>
              <circle cx={xCathode} cy={yBase} r="2" fill="#ef4444">
                <title>Cathode (-)</title>
              </circle>

              {/* Glowing halo when lit */}
              {isLit && (
                <circle
                  cx={xMid}
                  cy={yBase - 18}
                  r="16"
                  fill={glowColor}
                  opacity="0.4"
                  filter="url(#led-glow)"
                />
              )}

              {/* LED Base Collar / Flange */}
              <rect
                x={xMid - 8}
                y={yBase - 11}
                width="16"
                height="3.5"
                rx="1"
                fill={isLit ? glowColor : '#1e293b'}
                stroke={isSelected ? '#38bdf8' : '#0f172a'}
                strokeWidth="1"
              />

              {/* LED 5mm Dome */}
              <path
                d={`M ${xMid - 7} ${yBase - 11} L ${xMid - 7} ${yBase - 20} A 7 7 0 0 1 ${xMid + 7} ${yBase - 20} L ${xMid + 7} ${yBase - 11} Z`}
                fill={isLit ? litGrad : offGrad}
                stroke={isSelected ? '#38bdf8' : isLit ? '#ffffff' : '#0f172a'}
                strokeWidth={isSelected ? '2' : isLit ? '1.2' : '1'}
                style={isLit ? { filter: `drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 12px ${glowColor})` } : undefined}
              />

              {/* Specular curved reflection highlight */}
              <path
                d={`M ${xMid - 4} ${yBase - 23} A 4 4 0 0 1 ${xMid + 2} ${yBase - 25}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity={isLit ? '0.9' : '0.4'}
              />

              {/* LED Label */}
              <text
                x={xMid}
                y={yBase + 12}
                textAnchor="middle"
                fill={isLit ? glowColor : '#64748b'}
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {led.label.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* 6. JUMPER WIRES */}
        {wires.map((wire) => {
          const fromPt = getTerminalCoords(wire.from);
          const toPt = getTerminalCoords(wire.to);
          const isSelected = selectedWireId === wire.id;

          const dx = toPt.x - fromPt.x;
          const midX = (fromPt.x + toPt.x) / 2;
          const arch = Math.min(60, Math.max(20, Math.abs(dx) * 0.35));
          const midY = (fromPt.y + toPt.y) / 2 - arch;

          const pathD = `M ${fromPt.x} ${fromPt.y} Q ${midX} ${midY} ${toPt.x} ${toPt.y}`;

          return (
            <g
              key={wire.id}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWire(isSelected ? null : wire.id);
              }}
            >
              {/* Invisible thicker hit-box */}
              <path d={pathD} fill="none" stroke="transparent" strokeWidth="12" />

              {/* Shadow */}
              <path
                d={pathD}
                fill="none"
                stroke="#000000"
                strokeWidth="4"
                strokeOpacity="0.4"
                strokeLinecap="round"
                transform="translate(1, 2)"
              />

              {/* Insulated Wire Body */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelected ? '#38bdf8' : wire.color}
                strokeWidth={isSelected ? '4' : '2.8'}
                strokeLinecap="round"
              />

              {/* Endpoint connection pins */}
              <circle cx={fromPt.x} cy={fromPt.y} r="3" fill={wire.color} stroke="#ffffff" strokeWidth="1" />
              <circle cx={toPt.x} cy={toPt.y} r="3" fill={wire.color} stroke="#ffffff" strokeWidth="1" />
            </g>
          );
        })}
      </svg>

      {/* Terminal Hover Info Bar */}
      <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between px-2">
        <div>
          {hoveredTerm ? (
            <span className="text-blue-300">
              Terminal: <strong>{hoveredTerm}</strong>
            </span>
          ) : (
            <span>Tip: Click any switch pin, power pin, or breadboard hole to connect jumper wires. Click any component to delete.</span>
          )}
        </div>
        <div>
          {activeWiringSource && (
            <span className="text-amber-400 font-bold animate-pulse">
              Connecting from: {activeWiringSource} (Click destination hole or pin)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
