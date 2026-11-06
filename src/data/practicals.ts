import { Practical } from '../types';

export const PRACTICALS: Practical[] = [
  {
    id: 1,
    officialNumber: 1,
    category: 'combinational',
    syllabusCategory: 'Combinational Logic Design',
    title: 'Design (truth table, K-Map) and implement 4-bit code converter: (i) Binary to Gray and vice versa, (ii) Excess-3 to BCD and vice versa.',
    shortTitle: '4-Bit Code Converter (Binary ↔ Gray, Excess-3 ↔ BCD)',
    coMapped: ['CO1', 'CO2'],
    aim: 'To design, minimize using K-Map, and implement 4-bit code converters: Binary to Gray code, Gray to Binary code, BCD to Excess-3, and Excess-3 to BCD using digital logic ICs.',
    description: 'Code converters are combinational circuits that translate information from one binary code format into another. In Binary-to-Gray, G3=B3, G2=B3⊕B2, G1=B2⊕B1, G0=B1⊕B0. For Gray-to-Binary, B3=G3, B2=B3⊕G2, B1=B2⊕G1, B0=B1⊕G0. For Excess-3 conversion, arithmetic addition/subtraction of 3 (0011) or K-Map minimized XOR/NAND/AND/OR expressions are realized.',
    requiredICs: ['IC 7486 (Quad 2-input XOR Gate)', 'IC 7408 (Quad 2-input AND Gate)', 'IC 7432 (Quad 2-input OR Gate)', 'IC 7404 (Hex Inverter)'],
    procedureNotes: [
      '1. Verify pinouts and place IC 7486 across the breadboard center trough.',
      '2. Connect VCC (Pin 14) to +5V and GND (Pin 7) to ground rail.',
      '3. For Binary to Gray: connect B3 to G3 directly, B3 & B2 to XOR gate 1 (output G2), B2 & B1 to XOR gate 2 (output G1), and B1 & B0 to XOR gate 3 (output G0).',
      '4. Connect inputs to the digital trainer toggle switches and outputs to monitor LEDs.',
      '5. Switch power ON and verify output for all 16 input combinations against the truth table.'
    ],
    kmapNotes: 'K-Map minimization confirms single-step Hamming distance property of Gray code; each bit reduces to cascaded XOR expressions.',
    subExercises: [
      {
        id: 'bin2gray',
        name: 'Binary to Gray Code Converter',
        description: 'G3 = B3, G2 = B3 ⊕ B2, G1 = B2 ⊕ B1, G0 = B1 ⊕ B0',
        aim: 'Design and implement a 4-bit Binary to Gray code converter using XOR IC 7486.',
        requiredICs: ['IC 7486'],
        procedure: [
          'Connect B3 directly to LED G3.',
          'Connect B3 and B2 to XOR Gate 1 -> LED G2.',
          'Connect B2 and B1 to XOR Gate 2 -> LED G1.',
          'Connect B1 and B0 to XOR Gate 3 -> LED G0.'
        ],
        inputs: [
          { id: 'B3', label: 'B3 (MSB)' },
          { id: 'B2', label: 'B2' },
          { id: 'B1', label: 'B1' },
          { id: 'B0', label: 'B0 (LSB)' }
        ],
        outputs: [
          { id: 'G3', label: 'G3', color: 'green' },
          { id: 'G2', label: 'G2', color: 'green' },
          { id: 'G1', label: 'G1', color: 'green' },
          { id: 'G0', label: 'G0', color: 'green' }
        ],
        truthTable: {
          headers: ['B3', 'B2', 'B1', 'B0', 'G3', 'G2', 'G1', 'G0'],
          rows: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0, 1, 1, 1],
            [0, 1, 1, 0, 0, 1, 0, 1],
            [0, 1, 1, 1, 0, 1, 0, 0],
            [1, 0, 0, 0, 1, 1, 0, 0],
            [1, 0, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 1, 0, 1, 0],
            [1, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0]
          ]
        }
      },
      {
        id: 'gray2bin',
        name: 'Gray to Binary Code Converter',
        description: 'B3 = G3, B2 = B3 ⊕ G2, B1 = B2 ⊕ G1, B0 = B1 ⊕ G0',
        aim: 'Design and implement a 4-bit Gray to Binary code converter using XOR IC 7486.',
        requiredICs: ['IC 7486'],
        procedure: [
          'Connect G3 directly to LED B3.',
          'Connect B3 (output) and G2 to XOR Gate 1 -> LED B2.',
          'Connect B2 (output) and G1 to XOR Gate 2 -> LED B1.',
          'Connect B1 (output) and G0 to XOR Gate 3 -> LED B0.'
        ],
        inputs: [
          { id: 'G3', label: 'G3 (MSB)' },
          { id: 'G2', label: 'G2' },
          { id: 'G1', label: 'G1' },
          { id: 'G0', label: 'G0 (LSB)' }
        ],
        outputs: [
          { id: 'B3', label: 'B3', color: 'blue' },
          { id: 'B2', label: 'B2', color: 'blue' },
          { id: 'B1', label: 'B1', color: 'blue' },
          { id: 'B0', label: 'B0', color: 'blue' }
        ],
        truthTable: {
          headers: ['G3', 'G2', 'G1', 'G0', 'B3', 'B2', 'B1', 'B0'],
          rows: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1],
            [0, 0, 1, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 1, 1],
            [1, 1, 0, 0, 1, 0, 0, 0],
            [1, 1, 0, 1, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0],
            [1, 1, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 1, 0, 0],
            [1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 0],
            [1, 0, 0, 0, 1, 1, 1, 1]
          ]
        }
      },
      {
        id: 'bcd2xs3',
        name: 'BCD to Excess-3 Converter',
        description: 'Excess-3 = BCD + 3 (0011). Valid input ranges 0000 (0) to 1001 (9).',
        aim: 'Design and implement a BCD to Excess-3 code converter.',
        requiredICs: ['IC 7483 (4-bit Adder) or IC 7486, 7408, 7432'],
        procedure: [
          'Feed 4-bit BCD input to A3..A0 of 4-bit adder IC 7483.',
          'Set B3..B0 to constant binary 0011 (decimal 3): B3=0, B2=0, B1=1, B0=1.',
          'Connect C0 to GND (0).',
          'Observe sum outputs S3..S0 on output LEDs.'
        ],
        inputs: [
          { id: 'A3', label: 'A3 (MSB)' },
          { id: 'A2', label: 'A2' },
          { id: 'A1', label: 'A1' },
          { id: 'A0', label: 'A0 (LSB)' }
        ],
        outputs: [
          { id: 'X3', label: 'X3', color: 'purple' },
          { id: 'X2', label: 'X2', color: 'purple' },
          { id: 'X1', label: 'X1', color: 'purple' },
          { id: 'X0', label: 'X0', color: 'purple' }
        ],
        truthTable: {
          headers: ['A3', 'A2', 'A1', 'A0', 'Dec', 'X3', 'X2', 'X1', 'X0'],
          rows: [
            [0, 0, 0, 0, '0', 0, 0, 1, 1],
            [0, 0, 0, 1, '1', 0, 1, 0, 0],
            [0, 0, 1, 0, '2', 0, 1, 0, 1],
            [0, 0, 1, 1, '3', 0, 1, 1, 0],
            [0, 1, 0, 0, '4', 0, 1, 1, 1],
            [0, 1, 0, 1, '5', 1, 0, 0, 0],
            [0, 1, 1, 0, '6', 1, 0, 0, 1],
            [0, 1, 1, 1, '7', 1, 0, 1, 0],
            [1, 0, 0, 0, '8', 1, 0, 1, 1],
            [1, 0, 0, 1, '9', 1, 1, 0, 0]
          ]
        }
      }
    ],
    vivaQuestions: [
      {
        question: 'What is Gray code and why is it called a reflected / unit-distance code?',
        answer: 'Gray code is an unweighted code where only one bit changes between successive numerical values, preventing spurious switching glitches in mechanical and digital encoders.'
      },
      {
        question: 'What is Excess-3 code and what is its primary advantage?',
        answer: 'Excess-3 is an unweighted, self-complementing BCD code obtained by adding 3 (0011) to the BCD digit. Its 9s complement can be obtained directly by complementing each bit.'
      }
    ]
  },
  {
    id: 2,
    officialNumber: 2,
    category: 'combinational',
    syllabusCategory: 'Combinational Logic Design',
    title: 'Design (truth table, K-Map) and implementation of 4-bit BCD Adder using IC 7483.',
    shortTitle: '4-Bit BCD Adder using IC 7483',
    coMapped: ['CO1', 'CO2'],
    aim: 'To design and implement a 4-bit BCD (Binary Coded Decimal) adder circuit using 4-bit binary adder IC 7483 and logic gates.',
    description: 'A BCD adder adds two 4-bit BCD digits (0 to 9). When the binary sum exceeds 9 (1001) or produces a carry out (C4 = 1), the result is an invalid BCD digit. Correction is achieved by detecting sum > 9 via expression: Correction = C4 + S3·S2 + S3·S1, and adding binary 6 (0110) using a second IC 7483 stage.',
    requiredICs: ['IC 7483 (4-Bit Binary Full Adder) x 2', 'IC 7408 (Quad 2-input AND Gate)', 'IC 7432 (Quad 2-input OR Gate)'],
    procedureNotes: [
      '1. Insert IC 7483 (Stage 1) on the breadboard. Power pin 5 (+5V) and GND pin 12.',
      '2. Connect two 4-bit BCD numbers A[3..0] and B[3..0] to the corresponding adder inputs. Tie carry-in C0 (pin 13) to ground.',
      '3. Form the invalid-BCD detection logic: C_out = C4 OR (S3 AND S2) OR (S3 AND S1) using IC 7408 AND gates and IC 7432 OR gates.',
      '4. Connect Stage 1 sums S[3..0] to second IC 7483 inputs A[3..0].',
      '5. Feed correction word (0, C_out, C_out, 0) into second adder B inputs: B3=0, B2=C_out, B1=C_out, B0=0.',
      '6. Verify valid sums (e.g. 5+3=8, 7+6=13 -> Carry=1, Sum=3).'
    ],
    truthTableHeaders: ['A3..A0', 'B3..B0', 'Stage 1 Sum', 'Correction Required', 'Final BCD Carry', 'Final BCD Sum'],
    expectedTruthTable: [
      ['0010 (2)', '0011 (3)', '0101 (5)', '0 (No)', 0, '0101 (5)'],
      ['0100 (4)', '0101 (5)', '1001 (9)', '0 (No)', 0, '1001 (9)'],
      ['0101 (5)', '0111 (7)', '1100 (12)', '1 (+6)', 1, '0010 (2)'],
      ['1000 (8)', '1001 (9)', '0001 (17 with carry)', '1 (+6)', 1, '0111 (7)']
    ],
    vivaQuestions: [
      {
        question: 'Why do we add 6 (0110) to correct invalid BCD?',
        answer: 'Because a 4-bit binary group counts up to 16 states, but BCD is decimal with 10 states. The difference between 16 and 10 is 6, so adding 6 skips the 6 invalid hexadecimal combinations (1010 to 1111).'
      },
      {
        question: 'What is the boolean condition that triggers BCD correction?',
        answer: 'Correction C = C4 + S3·S2 + S3·S1, where C4 is the binary carry out, and S3·S2 / S3·S1 detect binary values 10, 11, 12, 13, 14, 15.'
      }
    ]
  },
  {
    id: 3,
    officialNumber: 3,
    category: 'combinational',
    syllabusCategory: 'Combinational Logic Design',
    title: 'Design and implement using Multiplexer IC 74153: (1) Full Adder, (2) Any three-variable function (Cascade Method).',
    shortTitle: 'Multiplexer IC 74153 (Full Adder & 3-Var Function)',
    coMapped: ['CO1', 'CO3'],
    aim: 'To design and implement a Full Adder and arbitrary 3-variable logic functions using Dual 4-to-1 Multiplexer IC 74153.',
    description: 'IC 74153 contains two independent 4-line to 1-line multiplexers sharing common select lines S1 and S0 with active-low enable inputs 1E and 2E. By applying variables A and B to S1, S0, input lines I0..I3 are connected to 0, 1, C, or C\' to generate Sum and Carry expressions of a Full Adder.',
    requiredICs: ['IC 74153 (Dual 4:1 Multiplexer)', 'IC 7404 (Hex Inverter)'],
    procedureNotes: [
      '1. Connect IC 74153 VCC (pin 16) to +5V and GND (pin 8) to ground.',
      '2. Ground the active-low enable inputs 1E (pin 1) and 2E (pin 15).',
      '3. Connect inputs A and B to select lines S1 (pin 14) and S0 (pin 2).',
      '4. Connect input C to an inverter IC 7404 to get both C and C\'.',
      '5. For Mux 1 (Sum): 1I0=C, 1I1=C\', 1I2=C\', 1I3=C. Connect 1Y (pin 7) to Sum LED.',
      '6. For Mux 2 (Carry): 2I0=0 (GND), 2I1=C, 2I2=C, 2I3=1 (+5V). Connect 2Y (pin 9) to Carry LED.',
      '7. Test all 8 input combinations (000 to 111).'
    ],
    subExercises: [
      {
        id: 'mux_full_adder',
        name: 'Full Adder using IC 74153',
        description: 'Sum = Σm(1,2,4,7), Carry = Σm(3,5,6,7)',
        aim: 'Implement Full Adder Sum & Carry using dual multiplexers of IC 74153.',
        requiredICs: ['IC 74153', 'IC 7404'],
        procedure: [
          'Select lines S1=A, S0=B.',
          'Mux 1 inputs for Sum: 1I0=C, 1I1=C\', 1I2=C\', 1I3=C.',
          'Mux 2 inputs for Carry: 2I0=0, 2I1=C, 2I2=C, 2I3=1.',
          'Verify outputs 1Y (Sum) and 2Y (Carry).'
        ],
        inputs: [
          { id: 'A', label: 'Input A' },
          { id: 'B', label: 'Input B' },
          { id: 'C', label: 'Cin' }
        ],
        outputs: [
          { id: 'Sum', label: 'Sum (1Y)', color: 'blue' },
          { id: 'Carry', label: 'Cout (2Y)', color: 'green' }
        ],
        truthTable: {
          headers: ['A', 'B', 'Cin', 'Sum', 'Cout'],
          rows: [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 0, 1],
            [1, 1, 1, 1, 1]
          ]
        }
      },
      {
        id: 'mux_3var',
        name: 'Three-Variable Function: F(A,B,C) = Σm(1, 3, 5, 6)',
        description: 'Standard 3-variable logic realization using IC 74153 multiplexer.',
        aim: 'Implement arbitrary 3-variable function using multiplexer logic.',
        requiredICs: ['IC 74153', 'IC 7404'],
        procedure: [
          'Select inputs S1=A, S0=B.',
          'Map inputs: I0=C (since m1=1, m0=0), I1=C (since m3=1, m2=0), I2=C (m5=1, m4=0), I3=C\' (m6=1, m7=0).',
          'Read output Y from pin 7.'
        ],
        inputs: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' }
        ],
        outputs: [
          { id: 'F', label: 'Output F', color: 'yellow' }
        ],
        truthTable: {
          headers: ['A', 'B', 'C', 'F'],
          rows: [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 0, 0],
            [0, 1, 1, 1],
            [1, 0, 0, 0],
            [1, 0, 1, 1],
            [1, 1, 0, 1],
            [1, 1, 1, 0]
          ]
        }
      }
    ],
    vivaQuestions: [
      {
        question: 'What is a multiplexer and why is it called a data selector?',
        answer: 'A multiplexer is a combinational circuit that selects binary information from one of many input lines and directs it to a single output line based on select lines.'
      },
      {
        question: 'How many 4:1 multiplexers are needed to implement a 16:1 multiplexer?',
        answer: 'Five 4:1 multiplexers: four in the first stage and one in the second stage to combine their outputs.'
      }
    ]
  },
  {
    id: 4,
    officialNumber: 4,
    category: 'combinational',
    syllabusCategory: 'Combinational Logic Design',
    title: 'Design and implement Full Subtractor using Decoder IC 74138.',
    shortTitle: 'Full Subtractor using Decoder IC 74138',
    coMapped: ['CO1', 'CO3'],
    aim: 'To design and implement a Full Subtractor circuit using 3-to-8 line Decoder / Demultiplexer IC 74138 and external NAND gates.',
    description: 'IC 74138 is a 3-line to 8-line decoder with active-low outputs (Y0 to Y7). Full Subtractor equations: Difference = Σm(1, 2, 4, 7), Borrow = Σm(1, 2, 3, 7). Because the outputs of 74138 are active-low (minterm complements), feeding them into active-low input OR gates (which are equivalent to standard NAND gates by De Morgans law) yields the true sum of minterms.',
    requiredICs: ['IC 74138 (3:8 Line Decoder)', 'IC 7420 (Dual 4-Input NAND Gate) or IC 7400'],
    procedureNotes: [
      '1. Insert IC 74138 on breadboard. Connect VCC (pin 16) to +5V, GND (pin 8) to 0V.',
      '2. Enable the decoder: pin 6 (G1) to +5V, pin 4 (G2A) to GND, pin 5 (G2B) to GND.',
      '3. Connect inputs A, B, Bin to select lines: pin 1 (A), pin 2 (B), pin 3 (C).',
      '4. Connect outputs Y1, Y2, Y4, Y7 to a 4-input NAND gate (Difference output).',
      '5. Connect outputs Y1, Y2, Y3, Y7 to another 4-input NAND gate (Borrow output).',
      '6. Test all 8 binary combinations from 000 to 111.'
    ],
    truthTableHeaders: ['A', 'B', 'Bin', 'Diff', 'Borrow'],
    expectedTruthTable: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 0, 1, 1],
      [0, 1, 1, 0, 1],
      [1, 0, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1]
    ],
    vivaQuestions: [
      {
        question: 'Why are NAND gates used with IC 74138 to get sum-of-minterms?',
        answer: 'IC 74138 provides active-low outputs (Y_i = m_i\'). By De Morgans theorem, (m1\' · m2\' · m4\' · m7\')\' = m1 + m2 + m4 + m7, so a NAND gate acts as an active-low OR gate.'
      },
      {
        question: 'What are the enable conditions for IC 74138?',
        answer: 'Pin 6 (G1) must be HIGH (1), and Pins 4 (G2A\') and 5 (G2B\') must be LOW (0).'
      }
    ]
  },
  {
    id: 5,
    officialNumber: 5,
    category: 'combinational',
    syllabusCategory: 'Combinational Logic Design',
    title: 'Design and implement Parity Generator and Parity Checker.',
    shortTitle: 'Parity Generator and Parity Checker',
    coMapped: ['CO1', 'CO3'],
    aim: 'To design and implement an even/odd parity generator and parity checker circuit for error detection during data transmission.',
    description: 'Parity bit is an additional bit transmitted with data to ensure the total number of 1s in the data word is either even (Even Parity) or odd (Odd Parity). An Even Parity Generator outputs P = A ⊕ B ⊕ C. The parity checker at the receiver computes error bit E = A ⊕ B ⊕ C ⊕ P. If E=1, a transmission error is detected.',
    requiredICs: ['IC 7486 (Quad 2-Input XOR Gate)', 'IC 74180 (9-Bit Parity Generator/Checker)'],
    procedureNotes: [
      '1. Insert IC 7486 on the breadboard. Connect Pin 14 to +5V and Pin 7 to GND.',
      '2. Cascade XOR gates: XOR1 inputs A and B -> out1. XOR2 inputs out1 and C -> Parity Bit P (Even Parity).',
      '3. To create the receiver checker: XOR3 inputs P and data bit C -> out2; XOR4 inputs out2 and XOR(A,B) -> Parity Error Check bit PEC.',
      '4. Observe PEC LED: 0 indicates valid parity, 1 indicates parity error.',
      '5. Simulate single-bit error by flipping one bit and observe the error indicator.'
    ],
    subExercises: [
      {
        id: 'even_parity_gen',
        name: '3-Bit Even Parity Generator',
        description: 'Generates parity bit P = A ⊕ B ⊕ C so total 1s including P is even.',
        aim: 'Generate even parity bit for 3-bit data.',
        requiredICs: ['IC 7486'],
        procedure: [
          'Wire A, B to XOR gate 1.',
          'Wire XOR gate 1 output and C to XOR gate 2.',
          'Output of XOR gate 2 is Parity bit P.'
        ],
        inputs: [
          { id: 'A', label: 'Data A' },
          { id: 'B', label: 'Data B' },
          { id: 'C', label: 'Data C' }
        ],
        outputs: [
          { id: 'P_even', label: 'Even Parity (P)', color: 'green' },
          { id: 'P_odd', label: 'Odd Parity (P_odd)', color: 'red' }
        ],
        truthTable: {
          headers: ['A', 'B', 'C', 'Even Parity (P)', 'Odd Parity (P_odd)'],
          rows: [
            [0, 0, 0, 0, 1],
            [0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 0, 1],
            [1, 0, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 0, 1],
            [1, 1, 1, 1, 0]
          ]
        }
      },
      {
        id: 'parity_checker',
        name: '4-Bit Even Parity Checker',
        description: 'Computes Error bit E = A ⊕ B ⊕ C ⊕ P. E=1 denotes error.',
        aim: 'Verify received word parity and detect transmission errors.',
        requiredICs: ['IC 7486'],
        procedure: [
          'Take 3 data bits (A, B, C) and received parity bit P.',
          'Cascade XOR gates across all 4 bits.',
          'Error indicator lights up if parity is invalid.'
        ],
        inputs: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'P', label: 'Parity (P)' }
        ],
        outputs: [
          { id: 'Error', label: 'Error (E)', color: 'red' }
        ],
        truthTable: {
          headers: ['A', 'B', 'C', 'P', 'Error Bit E'],
          rows: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 1]
          ]
        }
      }
    ],
    vivaQuestions: [
      {
        question: 'What is parity and how does it detect single-bit errors?',
        answer: 'Parity is an error detection scheme. If a single bit flips during transmission, the count of 1s changes from even to odd (or vice versa), which the parity checker detects.'
      },
      {
        question: 'Can a simple parity check detect 2-bit simultaneous errors?',
        answer: 'No. A two-bit error preserves the odd/even count of 1s and goes undetected by simple parity.'
      }
    ]
  },
  {
    id: 6,
    officialNumber: 6,
    category: 'sequential',
    syllabusCategory: 'Sequential Logic Design',
    title: 'Design and implement 3-bit Up and 3-bit Down Asynchronous Counters using master-slave JK Flip-Flop IC 7476.',
    shortTitle: '3-Bit Asynchronous Counter using IC 7476',
    coMapped: ['CO1', 'CO2', 'CO4', 'CO5'],
    aim: 'To design, connect, and observe the operation of a 3-bit ripple (asynchronous) Up and Down counter using dual JK flip-flop IC 7476.',
    description: 'In an asynchronous counter, the clock is applied only to the first flip-flop (FF0). Successive flip-flops are clocked by the output of the preceding stage. Since IC 7476 flip-flops toggle on negative clock transitions (falling edge), connecting Q of stage n to the clock of stage n+1 produces a down-counter, while connecting Q\' (or triggering on positive edge) produces an up-counter.',
    requiredICs: ['IC 7476 (Dual Master-Slave JK Flip-Flop with Preset & Clear) x 2'],
    procedureNotes: [
      '1. Insert two IC 7476 chips on the breadboard. Power pin 5 (+5V) and GND pin 13.',
      '2. Connect all J and K inputs to +5V (Logic 1) to configure the flip-flops in toggle mode.',
      '3. Connect all Preset (PRE) and Clear (CLR) pins to +5V (active-low inactive state).',
      '4. Connect manual pulse switch to CLK of FF0.',
      '5. For 3-bit Up counter: connect Q0\' to CLK1, and Q1\' to CLK2 (or Q0 to CLK1 for negative-edge UP counting).',
      '6. Connect Q0 (LSB), Q1, Q2 (MSB) to output indicator LEDs.',
      '7. Apply manual clock pulses one by one and record the count sequence from 000 to 111.'
    ],
    truthTableHeaders: ['Clock Pulse', 'Q2 (MSB)', 'Q1', 'Q0 (LSB)', 'Decimal State'],
    expectedTruthTable: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1],
      [2, 0, 1, 0, 2],
      [3, 0, 1, 1, 3],
      [4, 1, 0, 0, 4],
      [5, 1, 0, 1, 5],
      [6, 1, 1, 0, 6],
      [7, 1, 1, 1, 7],
      [8, 0, 0, 0, 0]
    ],
    vivaQuestions: [
      {
        question: 'Why is this called a ripple or asynchronous counter?',
        answer: 'Because the flip-flops do not change states simultaneously; the clock pulse ripples through each flip-flop one after the other, causing cumulative propagation delay.'
      },
      {
        question: 'How do you switch between UP counting and DOWN counting?',
        answer: 'In negative-edge triggered flip-flops, taking clock from Q produces down counting, whereas taking clock from Q\' produces up counting.'
      }
    ]
  },
  {
    id: 7,
    officialNumber: 7,
    category: 'sequential',
    syllabusCategory: 'Sequential Logic Design',
    title: 'Design and implement 3-bit Up and 3-bit Down Synchronous Counters using master-slave JK Flip-Flop IC 7476.',
    shortTitle: '3-Bit Synchronous Counter using IC 7476',
    coMapped: ['CO1', 'CO2', 'CO4', 'CO5'],
    aim: 'To design and implement a 3-bit synchronous Up and Down counter using JK flip-flops (IC 7476) and AND gates.',
    description: 'In a synchronous counter, all flip-flops share a common clock signal and trigger simultaneously. Toggle conditions are derived from excitation tables: for 3-bit Up counter, J0=K0=1, J1=K1=Q0, J2=K2=Q0·Q1. For 3-bit Down counter, J0=K0=1, J1=K1=Q0\', J2=K2=Q0\'·Q1\'.',
    requiredICs: ['IC 7476 (Dual JK Flip-Flop) x 2', 'IC 7408 (Quad 2-Input AND Gate)'],
    procedureNotes: [
      '1. Insert two IC 7476 chips and one IC 7408 on the breadboard. Wire VCC and GND.',
      '2. Connect all CLK pins together and tie to the manual clock pulse button.',
      '3. For UP counter: Set J0=K0=1. Connect J1=K1=Q0. Connect Q0 and Q1 to an AND gate; route its output to J2 and K2.',
      '4. Connect PRE and CLR inputs of all FFs to +5V (inactive).',
      '5. Observe states Q2, Q1, Q0 on LEDs upon pulsing.',
      '6. Verify simultaneous switching without ripple delay.'
    ],
    truthTableHeaders: ['Pulse', 'Q2', 'Q1', 'Q0', 'Decimal'],
    expectedTruthTable: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1],
      [2, 0, 1, 0, 2],
      [3, 0, 1, 1, 3],
      [4, 1, 0, 0, 4],
      [5, 1, 0, 1, 5],
      [6, 1, 1, 0, 6],
      [7, 1, 1, 1, 7],
      [8, 0, 0, 0, 0]
    ],
    vivaQuestions: [
      {
        question: 'What is the key advantage of a synchronous counter over an asynchronous counter?',
        answer: 'All flip-flops are triggered at the same instant by a common clock, eliminating cumulative ripple delay and allowing much higher operating frequencies without glitches.'
      },
      {
        question: 'What is the boolean condition for FF2 to toggle in a 3-bit synchronous UP counter?',
        answer: 'FF2 must toggle only when both previous stages are 1, i.e., J2 = K2 = Q1 · Q0.'
      }
    ]
  },
  {
    id: 8,
    officialNumber: 8,
    category: 'sequential',
    syllabusCategory: 'Sequential Logic Design',
    title: 'Design and implement Modulo \'n\' counter with IC 7490.',
    shortTitle: 'Modulo-N Counter using IC 7490',
    coMapped: ['CO1', 'CO2', 'CO4', 'CO5'],
    aim: 'To design and implement Modulo-N (Mod-10, Mod-6, Mod-7) asynchronous decade counter circuits using IC 7490.',
    description: 'IC 7490 is a monolithic decade counter containing a divide-by-2 section (input CKA, output QA) and a divide-by-5 section (input CKB, outputs QB, QC, QD). By feeding QA back into CKB, a BCD decade counter (Mod-10) is formed. Feeding desired terminal state outputs into reset pins R0(1) and R0(2) forces the counter to reset, achieving Mod-N counting.',
    requiredICs: ['IC 7490 (Decade Counter IC)', 'IC 7408 (AND gate if required for complex reset decoding)'],
    procedureNotes: [
      '1. Insert IC 7490. Connect VCC (pin 5) to +5V and GND (pin 10) to 0V.',
      '2. Connect pin 12 (QA) to pin 1 (input B) to cascade the divide-by-2 and divide-by-5 sections.',
      '3. For Mod-10: Connect reset pins R0(1) (pin 2), R0(2) (pin 3), R9(1) (pin 6), R9(2) (pin 7) to GND.',
      '4. For Mod-6 (0 to 5): Connect QC (pin 9) and QB (pin 8) to reset inputs R0(1) and R0(2). As soon as count hits 6 (0110), it resets to 0000.',
      '5. Apply clock pulses at pin 14 (Input A) and observe QA, QB, QC, QD on LEDs.'
    ],
    truthTableHeaders: ['Clock Pulse', 'QD (MSB)', 'QC', 'QB', 'QA (LSB)', 'Decimal Count'],
    expectedTruthTable: [
      [0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 1],
      [2, 0, 0, 1, 0, 2],
      [3, 0, 0, 1, 1, 3],
      [4, 0, 1, 0, 0, 4],
      [5, 0, 1, 0, 1, 5],
      [6, 0, 1, 1, 0, '6 -> Resets to 0 for Mod-6'],
      [7, 0, 1, 1, 1, 7],
      [8, 1, 0, 0, 0, 8],
      [9, 1, 0, 0, 1, 9]
    ],
    vivaQuestions: [
      {
        question: 'What are the internal sections of IC 7490?',
        answer: 'IC 7490 contains one independent Mod-2 counter (FF0 triggered by CKA) and one independent Mod-5 counter (FF1..FF3 triggered by CKB).'
      },
      {
        question: 'How do you design a Mod-6 counter using IC 7490?',
        answer: 'In binary, 6 is 0110 (QD=0, QC=1, QB=1, QA=0). Connect QC to R0(1) and QB to R0(2). When the counter momentarily hits 6, both reset pins go HIGH and immediately reset the counter to 0.'
      }
    ]
  },
  {
    id: 9,
    officialNumber: 9,
    category: 'sequential',
    syllabusCategory: 'Sequential Logic Design',
    title: 'Design and implement Modulo \'n\' counter with IC 74191.',
    shortTitle: 'Modulo-N Counter using IC 74191',
    coMapped: ['CO1', 'CO2', 'CO4', 'CO5'],
    aim: 'To design and implement a synchronous Modulo-N Up/Down counter using 4-bit synchronous reversible binary counter IC 74191.',
    description: 'IC 74191 is a 4-bit synchronous up/down counter with preset load capability. Pin 5 controls direction (0 = UP, 1 = DOWN), pin 4 is active-low Count Enable (CTEN\'), and pin 11 is active-low asynchronous parallel load (LOAD\'). By loading a base value or detecting terminal count, arbitrary Modulo-N counting can be configured.',
    requiredICs: ['IC 74191 (Synchronous 4-Bit Up/Down Binary Counter)', 'IC 7400 (Quad NAND Gate)'],
    procedureNotes: [
      '1. Insert IC 74191 on breadboard. Wire VCC (pin 16) to +5V and GND (pin 8) to ground.',
      '2. Ground pin 4 (active-low Count Enable / CTEN) to enable counting.',
      '3. Set pin 5 (UP/DOWN) to LOW for Up count, or HIGH for Down count.',
      '4. Connect manual clock pulse to pin 14 (CLK).',
      '5. Connect outputs QA (pin 3), QB (pin 2), QC (pin 6), QD (pin 7) to LEDs.',
      '6. For Mod-N truncation, connect output bits of the reset/load state through a NAND gate to pin 11 (LOAD\') with desired parallel data on pins D0..D3.'
    ],
    truthTableHeaders: ['Pulse', 'QD', 'QC', 'QB', 'QA', 'Dec Count', 'Direction'],
    expectedTruthTable: [
      [0, 0, 0, 0, 0, 0, 'UP'],
      [1, 0, 0, 0, 1, 1, 'UP'],
      [2, 0, 0, 1, 0, 2, 'UP'],
      [3, 0, 0, 1, 1, 3, 'UP'],
      [4, 0, 1, 0, 0, 4, 'UP'],
      [5, 0, 1, 0, 1, 5, 'UP']
    ],
    vivaQuestions: [
      {
        question: 'What is the function of the U/D pin (pin 5) in IC 74191?',
        answer: 'When pin 5 is LOW (0), the IC counts UP. When pin 5 is HIGH (1), the IC counts DOWN.'
      },
      {
        question: 'What is the difference between IC 74190 and IC 74191?',
        answer: 'IC 74190 is a synchronous BCD decade up/down counter (0 to 9), while IC 74191 is a full 4-bit binary up/down counter (0 to 15).'
      }
    ]
  },
  {
    id: 10,
    officialNumber: 10,
    category: 'sequential',
    syllabusCategory: 'Sequential Logic Design',
    title: 'Design and implement a sequence detector using D Flip-Flop IC 7474.',
    shortTitle: 'Sequence Detector using D Flip-Flop IC 7474',
    coMapped: ['CO1', 'CO2', 'CO4', 'CO5'],
    aim: 'To design and implement a finite state machine sequence detector for detecting the bit sequence \'101\' (overlapping) using D Flip-Flop IC 7474 and logic gates.',
    description: 'A sequence detector produces an output Z=1 whenever a specific bit pattern (e.g., 101) appears on the serial input stream X. Using Mealy or Moore state machine modeling with 2 D flip-flops (IC 7474), state equations are minimized to D1 = X · Q0, D0 = X · Q1\' · Q0\', and output Z = X · Q1 for Mealy 101 detector.',
    requiredICs: ['IC 7474 (Dual D-Type Positive-Edge Flip-Flop)', 'IC 7408 (AND Gate)', 'IC 7404 (NOT Gate)', 'IC 7432 (OR Gate)'],
    procedureNotes: [
      '1. Insert IC 7474 on breadboard. Wire pin 14 to +5V and pin 7 to GND.',
      '2. Connect asynchronous preset (PRE\', pins 4 & 10) and clear (CLR\', pins 1 & 13) to +5V.',
      '3. Wire next-state logic to D0 and D1 inputs.',
      '4. Connect common clock (pins 3 & 11) to manual clock button.',
      '5. Connect input switch for serial stream X.',
      '6. Connect output LED to detection signal Z.',
      '7. Enter bits one-by-one, press clock pulse after each bit, and verify output LED lights up exactly when 1-0-1 is received.'
    ],
    truthTableHeaders: ['Step', 'Input bit X', 'Present State (Q1 Q0)', 'Next State (Q1+ Q0+)', 'Detector Output Z'],
    expectedTruthTable: [
      [1, 1, '0 0 (S0)', '0 1 (S1)', 0],
      [2, 0, '0 1 (S1)', '1 0 (S2)', 0],
      [3, 1, '1 0 (S2)', '0 1 (S1)', 1],
      [4, 0, '0 1 (S1)', '1 0 (S2)', 0],
      [5, 1, '1 0 (S2)', '0 1 (S1)', 1]
    ],
    vivaQuestions: [
      {
        question: 'What is the difference between an overlapping and non-overlapping sequence detector?',
        answer: 'In an overlapping detector, the suffix of an already detected sequence can serve as the prefix of the next sequence (e.g. 10101 detects twice). In non-overlapping, it resets completely after detection.'
      },
      {
        question: 'What is the difference between Mealy and Moore state models?',
        answer: 'In a Mealy machine, outputs depend on both current state and current input. In a Moore machine, outputs depend strictly on the current state.'
      }
    ]
  }
];
