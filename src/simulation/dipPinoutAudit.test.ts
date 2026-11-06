import { describe, it, expect } from 'vitest';
import { runCircuitSimulation, PlacedIC, Wire } from './circuitEngine';

describe('Global DIP IC Physical Pinout Orientation Audit', () => {
  describe('1. Power & Ground Physical Corner Connections', () => {
    const col = 15;

    it('powers 14-pin standard corner TTL ICs (VCC at E15, GND at F21)', () => {
      const standard14PinICs = ['7400', '7402', '7404', '7408', '7432', '7486', '7474'];

      standard14PinICs.forEach(model => {
        const placedICs: PlacedIC[] = [{ id: 'u1', model, col }];
        // Start col 15 -> E15 is Pin 14; End col 21 -> F21 is Pin 7
        const wires: Wire[] = [
          { id: 'w_vcc', from: 'vcc_top:15', to: 'top:15:E', color: 'red' },
          { id: 'w_gnd', from: 'gnd_bot:21', to: 'bot:21:F', color: 'black' }
        ];

        const res = runCircuitSimulation(placedICs, wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);
        expect(res.icPowerStatus['u1'], `${model} should be powered via E15 (Pin 14) and F21 (Pin 7)`).toBe(true);
      });
    });

    it('powers 16-pin standard corner TTL ICs (VCC at E15, GND at F22)', () => {
      const standard16PinICs = ['74138', '74151', '74153', '74191'];

      standard16PinICs.forEach(model => {
        const placedICs: PlacedIC[] = [{ id: 'u1', model, col }];
        // Start col 15 -> E15 is Pin 16; End col 22 -> F22 is Pin 8
        const wires: Wire[] = [
          { id: 'w_vcc', from: 'vcc_top:15', to: 'top:15:E', color: 'red' },
          { id: 'w_gnd', from: 'gnd_bot:22', to: 'bot:22:F', color: 'black' }
        ];

        const res = runCircuitSimulation(placedICs, wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);
        expect(res.icPowerStatus['u1'], `${model} should be powered via E15 (Pin 16) and F22 (Pin 8)`).toBe(true);
      });
    });

    it('powers non-standard power pin ICs at their physical datasheet positions', () => {
      // 7483: 16-pin. VCC = Pin 5 (bot:19:F), GND = Pin 12 (top:19:E)
      const res7483 = runCircuitSimulation(
        [{ id: 'u1', model: '7483', col }],
        [
          { id: 'w_vcc', from: 'vcc_bot:19', to: 'bot:19:F', color: 'red' },
          { id: 'w_gnd', from: 'gnd_top:19', to: 'top:19:E', color: 'black' }
        ],
        [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true
      );
      expect(res7483.icPowerStatus['u1'], '7483 powered via Pin 5 (F19) and Pin 12 (E19)').toBe(true);

      // 7476: 16-pin. VCC = Pin 5 (bot:19:F), GND = Pin 13 (top:18:E)
      const res7476 = runCircuitSimulation(
        [{ id: 'u1', model: '7476', col }],
        [
          { id: 'w_vcc', from: 'vcc_bot:19', to: 'bot:19:F', color: 'red' },
          { id: 'w_gnd', from: 'gnd_top:18', to: 'top:18:E', color: 'black' }
        ],
        [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true
      );
      expect(res7476.icPowerStatus['u1'], '7476 powered via Pin 5 (F19) and Pin 13 (E18)').toBe(true);

      // 7490: 14-pin. VCC = Pin 5 (bot:19:F), GND = Pin 10 (top:19:E)
      const res7490 = runCircuitSimulation(
        [{ id: 'u1', model: '7490', col }],
        [
          { id: 'w_vcc', from: 'vcc_bot:19', to: 'bot:19:F', color: 'red' },
          { id: 'w_gnd', from: 'gnd_top:19', to: 'top:19:E', color: 'black' }
        ],
        [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true
      );
      expect(res7490.icPowerStatus['u1'], '7490 powered via Pin 5 (F19) and Pin 10 (E19)').toBe(true);
    });
  });

  describe('2. Gate Logic Testing Across Bottom Row (Pins 1–7) and Top Row (Pins 8–14)', () => {
    const col = 10;

    it('verifies 7408 AND gates on both bottom row and top row', () => {
      // 7408 at col 10:
      // Bottom row (Row F):
      // Pin 1 (1A) = bot:10:F, Pin 2 (1B) = bot:11:F, Pin 3 (1Y) = bot:12:F (Gate 1)
      // Pin 4 (2A) = bot:13:F, Pin 5 (2B) = bot:14:F, Pin 6 (2Y) = bot:15:F (Gate 2)
      // Pin 7 (GND) = bot:16:F
      // Top row (Row E):
      // Pin 14 (VCC) = top:10:E
      // Pin 13 (4B) = top:11:E, Pin 12 (4A) = top:12:E, Pin 11 (4Y) = top:13:E (Gate 4)
      // Pin 10 (3B) = top:14:E, Pin 9 (3A) = top:15:E, Pin 8 (3Y) = top:16:E (Gate 3)

      const placedICs: PlacedIC[] = [{ id: 'u1', model: '7408', col }];

      const wires: Wire[] = [
        // Power
        { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: 'red' },
        { id: 'w_gnd', from: 'gnd_bot:16', to: 'bot:16:F', color: 'black' },

        // Gate 1 (Bottom row): 1A from SW0, 1B from SW1 -> 1Y to LED 0
        { id: 'w_1a', from: 'sw:0', to: 'bot:10:G', color: 'yellow' },
        { id: 'w_1b', from: 'sw:1', to: 'bot:11:G', color: 'yellow' },
        { id: 'w_1y', from: 'bot:12:G', to: 'led:0', color: 'green' },

        // Gate 3 (Top row): 3A from SW2, 3B from SW3 -> 3Y to LED 1
        { id: 'w_3a', from: 'sw:2', to: 'top:15:D', color: 'yellow' }, // Pin 9 is at col 10 + (14-9) = 15
        { id: 'w_3b', from: 'sw:3', to: 'top:14:D', color: 'yellow' }, // Pin 10 is at col 10 + (14-10) = 14
        { id: 'w_3y', from: 'top:16:D', to: 'led:1', color: 'green' }  // Pin 8 is at col 10 + (14-8) = 16
      ];

      // Test Gate 1 on Bottom Row:
      // 0 AND 1 = 0
      let res = runCircuitSimulation(placedICs, wires, [0, 1, 0, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0]).toBe(0);

      // 1 AND 1 = 1
      res = runCircuitSimulation(placedICs, wires, [1, 1, 0, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0]).toBe(1);

      // Test Gate 3 on Top Row:
      // 1 AND 0 = 0
      res = runCircuitSimulation(placedICs, wires, [0, 0, 1, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[1]).toBe(0);

      // 1 AND 1 = 1
      res = runCircuitSimulation(placedICs, wires, [0, 0, 1, 1, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[1]).toBe(1);
    });

    it('verifies 7402 NOR gates with special pinout (outputs on Pins 1, 4, 10, 13)', () => {
      // 7402 at col 10:
      // Gate 1 (Bottom Row): Output is Pin 1 (bot:10:F), Inputs are Pins 2, 3 (bot:11:F, bot:12:F)
      // Gate 4 (Top Row): Output is Pin 13 (top:11:E), Inputs are Pins 11, 12 (top:13:E, top:12:E)

      const placedICs: PlacedIC[] = [{ id: 'u1', model: '7402', col }];

      const wires: Wire[] = [
        { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: 'red' }, // Pin 14
        { id: 'w_gnd', from: 'gnd_bot:16', to: 'bot:16:F', color: 'black' }, // Pin 7

        // Gate 1 (Bottom row): Output Pin 1 -> LED 0, Inputs Pin 2 (SW0), Pin 3 (SW1)
        { id: 'w_1a', from: 'sw:0', to: 'bot:11:G', color: 'yellow' },
        { id: 'w_1b', from: 'sw:1', to: 'bot:12:G', color: 'yellow' },
        { id: 'w_1y', from: 'bot:10:G', to: 'led:0', color: 'green' },

        // Gate 4 (Top row): Output Pin 13 -> LED 1, Inputs Pin 11 (SW2), Pin 12 (SW3)
        // Pin 13 is top:11:E (col 10 + 14 - 13)
        // Pin 12 is top:12:E (col 10 + 14 - 12)
        // Pin 11 is top:13:E (col 10 + 14 - 11)
        { id: 'w_4a', from: 'sw:2', to: 'top:13:D', color: 'yellow' },
        { id: 'w_4b', from: 'sw:3', to: 'top:12:D', color: 'yellow' },
        { id: 'w_4y', from: 'top:11:D', to: 'led:1', color: 'green' }
      ];

      // NOR(0, 0) = 1
      let res = runCircuitSimulation(placedICs, wires, [0, 0, 0, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0], 'Gate 1 NOR(0,0)').toBe(1);
      expect(res.ledOutputs[1], 'Gate 4 NOR(0,0)').toBe(1);

      // NOR(1, 0) = 0
      res = runCircuitSimulation(placedICs, wires, [1, 0, 0, 1, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0], 'Gate 1 NOR(1,0)').toBe(0);
      expect(res.ledOutputs[1], 'Gate 4 NOR(0,1)').toBe(0);
    });

    it('verifies 74151 8:1 Multiplexer selection across counter-clockwise pins', () => {
      // 74151 at col 10 (16-pin):
      // Pin 16 VCC (top:10:E), Pin 8 GND (bot:17:F)
      // Pin 7 G' (bot:16:F) -> GND (enabled)
      // Select lines: A=Pin 11 (top:15:E), B=Pin 10 (top:16:E), C=Pin 9 (top:17:E)
      // Data D3=Pin 1 (bot:10:F) set to 1, all others 0
      const placedICs: PlacedIC[] = [{ id: 'u1', model: '74151', col }];

      const wires: Wire[] = [
        { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: 'red' },
        { id: 'w_gnd', from: 'gnd_bot:17', to: 'bot:17:F', color: 'black' },
        { id: 'w_g', from: 'gnd_bot:16', to: 'bot:16:F', color: 'black' }, // Strobe G' to GND

        // Select lines: SW0=A (Pin 11 = top:15:E), SW1=B (Pin 10 = top:16:E), SW2=C (Pin 9 = top:17:E)
        { id: 'w_sel_a', from: 'sw:0', to: 'top:15:D', color: 'yellow' },
        { id: 'w_sel_b', from: 'sw:1', to: 'top:16:D', color: 'yellow' },
        { id: 'w_sel_c', from: 'sw:2', to: 'top:17:D', color: 'yellow' },

        // Data input D3 (Pin 1 = bot:10:F) to VCC (+5V)
        { id: 'w_d3', from: 'vcc_bot:10', to: 'bot:10:F', color: 'red' },

        // Output Y (Pin 5 = bot:14:F) -> LED 0
        { id: 'w_y', from: 'bot:14:G', to: 'led:0', color: 'green' }
      ];

      // When Select = 3 (A=1, B=1, C=0): Y should be 1 (D3)
      let res = runCircuitSimulation(placedICs, wires, [1, 1, 0, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0], '74151 Output Y for select=3').toBe(1);

      // When Select = 2 (A=0, B=1, C=0): Y should be 0 (D2 is 0)
      res = runCircuitSimulation(placedICs, wires, [0, 1, 0, 0, 0, 0, 0, 0], 0, 0, true);
      expect(res.ledOutputs[0], '74151 Output Y for select=2').toBe(0);
    });
  });
});
