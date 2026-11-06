# DELD Lab Practice Simulator — Implementation Plan

## 1. Project purpose

Build a simple browser-based **Digital Electronics and Logic Design (DELD) Lab Practice Simulator** for the K.K. Wagh Institute of Engineering Education and Research, Department of Information Technology.

The website should help students **practise the experiments listed in the official DELD Lab syllabus** by placing ICs on a virtual breadboard, making jumper-wire connections, changing input switches, applying clock pulses where needed, and observing outputs.

This is an educational practice tool, not a professional circuit-design or electrical-engineering simulator. Prioritise correct digital logic and ease of use over advanced features.

## 2. Course details from the college syllabus

- **Course:** 2308207 — Digital Electronics and Logic Design Lab
- **Programme:** S.Y. B.Tech. Information Technology
- **Pattern / Semester:** 2023 Pattern, Semester III
- **Academic year:** 2026–27
- **Practical teaching scheme:** 2 hours/week
- **Credits:** 1
- **Practical examination:** 25 marks
- **Term work:** 25 marks
- **Prerequisite:** Fundamentals of Electronics Engineering

### Course outcomes

- **CO1:** Simplify and minimize Boolean expressions using K-Map and Quine-McCluskey method.
- **CO2:** Design and implement combinational circuits using AND/OR logic.
- **CO3:** Design and implement combinational circuits using SSI and MSI logic.
- **CO4:** Explain applications of Flip Flops.
- **CO5:** Design and implement sequential logic circuits using Flip Flops.

## 3. Scope: keep the first version simple

### Must-have features

1. A home page showing all 10 practicals, grouped into Combinational Logic Design and Sequential Logic Design.
2. A practical details page with the experiment title, aim, required ICs/components, relevant pinout information, procedure notes and expected output. Fill details only when they are supported by the college lab manual or verified reference material.
3. A virtual breadboard where students can place supported ICs, LEDs and resistors.
4. Simple jumper-wire connections between breadboard points and component pins.
5. Input switches that students can toggle between 0 and 1.
6. A power ON/OFF control and a manual clock-pulse button for sequential experiments.
7. Live output through LEDs and a small input/output or state table.
8. A reset/clear-board option so students can repeat an experiment.
9. A basic reference view or optional connection hints. Do not load a completed circuit automatically when a practical is opened.

### Useful, but not required for the first working version

- A simple truth-table worksheet for combinational practicals.
- A basic 4-variable K-Map worksheet for the experiments that require K-Map design.
- A small viva-question section for each practical.
- A simple check button that compares observed outputs with expected outputs and gives a useful hint.
- Saving the latest board arrangement in the browser using local storage.

### Do not build in the first version

- Full electrical/analogue simulation, voltage-current calculations or realistic transistor-level behaviour.
- Complex circuit auto-routing or automatic wiring.
- AI chatbot or AI-generated circuit solutions.
- Login, accounts, cloud database or multi-user collaboration.
- Advanced waveform/logic-analyser tools.
- Complicated undo/redo history, extensive animations or a large dashboard.
- An automatic Quine-McCluskey solver. A simple worksheet or notes section is enough initially.

## 4. Official practical list to support

Use the titles and scope below as the source of truth. Keep the practical numbering exactly as shown in the college syllabus.

### A. Combinational Logic Design

| No. | Practical as listed in the syllabus | Required support |
|---|---|---|
| 1 | Design (truth table, K-Map) and implement 4-bit code converter: (i) Binary to Gray and vice versa, (ii) Excess-3 to BCD and vice versa. | Separate selectable exercises for Binary ↔ Gray and Excess-3 ↔ BCD. Include truth-table and K-Map worksheets, plus circuit practice. |
| 2 | Design (truth table, K-Map) and implementation of 4-bit BCD Adder using IC 7483. | IC 7483 support, input controls, output indicators, truth-table/design worksheet and circuit practice. |
| 3 | Design and implement using Multiplexer IC 74153: (1) Full Adder, (2) Any three-variable function (Cascade Method). | IC 74153 support; separate Full Adder and three-variable-function exercises. The selected function/details should be configurable from verified lab material. |
| 4 | Design and implement Full Subtractor using Decoder IC 74138. | IC 74138 support, input controls, output indicators and circuit practice. |
| 5 | Design and implement Parity Generator and Parity Checker. | Separate Generator and Checker exercises. Add the required ICs only after checking the college lab journal. |

