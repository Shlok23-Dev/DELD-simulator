export type PracticalCategory = 'combinational' | 'sequential';

export interface PracticalSubExercise {
  id: string;
  name: string;
  description: string;
  aim: string;
  requiredICs: string[];
  procedure: string[];
  inputs: { id: string; label: string; default?: 0 | 1 }[];
  outputs: { id: string; label: string; color?: string }[];
  truthTable?: {
    headers: string[];
    rows: (number | string)[][];
  };
  hintNotes?: string;
}

export interface Practical {
  id: number;
  category: PracticalCategory;
  officialNumber: number;
  title: string;
  shortTitle: string;
  syllabusCategory: string;
  coMapped: string[];
  aim: string;
  description: string;
  requiredICs: string[];
  procedureNotes: string[];
  subExercises?: PracticalSubExercise[];
  truthTableHeaders?: string[];
  expectedTruthTable?: (number | string)[][];
  vivaQuestions?: {
    question: string;
    answer: string;
  }[];
  kmapNotes?: string;
}

export interface ICPin {
  pinNumber: number;
  name: string;
  description: string;
  type: 'VCC' | 'GND' | 'INPUT' | 'OUTPUT' | 'CLOCK' | 'CONTROL' | 'NC';
}

export interface ICDef {
  model: string;
  name: string;
  description: string;
  pinCount: number;
  pins: ICPin[];
  widthPins?: number;
}

export type LogicSignal = 0 | 1 | 'Z' | 'CONFLICT';

export interface PlacedLED {
  id: string;
  anodeCol: number;    // 0-based breadboard column (e.g. 22)
  cathodeCol: number;  // 0-based breadboard column (e.g. 23)
  rowGroup: 'top' | 'bot'; // default 'bot'
  rowAnode: string;    // e.g. 'G'
  rowCathode: string;  // e.g. 'G'
  color: 'red' | 'green' | 'yellow' | 'blue';
  label: string;       // e.g. 'LED0 (G0)'
}

export interface PlacedResistor {
  id: string;
  fromTerm: string;    // e.g. 'bot:23:I'
  toTerm: string;      // e.g. 'gnd_bot:23'
  resistance: number;  // e.g. 330
  label: string;       // e.g. 'R0 (330Ω)'
}

export interface PlacedIC {
  id: string;
  model: string;
  col: number; // 0-based column index
}

export interface WireConnection {
  id: string;
  from: string; // e.g. "sw:0", "top:10:E", "bot:22:F", "pwr:vcc"
  to: string;
  color: string;
}
