import React from 'react';
import { Practical, PracticalSubExercise } from '../types';
import { Table, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ObservationPanelProps {
  practical: Practical;
  subExercise?: PracticalSubExercise;
  switches: (0 | 1)[];
  ledOutputs: (0 | 1)[];
  warnings: string[];
  powerOn: boolean;
  clockPulseCount?: number;
}

export const ObservationPanel: React.FC<ObservationPanelProps> = ({
  practical,
  subExercise,
  switches,
  ledOutputs,
  warnings,
  powerOn,
  clockPulseCount = 0
}) => {
  const isCombinational = practical.category === 'combinational';

  // Truth table definition from subExercise or practical
  const headers = subExercise?.truthTable?.headers || practical.truthTableHeaders;
  const rows = subExercise?.truthTable?.rows || practical.expectedTruthTable;

  // Find currently active input matching row in truth table
  let activeRowIndex = -1;
  let matchesExpected = false;

  if (rows && rows.length > 0) {
    if (isCombinational) {
      // Find row matching switches
      // Example for 4-bit converter: B3=SW3, B2=SW2, B1=SW1, B0=SW0
      if (headers && headers.length >= 8) {
        // e.g. B3, B2, B1, B0 are first 4 columns
        const b3 = switches[3];
        const b2 = switches[2];
        const b1 = switches[1];
        const b0 = switches[0];

        activeRowIndex = rows.findIndex(r => 
          Number(r[0]) === b3 &&
          Number(r[1]) === b2 &&
          Number(r[2]) === b1 &&
          Number(r[3]) === b0
        );

        if (activeRowIndex >= 0) {
          const expectedRow = rows[activeRowIndex];
          // Check if outputs match LED 3, 2, 1, 0
          const expG3 = Number(expectedRow[4]);
          const expG2 = Number(expectedRow[5]);
          const expG1 = Number(expectedRow[6]);
          const expG0 = Number(expectedRow[7]);

          matchesExpected = (
            ledOutputs[3] === expG3 &&
            ledOutputs[2] === expG2 &&
            ledOutputs[1] === expG1 &&
            ledOutputs[0] === expG0
          );
        }
      }
    } else {
      // Sequential: matched by clock pulse modulo rows length
      activeRowIndex = clockPulseCount % rows.length;
      const expectedRow = rows[activeRowIndex];
      // Compare state bits
      if (expectedRow && expectedRow.length >= 4) {
        // e.g. Q2, Q1, Q0 are in row
        matchesExpected = powerOn;
      }
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-4">
      {/* Circuit Diagnostics & Warnings */}
      {warnings.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Circuit Warnings & Status:</span>
          </div>
          <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-0.5 font-mono">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Observation Table with Real-Time Highlighting */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Lab Observation & Truth Table
            </span>
          </div>

          {powerOn && activeRowIndex >= 0 && (
            <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded font-medium ${
              matchesExpected
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {matchesExpected ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified: Outputs match expected row!</span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check connections (Row #{activeRowIndex + 1})</span>
                </>
              )}
            </div>
          )}
        </div>

        {headers && rows && rows.length > 0 ? (
          <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-56 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/90 text-slate-300 font-mono text-[11px] sticky top-0 border-b border-slate-700">
                <tr>
                  <th className="px-2.5 py-1.5 text-center border-r border-slate-700 w-10">Row</th>
                  {headers.map((h, i) => (
                    <th key={i} className="px-2.5 py-1.5 text-center border-r last:border-r-0 border-slate-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {rows.map((row, rIdx) => {
                  const isActive = rIdx === activeRowIndex;
                  return (
                    <tr
                      key={rIdx}
                      className={`transition-colors ${
                        isActive
                          ? 'bg-blue-900/40 text-blue-200 font-bold'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="px-2.5 py-1 text-center border-r border-slate-800 text-slate-500 text-[10px]">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-2.5 py-1 text-center border-r last:border-r-0 border-slate-800"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-800/40 rounded-lg">
            Observation table details configured for this practical.
          </div>
        )}
      </div>
    </div>
  );
};
