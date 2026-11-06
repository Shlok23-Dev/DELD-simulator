import { PlacedIC, Wire } from '../simulation/circuitEngine';

export interface PracticalReferenceCircuit {
  practicalId: number;
  subExerciseId?: string;
  name: string;
  description: string;
  placedICs: PlacedIC[];
  wires: Wire[];
  defaultSwitches?: (0 | 1)[];
  recommendedInputs: { name: string; swIndex: number }[];
  recommendedOutputs: { name: string; ledIndex: number }[];
}

export const REFERENCE_CIRCUITS: PracticalReferenceCircuit[] = [
  // Practical 1: Binary to Gray
  {
    practicalId: 1,
    subExerciseId: 'bin2gray',
    name: '4-Bit Binary to Gray Code Converter',
    description: 'Uses XOR IC 7486. G3=B3, G2=B3⊕B2, G1=B2⊕B1, G0=B1⊕B0.',
    placedICs: [
      { id: 'u1', model: '7486', col: 10 }
    ],
    // 7486 (14 pins) placed at Col 10:
    // Bottom row (Row F, cols 10..16): Pin 1..7 (1A, 1B, 1Y, 2A, 2B, 2Y, GND)
    // Top row (Row E, cols 10..16): Pin 14..8 (VCC, 4B, 4A, 4Y, 3B, 3A, 3Y)
    // Physical LEDs on breadboard arranged MSB to LSB (D, C, B, A):
    // LED 3 (G3 / D / MSB) Anode = bot:22:F
    // LED 2 (G2 / C)       Anode = bot:24:F
    // LED 1 (G1 / B)       Anode = bot:26:F
    // LED 0 (G0 / A / LSB) Anode = bot:28:F
    wires: [
      // 1. Power Pin 14 (top:10:E) to +5V rail and Pin 7 (bot:16:F) to GND rail
      { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: '#ef4444' },
      { id: 'w_gnd', from: 'gnd_bot:16', to: 'bot:16:F', color: '#3b82f6' },

      // 2. Wire SW3 (B3) directly to LED3 Anode (G3 = B3) AND to IC 7486 Pin 1 (1A = bot:10:F)
      { id: 'w_b3_led', from: 'sw:3', to: 'bot:22:F', color: '#3b82f6' },
      { id: 'w_b3_gate1', from: 'sw:3', to: 'bot:10:F', color: '#3b82f6' },

      // 3. Wire SW2 (B2) to IC 7486 Pin 2 (1B = bot:11:F) and Pin 4 (2A = bot:13:F)
      { id: 'w_b2_gate1', from: 'sw:2', to: 'bot:11:F', color: '#eab308' },
      { id: 'w_b2_gate2', from: 'sw:2', to: 'bot:13:F', color: '#eab308' },

      // 4. Wire Pin 3 (1Y = G2 = bot:12:F) to LED2 Anode (bot:24:F)
      { id: 'w_g2_led', from: 'bot:12:F', to: 'bot:24:F', color: '#22c55e' },

      // 5. Wire SW1 (B1) to IC 7486 Pin 5 (2B = bot:14:F) and Pin 9 (3A = top:15:E)
      { id: 'w_b1_gate2', from: 'sw:1', to: 'bot:14:F', color: '#a855f7' },
      { id: 'w_b1_gate3', from: 'sw:1', to: 'top:15:E', color: '#a855f7' },

      // 6. Wire Pin 6 (2Y = G1 = bot:15:F) to LED1 Anode (bot:26:F)
      { id: 'w_g1_led', from: 'bot:15:F', to: 'bot:26:F', color: '#22c55e' },

      // 7. Wire SW0 (B0) to IC 7486 Pin 10 (3B = top:14:E)
      { id: 'w_b0_gate3', from: 'sw:0', to: 'top:14:E', color: '#06b6d4' },

      // 8. Wire Pin 8 (3Y = G0 = top:16:E) to LED0 Anode (bot:28:F)
      { id: 'w_g0_led', from: 'top:16:E', to: 'bot:28:F', color: '#22c55e' }
    ],
    recommendedInputs: [
      { name: 'B3 (MSB)', swIndex: 3 },
      { name: 'B2', swIndex: 2 },
      { name: 'B1', swIndex: 1 },
      { name: 'B0 (LSB)', swIndex: 0 }
    ],
    recommendedOutputs: [
      { name: 'G3 (LED D - MSB)', ledIndex: 3 },
      { name: 'G2 (LED C)', ledIndex: 2 },
      { name: 'G1 (LED B)', ledIndex: 1 },
      { name: 'G0 (LED A - LSB)', ledIndex: 0 }
    ]
  },

  // Practical 1: Gray to Binary
  {
    practicalId: 1,
    subExerciseId: 'gray2bin',
    name: '4-Bit Gray to Binary Code Converter',
    description: 'Uses XOR IC 7486. B3=G3, B2=B3⊕G2, B1=B2⊕G1, B0=B1⊕G0.',
    placedICs: [
      { id: 'u1', model: '7486', col: 10 }
    ],
    wires: [
      // Power & Ground
      { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: '#ef4444' },
      { id: 'w_gnd', from: 'gnd_bot:16', to: 'bot:16:F', color: '#3b82f6' },

      // G3 (SW3) -> LED3 Anode (bot:22:F) and Pin 1 (1A = bot:10:F)
      { id: 'w_g3_led', from: 'sw:3', to: 'bot:22:F', color: '#3b82f6' },
      { id: 'w_g3_pin1', from: 'sw:3', to: 'bot:10:F', color: '#3b82f6' },

      // G2 (SW2) -> Pin 2 (1B = bot:11:F)
      { id: 'w_g2_pin2', from: 'sw:2', to: 'bot:11:F', color: '#eab308' },

      // Pin 3 (1Y = B2 = bot:12:F) -> LED2 Anode (bot:24:F) AND Pin 4 (2A = bot:13:F)
      { id: 'w_b2_led', from: 'bot:12:F', to: 'bot:24:F', color: '#22c55e' },
      { id: 'w_b2_pin4', from: 'bot:12:F', to: 'bot:13:F', color: '#22c55e' },

      // G1 (SW1) -> Pin 5 (2B = bot:14:F)
      { id: 'w_g1_pin5', from: 'sw:1', to: 'bot:14:F', color: '#a855f7' },

      // Pin 6 (2Y = B1 = bot:15:F) -> LED1 Anode (bot:26:F) AND Pin 9 (3A = top:15:E)
      { id: 'w_b1_led', from: 'bot:15:F', to: 'bot:26:F', color: '#22c55e' },
      { id: 'w_b1_pin9', from: 'bot:15:F', to: 'top:15:E', color: '#22c55e' },

      // G0 (SW0) -> Pin 10 (3B = top:14:E)
      { id: 'w_g0_pin10', from: 'sw:0', to: 'top:14:E', color: '#06b6d4' },

      // Pin 8 (3Y = B0 = top:16:E) -> LED0 Anode (bot:28:F)
      { id: 'w_b0_led', from: 'top:16:E', to: 'bot:28:F', color: '#22c55e' }
    ],
    recommendedInputs: [
      { name: 'G3 (MSB)', swIndex: 3 },
      { name: 'G2', swIndex: 2 },
      { name: 'G1', swIndex: 1 },
      { name: 'G0 (LSB)', swIndex: 0 }
    ],
    recommendedOutputs: [
      { name: 'B3 (LED D - MSB)', ledIndex: 3 },
      { name: 'B2 (LED C)', ledIndex: 2 },
      { name: 'B1 (LED B)', ledIndex: 1 },
      { name: 'B0 (LED A - LSB)', ledIndex: 0 }
    ]
  },

  // Practical 2: 4-Bit BCD Adder using IC 7483
  {
    practicalId: 2,
    name: '4-Bit BCD Adder using IC 7483',
    description: 'Binary full adder stage with sum outputs routed to breadboard LEDs.',
    placedICs: [
      { id: 'u1', model: '7483', col: 10 }
    ],
    // 7483 (16-pin) placed at Col 10:
    // Bottom row (Row F, cols 10..17): Pin 1..8 (A1, B1, A0, B0, VCC, S1, S0, C4)
    // Top row (Row E, cols 10..17): Pin 16..9 (A2, B2, A3, C0, GND, B3, S2, S3)
    wires: [
      // Power: Pin 5 VCC = bot:14:F, Pin 12 GND = top:14:E, Pin 13 C0 = top:13:E (to GND)
      { id: 'w_vcc', from: 'vcc_bot:14', to: 'bot:14:F', color: '#ef4444' },
      { id: 'w_gnd', from: 'gnd_top:14', to: 'top:14:E', color: '#3b82f6' },
      { id: 'w_c0_gnd', from: 'gnd_top:13', to: 'top:13:E', color: '#3b82f6' },

      // Operand A from SW0..SW3
      { id: 'w_a0', from: 'sw:0', to: 'bot:12:F', color: '#f97316' }, // A0 (Pin 3)
      { id: 'w_a1', from: 'sw:1', to: 'bot:10:F', color: '#f97316' }, // A1 (Pin 1)
      { id: 'w_a2', from: 'sw:2', to: 'top:10:E', color: '#f97316' }, // A2 (Pin 16)
      { id: 'w_a3', from: 'sw:3', to: 'top:12:E', color: '#f97316' }, // A3 (Pin 14)

      // Operand B from SW4..SW7
      { id: 'w_b0', from: 'sw:4', to: 'bot:13:F', color: '#8b5cf6' }, // B0 (Pin 4)
      { id: 'w_b1', from: 'sw:5', to: 'bot:11:F', color: '#8b5cf6' }, // B1 (Pin 2)
      { id: 'w_b2', from: 'sw:6', to: 'top:11:E', color: '#8b5cf6' }, // B2 (Pin 15)
      { id: 'w_b3', from: 'sw:7', to: 'top:15:E', color: '#8b5cf6' }, // B3 (Pin 11)

      // Outputs S3..S0 to physical LEDs (D, C, B, A) at cols 22, 24, 26, 28
      { id: 'w_s3', from: 'top:17:E', to: 'bot:22:F', color: '#22c55e' }, // S3 (Pin 9)  -> LED D (MSB)
      { id: 'w_s2', from: 'top:16:E', to: 'bot:24:F', color: '#22c55e' }, // S2 (Pin 10) -> LED C
      { id: 'w_s1', from: 'bot:15:F', to: 'bot:26:F', color: '#22c55e' }, // S1 (Pin 6)  -> LED B
      { id: 'w_s0', from: 'bot:16:F', to: 'bot:28:F', color: '#22c55e' }  // S0 (Pin 7)  -> LED A (LSB)
    ],
    recommendedInputs: [
      { name: 'A[3..0] (SW3..SW0)', swIndex: 0 },
      { name: 'B[3..0] (SW7..SW4)', swIndex: 4 }
    ],
    recommendedOutputs: [
      { name: 'S3 (LED D - MSB)', ledIndex: 3 },
      { name: 'S2 (LED C)', ledIndex: 2 },
      { name: 'S1 (LED B)', ledIndex: 1 },
      { name: 'S0 (LED A - LSB)', ledIndex: 0 }
    ]
  },

  // Practical 3: Multiplexer IC 74153 Full Adder
  {
    practicalId: 3,
    subExerciseId: 'mux_full_adder',
    name: 'Full Adder using Multiplexer IC 74153',
    description: 'Implements Sum & Carry with common select lines S1=A, S0=B.',
    placedICs: [
      { id: 'u1', model: '74153', col: 10 }
    ],
    // 74153 (16-pin) placed at Col 10:
    // Bottom row (Row F, cols 10..17): Pin 1..8 (1E', S0, 1I3, 1I2, 1I1, 1I0, 1Y, GND)
    // Top row (Row E, cols 10..17): Pin 16..9 (VCC, 2E', S1, 2I3, 2I2, 2I1, 2I0, 2Y)
    wires: [
      // Power: Pin 16 VCC at top:10:E, Pin 8 GND at bot:17:F
      { id: 'w_vcc', from: 'vcc_top:10', to: 'top:10:E', color: '#ef4444' },
      { id: 'w_gnd', from: 'gnd_bot:17', to: 'bot:17:F', color: '#3b82f6' },

      // Ground active-low enables 1E' (Pin 1 = bot:10:F) and 2E' (Pin 15 = top:11:E)
      { id: 'w_1e', from: 'gnd_bot:10', to: 'bot:10:F', color: '#3b82f6' },
      { id: 'w_2e', from: 'gnd_top:11', to: 'top:11:E', color: '#3b82f6' },

      // Select lines S1 (Pin 14 = top:12:E) = A (SW2), S0 (Pin 2 = bot:11:F) = B (SW1)
      { id: 'w_s1_a', from: 'sw:2', to: 'top:12:E', color: '#f97316' },
      { id: 'w_s0_b', from: 'sw:1', to: 'bot:11:F', color: '#eab308' },

      // Carry (2Y, Pin 9 = top:17:E): 2I0=0, 2I1=Cin, 2I2=Cin, 2I3=1
      { id: 'w_2i0', from: 'gnd_top:16', to: 'top:16:E', color: '#3b82f6' }, // 2I0 (Pin 10) to GND
      { id: 'w_2i1', from: 'sw:0', to: 'top:15:E', color: '#06b6d4' },       // 2I1 (Pin 11) to Cin (SW0)
      { id: 'w_2i2', from: 'sw:0', to: 'top:14:E', color: '#06b6d4' },       // 2I2 (Pin 12) to Cin (SW0)
      { id: 'w_2i3', from: 'vcc_top:13', to: 'top:13:E', color: '#ef4444' }, // 2I3 (Pin 13) to VCC

      // Outputs: 1Y (Pin 7 = bot:16:F = Sum) -> LED A Anode (bot:28:F)
      // 2Y (Pin 9 = top:17:E = Cout) -> LED B Anode (bot:26:F)
      { id: 'w_sum', from: 'bot:16:F', to: 'bot:28:F', color: '#3b82f6' },
      { id: 'w_cout', from: 'top:17:E', to: 'bot:26:F', color: '#22c55e' }
    ],
    recommendedInputs: [
      { name: 'Input A', swIndex: 2 },
      { name: 'Input B', swIndex: 1 },
      { name: 'Input Cin', swIndex: 0 }
    ],
    recommendedOutputs: [
      { name: 'Cout (LED B)', ledIndex: 1 },
      { name: 'Sum (LED A)', ledIndex: 0 }
    ]
  },

  // Practical 8: Mod-10 Counter with IC 7490
  {
    practicalId: 8,
    name: 'Modulo-10 / Modulo-N Counter using IC 7490',
    description: 'Decade ripple counter with QA cascaded to CKB for full 0-9 count.',
    placedICs: [
      { id: 'u1', model: '7490', col: 10 }
    ],
    // 7490 (14-pin) placed at Col 10:
    // Bottom row (Row F, cols 10..16): Pin 1..7 (CKB, R0(1), R0(2), NC, VCC, R9(1), R9(2))
    // Top row (Row E, cols 10..16): Pin 14..8 (CKA, NC, QA, QD, GND, QC, QB)
    wires: [
      // Power: Pin 5 VCC = bot:14:F, Pin 10 GND = top:14:E
      { id: 'w_vcc', from: 'vcc_bot:14', to: 'bot:14:F', color: '#ef4444' },
      { id: 'w_gnd', from: 'gnd_top:14', to: 'top:14:E', color: '#3b82f6' },

      // Resets R0(1) (Pin 2 = bot:11:F) & R0(2) (Pin 3 = bot:12:F) to GND
      { id: 'w_r0_1', from: 'gnd_bot:11', to: 'bot:11:F', color: '#3b82f6' },
      { id: 'w_r0_2', from: 'gnd_bot:12', to: 'bot:12:F', color: '#3b82f6' },

      // Clock input to CKA (Pin 14 = top:10:E)
      { id: 'w_clk', from: 'clk', to: 'top:10:E', color: '#ec4899' },

      // Cascade QA (Pin 12 = top:12:E) to CKB (Pin 1 = bot:10:F)
      { id: 'w_cascade', from: 'top:12:E', to: 'bot:10:F', color: '#eab308' },

      // Outputs to physical LEDs (D, C, B, A): QD->LED3 (D), QC->LED2 (C), QB->LED1 (B), QA->LED0 (A)
      { id: 'w_qd', from: 'top:13:E', to: 'bot:22:F', color: '#22c55e' },
      { id: 'w_qc', from: 'top:15:E', to: 'bot:24:F', color: '#22c55e' },
      { id: 'w_qb', from: 'top:16:E', to: 'bot:26:F', color: '#22c55e' },
      { id: 'w_qa', from: 'top:12:E', to: 'bot:28:F', color: '#22c55e' }
    ],
    recommendedInputs: [
      { name: 'Manual Clock Pulse', swIndex: 0 }
    ],
    recommendedOutputs: [
      { name: 'QD (LED D - MSB)', ledIndex: 3 },
      { name: 'QC (LED C)', ledIndex: 2 },
      { name: 'QB (LED B)', ledIndex: 1 },
      { name: 'QA (LED A - LSB)', ledIndex: 0 }
    ]
  }
];
