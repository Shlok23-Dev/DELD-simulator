import { LogicLevel, gateAND, gateOR, gateNOT, gateXOR, gateNAND, gateNOR } from './logic';

export interface EvaluatedIC {
  outputs: Record<number, LogicLevel>;
  nextInternalState?: Record<string, any>;
  hasPower: boolean;
}

export type ICEvaluator = (
  pins: Record<number, LogicLevel>,
  prevPins: Record<number, LogicLevel>,
  internalState?: Record<string, any>
) => EvaluatedIC;

// Helper to check standard power pins
export const checkPower = (
  pins: Record<number, LogicLevel>,
  vccPin: number,
  gndPin: number
): boolean => {
  return pins[vccPin] === 1 && pins[gndPin] === 0;
};

// 7483: 4-Bit Binary Full Adder
export const eval7483: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 5, 12);
  const outputs: Record<number, LogicLevel> = {
    6: 'Z', 7: 'Z', 8: 'Z', 9: 'Z', 10: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false };

  const a0 = pins[3] === 1 ? 1 : 0;
  const b0 = pins[4] === 1 ? 1 : 0;
  const a1 = pins[1] === 1 ? 1 : 0;
  const b1 = pins[2] === 1 ? 1 : 0;
  const a2 = pins[16] === 1 ? 1 : 0;
  const b2 = pins[15] === 1 ? 1 : 0;
  const a3 = pins[14] === 1 ? 1 : 0;
  const b3 = pins[11] === 1 ? 1 : 0;
  const c0 = pins[13] === 1 ? 1 : 0;

  const aVal = (a3 << 3) | (a2 << 2) | (a1 << 1) | a0;
  const bVal = (b3 << 3) | (b2 << 2) | (b1 << 1) | b0;
  const total = aVal + bVal + c0;

  outputs[7] = ((total >> 0) & 1) as LogicLevel; // S0
  outputs[6] = ((total >> 1) & 1) as LogicLevel; // S1
  outputs[10] = ((total >> 2) & 1) as LogicLevel; // S2
  outputs[9] = ((total >> 3) & 1) as LogicLevel; // S3
  outputs[8] = ((total >> 4) & 1) as LogicLevel; // C4

  return { outputs, hasPower: true };
};

// 74153: Dual 4:1 Multiplexer
export const eval74153: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 16, 8);
  const outputs: Record<number, LogicLevel> = { 7: 'Z', 9: 'Z' };

  if (!hasPower) return { outputs, hasPower: false };

  const s0 = pins[2] === 1 ? 1 : 0;
  const s1 = pins[14] === 1 ? 1 : 0;
  const select = (s1 << 1) | s0;

  // Mux 1 (Enable 1E' is Pin 1, active low)
  const e1 = pins[1] === 0;
  if (!e1) {
    outputs[7] = 0;
  } else {
    const mux1Inputs: Record<number, LogicLevel> = {
      0: pins[6] === 1 ? 1 : 0,
      1: pins[5] === 1 ? 1 : 0,
      2: pins[4] === 1 ? 1 : 0,
      3: pins[3] === 1 ? 1 : 0
    };
    outputs[7] = mux1Inputs[select] ?? 0;
  }

  // Mux 2 (Enable 2E' is Pin 15, active low)
  const e2 = pins[15] === 0;
  if (!e2) {
    outputs[9] = 0;
  } else {
    const mux2Inputs: Record<number, LogicLevel> = {
      0: pins[10] === 1 ? 1 : 0,
      1: pins[11] === 1 ? 1 : 0,
      2: pins[12] === 1 ? 1 : 0,
      3: pins[13] === 1 ? 1 : 0
    };
    outputs[9] = mux2Inputs[select] ?? 0;
  }

  return { outputs, hasPower: true };
};

