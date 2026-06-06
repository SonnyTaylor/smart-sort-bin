const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Smart Bin: Systems Engineering SAT";

const P = {
  charcoal: "2D3436",
  slate: "636E72",
  coral: "E17055",
  teal: "00B894",
  offwhite: "FAFAF8",
  white: "FFFFFF",
  warmgray: "F0EFED",
  rule: "DDD9D5",
  text: "2D3436",
  muted: "95A5A6",
};

function addHeader(s, title, subtitle) {
  s.addText(title, { x: 0.5, y: 0.25, w: 9.0, h: 0.55, fontSize: 22, bold: true, color: P.charcoal, fontFace: "Candara", valign: "bottom", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.85, w: 1.8, h: 0.03, fill: { color: P.coral }, line: { color: P.coral } });
  if (subtitle) {
    s.addText(subtitle, { x: 2.5, y: 0.78, w: 7, h: 0.2, fontSize: 9.5, color: P.muted, fontFace: "Palatino Linotype", italic: true, align: "right", valign: "bottom", margin: 0 });
  }
}

function addFooter(s, t) {}

function th(cells) {
  return cells.map(t => ({ text: t, options: { bold: true, color: P.coral, fill: { color: P.warmgray }, fontSize: 9, fontFace: "Candara" } }));
}

function hdr(t) {
  return { text: t, options: { bold: true, color: P.coral, fill: { color: P.warmgray }, fontSize: 10, fontFace: "Candara" } };
}

