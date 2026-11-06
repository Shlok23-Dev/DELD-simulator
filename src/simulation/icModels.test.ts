import { describe, it, expect } from 'vitest';
import { 
  eval7483, 
  eval74153, 
  eval74138, 
  eval7476, 
  eval7490, 
  eval74191, 
  eval7474,
  eval7486,
  eval7408,
  eval7404
} from './icModels';

describe('IC 7483 (4-bit binary adder)', () => {
  it('returns unpowered Z outputs when VCC or GND is missing', () => {
    const res = eval7483({ 5: 0, 12: 0 }, {});
    expect(res.hasPower).toBe(false);
    expect(res.outputs[7]).toBe('Z');
  });

  it('correctly calculates 5 + 3 = 8 (C4=0, S3..S0=1000)', () => {
    // VCC=5, GND=12
    // A: A3=0 (14), A2=1 (16), A1=0 (1), A0=1 (3) -> 5
    // B: B3=0 (11), B2=0 (15), B1=1 (2), B0=1 (4) -> 3
    // C0: 13=0
    const pins = {
      5: 1 as const,
      12: 0 as const,
      14: 0 as const, 16: 1 as const, 1: 0 as const, 3: 1 as const,
      11: 0 as const, 15: 0 as const, 2: 1 as const, 4: 1 as const,
      13: 0 as const
    };
    const res = eval7483(pins, {});
    expect(res.hasPower).toBe(true);
    expect(res.outputs[8]).toBe(0); // C4
    expect(res.outputs[9]).toBe(1); // S3
    expect(res.outputs[10]).toBe(0); // S2
    expect(res.outputs[6]).toBe(0); // S1
    expect(res.outputs[7]).toBe(0); // S0
  });

  it('correctly calculates 9 + 7 = 16 (C4=1, S=0000)', () => {
    // A=9 (1001), B=7 (0111)
    const pins = {
      5: 1 as const,
      12: 0 as const,
      14: 1 as const, 16: 0 as const, 1: 0 as const, 3: 1 as const,
      11: 0 as const, 15: 1 as const, 2: 1 as const, 4: 1 as const,
      13: 0 as const
    };
    const res = eval7483(pins, {});
    expect(res.outputs[8]).toBe(1); // C4 = 1
    expect(res.outputs[9]).toBe(0); // S3 = 0
    expect(res.outputs[10]).toBe(0); // S2 = 0
    expect(res.outputs[6]).toBe(0); // S1 = 0
    expect(res.outputs[7]).toBe(0); // S0 = 0
  });
});

describe('IC 74153 (Dual 4:1 Mux)', () => {
  it('selects input line based on S1, S0 when enabled', () => {
    // VCC=16, GND=8, 1E'=Pin 1 (0 = enabled), 2E'=Pin 15 (0)
    // S1=Pin 14, S0=Pin 2
    // Let S1=1, S0=0 (Select 2). 1I2 = Pin 4 (set to 1). 1I0,1,3 set to 0.
    const pins = {
      16: 1 as const, 8: 0 as const,
      1: 0 as const, 15: 0 as const,
      14: 1 as const, 2: 0 as const,
      6: 0 as const, 5: 0 as const, 4: 1 as const, 3: 0 as const,
      10: 0 as const, 11: 0 as const, 12: 0 as const, 13: 0 as const
    };
    const res = eval74153(pins, {});
    expect(res.outputs[7]).toBe(1); // 1Y
  });
});

describe('IC 74138 (3:8 Decoder)', () => {
  it('asserts active-low output for binary address when enabled', () => {
    // VCC=16, GND=8, G1=6(1), G2A'=4(0), G2B'=5(0)
    // Addr: C=3(0), B=2(1), A=1(1) -> addr 3 (011)
    const pins = {
      16: 1 as const, 8: 0 as const,
      6: 1 as const, 4: 0 as const, 5: 0 as const,
      3: 0 as const, 2: 1 as const, 1: 1 as const
    };
    const res = eval74138(pins, {});
    expect(res.outputs[12]).toBe(0); // Y3' is 0
    expect(res.outputs[15]).toBe(1); // Y0' is 1
    expect(res.outputs[14]).toBe(1); // Y1' is 1
    expect(res.outputs[13]).toBe(1); // Y2' is 1
  });
});