// 74138: 3-to-8 Line Decoder (active-low outputs)
export const eval74138: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 16, 8);
  const outputs: Record<number, LogicLevel> = {
    15: 'Z', 14: 'Z', 13: 'Z', 12: 'Z', 11: 'Z', 10: 'Z', 9: 'Z', 7: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false };

  // Enables: Pin 6 (G1=1), Pin 4 (G2A'=0), Pin 5 (G2B'=0)
  const g1 = pins[6] === 1;
  const g2a = pins[4] === 0;
  const g2b = pins[5] === 0;
  const enabled = g1 && g2a && g2b;

  const a = pins[1] === 1 ? 1 : 0;
  const b = pins[2] === 1 ? 1 : 0;
  const c = pins[3] === 1 ? 1 : 0;
  const addr = (c << 2) | (b << 1) | a;

  const outputPinMap: Record<number, number> = {
    0: 15, // Y0'
    1: 14, // Y1'
    2: 13, // Y2'
    3: 12, // Y3'
    4: 11, // Y4'
    5: 10, // Y5'
    6: 9,  // Y6'
    7: 7   // Y7'
  };

  for (let i = 0; i < 8; i++) {
    const pin = outputPinMap[i];
    // Active low output: 0 when selected and enabled, otherwise 1
    outputs[pin] = (enabled && addr === i) ? 0 : 1;
  }

  return { outputs, hasPower: true };
};

// 7476: Dual Master-Slave JK Flip-Flop
export const eval7476: ICEvaluator = (pins, prevPins, internalState = { q1: 0, q2: 0 }) => {
  const hasPower = checkPower(pins, 5, 13);
  const outputs: Record<number, LogicLevel> = {
    15: 'Z', 14: 'Z', 11: 'Z', 12: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false, nextInternalState: internalState };

  let q1 = internalState.q1 ?? 0;
  let q2 = internalState.q2 ?? 0;

  // FF1: Pin 1 CLK, Pin 2 PRE', Pin 3 CLR', Pin 4 J, Pin 16 K, Pin 15 Q, Pin 14 Q'
  const pre1 = pins[2];
  const clr1 = pins[3];
  const clk1Prev = prevPins[1];
  const clk1Curr = pins[1];
  const isFallingEdge1 = clk1Prev === 1 && clk1Curr === 0;

  if (pre1 === 0 && clr1 !== 0) {
    q1 = 1;
  } else if (clr1 === 0 && pre1 !== 0) {
    q1 = 0;
  } else if (pre1 === 0 && clr1 === 0) {
    q1 = 1;
  } else if (isFallingEdge1) {
    const j1 = pins[4] === 1 ? 1 : 0;
    const k1 = pins[16] === 1 ? 1 : 0;
    if (j1 === 0 && k1 === 1) q1 = 0;
    else if (j1 === 1 && k1 === 0) q1 = 1;
    else if (j1 === 1 && k1 === 1) q1 = q1 === 1 ? 0 : 1;
  }

  // FF2: Pin 6 CLK, Pin 7 PRE', Pin 8 CLR', Pin 9 J, Pin 10 K, Pin 11 Q, Pin 12 Q'
  const pre2 = pins[7];
  const clr2 = pins[8];
  const clk2Prev = prevPins[6];
  const clk2Curr = pins[6];
  const isFallingEdge2 = clk2Prev === 1 && clk2Curr === 0;

  if (pre2 === 0 && clr2 !== 0) {
    q2 = 1;
  } else if (clr2 === 0 && pre2 !== 0) {
    q2 = 0;
  } else if (pre2 === 0 && clr2 === 0) {
    q2 = 1;
  } else if (isFallingEdge2) {
    const j2 = pins[9] === 1 ? 1 : 0;
    const k2 = pins[10] === 1 ? 1 : 0;
    if (j2 === 0 && k2 === 1) q2 = 0;
    else if (j2 === 1 && k2 === 0) q2 = 1;
    else if (j2 === 1 && k2 === 1) q2 = q2 === 1 ? 0 : 1;
  }

  outputs[15] = q1 as LogicLevel; // 1Q
  outputs[14] = (q1 === 1 ? 0 : 1) as LogicLevel; // 1Q'
  outputs[11] = q2 as LogicLevel; // 2Q
  outputs[12] = (q2 === 1 ? 0 : 1) as LogicLevel; // 2Q'

  return {
    outputs,
    hasPower: true,
    nextInternalState: { q1, q2 }
  };
};

