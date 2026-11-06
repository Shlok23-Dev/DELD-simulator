import { PlacedLED, PlacedResistor } from '../types';

// LEDs ordered MSB (D) to LSB (A) from left to right on the breadboard.
// LED3 (Bit 3 / D / MSB) is leftmost, LED0 (Bit 0 / A / LSB) is rightmost.
export const createDefaultLEDs = (): PlacedLED[] => [
  {
    id: 'led_0',
    anodeCol: 28,
    cathodeCol: 29,
    rowGroup: 'bot',
    rowAnode: 'G',
    rowCathode: 'G',
    color: 'green',
    label: 'A (Bit 0)'
  },
  {
    id: 'led_1',
    anodeCol: 26,
    cathodeCol: 27,
    rowGroup: 'bot',
    rowAnode: 'G',
    rowCathode: 'G',
    color: 'green',
    label: 'B (Bit 1)'
  },
  {
    id: 'led_2',
    anodeCol: 24,
    cathodeCol: 25,
    rowGroup: 'bot',
    rowAnode: 'G',
    rowCathode: 'G',
    color: 'green',
    label: 'C (Bit 2)'
  },
  {
    id: 'led_3',
    anodeCol: 22,
    cathodeCol: 23,
    rowGroup: 'bot',
    rowAnode: 'G',
    rowCathode: 'G',
    color: 'green',
    label: 'D (Bit 3)'
  }
];

export const createDefaultResistors = (): PlacedResistor[] => [
  {
    id: 'res_0',
    fromTerm: 'bot:23:I',
    toTerm: 'gnd_bot:23',
    resistance: 330,
    label: 'R0 (330Ω)'
  },
  {
    id: 'res_1',
    fromTerm: 'bot:25:I',
    toTerm: 'gnd_bot:25',
    resistance: 330,
    label: 'R1 (330Ω)'
  },
  {
    id: 'res_2',
    fromTerm: 'bot:27:I',
    toTerm: 'gnd_bot:27',
    resistance: 330,
    label: 'R2 (330Ω)'
  },
  {
    id: 'res_3',
    fromTerm: 'bot:29:I',
    toTerm: 'gnd_bot:29',
    resistance: 330,
    label: 'R3 (330Ω)'
  }
];
