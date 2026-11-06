import { describe, it, expect } from 'vitest';
import { createDefaultLEDs, createDefaultResistors } from '../data/defaultComponents';
import { runCircuitSimulation, Wire } from './circuitEngine';
import { REFERENCE_CIRCUITS } from '../data/referenceCircuits';

describe('LED Ordering and Breadboard Grid Verification', () => {
  it('verifies default LEDs are arranged MSB (D) to LSB (A) from left to right', () => {
    const leds = createDefaultLEDs();

    // Must have 4 default LEDs
    expect(leds).toHaveLength(4);

    // Leftmost physical position must be LED 3 (D / MSB)
    const ledD = leds.find(l => l.id === 'led_3')!;
    const ledC = leds.find(l => l.id === 'led_2')!;
    const ledB = leds.find(l => l.id === 'led_1')!;
    const ledA = leds.find(l => l.id === 'led_0')!;

    expect(ledD).toBeDefined();
    expect(ledC).toBeDefined();
    expect(ledB).toBeDefined();
    expect(ledA).toBeDefined();

    // Verify left-to-right physical column progression: Col 22 < Col 24 < Col 26 < Col 28
    expect(ledD.anodeCol).toBe(22);
    expect(ledC.anodeCol).toBe(24);
    expect(ledB.anodeCol).toBe(26);
    expect(ledA.anodeCol).toBe(28);

    // Labels must indicate D, C, B, A
    expect(ledD.label).toContain('D');
    expect(ledC.label).toContain('C');
    expect(ledB.label).toContain('B');
    expect(ledA.label).toContain('A');
  });

  it('verifies 330Ω resistors are connected to each LED cathode and ground rail', () => {
    const resistors = createDefaultResistors();
    expect(resistors).toHaveLength(4);

    // Each resistor connects an LED cathode (cols 23, 25, 27, 29) to gnd_bot
    const cathodeCols = [23, 25, 27, 29];
    cathodeCols.forEach(col => {
      const r = resistors.find(res => res.fromTerm === `bot:${col}:I`);
      expect(r, `Resistor on cathode col ${col}`).toBeDefined();
      expect(r!.toTerm).toBe(`gnd_bot:${col}`);
      expect(r!.resistance).toBe(330);
    });
  });

  it('verifies electrical logic mapping: HIGH on column 22 lights up D (MSB / ledOutputs[3])', () => {
    // Wire +5V to Column 22 (LED D anode)
    const wires: Wire[] = [
      { id: 'w_test', from: 'vcc_bot:22', to: 'bot:22:F', color: 'red' }
    ];

    const res = runCircuitSimulation([], wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);

    // LED D must be lit
    expect(res.ledStates['led_3']).toBe(true);
    // ledOutputs[3] (MSB) must be 1
    expect(res.ledOutputs[3]).toBe(1);
    // Other LEDs must remain 0
    expect(res.ledOutputs[2]).toBe(0);
    expect(res.ledOutputs[1]).toBe(0);
    expect(res.ledOutputs[0]).toBe(0);
    // Combinational value: Bit 3 = 8
    expect(res.activeCombinationalValue).toBe(8);
  });

  it('verifies electrical logic mapping: HIGH on column 28 lights up A (LSB / ledOutputs[0])', () => {
    // Wire +5V to Column 28 (LED A anode)
    const wires: Wire[] = [
      { id: 'w_test', from: 'vcc_bot:28', to: 'bot:28:F', color: 'red' }
    ];

    const res = runCircuitSimulation([], wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);

    // LED A must be lit
    expect(res.ledStates['led_0']).toBe(true);
    // ledOutputs[0] (LSB) must be 1
    expect(res.ledOutputs[0]).toBe(1);
    // Other LEDs must remain 0
    expect(res.ledOutputs[3]).toBe(0);
    expect(res.ledOutputs[2]).toBe(0);
    expect(res.ledOutputs[1]).toBe(0);
    // Combinational value: Bit 0 = 1
    expect(res.activeCombinationalValue).toBe(1);
  });

  it('verifies full 4-bit binary representation D C B A = 1 0 1 0 (10 in decimal)', () => {
    // Light up D (col 22) and B (col 26)
    const wires: Wire[] = [
      { id: 'w_d', from: 'vcc_bot:22', to: 'bot:22:F', color: 'red' },
      { id: 'w_b', from: 'vcc_bot:26', to: 'bot:26:F', color: 'red' }
    ];

    const res = runCircuitSimulation([], wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);

    expect(res.ledOutputs[3]).toBe(1); // D = 1
    expect(res.ledOutputs[2]).toBe(0); // C = 0
    expect(res.ledOutputs[1]).toBe(1); // B = 1
    expect(res.ledOutputs[0]).toBe(0); // A = 0
    expect(res.activeCombinationalValue).toBe(10); // 8 + 2 = 10
  });

  it('verifies all reference circuits connect MSB to Col 22 (D) and LSB to Col 28 (A)', () => {
    // Practical 1: Bin to Gray
    const p1 = REFERENCE_CIRCUITS.find(r => r.practicalId === 1 && r.subExerciseId === 'bin2gray')!;
    // MSB G3 wire connects to Col 22
    const g3Wire = p1.wires.find(w => w.id === 'w_b3_led')!;
    expect(g3Wire.to).toBe('bot:22:F');
    // LSB G0 wire connects to Col 28
    const g0Wire = p1.wires.find(w => w.id === 'w_g0_led')!;
    expect(g0Wire.to).toBe('bot:28:F');

    // Practical 2: 7483 Adder
    const p2 = REFERENCE_CIRCUITS.find(r => r.practicalId === 2)!;
    // S3 (MSB) connects to Col 22
    const s3Wire = p2.wires.find(w => w.id === 'w_s3')!;
    expect(s3Wire.to).toBe('bot:22:F');
    // S0 (LSB) connects to Col 28
    const s0Wire = p2.wires.find(w => w.id === 'w_s0')!;
    expect(s0Wire.to).toBe('bot:28:F');
  });
});