// 7490: Decade Ripple Counter
export const eval7490: ICEvaluator = (pins, prevPins, internalState = { qa: 0, qbcd: 0 }) => {
  const hasPower = checkPower(pins, 5, 10);
  const outputs: Record<number, LogicLevel> = {
    12: 'Z', 8: 'Z', 9: 'Z', 11: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false, nextInternalState: internalState };

  let qa = internalState.qa ?? 0;
  let qbcd = internalState.qbcd ?? 0; // 0 to 4 for divide-by-5 section (QB, QC, QD)

  const r0_1 = pins[2] === 1;
  const r0_2 = pins[3] === 1;
  const r9_1 = pins[6] === 1;
  const r9_2 = pins[7] === 1;

  // Reset logic
  if (r9_1 && r9_2) {
    // Set to 9 (1001) -> QA=1, QB=0, QC=0, QD=1
    qa = 1;
    qbcd = 4; // QD=1, QC=0, QB=0
  } else if (r0_1 && r0_2) {
    // Reset to 0 (0000)
    qa = 0;
    qbcd = 0;
  } else {
    // Clock A (Pin 14, falling edge): toggles QA (divide-by-2)
    const ckaPrev = prevPins[14];
    const ckaCurr = pins[14];
    if (ckaPrev === 1 && ckaCurr === 0) {
      qa = qa === 1 ? 0 : 1;
    }

    // Clock B (Pin 1, falling edge): advances divide-by-5 section (0 to 4)
    const ckbPrev = prevPins[1];
    const ckbCurr = pins[1];
    if (ckbPrev === 1 && ckbCurr === 0) {
      qbcd = (qbcd + 1) % 5;
    }
  }

  // Derive QB, QC, QD from qbcd state
  // Divide-by-5 counts: 0->000, 1->001, 2->010, 3->011, 4->100
  const qb = (qbcd & 1) as LogicLevel;
  const qc = ((qbcd >> 1) & 1) as LogicLevel;
  const qd = ((qbcd >> 2) & 1) as LogicLevel;

  outputs[12] = qa as LogicLevel; // QA
  outputs[8] = qb;                // QB
  outputs[9] = qc;                // QC
  outputs[11] = qd;               // QD

  return {
    outputs,
    hasPower: true,
    nextInternalState: { qa, qbcd }
  };
};

// 74191: Synchronous 4-Bit Up/Down Binary Counter
export const eval74191: ICEvaluator = (pins, prevPins, internalState = { count: 0 }) => {
  const hasPower = checkPower(pins, 16, 8);
  const outputs: Record<number, LogicLevel> = {
    3: 'Z', 2: 'Z', 6: 'Z', 7: 'Z', 12: 'Z', 13: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false, nextInternalState: internalState };

  let count = internalState.count ?? 0;

  const load = pins[11] === 0; // Active-low parallel load
  if (load) {
    const d0 = pins[15] === 1 ? 1 : 0;
    const d1 = pins[1] === 1 ? 1 : 0;
    const d2 = pins[9] === 1 ? 1 : 0;
    const d3 = pins[10] === 1 ? 1 : 0;
    count = (d3 << 3) | (d2 << 2) | (d1 << 1) | d0;
  } else {
    const clkPrev = prevPins[14];
    const clkCurr = pins[14];
    const isRisingEdge = clkPrev === 0 && clkCurr === 1;
    const cten = pins[4] === 0; // Active low Count Enable
    const downMode = pins[5] === 1; // 0=UP, 1=DOWN

    if (isRisingEdge && cten) {
      if (downMode) {
        count = (count - 1 + 16) % 16;
      } else {
        count = (count + 1) % 16;
      }
    }
  }

  outputs[3] = ((count >> 0) & 1) as LogicLevel; // QA
  outputs[2] = ((count >> 1) & 1) as LogicLevel; // QB
  outputs[6] = ((count >> 2) & 1) as LogicLevel; // QC
  outputs[7] = ((count >> 3) & 1) as LogicLevel; // QD

  // MAX/MIN: HIGH if count is 15 in UP mode or 0 in DOWN mode
  const downMode = pins[5] === 1;
  const isTerminal = (downMode && count === 0) || (!downMode && count === 15);
  outputs[12] = isTerminal ? 1 : 0;
  outputs[13] = (isTerminal && pins[14] === 0) ? 0 : 1; // RCO'

  return {
    outputs,
    hasPower: true,
    nextInternalState: { count }
  };
};