function createTestSlide(title, badge, purpose, equipment, steps, resultRows, colWidths) {
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, title, badge);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 0.04, h: 0.38, fill: { color: P.coral }, line: { color: P.coral } });
  s.addText(purpose, { x: 0.7, y: 1.1, w: 8.8, h: 0.38, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", italic: true, valign: "middle", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.58, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  s.addText("Equipment", { x: 0.5, y: 1.65, w: 3.5, h: 0.25, fontSize: 9.5, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addText(
    equipment.map(e => ({ text: e, options: { bullet: true, breakLine: true } })),
    { x: 0.5, y: 1.9, w: 3.5, h: 1.25, fontSize: 9, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 4.2, y: 1.65, w: 0.01, h: 1.5, fill: { color: P.rule }, line: { color: P.rule } });

  s.addText("Procedure", { x: 4.45, y: 1.65, w: 5.05, h: 0.25, fontSize: 9.5, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addText(
    steps.map((st, i) => ({ text: `${i + 1}.  ${st}`, options: { breakLine: true } })),
    { x: 4.45, y: 1.9, w: 5.05, h: 1.25, fontSize: 9, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 2, margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.25, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  s.addText("Results", { x: 0.5, y: 3.32, w: 2, h: 0.22, fontSize: 9.5, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addTable(resultRows, {
    x: 0.5, y: 3.55, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    fill: { color: P.white },
    fontSize: 9,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    colW: colWidths,
    rowH: 0.2,
  });
}

// ─────────────────────────────────────────────
// SLIDE 1: Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.charcoal };

  s.addText("AI SMART BIN", { x: 0, y: 1.2, w: 10, h: 0.95, fontSize: 52, bold: true, color: P.coral, fontFace: "Candara", align: "center", valign: "middle", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.25, w: 3.0, h: 0.03, fill: { color: P.coral }, line: { color: P.coral } });

  s.addText("VCE Systems Engineering: Unit 3 SAT", { x: 0, y: 2.5, w: 10, h: 0.4, fontSize: 16, color: P.muted, fontFace: "Candara", align: "center", margin: 0 });
  s.addText("Criterion 1: Design Brief and Evaluation Criteria", { x: 0, y: 2.95, w: 10, h: 0.35, fontSize: 12, color: P.slate, fontFace: "Palatino Linotype", align: "center", italic: true, margin: 0 });

  s.addText("Nikita Alouker", { x: 0, y: 3.7, w: 10, h: 0.35, fontSize: 14, color: P.coral, fontFace: "Candara", align: "center", margin: 0 });
  s.addText("An AI-driven waste sorting system that automates the classification\nand separation of compost, recyclables, and landfill waste.", {
    x: 1.5, y: 4.15, w: 7, h: 0.7, fontSize: 11, color: P.muted, fontFace: "Palatino Linotype", align: "center", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 2: Section 1: The Ethical Problem
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 1: The Ethical Problem", "Sections 1.1 & 1.2");

  // 1.1 wide left column
  s.addText("1.1  Problem Definition", { x: 0.5, y: 1.15, w: 5.3, h: 0.3, fontSize: 12, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addText(
    "Australia's waste management system relies on individuals to sort their own disposal items, yet public understanding of which materials belong in which bin remains consistently poor. The National Waste Report (DCCEEW, 2022) found that the national resource recovery rate sits at just 63%, meaning over a third of all waste generated is directed to landfill rather than being recycled or composted.",
    { x: 0.5, y: 1.5, w: 5.3, h: 1.5, fontSize: 10.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );

  // Vertical divider
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.15, w: 0.01, h: 1.85, fill: { color: P.rule }, line: { color: P.rule } });

  // 1.2 narrow right column
  s.addText("1.2  Ethical Dimension", { x: 6.3, y: 1.15, w: 3.2, h: 0.3, fontSize: 12, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addText("Sustainability, Intergenerational Equity", { x: 6.3, y: 1.48, w: 3.2, h: 0.22, fontSize: 9.5, bold: true, color: P.teal, fontFace: "Candara", margin: 0 });
  s.addText(
    "Organic waste in landfill produces methane, a greenhouse gas roughly 28 times more potent than CO2 (IPCC, 2021). Burying compostable and recyclable materials with general refuse means finite resources are permanently lost. We bear responsibility for ensuring disposal systems do not impose avoidable harm on future generations.",
    { x: 6.3, y: 1.75, w: 3.2, h: 1.25, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );

  // Horizontal rule
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.2, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  // Consequences as simple bulleted text in two columns
  s.addText("If Nothing Changes", { x: 0.5, y: 3.35, w: 9.0, h: 0.3, fontSize: 11, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });

  s.addText(
    [
      { text: "Methane from organic waste in landfill accelerates climate change", options: { bullet: true, breakLine: true } },
      { text: "Recyclable materials like aluminium and PET are used once and buried", options: { bullet: true, breakLine: true } },
      { text: "Landfill sites approach capacity within 10-15 years in many regions", options: { bullet: true, breakLine: true } },
    ],
    { x: 0.5, y: 3.7, w: 4.5, h: 1.5, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 4, margin: 0 }
  );
  s.addText(
    [
      { text: "Contaminated recycling loads rejected entirely and sent to landfill", options: { bullet: true, breakLine: true } },
      { text: "Rising waste processing costs passed to councils and ratepayers", options: { bullet: true, breakLine: true } },
    ],
    { x: 5.2, y: 3.7, w: 4.3, h: 1.5, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 4, margin: 0 }
  );
}

// ─────────────────────────────────────────────
// SLIDE 3: Section 2: Context
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 2: Context", "Where & How");

  const details = [
    { label: "Location", val: "Shared indoor environments such as school common areas, staff kitchens, and office breakrooms where communal bins are typically found." },
    { label: "Users", val: "Students, office workers, and visitors of all ages with varying levels of awareness about waste sorting categories." },
    { label: "Operating Conditions", val: "Temperature-controlled indoor areas with artificial lighting and moderate foot traffic throughout the day." },
    { label: "Frequency", val: "Used dozens of times daily during peak hours, requiring consistent reliability and minimal ongoing maintenance." },
  ];

  // 2x2 grid
  details.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 0.5 + col * 4.7;
    const cy = 1.15 + row * 1.15;
    s.addText(d.label.toUpperCase(), { x: cx, y: cy, w: 4.3, h: 0.25, fontSize: 9, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
    s.addText(d.val, { x: cx, y: cy + 0.28, w: 4.3, h: 0.8, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.5, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  s.addText("Design Implications", { x: 0.5, y: 3.65, w: 9.0, h: 0.3, fontSize: 11, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });

  const points = [
    { label: "Compact Footprint", body: "Kitchens and breakrooms have limited floor space. The bin must fit within a standard pedal bin footprint, constraining the sorting mechanism to a compact rotary design rather than conveyor or multi-chamber alternatives." },
    { label: "Lighting Variability", body: "Indoor lighting varies in colour temperature between rooms. The camera must compensate through software white-balance or include a dedicated light source to ensure consistent image quality for classification." },
    { label: "Public Interaction", body: "Users interact many times daily with no training. All mechanical and electrical components must be fully enclosed, and the interface must require zero instruction." },
  ];

  points.forEach((p, i) => {
    const cx = 0.5 + i * 3.15;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx - 0.15, y: 4.0, w: 0.01, h: 1.4, fill: { color: P.rule }, line: { color: P.rule } });
    s.addText(p.label, { x: cx, y: 4.0, w: 2.9, h: 0.25, fontSize: 10, bold: true, color: P.charcoal, fontFace: "Candara", margin: 0 });
    s.addText(p.body, { x: cx, y: 4.28, w: 2.9, h: 1.15, fontSize: 9.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 4: Section 3: Constraints
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 3: Constraints", "Non-Negotiable Limits");

  const rows = [
    ["Accurate classification", "Misclassified items directly undermine the purpose of the system by contributing to the same contamination it aims to prevent.", "Requires a camera subsystem paired with an AI processing unit capable of reliably distinguishing compost, recyclables, and landfill items.", "Classification must be confirmed before any mechanical actuation. The servo must not rotate until the AI has returned a category with sufficient confidence."],
    ["Indoor form factor", "The system must fit in kitchens, breakrooms, and corridors without obstructing movement or appearing out of place.", "The rotary sorting mechanism and all electronics must fit within a housing no larger than a standard bin (~40cm diameter, ~80cm tall).", "All wiring, power delivery, and sensor cabling must be routed internally with no external protrusions or loose connections."],
    ["Low power draw", "An environmentally focused system that consumes excessive electricity would contradict its own stated purpose and raise operating costs.", "Components must be chosen for minimal current draw, particularly during idle periods, which represent the majority of operating time.", "A sleep-wake control strategy is required so the camera, AI, and servo only activate when the proximity sensor detects an item."],
  ];

  s.addTable([
    [hdr("Constraint"), hdr("Why It Exists"), hdr("Influence on Subsystem Selection"), hdr("Influence on Integration / Control")],
    ...rows,
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.5, 2.0, 2.75, 2.75],
    fill: { color: P.white },
    fontSize: 10.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
  });
}

// ─────────────────────────────────────────────
// SLIDE 5: Section 4: Factors (4.1-4.3)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 4: Factors Influencing Creation & Use", "4.1 - 4.3");

  const factors = [
    {
      num: "4.1", title: "Function",
      body: "The system must identify waste and physically direct it to the correct compartment. This demands integration of an electrotechnological subsystem (ESP32-CAM, cloud AI, proximity sensor) with a mechanical subsystem (servo-driven rotating deposit tray).\n\nTogether these form a closed-loop control system. The camera captures image data that feeds into the AI classification, which then commands the servo to rotate the tray to the correct position.\n\n(AS/NZS 62443, Industrial automation and control systems security)"
    },
    {
      num: "4.2", title: "User Needs",
      body: "Research into waste disposal behaviour suggests that convenience is the dominant factor in whether people sort correctly (Knickmeyer, 2020). The system must require nothing from the user beyond placing their item on the tray.\n\nVisual feedback showing the detected category builds user trust and serves an educational function, teaching people which materials belong in which waste stream over time."
    },
    {
      num: "4.3", title: "Environment of Use",
      body: "Indoor communal areas present specific challenges. Compostable waste may be wet, sticky, or irregularly shaped, meaning the deposit tray must be moisture-resistant and allow items to slide freely.\n\nAll electronic components must be positioned above and away from the waste drop path to prevent liquid damage or short circuits from food residue."
    },
  ];

  factors.forEach((f, i) => {
    const cx = 0.5 + i * 3.1;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx - 0.1, y: 1.15, w: 0.01, h: 4.1, fill: { color: P.rule }, line: { color: P.rule } });
    s.addText(f.num, { x: cx, y: 1.15, w: 0.6, h: 0.4, fontSize: 18, bold: true, color: P.coral, fontFace: "Candara", valign: "middle", margin: 0 });
    s.addText(f.title, { x: cx + 0.6, y: 1.15, w: 2.2, h: 0.4, fontSize: 13, bold: true, color: P.charcoal, fontFace: "Candara", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.58, w: 0.8, h: 0.02, fill: { color: P.coral }, line: { color: P.coral } });
    s.addText(f.body, { x: cx, y: 1.7, w: 2.85, h: 3.5, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6: Section 4: Factors (4.4-4.6)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 4: Factors Influencing Creation & Use", "4.4 - 4.6");

  const factors = [
    {
      num: "4.4", title: "Safety",
      body: "The rotating deposit tray creates a potential pinch point where the tray meets the bin housing. All moving components must be enclosed so users cannot access the rotation zone during operation.\n\nThe system operates on low-voltage DC (5-12V), well below dangerous levels. The servo must be limited in torque to prevent injury in the unlikely event of contact.\n\n(AS/NZS 3000:2018 Wiring Rules, low voltage safety)"
    },
    {
      num: "4.5", title: "Cost",
      body: "The system must be affordable enough for schools and small offices to realistically adopt. This rules out expensive AI processing boards and complex multi-actuator sorting mechanisms.\n\nThe rotary tray design uses a single servo motor, significantly reducing cost compared to conveyor or robotic arm alternatives. Cloud-based classification removes the need for costly edge computing hardware.\n\n(Budget target: ~$120-150 AUD for components)"
    },
    {
      num: "4.6", title: "Waste & Energy",
      body: "The system should consume minimal power during both active sorting and idle periods. Since the bin waits idle for most of its operating life, standby consumption is the dominant energy concern.\n\nA proximity sensor triggers wake-up only when an item is placed, keeping all subsystems in low-power states otherwise. The environmental footprint of the system's own components at end-of-life must also be minimised.\n\n(DCCEEW, E-waste Product Stewardship, 2023)"
    },
  ];

  factors.forEach((f, i) => {
    const cx = 0.5 + i * 3.1;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx - 0.1, y: 1.15, w: 0.01, h: 4.1, fill: { color: P.rule }, line: { color: P.rule } });
    s.addText(f.num, { x: cx, y: 1.15, w: 0.6, h: 0.4, fontSize: 18, bold: true, color: P.coral, fontFace: "Candara", valign: "middle", margin: 0 });
    s.addText(f.title, { x: cx + 0.6, y: 1.15, w: 2.2, h: 0.4, fontSize: 13, bold: true, color: P.charcoal, fontFace: "Candara", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.58, w: 0.8, h: 0.02, fill: { color: P.coral }, line: { color: P.coral } });
    s.addText(f.body, { x: cx, y: 1.7, w: 2.85, h: 3.5, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 7: Section 5 - Design Brief
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.charcoal };

  s.addText("Section 5", { x: 0.5, y: 0.3, w: 9.0, h: 0.35, fontSize: 12, color: P.muted, fontFace: "Candara", margin: 0 });
  s.addText("Design Brief", { x: 0.5, y: 0.6, w: 9.0, h: 0.55, fontSize: 28, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 2.0, h: 0.03, fill: { color: P.coral }, line: { color: P.coral } });

  s.addText(
    "An opportunity exists to apply a systems engineering approach to the problem of waste contamination caused by incorrect sorting at communal disposal points. Recent developments in cloud-hosted vision AI and affordable microcontrollers make it practical to build a system that classifies waste automatically and directs it to the appropriate stream without relying on user knowledge.\n\nDesign, plan and commence production of an integrated AI-powered smart bin system that addresses this problem. The system will combine a mechanical sorting subsystem (servo-driven rotating deposit tray on a tilted axle) with an electrotechnological subsystem (ESP32-CAM, cloud vision AI, ultrasonic sensor), operating together as a closed-loop control system.\n\nThe system must be suitable for everyday use in schools and offices, requiring no user training, fitting within standard bin dimensions, and operating quietly enough for shared indoor spaces.",
    { x: 0.5, y: 1.4, w: 6.5, h: 3.5, fontSize: 11.5, color: "CCCCCC", fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );

  s.addText("Required Elements", { x: 7.3, y: 1.4, w: 2.2, h: 0.3, fontSize: 10, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 1.72, w: 1.2, h: 0.02, fill: { color: P.coral, transparency: 50 }, line: { color: P.coral, transparency: 50 } });

  const items = ["The ethical problem", "Sustainability dimension", "Mechanical + electrotechnological integration", "Closed-loop control", "Target users: schools & offices", "Autonomous and educational"];
  items.forEach((item, i) => {
    s.addText("\u2022  " + item, { x: 7.3, y: 1.85 + i * 0.45, w: 2.2, h: 0.4, fontSize: 9.5, color: "AAAAAA", fontFace: "Palatino Linotype", valign: "middle", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 8: Section 6: Parameters
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 6: Parameters", "Measurable Targets");

  s.addTable([
    [hdr("Parameter"), hdr("Target"), hdr("Unit"), hdr("Why This Value?"), hdr("Testing Method"), hdr("Link to Ethical Issue")],
    ["Sorting Accuracy", "> 85", "%", "Must correctly sort the majority of items to meaningfully reduce contamination.", "Present 40 assorted waste items and count correct classifications.", "Higher accuracy directly reduces recyclable and compostable material lost to landfill."],
    ["Cycle Time", "< 5", "Sec", "Users should not wait more than a few seconds or they will bypass the system.", "Stopwatch from item detection to tray returning to neutral position.", "Slow sorting discourages use, reverting people to incorrect manual disposal."],
    ["Noise Output", "< 55", "dB", "Must be tolerable in shared indoor spaces like classrooms and staff kitchens.", "Decibel meter at 1m from the bin during a full sort cycle.", "Excessive noise limits adoption in the environments where contamination is worst."],
    ["Idle Power", "< 10", "W", "The bin spends most of its time idle, so standby draw dominates total consumption.", "Multimeter on the power input while the system is in sleep mode.", "High electricity use would undermine the environmental purpose of the system."],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.6, 0.65, 0.5, 1.95, 1.7, 2.6],
    fill: { color: P.white },
    fontSize: 10.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
  });
}

// ─────────────────────────────────────────────
// SLIDE 9: Section 7: Evaluation Criteria
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 7: Evaluation Criteria", "");

  s.addTable([
    [hdr("Criteria (The system will...)"), hdr("Linked Parameter"), hdr("Testing Method"), hdr("Alignment with Design Brief & Factors")],
    [
      "Correctly classify and deposit items into the appropriate waste stream.",
      "Sorting Accuracy > 85%",
      "Present 40 different items (banana peels, plastic bottles, chip packets, paper) and record how many are deposited into the correct compartment.",
      "Directly addresses the design brief's goal of reducing contamination through automated classification and sorting."
    ],
    [
      "Complete a full sorting cycle within an acceptable timeframe.",
      "Cycle Time < 5 Seconds",
      "Measure from item detection (sensor trigger) to the tray returning to its neutral position using a stopwatch.",
      "Aligns with the User Needs factor. A system that is too slow will be abandoned in favour of conventional bins."
    ],
    [
      "Produce acceptable noise levels during sorting operation.",
      "Noise Output < 55 Decibels",
      "Use a decibel meter placed 1 metre from the bin during servo rotation and item deposit. The 55dB limit is informed by WHO guidelines for indoor work environments (WHO, 1999).",
      "Meets the Environment of Use constraint. The system must be suitable for quiet indoor shared spaces."
    ],
    [
      "Draw minimal power while waiting for items.",
      "Idle Power < 10 Watts",
      "Connect a digital multimeter to the DC power input and record the wattage drawn while the system is in its sleep state.",
      "Supports the Waste & Energy sustainability factor. The system must not create disproportionate energy costs."
    ],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [2.0, 1.8, 2.3, 2.9],
    fill: { color: P.white },
    fontSize: 10,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
  });
}

// ─────────────────────────────────────────────
// SLIDE 10: Section 8: Design Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Section 8: Design Research", "");

  s.addTable([
    [hdr("Source"), hdr("What Was Investigated"), hdr("What Was Learned"), hdr("Influence on Subsystem Selection"), hdr("Influence on Control Strategy")],
    ["Ameru Smart Bin (ameru.ai)", "Mechanical and AI approaches used in commercial smart bins", "Ameru uses a Jetson Orin Nano for local classification and a dual-servo pan-tilt to direct items into partitions. Effective but expensive (~$4,900 AUD).", "The pan-tilt approach works but requires two servos. A single-servo rotary design achieves the same outcome with fewer moving parts.", "Confirms the importance of completing classification before actuation. The system must not move until a category is determined."],
    ["MG996R Servo Datasheet (TowerPro)", "Torque and speed characteristics for affordable servo motors", "The MG996R delivers 11 kg/cm torque at 6V with 0.17s per 60 degrees of rotation. Metal gears handle repeated load cycles.", "Confirms the MG996R has sufficient torque to rotate a loaded deposit tray through 180 degrees reliably.", "PWM control allows precise positioning at three discrete angles (0, 90, 180 degrees) corresponding to the three bin compartments."],
    ["National Waste Report (DCCEEW, 2022)", "Composition and volume of Australian waste streams", "Australia generated 75.8Mt of waste in 2020-21. Organic waste is the largest category directed to landfill. National recovery rate is 63%.", "Supports a three-stream system (compost, recyclable, landfill) rather than a simpler two-stream approach.", "Validates the accuracy parameter. Even moderate sorting improvement could divert significant tonnage from landfill."],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.6, 1.4, 2.1, 2.0, 1.9],
    fill: { color: P.white },
    fontSize: 10,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
  });

  // Research outcome - quote style
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.5, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.62, w: 0.04, h: 0.55, fill: { color: P.coral }, line: { color: P.coral } });
  s.addText([
    { text: "Research outcome:  ", options: { bold: true, color: P.coral, fontFace: "Candara" } },
    { text: "Research supports pairing an affordable microcontroller (ESP32-CAM) with a cloud-hosted vision AI for classification, connected to a single-servo rotary mechanism for physical sorting. This architecture balances cost, accuracy, and mechanical simplicity within a closed-loop control framework.", options: { color: P.text, italic: true } },
  ], { x: 0.7, y: 4.6, w: 8.6, h: 0.6, fontSize: 10, fontFace: "Palatino Linotype", valign: "middle", margin: 0 });
}

// ─────────────────────────────────────────────
// SLIDE 11: Section 9 - Systems Thinking
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.charcoal };

  s.addText("Section 9", { x: 0.5, y: 0.3, w: 9.0, h: 0.3, fontSize: 11, color: P.muted, fontFace: "Candara", margin: 0 });
  s.addText("Systems Thinking", { x: 0.5, y: 0.55, w: 9.0, h: 0.5, fontSize: 24, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 2.0, h: 0.03, fill: { color: P.coral }, line: { color: P.coral } });
  s.addText("(Mandatory for 9-10 mark range)", { x: 0.5, y: 1.18, w: 9, h: 0.25, fontSize: 9, color: P.muted, fontFace: "Palatino Linotype", italic: true, margin: 0 });

  s.addText(
    "Incorrect waste sorting is a widespread issue driven by user confusion and inadequate disposal infrastructure. The resulting contamination of recycling and compost streams sends recoverable materials to landfill, producing methane emissions and depleting finite resources. This presents a clear opportunity for a systems engineering solution.\n\nAs outlined in the design brief, the system integrates a mechanical sorting subsystem (servo-driven rotary deposit tray on a permanently tilted axle) with an electrotechnological subsystem (ESP32-CAM, cloud-hosted vision AI, ultrasonic proximity sensor). These operate as a closed-loop control system: the sensor detects an item, the camera captures an image, the AI classifies it, and the servo rotates the tray to the corresponding compartment.\n\nConstraints including indoor noise limits, compact form factor, and user safety shaped the selection of a single-servo rotary mechanism over more complex conveyor or robotic arm alternatives. The permanent axle tilt means gravity performs the final deposit step, reducing mechanical complexity and acoustic output.\n\nEnergy sustainability influenced the control strategy: all subsystems remain in a low-power sleep state until the proximity sensor detects an item, activating the camera and AI on demand rather than continuously.\n\nThe selected parameters (>85% sorting accuracy and <10W idle power) provide measurable benchmarks to evaluate whether the system meaningfully addresses the ethical problem without creating disproportionate environmental costs.",
    { x: 0.5, y: 1.55, w: 6.0, h: 3.8, fontSize: 10.5, color: "CCCCCC", fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );

  // Side summary - plain text blocks with thin rules between
  const links = [
    { label: "Ethical Issue", val: "Opportunity for SE" },
    { label: "Functional Req.", val: "Subsystem Integration" },
    { label: "Constraints", val: "Mechanism Selection" },
    { label: "Sustainability", val: "Sleep-Wake Control" },
    { label: "Parameters", val: "Objective Benchmarks" },
  ];
  links.forEach((l, i) => {
    const y = 1.55 + i * 0.72;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: y - 0.04, w: 2.5, h: 0.01, fill: { color: P.slate }, line: { color: P.slate } });
    s.addText(l.label, { x: 7.0, y: y, w: 2.5, h: 0.28, fontSize: 10, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
    s.addText(l.val, { x: 7.0, y: y + 0.3, w: 2.5, h: 0.28, fontSize: 9.5, color: P.muted, fontFace: "Palatino Linotype", margin: 0 });
  });
}

// ═════════════════════════════════════════════
// CRITERION 2
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// SLIDE 12: Criterion 2 Divider
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.charcoal };

  // Split panel - coral left, charcoal right
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.2, h: 5.625, fill: { color: P.coral }, line: { color: P.coral } });
  s.addText("2", { x: 0, y: 1.0, w: 3.2, h: 2.5, fontSize: 120, bold: true, color: P.white, fontFace: "Candara", align: "center", valign: "middle", margin: 0 });

  s.addText("Criterion 2", { x: 3.8, y: 1.5, w: 5.7, h: 0.7, fontSize: 36, bold: true, color: P.coral, fontFace: "Candara", valign: "middle", margin: 0 });
  s.addText("Component & Subsystem Testing", { x: 3.8, y: 2.3, w: 5.7, h: 0.4, fontSize: 16, color: P.muted, fontFace: "Candara", margin: 0 });
  s.addText("Design Iteration, Component Selection & Testing", { x: 3.8, y: 2.8, w: 5.7, h: 0.35, fontSize: 12, color: P.slate, fontFace: "Palatino Linotype", italic: true, margin: 0 });
}

// ─────────────────────────────────────────────
// SLIDE 13: Existing Systems Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Existing Systems Research", "Task 1");

  const systems = [
    { name: "Ameru Smart Bin", src: "ameru.ai", body: "A commercially available AI bin using a Jetson Orin Nano for on-device image classification. Sorts into 4 streams via a dual-servo pan-tilt mechanism that tilts the collection tray along two axes. Claims 95% accuracy across 90+ waste categories. Priced at approximately $4,900 AUD." },
    { name: "Bin-e", src: "bine.world", body: "An office-focused smart bin using cloud image recognition to identify waste. Items are routed internally via a hidden conveyor belt into four sub-bins (paper, glass, plastic, general). Includes waste compression to maximise capacity. Pricing is quote-based, estimated at $10,000+ AUD." },
    { name: "Oscar Sort", src: "oscarsort.com", body: "An advisory AI system that uses a camera and display screen to tell users which bin to use rather than sorting automatically. No mechanical actuation is involved. Lower upfront cost but depends entirely on users following the on-screen instructions." },
  ];

  // Text columns with vertical dividers (no cards)
  systems.forEach((sys, i) => {
    const cx = 0.5 + i * 3.1;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx - 0.1, y: 1.15, w: 0.01, h: 1.8, fill: { color: P.rule }, line: { color: P.rule } });
    s.addText(sys.name, { x: cx, y: 1.15, w: 2.85, h: 0.28, fontSize: 11, bold: true, color: P.charcoal, fontFace: "Candara", margin: 0 });
    s.addText(sys.src, { x: cx, y: 1.43, w: 2.85, h: 0.2, fontSize: 8.5, color: P.coral, fontFace: "Palatino Linotype", italic: true, margin: 0 });
    s.addText(sys.body, { x: cx, y: 1.68, w: 2.85, h: 1.3, fontSize: 9.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.15, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  s.addTable([
    [hdr(""), hdr("Ameru Smart Bin"), hdr("Bin-e"), hdr("Oscar Sort")],
    ["AI Approach",       "Local (Jetson Orin Nano)",   "Cloud image recognition",      "Camera + display (advisory only)"],
    ["Sorting Method",    "Dual-servo pan-tilt tray",   "Conveyor belt with diverters", "None (user sorts manually)"],
    ["Waste Streams",     "4 (via partitioned bin)",    "4 (paper, glass, plastic, general)", "Multiple (display guidance only)"],
    ["Approx. Price",     "~$4,900 AUD",                "~$10,000+ AUD (est.)",         "~$16,000-24,000 AUD installed"],
    ["Key Insight",       "Pan-tilt works but two servos adds complexity", "Conveyors are effective but expensive and large", "AI classification alone is viable without mechanics"],
  ], {
    x: 0.5, y: 3.3, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.7, 2.4, 2.5, 2.4],
    fill: { color: P.white },
    fontSize: 9.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.32,
  });
}

// ─────────────────────────────────────────────
// SLIDE 14: Existing Subsystems Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Existing Subsystems Research", "Task 1");

  s.addTable([
    [hdr("Subsystem"), hdr("Role in the System"), hdr("Ameru's Approach"), hdr("Bin-e's Approach"), hdr("Our Approach"), hdr("Link to Design Brief")],
    [
      "AI Vision / Classification",
      "Identifies what category of waste the item belongs to so the sorting mechanism can direct it correctly.",
      "Jetson Orin Nano running a locally trained model with an 8MP camera.",
      "Cloud-based image recognition transmitted over WiFi.",
      "ESP32-CAM captures a photo and sends it to a cloud VLM (e.g. Gemini, GPT-4o) which returns the waste category.",
      "Fulfils the electrotechnological subsystem requirement with target >85% accuracy.",
    ],
    [
      "Mechanical Sorting",
      "Physically moves the item into the correct bin compartment after classification.",
      "Dual-servo pan-tilt tips the tray along two axes to direct items into partitions.",
      "Hidden conveyor belt with diverter gates routes items to sub-bins.",
      "Single MG996R servo rotates a deposit tray on a permanently tilted axle to one of three positions (0\u00B0, 90\u00B0, 180\u00B0). Gravity deposits the item.",
      "Fulfils the mechanical subsystem requirement. Single servo keeps cost and complexity low.",
    ],
    [
      "Item Detection",
      "Detects when a user places an item on the tray and triggers the classification process.",
      "Proximity sensor at the bin opening.",
      "Weight sensor on the input platform.",
      "HC-SR04 ultrasonic sensor mounted above the tray detects objects within range and wakes the system from sleep.",
      "Enables closed-loop control. Nothing activates until an item is present.",
    ],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.2, 1.35, 1.45, 1.45, 1.75, 1.8],
    fill: { color: P.white },
    fontSize: 9,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.95,
  });
}

// ─────────────────────────────────────────────
// SLIDE 15: Component Research: AI Processing
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Component Research: AI Processing", "Task 1");

  s.addTable([
    [hdr(""), hdr("ESP32-CAM"), hdr("Sipeed MaixCAM"), hdr("Nvidia Jetson Nano")],
    ["Price",              "~$10-15 AUD",   "~$80 AUD",        "~$200+ AUD"],
    ["AI Method",          "Captures image, sends to cloud VLM via WiFi", "Runs quantised YOLO model locally (INT8)", "Runs YOLO model locally with GPU acceleration"],
    ["Training Required",  "None (cloud model has pre-existing general knowledge)", "Yes (custom dataset collection, labelling, and quantisation", "Yes (custom dataset and training pipeline needed"],
    ["WiFi Dependency",    "Required for every classification", "Optional", "Optional"],
    ["Power Consumption",  "~0.5-1W during capture", "~2-3W continuous", "~5-10W continuous"],
    ["Built-in Camera",    "Yes (2MP OV2640)", "Yes (2MP)", "No (external USB or CSI camera required)"],
    ["Verdict",            "Selected: lowest cost, no training, simple setup", "Good capability but over budget", "Far too expensive for this project"],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.7, 2.4, 2.45, 2.45],
    fill: { color: P.white },
    fontSize: 10,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.48,
  });
}

// ─────────────────────────────────────────────
// SLIDE 16: Component Research - Servo & Sensors
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Component Research: Servo Motors & Sensors", "Task 1");

  s.addText("Servo Motor Options", { x: 0.5, y: 1.12, w: 4, h: 0.24, fontSize: 10, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addTable([
    [hdr(""), hdr("SG90 (Micro)"), hdr("MG996R"), hdr("Nema 17 Stepper")],
    ["Price",   "~$3 AUD",   "~$8 AUD",    "~$15 + $5 driver board"],
    ["Torque",  "1.8 kg/cm", "11 kg/cm",   "4.2 kg/cm (holding)"],
    ["Noise",   "Quiet",     "Moderate",   "Louder (stepping noise)"],
    ["Control", "PWM signal","PWM signal", "Step and direction pins"],
    ["Verdict", "Insufficient torque for loaded tray rotation", "Selected: strong torque at low cost", "Unnecessary complexity, requires driver board"],
  ], {
    x: 0.5, y: 1.38, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.4, 2.4, 2.7, 2.5],
    fill: { color: P.white },
    fontSize: 9.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.35,
  });

  s.addText("Detection Sensor Options", { x: 0.5, y: 3.48, w: 4, h: 0.24, fontSize: 10, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addTable([
    [hdr(""), hdr("HC-SR04 (Ultrasonic)"), hdr("IR Proximity Sensor"), hdr("VL53L0X (ToF Laser)")],
    ["Price",      "~$3 AUD",   "~$2 AUD",    "~$12 AUD"],
    ["Range",      "2-400cm",   "2-30cm",     "3-200cm"],
    ["Precision",  "\u00B13mm",  "Binary (on/off only)", "\u00B13% of measured distance"],
    ["Interface",  "Digital pulse width (distance)", "Digital HIGH/LOW", "I2C bus (distance value)"],
    ["Verdict",    "Selected: affordable, accurate, returns distance", "Too basic, cannot measure distance", "Accurate but overpriced for this application"],
  ], {
    x: 0.5, y: 3.72, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.4, 2.5, 2.5, 2.6],
    fill: { color: P.white },
    fontSize: 9,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.28,
  });
}

// ─────────────────────────────────────────────
// SLIDE 17: Component Research: Power Supply
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Component Research: Power Supply", "Task 1");

  s.addTable([
    [hdr(""), hdr("USB-C PD Trigger Board"), hdr("18650 Li-ion Battery Pack"), hdr("12V Sealed Lead-Acid")],
    ["Type",            "Mains powered via USB-C charger", "Rechargeable lithium cells (2-3S configuration)", "Rechargeable lead-acid battery"],
    ["Price",           "~$5 AUD (trigger board) + any USB-C charger", "~$20-30 AUD (cells + BMS + charger)", "~$25-40 AUD (battery + charger)"],
    ["Output Voltage",  "Selectable (5V, 9V, 12V, 20V via PD negotiation)", "7.4V or 11.1V depending on cell count", "12V nominal"],
    ["Runtime",         "Unlimited (mains connected)",  "4-8 hours estimated under load", "12-24 hours estimated"],
    ["Mass",            "Negligible (~5g board only)",  "~150g for 3 cells and holder", "~2kg"],
    ["Charging",        "Not applicable (continuous power)", "Requires BMS circuit, 2-4 hours to charge", "Requires external charger, slow cycle"],
    ["Wiring",          "Simple: two output wires to power rail", "Moderate: BMS, regulator, charging circuit", "Simple wiring but heavy and bulky"],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.4, 2.4, 2.6, 2.6],
    fill: { color: P.white },
    fontSize: 9.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.42,
  });
}

// ─────────────────────────────────────────────
// SLIDE 18: Power Supply Decision
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Power Supply Decision", "Key Decision");

  // Selected - wide left section
  s.addText("Selected: USB-C PD Trigger Board", { x: 0.5, y: 1.15, w: 5.5, h: 0.35, fontSize: 12, bold: true, color: P.teal, fontFace: "Candara", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.52, w: 1.0, h: 0.02, fill: { color: P.teal }, line: { color: P.teal } });

  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "A USB-C Power Delivery trigger board negotiates a specific voltage from any compatible charger. The board outputs stable DC power that feeds the ESP32, servo, and sensors through a shared power rail.", options: { breakLine: true } },
      { text: "\nWhy this was selected:", options: { bold: true, breakLine: true } },
      { text: "- The bin is designed for fixed indoor placement near a wall outlet", options: { breakLine: true } },
      { text: "- Continuous operation is required. Batteries would need constant recharging", options: { breakLine: true } },
      { text: "- The trigger board costs ~$5 and requires only two output wires", options: { breakLine: true } },
      { text: "- Compatible with any existing USB-C charger", options: { breakLine: true } },
      { text: "- No energy lost to charge-discharge cycles", options: { breakLine: true } },
    ],
    { x: 0.5, y: 1.65, w: 5.5, h: 3.4, fontSize: 10.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // Vertical divider
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 1.15, w: 0.01, h: 3.9, fill: { color: P.rule }, line: { color: P.rule } });

  // Rejected - narrow right column
  s.addText("Rejected", { x: 6.5, y: 1.15, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });

  s.addText("18650 Li-ion Pack", { x: 6.5, y: 1.6, w: 3.0, h: 0.25, fontSize: 10, bold: true, color: P.charcoal, fontFace: "Candara", margin: 0 });
  s.addText("Limited runtime of 4-8 hours under load. Requires a battery management system and charging circuitry, adding cost and complexity. Impractical for continuous indoor operation.", {
    x: 6.5, y: 1.88, w: 3.0, h: 1.15, fontSize: 9.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 3.15, w: 2.5, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  s.addText("12V Sealed Lead-Acid", { x: 6.5, y: 3.3, w: 3.0, h: 0.25, fontSize: 10, bold: true, color: P.charcoal, fontFace: "Candara", margin: 0 });
  s.addText("Better runtime (12-24 hours) but weighs approximately 2kg. Still requires periodic recharging. No advantage over mains power for a fixed indoor installation.", {
    x: 6.5, y: 3.58, w: 3.0, h: 1.15, fontSize: 9.5, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 19: Design Iteration: AI Classification
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Design Iteration: AI Classification", "Key Decision");

  // Rejected approach - top section, compact
  s.addText("Rejected: On-Device YOLO Model + Dedicated AI Board", { x: 0.5, y: 1.15, w: 9.0, h: 0.3, fontSize: 11, bold: true, color: P.coral, fontFace: "Candara", margin: 0 });
  s.addText(
    [
      { text: "How it would work: ", options: { bold: true } },
      { text: "Collect thousands of waste images, label each by category, train a custom YOLO model, then deploy it on an edge AI board (Jetson Nano ~$200 or MaixCAM ~$80) for offline inference.", options: { breakLine: true } },
      { text: "\nWhy it was rejected: ", options: { bold: true } },
      { text: "Edge AI boards cost $80-$200+, consuming most of the component budget. Collecting and labelling a training dataset is extremely time-consuming within SAT deadlines. A model trained on limited data may not generalise to real-world waste items.", options: {} },
    ],
    { x: 0.5, y: 1.5, w: 9.0, h: 1.4, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );

  // Horizontal rule
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.05, w: 9.0, h: 0.01, fill: { color: P.rule }, line: { color: P.rule } });

  // Selected approach - bottom section, more prominent
  s.addText("Selected: ESP32-CAM + Cloud Vision Language Model", { x: 0.5, y: 3.2, w: 9.0, h: 0.3, fontSize: 11, bold: true, color: P.teal, fontFace: "Candara", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.52, w: 1.0, h: 0.02, fill: { color: P.teal }, line: { color: P.teal } });
  s.addText(
    [
      { text: "How it works: ", options: { bold: true } },
      { text: "The ESP32-CAM captures a photo and transmits it over WiFi to a cloud-hosted Vision Language Model (such as Gemini or GPT-4o). The model identifies the item and returns the appropriate waste stream (compost, recyclable, or landfill).", options: { breakLine: true } },
      { text: "\nWhy it was selected: ", options: { bold: true } },
      { text: "The ESP32-CAM costs under $15, freeing budget for other components. Cloud VLMs already understand common objects without custom datasets. VLMs handle unusual or ambiguous items well. The trade-off is requiring a stable WiFi connection and ~1-2 seconds of network latency per classification.", options: {} },
    ],
    { x: 0.5, y: 3.65, w: 9.0, h: 1.7, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", margin: 0 }
  );
}

// ─────────────────────────────────────────────
// SLIDE 20: Component Comparison Table
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "Component Comparison: Why ESP32-CAM + Cloud VLM", "");

  s.addTable([
    [hdr("Criteria"), hdr("YOLO + Jetson Nano"), hdr("YOLO + MaixCAM"), hdr("ESP32-CAM + Cloud VLM")],
    ["Component Cost",        "~$200+ AUD",       "~$80 AUD",          "~$10-15 AUD"],
    ["Model Training",        "Required (custom YOLO with thousands of labelled images)", "Required (YOLO + INT8 quantisation for on-device inference)", "Not required (cloud model has pre-existing knowledge)"],
    ["Expected Accuracy",     "Variable: depends on training data volume and quality", "Variable: quantisation can reduce precision", "High: VLMs handle diverse everyday objects well"],
    ["Works Offline?",        "Yes (all processing is local)",  "Yes (all processing is local)",  "No (requires WiFi for every classification"],
    ["Response Time",         "~50-200ms per inference",         "~100-300ms per inference",        "~1-2 seconds (network round-trip)"],
    ["Power During Inference","~5-10W",             "~2-3W",             "~0.5-1W (capture and transmit)"],
    ["Setup Difficulty",      "Moderate: Linux, CUDA drivers, Python environment", "Moderate: MaixPy firmware, model conversion pipeline", "Simple: Arduino IDE, single HTTP API call"],
    ["SAT Suitability",       "Over budget, too complex to train in time", "Expensive, training timeline too tight", "Affordable, fast to deploy, reliable accuracy"],
  ], {
    x: 0.5, y: 1.15, w: 9.0,
    border: { pt: 0.5, color: P.rule },
    colW: [1.9, 2.2, 2.3, 2.6],
    fill: { color: P.white },
    fontSize: 9.5,
    fontFace: "Palatino Linotype",
    color: P.text,
    valign: "middle",
    rowH: 0.44,
  });
}

// ─────────────────────────────────────────────
// SLIDE 21: Servo Rotary Platform Test
// ─────────────────────────────────────────────
createTestSlide(
  "Component Testing: Servo Rotary Platform",
  "Subsystem Test 1 of 3",
  "Verify the MG996R servo can rotate the deposit tray accurately to three positions and handle the load of a waste item on the tray.",
  ["MG996R servo motor", "6V power supply", "Digital multimeter", "Protractor", "150g test weight", "Jumper wires and breadboard"],
  [
    "Connect the servo to a 6V supply with the multimeter in series on the positive lead",
    "Command the servo to 0\u00B0 (compost position) and record current draw with no load",
    "Repeat at 90\u00B0 (recyclable) and 180\u00B0 (landfill) with no load",
    "Attach a 150g weight to the tray arm at 90\u00B0 and record current under load",
    "Stall the motor against a fixed stop and record peak current draw",
    "Verify each angle against a protractor to check positional accuracy",
  ],
  [
    th(["Condition", "Supply Voltage", "Current Draw", "Angle Error", "Pass/Fail"]),
    ["No load,0\u00B0 (compost)", "6.01 V", "95 mA", "\u00B11\u00B0", "PASS"],
    ["No load,90\u00B0 (recyclable)", "6.01 V", "112 mA", "\u00B12\u00B0", "PASS"],
    ["No load,180\u00B0 (landfill)", "6.00 V", "105 mA", "\u00B11\u00B0", "PASS"],
    ["150g load at 90\u00B0", "5.99 V", "385 mA", "\u00B12\u00B0", "PASS"],
    ["Stalled against stop", "5.97 V", "710 mA", "N/A", "PASS"],
  ],
  [2.4, 1.4, 1.4, 1.5, 2.3]
);

// ─────────────────────────────────────────────
// SLIDE 22: HC-SR04 Ultrasonic Sensor Test
// ─────────────────────────────────────────────
createTestSlide(
  "Component Testing: HC-SR04 Ultrasonic Sensor",
  "Subsystem Test 2 of 3",
  "Confirm the ultrasonic sensor can reliably detect objects at the distances relevant to the bin drop zone (8-45 cm range).",
  ["HC-SR04 ultrasonic sensor", "ESP32 development board", "USB cable and laptop", "Arduino IDE with Serial Monitor", "Metal ruler", "Flat cardboard target"],
  [
    "Wire HC-SR04 to ESP32 (Trig to GPIO12, Echo to GPIO14)",
    "Upload a distance-reading sketch and open Serial Monitor at 115200 baud",
    "Position a flat cardboard target at 8, 15, 25, 35, and 45 cm from the sensor face",
    "Record 3 consecutive readings at each distance and calculate the average",
    "Determine whether each average falls within \u00B12 cm of the actual distance",
  ],
  [
    th(["Actual Distance", "Reading 1", "Reading 2", "Reading 3", "Average", "Error", "Pass/Fail"]),
    ["8 cm", "8.1 cm", "8.3 cm", "8.0 cm", "8.1 cm", "+0.1 cm", "PASS"],
    ["15 cm", "15.4 cm", "15.2 cm", "15.5 cm", "15.4 cm", "+0.4 cm", "PASS"],
    ["25 cm", "25.6 cm", "25.3 cm", "25.8 cm", "25.6 cm", "+0.6 cm", "PASS"],
    ["35 cm", "35.9 cm", "36.1 cm", "35.7 cm", "35.9 cm", "+0.9 cm", "PASS"],
    ["45 cm", "46.0 cm", "45.6 cm", "46.2 cm", "45.9 cm", "+0.9 cm", "PASS"],
  ],
  [1.3, 1.05, 1.05, 1.05, 1.05, 1.05, 1.45]
);

// ─────────────────────────────────────────────
// SLIDE 23: ESP32 Microcontroller Test
// ─────────────────────────────────────────────
createTestSlide(
  "Component Testing: ESP32 Microcontroller",
  "Subsystem Test 3 of 3",
  "Confirm the ESP32 board's GPIO, WiFi connectivity, serial communication, and PWM output function correctly for this project.",
  ["ESP32 DevKit V1", "Digital multimeter", "USB cable and laptop", "Arduino IDE with Serial Monitor", "LED and 220\u03A9 resistor", "Jumper wires"],
  [
    "Flash a sketch that sets a GPIO pin HIGH and measure the output voltage with the multimeter",
    "Connect to the local WiFi network and record the time to establish connection",
    "Wire TX to RX for a loopback test. Transmit 50 messages and count any dropped or corrupted",
    "Measure the 3.3V regulated output pin while driving an LED through a 220\u03A9 resistor",
    "Configure a PWM channel at 50Hz and verify the output frequency with the multimeter",
  ],
  [
    th(["Test", "Expected", "Measured", "Pass/Fail"]),
    ["GPIO HIGH voltage", "3.3 V", "3.28 V", "PASS"],
    ["GPIO LOW voltage", "0 V", "0.02 V", "PASS"],
    ["WiFi connect time", "< 5 seconds", "2.3 seconds", "PASS"],
    ["UART loopback (50 msgs)", "0 errors", "0 errors", "PASS"],
    ["3.3V pin under load", "3.3 V", "3.27 V", "PASS"],
    ["PWM frequency", "50 Hz", "50.1 Hz", "PASS"],
  ],
  [2.9, 2.1, 2.1, 1.9]
);

// ─────────────────────────────────────────────
// SLIDE 24: References
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: P.offwhite };
  addHeader(s, "References", "");

  const refs = [
    "Ameru (2024). Ameru Smart Bin: AI-Powered Waste Sorting. https://www.ameru.ai/",
    "Bin-e (2024). Bin-e Smart Waste Bin for Offices. https://www.bine.world/",
    "Clean Up Australia (2023). Australian Litter and Rubbish Report. https://www.cleanup.org.au/",
    "DCCEEW (2022). National Waste Report 2022. https://www.dcceew.gov.au/environment/protection/waste/national-waste-reports/2022",
    "DCCEEW (2023). National Product Stewardship Investment Fund: E-waste. https://www.dcceew.gov.au/environment/protection/waste/product-stewardship",
    "Elec Freaks (n.d.). HC-SR04 Ultrasonic Sensor Datasheet. https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf",
    "Espressif (n.d.). ESP32-CAM Development Board. https://www.espressif.com/en/products/devkits",
    "Intuitive AI (2024). Oscar Sort: AI Recycling Assistant. https://intuitiveai.ca/oscar-sort",
    "IPCC (2021). Climate Change 2021: The Physical Science Basis (AR6 WGI). https://www.ipcc.ch/report/ar6/wg1/",
    "Knickmeyer, D. (2020). Social factors influencing household waste separation. Resources, Conservation and Recycling, 164.",
    "Standards Australia (2018). AS/NZS 3000:2018, Electrical Installations (Wiring Rules). https://www.standards.org.au/",
    "TowerPro (n.d.). MG996R High-Torque Servo Motor Datasheet. https://www.towerpro.com.tw/product/mg996r/",
    "WHO (1999). Guidelines for Community Noise. https://www.who.int/publications/i/item/a68672",
  ];

  s.addText(
    refs.map(r => ({ text: r, options: { bullet: true, breakLine: true } })),
    { x: 0.5, y: 1.15, w: 9.0, h: 4.2, fontSize: 10, color: P.text, fontFace: "Palatino Linotype", valign: "top", paraSpaceAfter: 6, margin: 0 }
  );
}

pres.writeFile({ fileName: "AI_Smart_Bin_NA.pptx" })
  .then(() => console.log("Done! -> AI_Smart_Bin_NA.pptx"))
  .catch(e => console.error(e));
