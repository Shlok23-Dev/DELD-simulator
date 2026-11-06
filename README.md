# DELD Lab Practice Simulator

A modern, interactive browser-based **Digital Electronics and Logic Design (DELD) Lab Practice Simulator** tailored for S.Y. B.Tech Information Technology students (Course Code: **2308207**, 2023 Pattern, Semester III, K.K. Wagh Institute of Engineering Education and Research).

## Features

- **Official Syllabus Practicals (1 to 10):**
  - **A. Combinational Logic Design (Practicals 1–5):**
    - Practical 1: 4-Bit Code Converter (Binary ↔ Gray, Excess-3 ↔ BCD)
    - Practical 2: 4-Bit BCD Adder using IC 7483
    - Practical 3: Multiplexer IC 74153 (Full Adder & 3-Variable Cascade Logic)
    - Practical 4: Full Subtractor using Decoder IC 74138
    - Practical 5: Parity Generator and Parity Checker
  - **B. Sequential Logic Design (Practicals 6–10):**
    - Practical 6: 3-Bit Asynchronous Up/Down Counter using JK Flip-Flop IC 7476
    - Practical 7: 3-Bit Synchronous Up/Down Counter using JK Flip-Flop IC 7476
    - Practical 8: Modulo-N Counter using Decade Counter IC 7490
    - Practical 9: Modulo-N Counter using Synchronous Reversible Counter IC 74191
    - Practical 10: Sequence Detector using D Flip-Flop IC 7474
- **Virtual Breadboard Trainer:**
  - 36-column realistic breadboard with upper and lower 5-hole terminal strips (Rows A–E and F–J), central DIP IC trough, and dual ±5V / GND power rails.
  - Interactive DIP IC placement with realistic pinout labeling, notch orientation, and active pin level hover inspector.
  - Multi-color click-to-connect jumper wiring (Red, Blue, Green, Yellow, Orange, Purple, Cyan, White) with smooth Bezier wire rendering and click-to-delete.
  - Trainer DC power switch with bus indicator.
  - 8 Logic Input toggle switches (0 / 1) with trainer sockets.
  - Manual clock pulse button with 1Hz auto-clock generator for sequential experiments.
  - 8 Logic Monitor LEDs with decimal and hexadecimal digital readouts.
- **Academic & Study Support:**
  - Real-time truth table observation and state table with active row highlighting and verification.
  - Interactive 4-variable K-Map worksheet for CO1 minimization practice.
  - Verified lab procedures, IC pinouts, viva voce questions & answers.
  - Optional reference circuit loader and connection hints (board starts clean for student practice).

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Run Automated Logic & Circuit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
The optimized bundle is output to `dist/`.