### B. Sequential Logic Design

| No. | Practical as listed in the syllabus | Required support |
|---|---|---|
| 6 | Design and implement 3-bit Up and 3-bit Down Asynchronous Counters using master-slave JK Flip-Flop IC 7476. | IC 7476 support, manual clock pulses, UP/DOWN circuit practice and visible 3-bit count. |
| 7 | Design and implement 3-bit Up and 3-bit Down Synchronous Counters using master-slave JK Flip-Flop IC 7476. | IC 7476 support, common clock, UP/DOWN circuit practice and visible 3-bit count. |
| 8 | Design and implement Modulo 'n' counter with IC 7490. | IC 7490 support, manual clock pulses, configurable Mod-N practice and visible count. |
| 9 | Design and implement Modulo 'n' counter with IC 74191. | IC 74191 support, manual clock pulses, configurable Mod-N practice and visible count. |
| 10 | Design and implement a sequence detector using D Flip-Flop IC 7474. | IC 7474 support, manual clock pulses, input-bit control and visible sequence/state output. |

### CO mapping from the syllabus

| Practical | CO mapped |
|---|---|
| 1 | CO1, CO2 |
| 2 | CO1, CO2 |
| 3 | CO1, CO3 |
| 4 | CO1, CO3 |
| 5 | CO1, CO3 |
| 6 | CO1, CO2, CO4, CO5 |
| 7 | CO1, CO2, CO4, CO5 |
| 8 | CO1, CO2, CO4, CO5 |
| 9 | CO1, CO2, CO4, CO5 |
| 10 | CO1, CO2, CO4, CO5 |

**Important:** The syllabus sheet gives the experiment titles and some named ICs, but it does not provide complete circuit diagrams, all supporting IC numbers, pin-to-pin wiring, or the sequence to be detected in Practical 10. Do not invent these details. Add them only after checking the official lab journal, class notes or a verified IC datasheet. Keep such practical details editable in one data file.

## 5. Simple website layout

### Home page

- Header: `DELD Lab Practice Simulator`
- Small course label: `2308207 · S.Y. B.Tech IT · 2026–27`
- Two sections/cards:
  - Combinational Logic Design — Practicals 1–5
  - Sequential Logic Design — Practicals 6–10
- Each practical card should show its number, short title and an `Open Practical` action.

### Practical page

Show:

- Practical number and official title.
- Aim and short description (content to be filled from the lab journal).
- Required ICs/components (only verified parts).
- A short procedure/checklist.
- A `Start Practice` button.
- Optional `View Reference` or `Show Hint` action, hidden by default.
- A compact truth table / observation area where relevant.

### Practice workspace

Use a straightforward three-area layout:

1. **Component tray:** ICs required for the selected practical, basic gate ICs that are actually used in the verified circuit, LEDs and resistors.
2. **Breadboard:** The main work area. Students place components and connect pins using jumper wires.
3. **Controls and observations:** Power switch, input switches, manual clock button (only for sequential practicals), output LEDs and a small result/state table.

Keep the layout readable on a normal laptop screen. A simple dark or light laboratory theme is fine; usability matters more than visual effects.

## 6. Breadboard and interaction requirements

### Breadboard appearance

- Show two groups of five connected holes separated by a central IC gap.
- Show positive and ground rails.
- Use a sensible board width that can fit the components needed by the selected practical. Horizontal scrolling is acceptable for wider circuits.
- Components should snap to valid holes/positions.
- ICs should sit across the centre gap, with a visible notch and numbered pins.