describe('IC 7476 (Dual JK Flip-Flop)', () => {
  it('toggles Q on falling clock edge when J=1, K=1', () => {
    // VCC=5, GND=13, PRE'=Pin 2 (1), CLR'=Pin 3 (1), J=Pin 4 (1), K=Pin 16 (1)
    const pins = {
      5: 1 as const, 13: 0 as const,
      2: 1 as const, 3: 1 as const,
      4: 1 as const, 16: 1 as const,
      1: 0 as const // current clock is LOW
    };
    const prevPins = {
      1: 1 as const // previous clock was HIGH -> Falling edge!
    };
    const res = eval7476(pins, prevPins, { q1: 0, q2: 0 });
    expect(res.outputs[15]).toBe(1); // 1Q toggled from 0 to 1
    expect(res.outputs[14]).toBe(0); // 1Q' is 0
  });
});

describe('IC 7490 (Decade Counter)', () => {
  it('increments QA on falling edge of CKA', () => {
    const pins = {
      5: 1 as const, 10: 0 as const,
      2: 0 as const, 3: 0 as const,
      6: 0 as const, 7: 0 as const,
      14: 0 as const // falling edge
    };
    const prevPins = { 14: 1 as const };
    const res = eval7490(pins, prevPins, { qa: 0, qbcd: 0 });
    expect(res.outputs[12]).toBe(1); // QA = 1
  });

  it('resets to 0 when R0(1) and R0(2) are both HIGH', () => {
    const pins = {
      5: 1 as const, 10: 0 as const,
      2: 1 as const, 3: 1 as const,
      6: 0 as const, 7: 0 as const,
      14: 0 as const
    };
    const res = eval7490(pins, {}, { qa: 1, qbcd: 3 });
    expect(res.outputs[12]).toBe(0);
    expect(res.outputs[8]).toBe(0);
    expect(res.outputs[9]).toBe(0);
    expect(res.outputs[11]).toBe(0);
  });
});

describe('IC 74191 (Up/Down Binary Counter)', () => {
  it('increments count on rising clock edge when CTEN is low and D/U is 0', () => {
    const pins = {
      16: 1 as const, 8: 0 as const,
      4: 0 as const, // CTEN active
      5: 0 as const, // UP mode
      11: 1 as const, // LOAD inactive
      14: 1 as const // rising clock
    };
    const prevPins = { 14: 0 as const };
    const res = eval74191(pins, prevPins, { count: 3 });
    expect(res.nextInternalState?.count).toBe(4);
    expect(res.outputs[6]).toBe(1); // QC (bit 2) is 1
  });

  it('decrements count on rising clock edge when D/U is 1', () => {
    const pins = {
      16: 1 as const, 8: 0 as const,
      4: 0 as const,
      5: 1 as const, // DOWN mode
      11: 1 as const,
      14: 1 as const
    };
    const prevPins = { 14: 0 as const };
    const res = eval74191(pins, prevPins, { count: 4 });
    expect(res.nextInternalState?.count).toBe(3);
  });
});

describe('IC 7474 (Dual D Flip-Flop)', () => {
  it('latches D into Q on rising clock edge', () => {
    const pins = {
      14: 1 as const, 7: 0 as const,
      4: 1 as const, 1: 1 as const,
      2: 1 as const, // D = 1
      3: 1 as const  // rising edge
    };
    const prevPins = { 3: 0 as const };
    const res = eval7474(pins, prevPins, { q1: 0, q2: 0 });
    expect(res.outputs[5]).toBe(1); // 1Q is 1
  });
});

describe('Basic gates (7486, 7408, 7404)', () => {
  it('7486 computes XOR', () => {
    const res = eval7486({ 14: 1, 7: 0, 1: 1, 2: 0 }, {});
    expect(res.outputs[3]).toBe(1);
  });

  it('7408 computes AND', () => {
    const res = eval7408({ 14: 1, 7: 0, 1: 1, 2: 1 }, {});
    expect(res.outputs[3]).toBe(1);
  });

  it('7404 computes NOT', () => {
    const res = eval7404({ 14: 1, 7: 0, 1: 1 }, {});
    expect(res.outputs[2]).toBe(0);
  });
});
