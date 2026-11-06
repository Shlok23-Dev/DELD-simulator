import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Practical, PlacedLED, PlacedResistor } from '../types';
import { PlacedIC, Wire, runCircuitSimulation, SimulationResult } from '../simulation/circuitEngine';
import { REFERENCE_CIRCUITS, PracticalReferenceCircuit } from '../data/referenceCircuits';
import { IC_CATALOG } from '../data/icPinouts';
import { createDefaultLEDs, createDefaultResistors } from '../data/defaultComponents';
import { LogicLevel } from '../simulation/logic';
import { BreadboardSVG } from './BreadboardSVG';
import { TrainerControls } from './TrainerControls';
import { ComponentTray } from './ComponentTray';
import { ObservationPanel } from './ObservationPanel';
import { KMapWorksheet } from './KMapWorksheet';
import { ArrowLeft, Sparkles, Layers, Grid } from 'lucide-react';

interface WorkspaceProps {
  practical: Practical;
  subExerciseId?: string;
  onBackToDetails: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  practical,
  subExerciseId,
  onBackToDetails
}) => {
  const isSequential = practical.category === 'sequential';

  // Find reference circuit if available
  const refCircuit = useMemo<PracticalReferenceCircuit | undefined>(() => {
    return REFERENCE_CIRCUITS.find(
      r => r.practicalId === practical.id && (!subExerciseId || r.subExerciseId === subExerciseId)
    ) || REFERENCE_CIRCUITS.find(r => r.practicalId === practical.id);
  }, [practical.id, subExerciseId]);

  // Active sub-exercise if present
  const currentSubExercise = practical.subExercises?.find(s => s.id === subExerciseId) || practical.subExercises?.[0];

  // Board State
  const [placedICs, setPlacedICs] = useState<PlacedIC[]>([]);
  const [placedLEDs, setPlacedLEDs] = useState<PlacedLED[]>(createDefaultLEDs());
  const [placedResistors, setPlacedResistors] = useState<PlacedResistor[]>(createDefaultResistors());
  const [wires, setWires] = useState<Wire[]>([]);
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [switches, setSwitches] = useState<(0 | 1)[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [clock, setClock] = useState<0 | 1>(0);
  const [prevClock, setPrevClock] = useState<0 | 1>(0);
  const [autoClock, setAutoClock] = useState<boolean>(false);
  const [clockPulseCount, setClockPulseCount] = useState<number>(0);

  // Wiring and Interaction State
  const [activeWiringSource, setActiveWiringSource] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [selectedICId, setSelectedICId] = useState<string | null>(null);
  const [selectedLEDId, setSelectedLEDId] = useState<string | null>(null);
  const [selectedResistorId, setSelectedResistorId] = useState<string | null>(null);
  const [selectedWireColor, setSelectedWireColor] = useState<string>('#22c55e'); // Green default
  const [showKMapModal, setShowKMapModal] = useState<boolean>(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);

  // Sequential IC internal states
  const [icInternalStates, setIcInternalStates] = useState<Record<string, any>>({});
  const prevPinLevelsRef = useRef<Record<string, Record<number, LogicLevel>>>({});

  // Auto-load starter reference circuit on initial visit if empty, or allow student to build
  useEffect(() => {
    // When practical or subExercise changes, reset pulse count and switch defaults
    setClockPulseCount(0);
    setCheckFeedback(null);
  }, [practical.id, subExerciseId]);

  // Auto-Clock 1Hz timer
  useEffect(() => {
    if (!autoClock || !powerOn) return;
    const interval = setInterval(() => {
      setClock(prev => {
        const next = prev === 1 ? 0 : 1;
        if (prev === 1 && next === 0) {
          // Falling edge
          setClockPulseCount(c => c + 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClock, powerOn]);

  // Run Real-time Circuit Simulation Engine
  const simulationResult = useMemo<SimulationResult>(() => {
    const res = runCircuitSimulation(
      placedICs,
      wires,
      switches,
      clock,
      prevClock,
      powerOn,
      icInternalStates,
      prevPinLevelsRef.current,
      placedLEDs,
      placedResistors
    );
    prevPinLevelsRef.current = res.icPinLevels;
    return res;
  }, [placedICs, wires, switches, clock, prevClock, powerOn, icInternalStates, placedLEDs, placedResistors]);

  // Update sequential IC states if simulation computed new internal states
  useEffect(() => {
    if (simulationResult.icNextStates && Object.keys(simulationResult.icNextStates).length > 0) {
      setIcInternalStates(simulationResult.icNextStates);
    }
  }, [simulationResult.icNextStates]);

  // Manual Clock Pulse handler
  const handlePulseClock = () => {
    if (!powerOn) return;
    setPrevClock(1);
    setClock(0);
    setClockPulseCount(c => c + 1);
    // After 250ms release back to HIGH or toggle
    setTimeout(() => {
      setPrevClock(0);
      setClock(1);
    }, 250);
  };

  // Toggle Input Switch (0 <-> 1)
  const handleToggleSwitch = (index: number) => {
    setSwitches(prev => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
    setCheckFeedback(null);
  };

  // Click on a breadboard hole or socket terminal
  const handleSelectTerminal = (termId: string) => {
    if (!activeWiringSource) {
      // First click: select source
      setActiveWiringSource(termId);
      setSelectedWireId(null);
    } else {
      // Second click: create wire if different terminal
      if (activeWiringSource !== termId) {
        const newWire: Wire = {
          id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          from: activeWiringSource,
          to: termId,
          color: selectedWireColor
        };
        setWires(prev => [...prev, newWire]);
      }
      setActiveWiringSource(null);
    }
  };

  // Selection handlers to ensure only one item is active at a time
  const handleSelectWire = (id: string | null) => {
    setSelectedWireId(id);
    if (id) {
      setSelectedICId(null);
      setSelectedLEDId(null);
      setSelectedResistorId(null);
    }
  };

  const handleSelectIC = (id: string | null) => {
    setSelectedICId(id);
    if (id) {
      setSelectedWireId(null);
      setSelectedLEDId(null);
      setSelectedResistorId(null);
    }
  };

  const handleSelectLED = (id: string | null) => {
    setSelectedLEDId(id);
    if (id) {
      setSelectedWireId(null);
      setSelectedICId(null);
      setSelectedResistorId(null);
    }
  };

  const handleSelectResistor = (id: string | null) => {
    setSelectedResistorId(id);
    if (id) {
      setSelectedWireId(null);
      setSelectedICId(null);
      setSelectedLEDId(null);
    }
  };

  // Delete a wire
  const handleDeleteWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
    if (selectedWireId === wireId) setSelectedWireId(null);
  };

  // Add an IC to breadboard
  const handleAddIC = (model: string) => {
    // Find first free column (starting from col 6) that doesn't overlap existing ICs
    const def = IC_CATALOG[model];
    const width = def ? def.pinCount / 2 : 7;
    let candidateCol = 6;

    while (candidateCol <= 36 - width) {
      const collides = placedICs.some(
        ic => candidateCol < ic.col + 8 && candidateCol + width > ic.col
      );
      if (!collides) break;
      candidateCol += 9;
    }

    if (candidateCol > 36 - width) {
      candidateCol = 10; // Fallback
    }

    const newIC: PlacedIC = {
      id: `ic_${Date.now()}`,
      model,
      col: candidateCol
    };
    setPlacedICs(prev => [...prev, newIC]);
  };

  // Delete an IC
  const handleDeleteIC = (icId: string) => {
    setPlacedICs(prev => prev.filter(i => i.id !== icId));
    if (selectedICId === icId) setSelectedICId(null);
  };

  // Move an IC to a new column
  const handleMoveIC = (icId: string, newCol: number) => {
    setPlacedICs(prev =>
      prev.map(i => (i.id === icId ? { ...i, col: newCol } : i))
    );
  };

  // Add a physical LED to breadboard
  const handleAddLED = (color: 'red' | 'green') => {
    // Look for first available column pair between 16 and 34
    let candidateCol = 22;
    for (let c = 16; c <= 34; c += 2) {
      const occupied = placedLEDs.some(
        led => led.anodeCol === c || led.cathodeCol === c || led.anodeCol === c + 1 || led.cathodeCol === c + 1
      );
      if (!occupied) {
        candidateCol = c;
        break;
      }
    }

    const newLED: PlacedLED = {
      id: `led_${Date.now()}`,
      anodeCol: candidateCol,
      cathodeCol: candidateCol + 1,
      rowGroup: 'bot',
      rowAnode: 'G',
      rowCathode: 'G',
      color,
      label: `LED${placedLEDs.length} (${color})`
    };
    setPlacedLEDs(prev => [...prev, newLED]);
  };

  // Delete an LED
  const handleDeleteLED = (ledId: string) => {
    setPlacedLEDs(prev => prev.filter(l => l.id !== ledId));
    if (selectedLEDId === ledId) setSelectedLEDId(null);
  };

  // Add a 330Ω axial resistor
  const handleAddResistor = (resistance: number = 330) => {
    // Look for available column between 17 and 35
    let candidateCol = 23;
    for (let c = 17; c <= 35; c += 2) {
      const occupied = placedResistors.some(
        r => r.fromTerm === `bot:${c}:I` || r.toTerm === `gnd_bot:${c}`
      );
      if (!occupied) {
        candidateCol = c;
        break;
      }
    }

    const newResistor: PlacedResistor = {
      id: `res_${Date.now()}`,
      fromTerm: `bot:${candidateCol}:I`,
      toTerm: `gnd_bot:${candidateCol}`,
      resistance,
      label: `R${placedResistors.length} (${resistance}Ω)`
    };
    setPlacedResistors(prev => [...prev, newResistor]);
  };

  // Delete a Resistor
  const handleDeleteResistor = (resId: string) => {
    setPlacedResistors(prev => prev.filter(r => r.id !== resId));
    if (selectedResistorId === resId) setSelectedResistorId(null);
  };

  // Clear / Reset Board
  const handleResetBoard = () => {
    if (wires.length > 0 || placedICs.length > 0 || placedLEDs.length > 0) {
      if (window.confirm('Clear breadboard? This resets ICs, wires, and restores default LEDs and resistors.')) {
        setWires([]);
        setPlacedICs([]);
        setPlacedLEDs(createDefaultLEDs());
        setPlacedResistors(createDefaultResistors());
        setActiveWiringSource(null);
        setSelectedWireId(null);
        setSelectedICId(null);
        setSelectedLEDId(null);
        setSelectedResistorId(null);
        setClockPulseCount(0);
        setCheckFeedback(null);
      }
    }
  };

  // Load Reference Circuit Setup
  const handleLoadReferenceCircuit = () => {
    if (!refCircuit) return;
    setPlacedICs(refCircuit.placedICs);
    setWires(refCircuit.wires);
    if (refCircuit.defaultSwitches) {
      setSwitches(refCircuit.defaultSwitches);
    }
    // Ensure standard LEDs and pull-down resistors exist for reference circuit
    if (placedLEDs.length === 0) {
      setPlacedLEDs(createDefaultLEDs());
    }
    if (placedResistors.length === 0) {
      setPlacedResistors(createDefaultResistors());
    }
    setActiveWiringSource(null);
    setSelectedWireId(null);
    setSelectedICId(null);
    setSelectedLEDId(null);
    setSelectedResistorId(null);
    setClockPulseCount(0);
    setCheckFeedback('Loaded verified reference circuit onto breadboard!');
  };

  // Check Output against Truth Table
  const handleCheckOutput = () => {
    if (!powerOn) {
      setCheckFeedback('Power is OFF! Turn ON DC power to test output.');
      return;
    }
    if (placedICs.length === 0) {
      setCheckFeedback('No ICs placed on breadboard! Add required ICs from tray.');
      return;
    }
    if (wires.length === 0) {
      setCheckFeedback('No jumper wires connected. Connect IC pins to power, switches and LEDs.');
      return;
    }

    if (simulationResult.warnings.length > 0) {
      setCheckFeedback(`Circuit issue detected: ${simulationResult.warnings[0]}`);
      return;
    }

    setCheckFeedback('Circuit is active! Compare output LEDs with the highlighted row in the truth table.');
  };

  // Determine available ICs for tray
  const availableICs = useMemo(() => {
    const list = new Set<string>();
    // ICs from practical requiredICs
    practical.requiredICs.forEach(icStr => {
      Object.keys(IC_CATALOG).forEach(m => {
        if (icStr.includes(m)) list.add(m);
      });
    });
    // Add common supporting gates if not present
    list.add('7408');
    list.add('7404');
    list.add('7432');
    list.add('7486');
    list.add('7400');
    list.add('7402');
    list.add('74151');
    return Array.from(list);
  }, [practical]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Workspace Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDetails}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lab Manual</span>
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">
                Practical {practical.officialNumber}: {practical.shortTitle}
              </span>
              {currentSubExercise && (
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono">
                  {currentSubExercise.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentSubExercise?.description || practical.aim}
            </p>
          </div>
        </div>

        {/* Check Feedback Badge */}
        <div className="flex items-center space-x-2">
          {!isSequential && (
            <button
              onClick={() => setShowKMapModal(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span>K-Map Worksheet</span>
            </button>
          )}

          {checkFeedback && (
            <div className="bg-blue-950/80 border border-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{checkFeedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trainer Console: Power, Switches, Clock */}
      <TrainerControls
        powerOn={powerOn}
        onTogglePower={() => setPowerOn(p => !p)}
        switches={switches}
        onToggleSwitch={handleToggleSwitch}
        clock={clock}
        onPulseClock={handlePulseClock}
        autoClock={autoClock}
        onToggleAutoClock={() => setAutoClock(a => !a)}
        activeWiringSource={activeWiringSource}
        onSelectTerminal={handleSelectTerminal}
        isSequential={isSequential}
        recommendedInputs={refCircuit?.recommendedInputs}
      />

      {/* Breadboard Work Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-blue-400" />
            Virtual Breadboard (DIP IC Area & Power Rails)
          </span>
          <div className="flex items-center space-x-3">
            <span>Placed ICs: <strong className="text-slate-200">{placedICs.length}</strong></span>
            <span>Jumper Wires: <strong className="text-slate-200">{wires.length}</strong></span>
          </div>
        </div>

        <BreadboardSVG
          placedICs={placedICs}
          placedLEDs={placedLEDs}
          placedResistors={placedResistors}
          wires={wires}
          ledStates={simulationResult.ledStates}
          activeWiringSource={activeWiringSource}
          selectedWireId={selectedWireId}
          selectedICId={selectedICId}
          selectedLEDId={selectedLEDId}
          selectedResistorId={selectedResistorId}
          onSelectTerminal={handleSelectTerminal}
          onSelectWire={handleSelectWire}
          onSelectIC={handleSelectIC}
          onSelectLED={handleSelectLED}
          onSelectResistor={handleSelectResistor}
          onDeleteWire={handleDeleteWire}
          onDeleteIC={handleDeleteIC}
          onDeleteLED={handleDeleteLED}
          onDeleteResistor={handleDeleteResistor}
          onMoveIC={handleMoveIC}
          icPowerStatus={simulationResult.icPowerStatus}
          icPinLevels={simulationResult.icPinLevels}
        />
      </div>

      {/* Component Tray & Action Toolbar */}
      <ComponentTray
        availableICs={availableICs}
        selectedWireColor={selectedWireColor}
        onSelectWireColor={setSelectedWireColor}
        onAddIC={handleAddIC}
        onAddLED={handleAddLED}
        onAddResistor={handleAddResistor}
        onResetBoard={handleResetBoard}
        onLoadReferenceCircuit={handleLoadReferenceCircuit}
        hasReferenceCircuit={!!refCircuit}
        onCheckOutput={handleCheckOutput}
      />

      {/* Observation Table & Diagnostic Panel */}
      <ObservationPanel
        practical={practical}
        subExercise={currentSubExercise}
        switches={switches}
        ledOutputs={simulationResult.ledOutputs}
        warnings={simulationResult.warnings}
        powerOn={powerOn}
        clockPulseCount={clockPulseCount}
      />

      {/* K-Map Modal */}
      {showKMapModal && (
        <KMapWorksheet practical={practical} onClose={() => setShowKMapModal(false)} />
      )}
    </div>
  );
};
