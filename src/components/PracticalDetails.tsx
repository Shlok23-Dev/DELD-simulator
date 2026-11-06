import React, { useState } from 'react';
import { Practical } from '../types';
import { IC_CATALOG } from '../data/icPinouts';
import { KMapWorksheet } from './KMapWorksheet';
import { 
  ArrowLeft, 
  Play, 
  Cpu, 
  ListChecks, 
  Table, 
  HelpCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Grid
} from 'lucide-react';

interface PracticalDetailsProps {
  practical: Practical;
  onBack: () => void;
  onStartPractice: (practicalId: number, subExerciseId?: string) => void;
}

export const PracticalDetails: React.FC<PracticalDetailsProps> = ({
  practical,
  onBack,
  onStartPractice,
}) => {
  const [selectedSubExerciseId, setSelectedSubExerciseId] = useState<string>(
    practical.subExercises && practical.subExercises.length > 0
      ? practical.subExercises[0].id
      : ''
  );

  const [expandedViva, setExpandedViva] = useState<number | null>(null);
  const [showPinoutModal, setShowPinoutModal] = useState<string | null>(null);
  const [showKMapModal, setShowKMapModal] = useState<boolean>(false);

  const isCombinational = practical.category === 'combinational';

  const currentSubExercise = practical.subExercises?.find(
    (s) => s.id === selectedSubExerciseId
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Syllabus List</span>
        </button>

        <div className="flex items-center space-x-2">
          {isCombinational && (
            <button
              onClick={() => setShowKMapModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span>K-Map Worksheet (CO1)</span>
            </button>
          )}

          <button
            onClick={() => onStartPractice(practical.id, selectedSubExerciseId || undefined)}
            className={`inline-flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
              isCombinational
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Open Virtual Breadboard</span>
          </button>
        </div>
      </div>

      {/* Practical Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
            isCombinational 
              ? 'bg-blue-950 text-blue-300 border border-blue-800' 
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            Practical {practical.officialNumber}
          </span>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            {practical.syllabusCategory}
          </span>
          {practical.coMapped.map((co) => (
            <span
              key={co}
              className="text-xs bg-slate-950 text-blue-400 px-2 py-0.5 rounded border border-blue-900 font-semibold"
            >
              Mapped: {co}
            </span>
          ))}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          {practical.title}
        </h1>

        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center">
            <Info className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Aim & Description
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed mb-2 font-medium">
            {practical.aim}
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            {practical.description}
          </p>
        </div>
      </div>

      {/* Sub-exercises selector tabs if available */}
      {practical.subExercises && practical.subExercises.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
          <div className="text-xs font-semibold text-slate-400 px-3 py-1">
            Choose Experiment Part / Exercise:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
            {practical.subExercises.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubExerciseId(sub.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedSubExerciseId === sub.id
                    ? 'bg-blue-900/40 border-blue-500 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-slate-100 flex items-center justify-between">
                  <span>{sub.name}</span>
                  {selectedSubExerciseId === sub.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-mono">
                  {sub.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Section: Components & Procedure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Verified Components & Pinouts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-blue-400" />
              Verified Lab Components & ICs
            </h3>
            <ul className="space-y-2">
              {practical.requiredICs.map((icStr, i) => {
                // Find matching IC in catalog if available
                const match = Object.keys(IC_CATALOG).find(model => icStr.includes(model));
                const icInfo = match ? IC_CATALOG[match] : null;

                return (
                  <li
                    key={i}
                    className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/70 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">
                        {icStr}
                      </span>
                      {icInfo && (
                        <button
                          onClick={() => setShowPinoutModal(match || null)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 underline font-mono"
                        >
                          Pinout ({icInfo.pinCount} pins)
                        </button>
                      )}
                    </div>
                    {icInfo && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {icInfo.description}
                      </p>
                    )}
                  </li>
                );
              })}
              <li className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400">
                Breadboard, Trainer Power Supply (+5V, GND), logic switches, LEDs, and color jumper wires.
              </li>
            </ul>
          </div>

          {/* Quick Pinout Reference Box if selected */}
          {showPinoutModal && IC_CATALOG[showPinoutModal] && (
            <div className="bg-slate-900 border border-blue-500/40 rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-blue-300 font-mono">
                  {IC_CATALOG[showPinoutModal].name} Pinout
                </span>
                <button
                  onClick={() => setShowPinoutModal(null)}
                  className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto font-mono text-[11px]">
                {IC_CATALOG[showPinoutModal].pins.map((pin) => (
                  <div
                    key={pin.pinNumber}
                    className={`p-1.5 rounded flex items-center justify-between border ${
                      pin.type === 'VCC'
                        ? 'bg-red-950/40 border-red-800 text-red-300'
                        : pin.type === 'GND'
                        ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                        : pin.type === 'OUTPUT'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>Pin {pin.pinNumber}: <strong>{pin.name}</strong></span>
                    <span className="text-[9px] uppercase px-1 rounded bg-black/40">
                      {pin.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Step-by-Step Procedure */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
              <ListChecks className="w-4 h-4 mr-1.5 text-blue-400" />
              Standard Lab Procedure & Wiring Checklist
            </h3>
            <div className="space-y-2.5">
              {(currentSubExercise?.procedure || practical.procedureNotes).map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Observation / Expected Output Truth Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Table className="w-4 h-4 mr-1.5 text-blue-400" />
            Expected Observation & Truth Table
          </h3>
          <span className="text-[11px] text-slate-400">
            {practical.category === 'combinational' ? 'Input/Output Combinations' : 'Clock State Sequence'}
          </span>
        </div>

        {/* Render Sub-exercise truth table or main practical table */}
        {(() => {
          const headers = currentSubExercise?.truthTable?.headers || practical.truthTableHeaders;
          const rows = currentSubExercise?.truthTable?.rows || practical.expectedTruthTable;

          if (!headers || !rows) {
            return (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-800/40 rounded-lg">
                Truth table details are configured for practice simulation.
              </div>
            );
          }

          return (
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/80 text-slate-300 font-mono uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-center border-r last:border-r-0 border-slate-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {rows.slice(0, 10).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-1.5 text-center text-slate-200 border-r last:border-r-0 border-slate-800"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 10 && (
                <div className="p-2 text-center text-[11px] text-slate-500 bg-slate-900 border-t border-slate-800">
                  Showing first 10 rows of {rows.length} total states.
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Viva Voce Questions Section */}
      {practical.vivaQuestions && practical.vivaQuestions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
            <HelpCircle className="w-4 h-4 mr-1.5 text-amber-400" />
            Viva Voce & Lab Exam Questions
          </h3>
          <div className="space-y-2">
            {practical.vivaQuestions.map((viva, idx) => {
              const isOpen = expandedViva === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-lg overflow-hidden bg-slate-800/40"
                >
                  <button
                    onClick={() => setExpandedViva(isOpen ? null : idx)}
                    className="w-full text-left p-3 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span>Q{idx + 1}: {viva.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-3 text-xs text-slate-300 bg-slate-950/60 border-t border-slate-800/80 leading-relaxed">
                      <strong className="text-emerald-400 block mb-1">Answer:</strong>
                      {viva.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Big Action Footer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Ready to connect the circuit?</div>
          <div className="text-xs text-slate-400">
            Open the virtual trainer board to insert ICs, place jumper wires, and verify logic.
          </div>
        </div>
        <button
          onClick={() => onStartPractice(practical.id, selectedSubExerciseId || undefined)}
          className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
            isCombinational
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
          }`}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Practising Now</span>
        </button>
      </div>

      {/* K-Map Modal */}
      {showKMapModal && (
        <KMapWorksheet practical={practical} onClose={() => setShowKMapModal(false)} />
      )}
    </div>
  );
};