// 7474: Dual D Positive-Edge Flip-Flop
export const eval7474: ICEvaluator = (pins, prevPins, internalState = { q1: 0, q2: 0 }) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = {
    5: 'Z', 6: 'Z', 9: 'Z', 8: 'Z'
  };

  if (!hasPower) return { outputs, hasPower: false, nextInternalState: internalState };

  let q1 = internalState.q1 ?? 0;
  let q2 = internalState.q2 ?? 0;

  // FF1: 1CLR' (1), 1D (2), 1CLK (3), 1PRE' (4), 1Q (5), 1Q' (6)
  const pre1 = pins[4];
  const clr1 = pins[1];
  const clk1Prev = prevPins[3];
  const clk1Curr = pins[3];
  const isRising1 = clk1Prev === 0 && clk1Curr === 1;

  if (pre1 === 0 && clr1 !== 0) {
    q1 = 1;
  } else if (clr1 === 0 && pre1 !== 0) {
    q1 = 0;
  } else if (pre1 === 0 && clr1 === 0) {
    q1 = 1;
  } else if (isRising1) {
    q1 = pins[2] === 1 ? 1 : 0;
  }

  // FF2: 2CLR' (13), 2D (12), 2CLK (11), 2PRE' (10), 2Q (9), 2Q' (8)
  const pre2 = pins[10];
  const clr2 = pins[13];
  const clk2Prev = prevPins[11];
  const clk2Curr = pins[11];
  const isRising2 = clk2Prev === 0 && clk2Curr === 1;

  if (pre2 === 0 && clr2 !== 0) {
    q2 = 1;
  } else if (clr2 === 0 && pre2 !== 0) {
    q2 = 0;
  } else if (pre2 === 0 && clr2 === 0) {
    q2 = 1;
  } else if (isRising2) {
    q2 = pins[12] === 1 ? 1 : 0;
  }

  outputs[5] = q1 as LogicLevel;
  outputs[6] = (q1 === 1 ? 0 : 1) as LogicLevel;
  outputs[9] = q2 as LogicLevel;
  outputs[8] = (q2 === 1 ? 0 : 1) as LogicLevel;

  return {
    outputs,
    hasPower: true,
    nextInternalState: { q1, q2 }
  };
};

// 7486: Quad 2-Input XOR Gate
export const eval7486: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 3: 'Z', 6: 'Z', 8: 'Z', 11: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[3] = gateXOR(pins[1], pins[2]);
  outputs[6] = gateXOR(pins[4], pins[5]);
  outputs[8] = gateXOR(pins[9], pins[10]);
  outputs[11] = gateXOR(pins[12], pins[13]);
  return { outputs, hasPower: true };
};

// 7408: Quad 2-Input AND Gate
export const eval7408: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 3: 'Z', 6: 'Z', 8: 'Z', 11: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[3] = gateAND(pins[1], pins[2]);
  outputs[6] = gateAND(pins[4], pins[5]);
  outputs[8] = gateAND(pins[9], pins[10]);
  outputs[11] = gateAND(pins[12], pins[13]);
  return { outputs, hasPower: true };
};

