import React, { useState } from 'react';
import { Practical } from '../types';
import { Grid, RotateCcw, X } from 'lucide-react';

interface KMapWorksheetProps {
  practical: Practical;
  onClose: () => void;
}

export const KMapWorksheet: React.FC<KMapWorksheetProps> = ({ practical, onClose }) => {
  // 4-variable K-Map (variables A, B on rows; C, D on columns)
  // Rows: 00, 01, 11, 10 (Gray code order: 0, 1, 3, 2)
  // Cols: 00, 01, 11, 10 (Gray code order: 0, 1, 3, 2)
  const [cells, setCells] = useState<Record<number, number | 'X'>>({});

  // Standard minterm numbers for 4-variable K-Map cells [rowIdx][colIdx]
  const mintermGrid = [
    [0, 1, 3, 2],
    [4, 5, 7, 6],
    [12, 13, 15, 14],
    [8, 9, 11, 10]
  ];

  const rowLabels = ['00 (A\'B\')', '01 (A\'B)', '11 (AB)', '10 (AB\')'];
  const colLabels = ['00 (C\'D\')', '01 (C\'D)', '11 (CD)', '10 (CD\')'];

  const handleCellClick = (minterm: number) => {
    setCells(prev => {
      const cur = prev[minterm];
      let next: number | 'X';
      if (cur === undefined || cur === 0) next = 1;
      else if (cur === 1) next = 'X';
      else next = 0;
      return { ...prev, [minterm]: next };
    });
  };

  const handleClear = () => {
    setCells({});
  };

  // Find minterms currently set to 1
  const ones = Object.entries(cells)
    .filter(([_, v]) => v === 1)
    .map(([m]) => Number(m))
    .sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                4-Variable K-Map Worksheet (CO1 Design Tool)
              </h2>
              <p className="text-xs text-slate-400">
                Practical {practical.officialNumber}: {practical.shortTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Click any cell to cycle values: <strong>0 ➔ 1 ➔ X (Don't Care)</strong>. 
          Use this interactive map to group adjacent powers-of-two (1s, 2s, 4s, 8s) to find minimal SOP expressions before breadboard wiring.
        </p>

        {/* K-Map Table */}
        <div className="overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
          <table className="border-collapse text-xs font-mono select-none">
            <thead>
              <tr>
                <th className="p-2 text-slate-500 text-[10px] border border-slate-800 text-center">
                  AB \ CD
                </th>
                {colLabels.map((col, idx) => (
                  <th
                    key={idx}
                    className="p-2 border border-slate-800 text-center font-bold text-blue-300 bg-slate-900/60"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mintermGrid.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-2 border border-slate-800 font-bold text-blue-300 text-center bg-slate-900/60 whitespace-nowrap">
                    {rowLabels[rIdx]}
                  </td>
                  {row.map((minterm) => {
                    const val = cells[minterm];
                    const isOne = val === 1;
                    const isX = val === 'X';

                    return (
                      <td
                        key={minterm}
                        onClick={() => handleCellClick(minterm)}
                        className={`w-16 h-14 border border-slate-800 text-center cursor-pointer transition-all relative ${
                          isOne
                            ? 'bg-emerald-950/80 text-emerald-300 font-extrabold text-base border-emerald-600/60'
                            : isX
                            ? 'bg-amber-950/60 text-amber-300 font-extrabold text-base border-amber-600/60'
                            : 'hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {/* Minterm subscript */}
                        <span className="absolute top-1 left-1.5 text-[9px] text-slate-500 font-normal">
                          m{minterm}
                        </span>
                        <span>{val !== undefined ? val : 0}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Minterms Display */}
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-400 block text-[11px]">Selected Minterms (Σm):</span>
            <span className="font-mono text-emerald-400 font-bold">
              {ones.length > 0 ? `Σm(${ones.join(', ')})` : 'None selected'}
            </span>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Map</span>
          </button>
        </div>

        {/* Educational Note from Syllabus */}
        {practical.kmapNotes && (
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200/90 leading-relaxed">
            <strong className="text-blue-300 block mb-0.5">Syllabus Design Note:</strong>
            {practical.kmapNotes}
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
