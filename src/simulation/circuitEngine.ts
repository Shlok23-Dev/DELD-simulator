import { LogicLevel } from './logic';
import { IC_EVALUATORS } from './icModels';
import { IC_CATALOG } from '../data/icPinouts';
import { PlacedLED, PlacedResistor, PlacedIC } from '../types';
import { createDefaultLEDs, createDefaultResistors } from '../data/defaultComponents';

export interface Wire {
  id: string;
  from: string; // e.g. "sw:0", "top:10:E", "bot:22:F", "vcc_top:5", "gnd_bot:8", "pwr:vcc", "clk"
  to: string;
  color: string;
}

export type { PlacedIC, PlacedLED, PlacedResistor };

export interface SimulationResult {
  netLevels: Record<string, LogicLevel>;
  ledOutputs: (0 | 1)[];
  ledStates: Record<string, boolean>; // ledId -> isLit
  icPowerStatus: Record<string, boolean>; // icId -> hasPower
  icPinLevels: Record<string, Record<number, LogicLevel>>;
  icNextStates: Record<string, any>;
  warnings: string[];
  activeCombinationalValue: number;
}

// Disjoint Set (Union-Find) for net identification
class UnionFind {
  parent: Record<string, string> = {};

  find(item: string): string {
    if (!this.parent[item]) {
      this.parent[item] = item;
      return item;
    }
    if (this.parent[item] !== item) {
      this.parent[item] = this.find(this.parent[item]);
    }
    return this.parent[item];
  }

  union(a: string, b: string) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent[rootB] = rootA;
    }
  }
}

// Map any terminal string to its breadboard net representation
export const normalizeTerminal = (term: string): string => {
  // Main breadboard vertical 5-hole terminal strips:
  // e.g. "top:12:A", "top:12:B", "top:12:E" -> "net_top_12"
  if (term.startsWith('top:')) {
    const parts = term.split(':');
    return `net_top_${parts[1]}`;
  }
  // e.g. "bot:12:F", "bot:12:G", "bot:12:J" -> "net_bot_12"
  if (term.startsWith('bot:')) {
    const parts = term.split(':');
    return `net_bot_${parts[1]}`;
  }
  // Power rails: all holes in rail are in one horizontal bus
  if (term.startsWith('vcc_top') || term === 'pwr:vcc') return 'rail_vcc_top';
  if (term.startsWith('gnd_top')) return 'rail_gnd_top';
  if (term.startsWith('vcc_bot')) return 'rail_vcc_bot';
  if (term.startsWith('gnd_bot') || term === 'pwr:gnd') return 'rail_gnd_bot';
  return term;
};

// Calculate pin connection to breadboard net for a placed IC
// Standard physical DIP orientation (Notch facing Left):
// Bottom row (Row F): Pin 1 .. Pin N/2 (Left to Right)
// Top row (Row E): Pin N .. Pin (N/2)+1 (Left to Right)
export const getPinNet = (placedIC: PlacedIC, pinNumber: number): string => {
  const icDef = IC_CATALOG[placedIC.model];
  if (!icDef) return '';
  const half = icDef.pinCount / 2;

  if (pinNumber >= 1 && pinNumber <= half) {
    // Bottom row (Row F): Pin 1 at col, Pin 2 at col+1, etc.
    const col = placedIC.col + (pinNumber - 1);
    return `net_bot_${col}`;
  } else {
    // Top row (Row E): Pin N at col, Pin N-1 at col+1, etc.
    const col = placedIC.col + (icDef.pinCount - pinNumber);
    return `net_top_${col}`;
  }
};

export const getPinTerminal = (placedIC: PlacedIC, pinNumber: number): string => {
  const icDef = IC_CATALOG[placedIC.model];
  if (!icDef) return '';
  const half = icDef.pinCount / 2;
  if (pinNumber >= 1 && pinNumber <= half) {
    const col = placedIC.col + (pinNumber - 1);
    return `bot:${col}:F`;
  } else {
    const col = placedIC.col + (icDef.pinCount - pinNumber);
    return `top:${col}:E`;
  }
};