### Components

Start with only the parts needed for the listed practicals:

- IC 7483 — Practical 2.
- IC 74153 — Practical 3.
- IC 74138 — Practical 4.
- IC 7476 — Practicals 6 and 7.
- IC 7490 — Practical 8.
- IC 74191 — Practical 9.
- IC 7474 — Practical 10.
- Supporting gate ICs and the ICs for Practicals 1 and 5 should be added according to the actual lab journal.
- LEDs and suitable current-limiting resistors.
- Jumper wires.

A starter board may contain a few removable LEDs and resistors for convenience, but students must be able to move or delete them.

### Wiring interaction

Keep wiring simple:

1. Student clicks the first connection point/pin.
2. Student clicks the second point/pin.
3. A wire appears between them.
4. Student can select and delete a wire.
5. Use a small colour selector only if it is easy to implement.

Do not build automatic wire routing in the initial version.

### Trainer controls

- Power ON/OFF.
- Four to eight toggle switches, depending on the practical's input needs.
- A `Pulse` button for sequential circuits. Each click should apply one clock pulse and update the visible state.
- Optional slow auto-clock can be added later, but manual stepping is the priority.

## 7. Simulation behaviour — keep it educational and manageable

The simulator only needs to model the digital behaviour required for these practicals.

### Basic logic

- Represent a connected signal as `0`, `1` or `UNCONNECTED`.
- Evaluate the supported logic gates and ICs according to their verified truth tables and pin configurations.
- Show an obvious warning for missing power, missing ground, unconnected required inputs or conflicting logic connections.
- Do not attempt a detailed electrical current or voltage simulation.

### Combinational circuits

- When a student changes an input switch, update the circuit outputs.
- Display output LEDs and the corresponding output bits.
- Where a truth table is relevant, show the expected output alongside the observed output.
- A simple `Check Output` action can report whether the current result matches the expected row.

### Sequential circuits

- Store the current flip-flop/counter state.
- Update the state only when the correct clock event occurs for the particular IC/circuit.
- Provide a manual pulse button so students can observe one state transition at a time.
- Show the present state and next observed state in binary.
- Reset the state using the correct reset/preset behaviour for the selected IC and verified circuit.

**Accuracy rule:** Do not guess IC pinouts, active-low controls, clock-edge behaviour or reset behaviour. Verify each IC model against the exact device datasheet and the circuit used in the college lab. Keep IC models separate from the user interface so they can be corrected easily.

## 8. Suggested technology (avoid unnecessary complexity)

- **Frontend:** React + TypeScript using Vite.
- **Styling:** Plain CSS or Tailwind CSS. Choose whichever Antigravity can maintain more reliably.
- **Breadboard drawing:** SVG with clickable holes, pins and wires.
- **State:** React state/useReducer initially. Add Zustand only if the state becomes difficult to manage.
- **Testing:** A small set of unit tests for each supported IC and each practical's expected outputs.
- **Storage:** Browser local storage only if saving a student's current practice setup is straightforward.
- **Backend:** Not required for the first version.

Do not add a database, authentication or server unless a real requirement appears later.

## 9. Practical content structure

Keep experiment information outside the UI code. For example:

```text
src/
  components/
    PracticalCard.tsx
    PracticalDetails.tsx
    Breadboard.tsx
    ComponentTray.tsx
    InputSwitches.tsx
    ClockControl.tsx
    OutputLeds.tsx
    Wire.tsx
  data/
    practicals.ts
    icPinouts.ts
    referenceCircuits.ts
  simulation/
    logic.ts
    combinational.ts
    sequential.ts
    icModels/
      ic7483.ts
      ic74153.ts
      ic74138.ts
      ic7476.ts
      ic7490.ts
      ic74191.ts
      ic7474.ts
  App.tsx
  main.tsx
```