// 7432: Quad 2-Input OR Gate
export const eval7432: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 3: 'Z', 6: 'Z', 8: 'Z', 11: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[3] = gateOR(pins[1], pins[2]);
  outputs[6] = gateOR(pins[4], pins[5]);
  outputs[8] = gateOR(pins[9], pins[10]);
  outputs[11] = gateOR(pins[12], pins[13]);
  return { outputs, hasPower: true };
};

// 7404: Hex Inverter
export const eval7404: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 2: 'Z', 4: 'Z', 6: 'Z', 8: 'Z', 10: 'Z', 12: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[2] = gateNOT(pins[1]);
  outputs[4] = gateNOT(pins[3]);
  outputs[6] = gateNOT(pins[5]);
  outputs[8] = gateNOT(pins[9]);
  outputs[10] = gateNOT(pins[11]);
  outputs[12] = gateNOT(pins[13]);
  return { outputs, hasPower: true };
};

// 7400: Quad 2-Input NAND Gate
export const eval7400: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 3: 'Z', 6: 'Z', 8: 'Z', 11: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[3] = gateNAND(pins[1], pins[2]);
  outputs[6] = gateNAND(pins[4], pins[5]);
  outputs[8] = gateNAND(pins[9], pins[10]);
  outputs[11] = gateNAND(pins[12], pins[13]);
  return { outputs, hasPower: true };
};

// 7402: Quad 2-Input NOR Gate
// Note authentic pinout: outputs on pins 1, 4, 10, 13!
export const eval7402: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 14, 7);
  const outputs: Record<number, LogicLevel> = { 1: 'Z', 4: 'Z', 10: 'Z', 13: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  outputs[1] = gateNOR(pins[2], pins[3]);
  outputs[4] = gateNOR(pins[5], pins[6]);
  outputs[10] = gateNOR(pins[8], pins[9]);
  outputs[13] = gateNOR(pins[11], pins[12]);
  return { outputs, hasPower: true };
};

// 74151: 8-to-1 Line Data Selector/Multiplexer
export const eval74151: ICEvaluator = (pins) => {
  const hasPower = checkPower(pins, 16, 8);
  const outputs: Record<number, LogicLevel> = { 5: 'Z', 6: 'Z' };
  if (!hasPower) return { outputs, hasPower: false };

  const strobeG = pins[7] === 0; // Active low
  if (!strobeG) {
    outputs[5] = 0;
    outputs[6] = 1;
    return { outputs, hasPower: true };
  }

  const a = pins[11] === 1 ? 1 : 0;
  const b = pins[10] === 1 ? 1 : 0;
  const c = pins[9] === 1 ? 1 : 0;
  const sel = (c << 2) | (b << 1) | a;

  const dataPins: Record<number, number> = {
    0: 4,  // D0
    1: 3,  // D1
    2: 2,  // D2
    3: 1,  // D3
    4: 15, // D4
    5: 14, // D5
    6: 13, // D6
    7: 12  // D7
  };

  const selectedPin = dataPins[sel];
  const dVal = (pins[selectedPin] === 1 ? 1 : 0) as LogicLevel;

  outputs[5] = dVal;
  outputs[6] = gateNOT(dVal);
  return { outputs, hasPower: true };
};

// Registry of evaluators
export const IC_EVALUATORS: Record<string, ICEvaluator> = {
  '7483': eval7483,
  '74153': eval74153,
  '74138': eval74138,
  '7476': eval7476,
  '7490': eval7490,
  '74191': eval74191,
  '7474': eval7474,
  '7486': eval7486,
  '7408': eval7408,
  '7432': eval7432,
  '7404': eval7404,
  '7400': eval7400,
  '7402': eval7402,
  '74151': eval74151
};