export const runCircuitSimulation = (
  placedICs: PlacedIC[],
  wires: Wire[],
  switches: (0 | 1)[],
  clock: 0 | 1,
  _prevClock: 0 | 1,
  powerOn: boolean,
  currentICStates: Record<string, any> = {},
  prevICPinLevels: Record<string, Record<number, LogicLevel>> = {},
  placedLEDs?: PlacedLED[],
  placedResistors?: PlacedResistor[]
): SimulationResult => {
  const effectiveLEDs = placedLEDs !== undefined ? placedLEDs : createDefaultLEDs();
  const effectiveResistors = placedResistors !== undefined ? placedResistors : createDefaultResistors();

  const warnings: string[] = [];
  const ledStates: Record<string, boolean> = {};
  const ledOutputs: (0 | 1)[] = [0, 0, 0, 0, 0, 0, 0, 0];
  const icPowerStatus: Record<string, boolean> = {};
  const icPinLevels: Record<string, Record<number, LogicLevel>> = {};
  const icNextStates: Record<string, any> = { ...currentICStates };

  if (!powerOn) {
    // Trainer is turned OFF: all lines unpowered
    placedICs.forEach(ic => {
      icPowerStatus[ic.id] = false;
      icPinLevels[ic.id] = {};
    });
    effectiveLEDs.forEach(led => {
      ledStates[led.id] = false;
    });
    return {
      netLevels: {},
      ledOutputs,
      ledStates,
      icPowerStatus,
      icPinLevels,
      icNextStates,
      warnings: ['DC Power Supply is OFF. Turn power ON to simulate logic.'],
      activeCombinationalValue: 0
    };
  }

  // 1. Build Netlist using Union-Find
  const uf = new UnionFind();

  // Top and bottom VCC rails are connected to +5V
  // Top and bottom GND rails are connected to GND (0V)
  uf.find('rail_vcc_top');
  uf.find('rail_vcc_bot');
  uf.find('rail_gnd_top');
  uf.find('rail_gnd_bot');

  // Wires connect terminals together
  wires.forEach(w => {
    const netFrom = normalizeTerminal(w.from);
    const netTo = normalizeTerminal(w.to);
    uf.union(netFrom, netTo);
  });

  // Placed Resistors bridge their two terminals into the same net
  effectiveResistors.forEach(r => {
    const netFrom = normalizeTerminal(r.fromTerm);
    const netTo = normalizeTerminal(r.toTerm);
    uf.union(netFrom, netTo);
  });

  // Track sources driving each root net
  // Sources can be VCC (1), GND (0), Switch i (0|1), Clock (0|1)
  const netDrivers: Record<string, Set<0 | 1>> = {};

  const addDriver = (netName: string, val: 0 | 1) => {
    const root = uf.find(netName);
    if (!netDrivers[root]) netDrivers[root] = new Set();
    netDrivers[root].add(val);
  };

  // Connect DC power supply rails (+5V and GND)
  addDriver('rail_vcc_top', 1);
  addDriver('rail_vcc_bot', 1);
  addDriver('rail_gnd_top', 0);
  addDriver('rail_gnd_bot', 0);

  // Connect Input Switches (sw:0 .. sw:7)
  switches.forEach((val, i) => {
    addDriver(`sw:${i}`, val);
  });

  // Connect Clock Output (clk)
  addDriver('clk', clock);

  // Helper to read current resolved level of any net
  const getNetLevel = (term: string): LogicLevel => {
    const root = uf.find(normalizeTerminal(term));
    const drivers = netDrivers[root];
    if (!drivers || drivers.size === 0) return 'Z';
    if (drivers.has(0) && drivers.has(1)) return 'CONFLICT';
    if (drivers.has(1)) return 1;
    if (drivers.has(0)) return 0;
    return 'Z';
  };

  // 2. Multi-pass propagation for ICs (handles cascaded logic gates)
  const MAX_PASSES = 3;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    for (const ic of placedICs) {
      const def = IC_CATALOG[ic.model];
      const evaluator = IC_EVALUATORS[ic.model];
      if (!def || !evaluator) continue;

      const currentPins: Record<number, LogicLevel> = {};
      const prevPins = prevICPinLevels[ic.id] || {};

      // Read all pins from their connected breadboard nets
      for (const p of def.pins) {
        const net = getPinNet(ic, p.pinNumber);
        currentPins[p.pinNumber] = getNetLevel(net);
      }

      // Evaluate IC
      const result = evaluator(currentPins, prevPins, icNextStates[ic.id]);
      icPowerStatus[ic.id] = result.hasPower;
      icPinLevels[ic.id] = currentPins;
      if (result.nextInternalState) {
        icNextStates[ic.id] = result.nextInternalState;
      }

      if (pass === 0 && !result.hasPower) {
        warnings.push(`${def.name} missing +5V (VCC) or GND connection.`);
      }

      // Drive IC outputs onto nets if powered
      if (result.hasPower) {
        for (const [pinStr, outVal] of Object.entries(result.outputs)) {
          const pinNum = Number(pinStr);
          if (outVal === 0 || outVal === 1) {
            const net = getPinNet(ic, pinNum);
            addDriver(net, outVal);
          }
        }
      }
    }
  }

  // 3a. Evaluate direct wire connections to trainer LED terminals or test 'led:0'..'led:7'
  for (let i = 0; i < 8; i++) {
    const termA = `led:${i}`;
    const termB = `led_${i}`;
    const lvlA = getNetLevel(termA);
    const lvlB = getNetLevel(termB);
    if (lvlA === 1 || lvlB === 1) {
      ledOutputs[i] = 1;
    }
  }

  // 3b. Evaluate Physical LEDs placed on the breadboard
  effectiveLEDs.forEach((led, idx) => {
    const anodeNet = `net_${led.rowGroup}_${led.anodeCol}`;
    const cathodeNet = `net_${led.rowGroup}_${led.cathodeCol}`;
    const anodeLevel = getNetLevel(anodeNet);
    const cathodeLevel = getNetLevel(cathodeNet);

    // An LED lights up when Anode is HIGH (1) and Cathode is tied to GND (0)
    const isLit = powerOn && anodeLevel === 1 && cathodeLevel === 0;
    ledStates[led.id] = isLit;
    const idMatch = led.id.match(/\d+$/);
    const outputIdx = idMatch ? parseInt(idMatch[0], 10) : idx;
    if (isLit && outputIdx < 8) {
      ledOutputs[outputIdx] = 1;
    }
  });

  // Check for short circuits or logic conflicts
  for (const [root, set] of Object.entries(netDrivers)) {
    if (set.has(0) && set.has(1)) {
      warnings.push(`Logic conflict detected on net (${root}): +5V and GND/Outputs shorted together!`);
    }
  }

  // Final net levels dictionary
  const netLevels: Record<string, LogicLevel> = {};
  for (const root of Object.keys(netDrivers)) {
    const s = netDrivers[root];
    if (s.has(0) && s.has(1)) netLevels[root] = 'CONFLICT';
    else if (s.has(1)) netLevels[root] = 1;
    else if (s.has(0)) netLevels[root] = 0;
    else netLevels[root] = 'Z';
  }

  // Compute active binary value of LEDs (LSB led 0, MSB led 3/7)
  let activeValue = 0;
  for (let i = 0; i < 8; i++) {
    if (ledOutputs[i] === 1) {
      activeValue |= (1 << i);
    }
  }

  return {
    netLevels,
    ledOutputs,
    ledStates,
    icPowerStatus,
    icPinLevels,
    icNextStates,
    warnings,
    activeCombinationalValue: activeValue
  };
};