This is a suggested small structure, not a requirement to create every file before it is needed. Add files as each feature is implemented.

## 10. Development phases

Build and test one small working section at a time. Do not ask Antigravity to implement all 10 practicals in one large generation step.

### Phase 1 — Basic website

- Create the React + TypeScript project.
- Build the home page with all 10 practicals and the two syllabus categories.
- Build a practical details page using the official titles from this document.
- Make navigation between the list and practical pages work.

**Done when:** All 10 practicals are visible, correctly numbered and open their own details page.

### Phase 2 — Basic breadboard

- Draw the breadboard, centre gap and power rails.
- Add a small component tray.
- Allow placing, moving and deleting an IC, LED and resistor.
- Add click-to-connect jumper wires and wire deletion.
- Add a clear/reset board button.

**Done when:** A student can arrange components and make/remove visible connections reliably.

### Phase 3 — Basic combinational simulation

- Implement the gate types and ICs required by the first verified combinational practical.
- Add toggle switches and LEDs.
- Update outputs when inputs change.
- Add a basic truth-table/result panel.
- Test with known input/output combinations.

**Done when:** At least one combinational practical can be assembled and its outputs match the verified truth table.

### Phase 4 — Sequential simulation

- Add manual clock pulses.
- Implement and test the required 7476, 7490, 74191 and 7474 behaviour as each corresponding practical is developed.
- Show the count/state after each pulse.
- Add the correct reset/load controls required by each experiment.

**Done when:** The student can step through a verified counter or sequence-detector example and observe the expected state changes.

### Phase 5 — Add the remaining practicals

Implement the experiments one by one in syllabus order. For each practical:

1. Add its verified components and pinout information.
2. Add its reference truth table or expected state sequence.
3. Add its circuit-practice workspace.
4. Test its output against the college lab-journal circuit.
5. Mark it complete only after the test passes.

### Phase 6 — Practical study support

- Add short procedures and connection checklists from the lab journal.
- Add truth-table and K-Map worksheets where required.
- Add a small set of experiment-wise viva questions.
- Add simple hints and output checking.
- Make the pages usable on a laptop and tablet.

## 11. Acceptance checklist

The first useful release should satisfy these points:

- [ ] All 10 official practicals appear with correct names and numbering.
- [ ] Practicals are grouped into combinational and sequential logic design.
- [ ] Each practical has a details page.
- [ ] Students can place, move and delete supported components.
- [ ] Students can connect and delete jumper wires.
- [ ] Input switches can be changed between 0 and 1.
- [ ] Combinational outputs update correctly.
- [ ] Sequential circuits can be stepped using a manual clock pulse.
- [ ] LEDs clearly show outputs.
- [ ] Pin labels and power pins are readable.
- [ ] Students can reset the board and practise again.
- [ ] Each implemented circuit has been checked against the college lab journal or a verified reference.
- [ ] The website does not silently show a completed circuit as the default practice state.

## 12. Instructions for Antigravity

1. Treat this Markdown file and the college syllabus as the project scope.
2. Keep the application simple and focused on student practice. Do not add advanced features just because they are technically possible.
3. Do not invent experiment details that are missing from the syllabus. Mark them as `To be verified from lab journal` until confirmed.
4. Do not assume supporting ICs for Practicals 1 and 5. Add the actual parts after checking the lab journal.
5. Do not pre-wire the student's practice board. Provide optional reference connections separately.
6. Implement one phase at a time. Run the app and test the completed phase before moving forward.
7. Before implementing a practical, show the proposed IC list, pin connections and expected outputs for that practical. Use verified information only.
8. Prefer a working, understandable simulator for all 10 practicals over a highly realistic simulator that supports only one or two experiments.

**Final goal:** A student should be able to open a practical, understand what to build, assemble the circuit on a virtual breadboard, toggle inputs or apply clock pulses, observe the output, and repeat the experiment for practice.
