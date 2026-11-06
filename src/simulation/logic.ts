export type LogicLevel = 0 | 1 | 'Z' | 'CONFLICT';

export interface ICPinState {
  pinNumber: number;
  name: string;
  type: 'VCC' | 'GND' | 'INPUT' | 'OUTPUT' | 'CLOCK' | 'CONTROL' | 'NC';
  level: LogicLevel;
}

export interface ICInstanceState {
  instanceId: string;
  model: string;
  pins: Record<number, LogicLevel>;
  // Internal state for sequential ICs (flip-flops, counters)
  internalState?: Record<string, any>;
}

// Basic logic gates
export const gateAND = (a: LogicLevel, b: LogicLevel): LogicLevel => {
  if (a === 'CONFLICT' || b === 'CONFLICT') return 'CONFLICT';
  if (a === 0 || b === 0) return 0;
  if (a === 1 && b === 1) return 1;
  return 'Z';
};

export const gateOR = (a: LogicLevel, b: LogicLevel): LogicLevel => {
  if (a === 'CONFLICT' || b === 'CONFLICT') return 'CONFLICT';
  if (a === 1 || b === 1) return 1;
  if (a === 0 && b === 0) return 0;
  return 'Z';
};

export const gateNOT = (a: LogicLevel): LogicLevel => {
  if (a === 1) return 0;
  if (a === 0) return 1;
  return 'Z';
};

export const gateXOR = (a: LogicLevel, b: LogicLevel): LogicLevel => {
  if (a === 'CONFLICT' || b === 'CONFLICT') return 'CONFLICT';
  if ((a !== 0 && a !== 1) || (b !== 0 && b !== 1)) return 'Z';
  return (a ^ b) as 0 | 1;
};

export const gateNAND = (a: LogicLevel, b: LogicLevel): LogicLevel => {
  const andVal = gateAND(a, b);
  return gateNOT(andVal);
};

export const gateNOR = (a: LogicLevel, b: LogicLevel): LogicLevel => {
  const orVal = gateOR(a, b);
  return gateNOT(orVal);
};
