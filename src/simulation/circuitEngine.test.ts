import { describe, it, expect } from 'vitest';
import { runCircuitSimulation, Wire, PlacedIC } from './circuitEngine';

describe('Circuit Engine Simulation (Counter-Clockwise DIP Pinout)', () => {
  it('correctly simulates 7404 NOT gate circuit wired on breadboard', () => {
    // Place 7404 at column 10 (14 pins: 7 pins on bottom, 7 on top)
    // Standard Counter-Clockwise orientation:
    // Bottom row (Row F): Pin 1 at col 10, Pin 2 at col 11, ..., Pin 7 (GND) at col 16
    // Top row (Row E): Pin 14 (VCC) at col 10, Pin 13 at col 11, ..., Pin 8 at col 16
    
    const placedICs: PlacedIC[] = [
      { id: 'u1', model: '7404', col: 10 }
    ];

    // Wire:
    // 1. VCC to Pin 14: rail_vcc_top -> top:10:E
    // 2. GND to Pin 7: rail_gnd_bot -> bot:16:F
    // 3. Switch 0 to Pin 1 (1A): sw:0 -> bot:10:G
    // 4. Pin 2 (1Y) to LED 0: bot:11:G -> led:0
    const wires: Wire[] = [
      { id: 'w1', from: 'vcc_top:10', to: 'top:10:E', color: 'red' },
      { id: 'w2', from: 'gnd_bot:16', to: 'bot:16:F', color: 'black' },
      { id: 'w3', from: 'sw:0', to: 'bot:10:G', color: 'yellow' },
      { id: 'w4', from: 'bot:11:G', to: 'led:0', color: 'green' }
    ];

    // Case A: SW0 is 0 -> Inverter Output should be 1 -> LED 0 should be 1
    const resA = runCircuitSimulation(
      placedICs,
      wires,
      [0, 0, 0, 0, 0, 0, 0, 0],
      0, 0,
      true
    );

    expect(resA.icPowerStatus['u1']).toBe(true);
    expect(resA.ledOutputs[0]).toBe(1);

    // Case B: SW0 is 1 -> Inverter Output should be 0 -> LED 0 should be 0
    const resB = runCircuitSimulation(
      placedICs,
      wires,
      [1, 0, 0, 0, 0, 0, 0, 0],
      0, 0,
      true
    );

    expect(resB.ledOutputs[0]).toBe(0);
  });

  it('reports missing power when VCC or GND is not connected', () => {
    const placedICs: PlacedIC[] = [
      { id: 'u1', model: '7404', col: 10 }
    ];
    const wires: Wire[] = [];
    const res = runCircuitSimulation(placedICs, wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);
    expect(res.icPowerStatus['u1']).toBe(false);
    expect(res.warnings.length).toBeGreaterThan(0);
  });
});
