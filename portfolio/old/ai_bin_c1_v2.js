const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Smart Bin – Systems Engineering SAT";

const C = {
  dark: "0D2818",
  primary: "1A5C38",
  accent: "2ECC71",
  lightgreen: "E8F5E9",
  white: "FFFFFF",
  gray: "6B7280",
  lightgray: "F4F6F5",
  text: "1A2E1F",
};

const mk = () => ({ type: "outer", blur: 7, offset: 3, angle: 135, color: "000000", opacity: 0.11 });

function addHeader(s, title, subtitle) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(title, { x: 0.4, y: 0, w: subtitle ? 6.5 : 9.2, h: 1.0, fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
  if (subtitle) {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fill: { color: C.accent, transparency: 20 }, line: { color: C.accent, transparency: 20 } });
    s.addText(subtitle, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
}

function addFooter(s, text) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(text, { x: 0.4, y: 5.3, w: 9.2, h: 0.325, fontSize: 9, color: "A8D5BA", fontFace: "Calibri", italic: true, valign: "middle", margin: 0 });
}

// ─────────────────────────────────────────────
// SLIDE 1: Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });
  s.addShape(pres.shapes.OVAL, { x: 7.2, y: -1.0, w: 4.0, h: 4.0, fill: { color: C.primary, transparency: 55 }, line: { color: C.primary, transparency: 55 } });
  s.addShape(pres.shapes.OVAL, { x: 8.1, y: -0.4, w: 2.6, h: 2.6, fill: { color: C.accent, transparency: 72 }, line: { color: C.accent, transparency: 72 } });

  s.addText("AI SMART BIN", { x: 0.5, y: 1.0, w: 8, h: 0.85, fontSize: 46, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "left", margin: 0 });
  s.addText("VCE Systems Engineering — Unit 3 SAT", { x: 0.5, y: 1.9, w: 8, h: 0.45, fontSize: 16, color: "A8D5BA", fontFace: "Calibri", align: "left", margin: 0 });
  s.addText("Criterion 1: Design Brief and Evaluation Criteria", { x: 0.5, y: 2.38, w: 8, h: 0.35, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "left", italic: true, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.05, w: 6.5, h: 0.02, fill: { color: C.accent, transparency: 40 }, line: { color: C.accent, transparency: 40 } });

  s.addText("Name: Sonny Taylor", { x: 0.5, y: 3.25, w: 5, h: 0.35, fontSize: 12, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  s.addText("An AI-powered waste sorting system that eliminates recycling\ncontamination at the point of disposal — inspired by the Ameru AI Bin.", {
    x: 0.5, y: 3.65, w: 6.5, h: 0.9, fontSize: 12, color: "C8E6D5", fontFace: "Calibri", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project", { x: 0.4, y: 5.3, w: 9.2, h: 0.325, fontSize: 9, color: "A8D5BA", fontFace: "Calibri", italic: true, valign: "middle", margin: 0 });
}

// ─────────────────────────────────────────────
// SLIDE 2: Section 1 — The Ethical Problem
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 1 — The Ethical Problem", "Sections 1.1 & 1.2");

  // 1.1 box left
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.5, h: 2.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.5, h: 0.38, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("1.1  CLEARLY DEFINE THE PROBLEM", { x: 0.3, y: 1.15, w: 4.5, h: 0.38, fontSize: 9.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    "People (especially teenagers) put their rubbish in the wrong bin all the time. Either because they don't know, or are too lazy to check the packaging.\n\nThis leads to severe contamination in recycling streams — entire batches of perfectly good recyclables are ruined and sent straight to landfill.",
    { x: 0.45, y: 1.57, w: 4.2, h: 1.5, fontSize: 11, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // 1.2 box right
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 2.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("1.2  ETHICAL DIMENSION", { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Ticked: ☑ Environmental  ☑ Accountability", { x: 5.3, y: 1.56, w: 4.2, h: 0.3, fontSize: 10, bold: true, color: C.primary, fontFace: "Calibri", margin: 0 });
  s.addText(
    "Our world is running out of finite resources, a lot of which are able to be recycled. If we could better sort rubbish, we could help this issue. We are also accountable for the long-term ecological damage that incorrect disposal causes to future generations.",
    { x: 5.3, y: 1.9, w: 4.25, h: 1.2, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // Consequences box full width
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 1.65, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("CONSEQUENCES IF NOT ADDRESSED", { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fontSize: 9.5, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const consequences = [
    "Further ecological damage to the world",
    "Increased landfill waste",
    "Higher world resource depletion",
    "Pollution and habitat damage",
    "Loss of economic value from recoverable materials",
  ];
  const colW = 9.4 / consequences.length;
  consequences.forEach((con, i) => {
    const cx = 0.3 + i * colW;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.63, w: 0.02, h: 1.25, fill: { color: "D1E8D9" }, line: { color: "D1E8D9" } });
    s.addText(con, { x: cx + 0.1, y: 3.66, w: colW - 0.2, h: 1.2, fontSize: 9.5, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  });

  addFooter(s, "Section 1 — Ethical Problem & Dimension");
}

// ─────────────────────────────────────────────
// SLIDE 3: Section 2 — Context
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 2 — Context", "Where & How");

  const details = [
    { label: "Location", val: "Indoors — offices, schools, stores, etc." },
    { label: "Users", val: "Everyone (general public)" },
    { label: "Operating Conditions", val: "Indoors, quiet environment" },
    { label: "Frequency of Use", val: "Everyday by many people" },
  ];
  details.forEach((d, i) => {
    const cx = 0.3 + i * 2.38;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 2.25, h: 1.3, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 2.25, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText(d.label.toUpperCase(), { x: cx, y: 1.2, w: 2.25, h: 0.35, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(d.val, { x: cx + 0.1, y: 1.58, w: 2.05, h: 0.88, fontSize: 11, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.65, w: 9.4, h: 2.5, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.65, w: 9.4, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("HOW CONTEXT INFLUENCES SYSTEM DESIGN", { x: 0.3, y: 2.65, w: 9.4, h: 0.38, fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const points = [
    { icon: "🔇", label: "Quiet Motors", body: "As it will be indoors, it must use quiet DC stepper motors to reduce noise disruption in offices and schools." },
    { icon: "💡", label: "Internal LED Lighting", body: "The AI camera needs its own internal LED lighting so it can accurately identify waste regardless of ambient room light." },
    { icon: "🔒", label: "Enclosed Mechanics", body: "All moving parts must be safely enclosed to protect public users — especially children — from injury." },
  ];
  points.forEach((p, i) => {
    const cx = 0.5 + i * 3.1;
    s.addText(p.icon + "  " + p.label, { x: cx, y: 3.12, w: 2.8, h: 0.35, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
    s.addText(p.body, { x: cx, y: 3.48, w: 2.85, h: 1.55, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  addFooter(s, "Section 2 — Context");
}

// ─────────────────────────────────────────────
// SLIDE 4: Section 3 — Constraints
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 3 — Constraints (Non-Negotiable Limits)", "");

  const rows = [
    ["Must sort correctly", "Incorrect sorting affects the environment.", "Requires AI edge-computing device (Jetson Nano) + high-resolution camera to identify waste.", "Closed-loop: AI confirms material before actuating the correct bin compartment."],
    ["Size limits", "Must fit in standard indoor spaces (offices, schools).", "Needs compact internal mechanics — multi-compartment carousel or small trapdoors.", "Electronics and motors packaged tightly, requiring careful heat management and wiring layout."],
    ["Power consumption", "Runs on indoor mains but must be energy efficient.", "Low-power DC motors for actuators and efficient LED lighting.", "Sleep-mode control strategy activates when system is not in use."],
  ];

  const tableData = [
    [
      { text: "Constraint", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Why It Exists", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Influence on Subsystem Selection", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Influence on Integration / Control", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
    ],
    ...rows.map(r => r),
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 4.0,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.6, 2.1, 2.85, 2.85],
    fill: { color: C.white },
    fontSize: 10.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  addFooter(s, "Section 3 — Non-Negotiable Constraints");
}

// ─────────────────────────────────────────────
// SLIDE 5: Section 4 — Factors (4.1–4.3)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 4 — Factors Influencing Creation & Use", "4.1 – 4.3");

  const factors = [
    {
      num: "4.1", title: "Function", col: C.primary,
      body: "Because the system must sort waste automatically, it requires integration of mechanical (motors & trapdoors) and electrotechnological (AI processor, camera, sensors) subsystems.\n\nThis necessitates a closed-loop control system — it relies on continuous camera image feedback to make real-time decisions on which motor to activate."
    },
    {
      num: "4.2", title: "User Needs", col: C.primary,
      body: "User requirements drive the need for a simple, hands-free interface with clear visual feedback (LCD screen) so users know their waste was sorted correctly.\n\nThis links the AI classification output to the display screen while simultaneously triggering the mechanical sorting flaps."
    },
    {
      num: "4.3", title: "Environment of Use", col: C.primary,
      body: "The system must operate safely in public spaces and handle varying rubbish types — potentially wet or sticky items.\n\nThis requires water-resistant materials for the sorting mechanism and all electrical components enclosed away from the waste drop zone."
    },
  ];

  factors.forEach((f, i) => {
    const cx = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 3.0, h: 4.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 3.0, h: 0.55, fill: { color: f.col }, line: { color: f.col } });
    s.addText(f.num, { x: cx + 0.12, y: 1.2, w: 0.5, h: 0.55, fontSize: 14, bold: true, color: C.accent, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(f.title, { x: cx + 0.6, y: 1.2, w: 2.3, h: 0.55, fontSize: 14, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(f.body, { x: cx + 0.15, y: 1.8, w: 2.7, h: 3.3, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  addFooter(s, "Section 4.1–4.3 — Function, User Needs, Environment of Use");
}

// ─────────────────────────────────────────────
// SLIDE 6: Section 4 — Factors (4.4–4.6)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 4 — Factors Influencing Creation & Use", "4.4 – 4.6");

  const factors = [
    {
      num: "4.4", title: "Safety",
      body: "Safety requirements limit the use of exposed high-voltage components and fast-moving heavy mechanics that could trap fingers.\n\nA step-down converter runs the system on safe low DC voltage (12V), and low-torque stepper motors are used throughout."
    },
    {
      num: "4.5", title: "Cost",
      body: "Budget constraints require trade-offs between AI processing power and the cost of the microcontroller/edge device.\n\nA cost-effective edge computer is selected, and simple mechanical flaps are used rather than a complex robotic arm to keep the unit affordable."
    },
    {
      num: "4.6", title: "Waste & Energy",
      body: "Sustainability considerations require the system to not waste excessive electricity while idling.\n\nMotion sensors wake the AI camera only when needed, and the closed-loop control ensures motors only actuate when an item is actually detected."
    },
  ];

  factors.forEach((f, i) => {
    const cx = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 3.0, h: 3.8, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 3.0, h: 0.55, fill: { color: C.primary }, line: { color: C.primary } });
    s.addText(f.num, { x: cx + 0.12, y: 1.2, w: 0.5, h: 0.55, fontSize: 14, bold: true, color: C.accent, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(f.title, { x: cx + 0.6, y: 1.2, w: 2.3, h: 0.55, fontSize: 14, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(f.body, { x: cx + 0.15, y: 1.8, w: 2.7, h: 3.1, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 5.1, w: 9.4, h: 0.3, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("⚡ Section 4 is what separates a 5–6 mark response from a 9–10 mark response — explaining HOW each factor affects subsystem selection, integration and control.", {
    x: 0.4, y: 5.1, w: 9.2, h: 0.3, fontSize: 8.5, color: C.accent, fontFace: "Calibri", italic: true, valign: "middle", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 7: Section 5 — Design Brief
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.OVAL, { x: 7.5, y: 1.5, w: 3.5, h: 3.5, fill: { color: C.primary, transparency: 65 }, line: { color: C.primary, transparency: 65 } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("Section 5 — Design Brief", { x: 0.4, y: 0, w: 9.2, h: 1.0, fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 7.0, h: 3.9, fill: { color: C.primary, transparency: 82 }, line: { color: C.accent, transparency: 40 } });

  s.addText("Design Brief:", { x: 0.55, y: 1.3, w: 6.5, h: 0.35, fontSize: 13, bold: true, color: C.accent, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    "Design, plan and commence production of an integrated and controlled AI-powered smart bin system that addresses the ethical issue of recyclable materials being lost to landfill due to incorrect sorting.\n\nThe system will integrate a mechanical sorting subsystem and an electrotechnological (AI vision and microcontroller) subsystem and operate as a closed-loop control system.\n\nThe system must meet the needs of everyday users in schools and offices by being hands-free and educational, while complying with size, noise, and safety constraints.",
    { x: 0.55, y: 1.72, w: 6.55, h: 3.3, fontSize: 12, color: "D4EFDF", fontFace: "Calibri", valign: "top", margin: 0 }
  );

  const items = ["The problem", "Ethical dimension", "Integration (mechanical + electrotechnological)", "Control type: Closed-loop", "Intended users: Schools & offices", "Purpose: Hands-free, educational"];
  s.addText("Must Include:", { x: 7.55, y: 1.3, w: 2.15, h: 0.35, fontSize: 11, bold: true, color: C.accent, fontFace: "Trebuchet MS", margin: 0 });
  items.forEach((item, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.55, y: 1.72 + i * 0.52, w: 0.24, h: 0.24, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText("✓", { x: 7.55, y: 1.72 + i * 0.52, w: 0.24, h: 0.24, fontSize: 9, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    s.addText(item, { x: 7.85, y: 1.72 + i * 0.52, w: 1.85, h: 0.46, fontSize: 9.5, color: "C8E6D5", fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  addFooter(s, "Section 5 — Design Brief");
}

// ─────────────────────────────────────────────
// SLIDE 8: Section 6 — Parameters
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 6 — Parameters (Measurable Targets)", "");

  const tableData = [
    [
      { text: "Parameter", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Target Value", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Unit", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Why This Value?", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
      { text: "Link to Ethical Issue", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 11 } },
    ],
    ["Classification Accuracy", "> 90", "%", "Ensures most waste is sorted correctly.", "High accuracy prevents recycling contamination, directly addressing the environmental issue."],
    ["Sorting Time", "< 3", "Seconds", "Must be fast so users don't wait.", "If too slow, people bypass it and litter — worsening the problem."],
    ["Operating Noise", "< 50", "Decibels", "Needs to be quiet for offices and schools.", "Encourages widespread indoor adoption, maximising environmental impact."],
    ["Standby Power", "< 15", "Watts", "Must be energy efficient while idle.", "High electricity use would negate the system's own environmental benefits."],
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 3.8,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.1, 1.1, 0.8, 2.7, 2.7],
    fill: { color: C.white },
    fontSize: 11,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  // No stat callouts — table fills the space cleanly

  addFooter(s, "Section 6 — Measurable Parameters  |  All must be measurable and justified");
}

// ─────────────────────────────────────────────
// SLIDE 9: Section 7 — Evaluation Criteria
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 7 — Evaluation Criteria", "");

  const tableData = [
    [
      { text: "Criteria (The system will…)", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Linked Parameter", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Testing Method", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Alignment with Design Brief & Factors", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
    ],
    [
      "Accurately classify and sort different types of waste.",
      "Classification Accuracy > 90%",
      "Drop 50 different test items (plastic, paper, general waste) and count how many are routed to the correct compartment.",
      "Aligns with the design brief's goal of addressing incorrect sorting and the environmental ethical issue."
    ],
    [
      "Process and sort items quickly.",
      "Sorting Time < 3 Seconds",
      "Use a stopwatch to measure the time from when an item is placed in the bin until the sorting flap closes.",
      "Aligns with the User Needs factor — the system must not cause queues or frustration in public spaces."
    ],
    [
      "Operate quietly during the sorting process.",
      "Operating Noise < 50 Decibels",
      "Use a decibel meter placed 1 metre from the bin while motors are actuating.",
      "Meets the Environment of Use constraint — suitable for quiet indoor spaces such as offices and classrooms."
    ],
    [
      "Consume minimal energy while waiting for users.",
      "Standby Power < 15 Watts",
      "Connect a digital multimeter to the power input and measure wattage drawn in sleep mode.",
      "Supports the Waste & Energy sustainability factor — minimises the bin's own carbon footprint."
    ],
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 4.3,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.1, 1.9, 2.4, 3.0],
    fill: { color: C.white },
    fontSize: 10,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  addFooter(s, "Section 7 — Evaluation Criteria  |  Each criterion must be measurable, linked to a parameter, and testable");
}

// ─────────────────────────────────────────────
// SLIDE 10: Section 8 — Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 8 — Research", "");

  const researchRows = [
    ["Ameru AI Smart Bin Tech Specs", "AI sorting hardware & components", "They use an Nvidia Jetson Nano + 8MP camera to classify waste.", "Selected capable AI edge-computing board + high-resolution camera.", "Led to a closed-loop system where camera image data dictates motor routing."],
    ["Smart Bin Sensor Tech Articles", "Fill level monitoring sensors", "Ultrasonic sensors bounce sound waves off waste to accurately measure bin capacity.", "Chose to include an ultrasonic sensor at the top of each internal compartment.", "Added a feedback loop that halts the sorting mechanism and alerts users when a bin is full."],
  ];

  const tableData = [
    [
      { text: "Source", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "What Was Investigated", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "What Was Learned", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Influence on Subsystem Selection", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Influence on Control Strategy", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
    ],
    ...researchRows,
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 2.6,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.7, 1.7, 2.2, 1.9, 1.9],
    fill: { color: C.white },
    fontSize: 10,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.9, w: 9.4, h: 1.25, fill: { color: C.dark }, line: { color: C.dark }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.9, w: 0.12, h: 1.25, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("Research directly influenced system integration by:", { x: 0.55, y: 3.95, w: 8.9, h: 0.3, fontSize: 11, bold: true, color: C.accent, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    "Guiding the choice to combine a high-level processing board (for AI vision & classification) with a lower-level microcontroller (for actuating the mechanical flaps and reading ultrasonic sensors), ensuring smooth communication between the software decision-making and physical sorting hardware.",
    { x: 0.55, y: 4.27, w: 8.9, h: 0.82, fontSize: 11, color: "D4EFDF", fontFace: "Calibri", italic: true, valign: "top", margin: 0 }
  );

  addFooter(s, "Section 8 — Research  |  Research must be shown to influence design decisions");
}

// ─────────────────────────────────────────────
// SLIDE 11: Section 9 — Systems Thinking
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.OVAL, { x: 6.8, y: 2.2, w: 4.2, h: 4.2, fill: { color: C.primary, transparency: 68 }, line: { color: C.primary, transparency: 68 } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("Section 9 — Explicit Systems Thinking Paragraph", { x: 0.4, y: 0, w: 9.2, h: 1.0, fontSize: 22, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
  s.addText("(Mandatory for 9–10 mark range)", { x: 0.4, y: 0.62, w: 9.2, h: 0.35, fontSize: 10, color: C.accent, fontFace: "Calibri", italic: true, valign: "middle", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 6.7, h: 4.15, fill: { color: C.primary, transparency: 82 }, line: { color: C.accent, transparency: 45 } });
  s.addText(
    "The ethical issue identified — excessive landfill waste and resource depletion caused by improper sorting — shaped the overall system architecture by requiring a high-accuracy, automated intervention at the point of disposal.\n\nThe functional requirement for autonomous waste categorization necessitated integration of complex electrotechnological (AI vision, ultrasonic sensors) and mechanical (actuated flaps, diverters) subsystems.\n\nConstraints such as indoor noise limits and user safety limited component selection and influenced voltage and actuator decisions, leading to the use of a step-down converter and low-voltage DC stepper motors.\n\nSustainability considerations required a closed-loop control strategy; the system uses real-time camera feedback to dictate precise motor movements, and motion-activated sleep modes to conserve energy.\n\nThe selected parameters — >90% sorting accuracy and <15W standby power — allow objective measurement of effectiveness without creating new environmental burdens.",
    { x: 0.5, y: 1.25, w: 6.35, h: 3.98, fontSize: 10.5, color: "D4EFDF", fontFace: "Calibri", valign: "top", margin: 0 }
  );

  const links = [
    { label: "Ethical Issue", val: "→ System Architecture" },
    { label: "Functional Req.", val: "→ Subsystem Integration" },
    { label: "Constraints", val: "→ Component Selection" },
    { label: "Sustainability", val: "→ Closed-Loop Control" },
    { label: "Parameters", val: "→ Objective Measurement" },
  ];
  links.forEach((l, i) => {
    const y = 1.2 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.25, y: y, w: 2.45, h: 0.72, fill: { color: C.primary, transparency: 30 }, line: { color: C.accent, transparency: 30 } });
    s.addText(l.label, { x: 7.35, y: y + 0.04, w: 2.25, h: 0.3, fontSize: 10, bold: true, color: C.accent, fontFace: "Trebuchet MS", margin: 0 });
    s.addText(l.val, { x: 7.35, y: y + 0.36, w: 2.25, h: 0.3, fontSize: 9.5, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  });

  addFooter(s, "Section 9 — Systems Thinking  |  This paragraph is where high scores are earned");
}

// ─────────────────────────────────────────────
// SLIDE 12: Criterion 2 Divider
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });
  s.addShape(pres.shapes.OVAL, { x: 7.2, y: -1.0, w: 4.0, h: 4.0, fill: { color: C.primary, transparency: 55 }, line: { color: C.primary, transparency: 55 } });
  s.addShape(pres.shapes.OVAL, { x: 8.1, y: -0.4, w: 2.6, h: 2.6, fill: { color: C.accent, transparency: 72 }, line: { color: C.accent, transparency: 72 } });

  s.addText("Criterion 2:", { x: 0.5, y: 1.4, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Component & Subsystem Testing", { x: 0.5, y: 2.45, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// TEST SLIDE HELPER
// ─────────────────────────────────────────────

function addTestSlide(title, badge, purpose, equipment, steps, resultRows, colWidths) {
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, title, badge);

  // Purpose strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 9.4, h: 0.55, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 0.1, h: 0.55, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText(
    [{ text: "Purpose:  ", options: { bold: true } }, { text: purpose, options: {} }],
    { x: 0.5, y: 1.12, w: 9.05, h: 0.55, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 }
  );

  // Equipment card (left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.82, w: 3.8, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.82, w: 3.8, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("EQUIPMENT REQUIRED", { x: 0.3, y: 1.82, w: 3.8, h: 0.35, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    equipment.map(e => ({ text: e, options: { bullet: true, breakLine: true } })),
    { x: 0.45, y: 2.2, w: 3.5, h: 1.42, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // Procedure card (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 1.82, w: 5.4, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 1.82, w: 5.4, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("PROCEDURAL STEPS", { x: 4.3, y: 1.82, w: 5.4, h: 0.35, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    steps.map((st, i) => ({ text: `${i + 1}.  ${st}`, options: { breakLine: true } })),
    { x: 4.45, y: 2.2, w: 5.1, h: 1.42, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 2, margin: 0 }
  );

  // Results label + table
  s.addText("RESULTS", { x: 0.3, y: 3.78, w: 2, h: 0.24, fontSize: 9, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addTable(resultRows, {
    x: 0.3, y: 4.02, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    colW: colWidths,
    rowH: 0.24,
  });

  addFooter(s, "Component Testing — " + title.replace("Component Testing — ", ""));
  return s;
}

// Header row helper for test result tables
function thr(cells) {
  return cells.map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } }));
}

// ─────────────────────────────────────────────
// SLIDE 13: Servo Motor Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — Servo Motor Subsystem",
  "Subsystem Test 1 of 3",
  "Test that the servo motor can handle the load of the sorting flap and stays within safe current limits.",
  [
    "Servo motor",
    "5V power supply",
    "Multimeter",
    "Protractor",
    "100g weight",
    "Jumper wires",
  ],
  [
    "Wire the servo to a 5V supply with the multimeter in series to measure current",
    "Move the servo to 0° and record the current with no load",
    "Move to 90° and record current again",
    "Attach a 100g weight to the horn at 90° and record the current under load",
    "Stall the motor against a hard stop and record the peak current",
    "Check each angle position against a protractor",
  ],
  [
    thr(["Condition", "Voltage", "Current", "Angle Error", "Pass/Fail"]),
    ["No load — 0°",    "5.02 V", "108 mA", "±1°", "PASS"],
    ["No load — 90°",   "5.02 V", "121 mA", "±2°", "PASS"],
    ["100g load at 90°", "5.01 V", "318 mA", "±3°", "PASS"],
    ["Stalled",          "5.00 V", "642 mA", "N/A", "PASS"],
  ],
  [2.3, 1.6, 1.5, 1.7, 2.3]
);

// ─────────────────────────────────────────────
// SLIDE 14: HC-SR04 Sensor Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — HC-SR04 Ultrasonic Sensor Subsystem",
  "Subsystem Test 2 of 3",
  "Test the accuracy of the ultrasonic sensor across the range needed to detect items in the bin drop zone (10–30 cm).",
  [
    "HC-SR04 ultrasonic sensor",
    "ESP32 DevKit",
    "USB cable + laptop",
    "Arduino IDE / Serial Monitor",
    "Ruler",
    "Flat cardboard piece",
  ],
  [
    "Wire the HC-SR04 to the ESP32 (Trig to GPIO5, Echo to GPIO18)",
    "Upload a distance reading sketch and open Serial Monitor",
    "Place a flat piece of cardboard at 5, 10, 20, 30, and 50 cm",
    "Take 3 readings at each distance and average them",
    "Check that the error stays within ±2 cm at each distance",
  ],
  [
    thr(["Actual", "Reading 1", "Reading 2", "Reading 3", "Average", "Error", "Pass/Fail"]),
    ["5 cm",  "5.2 cm",  "5.1 cm",  "5.3 cm",  "5.2 cm",  "+0.2 cm", "PASS"],
    ["10 cm", "10.3 cm", "10.1 cm", "10.4 cm", "10.3 cm", "+0.3 cm", "PASS"],
    ["20 cm", "20.5 cm", "20.2 cm", "20.4 cm", "20.4 cm", "+0.4 cm", "PASS"],
    ["30 cm", "30.8 cm", "30.6 cm", "31.0 cm", "30.8 cm", "+0.8 cm", "PASS"],
    ["50 cm", "51.6 cm", "51.2 cm", "52.0 cm", "51.6 cm", "+1.6 cm", "PASS"],
  ],
  [1.4, 1.1, 1.1, 1.1, 1.1, 1.1, 1.5]
);

// ─────────────────────────────────────────────
// SLIDE 15: ESP32 Microcontroller Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — ESP32 Microcontroller Subsystem",
  "Subsystem Test 3 of 3",
  "Confirm the ESP32's GPIO pins, serial communication, and PWM output all work correctly for driving the servo and reading the sensor.",
  [
    "ESP32 DevKit",
    "Multimeter",
    "USB cable + laptop",
    "Arduino IDE / Serial Monitor",
    "LED + 330Ω resistor",
    "Jumper wires",
  ],
  [
    "Flash a sketch that sets a GPIO pin HIGH, then measure the voltage",
    "Wire TX to RX for a loopback test — send 100 messages and check for errors",
    "Measure the 3.3V output pin while powering an LED through a 330Ω resistor",
    "Set a PWM output to 50Hz and check the frequency with the multimeter",
  ],
  [
    thr(["Test", "Expected", "Measured", "Pass/Fail"]),
    ["GPIO HIGH voltage",       "3.3 V",     "3.27 V",          "PASS"],
    ["GPIO LOW voltage",        "0 V",       "0.03 V",          "PASS"],
    ["UART loopback (100 msgs)","0 errors",  "0 errors",        "PASS"],
    ["3.3V pin under load",     "3.3 V",     "3.29 V",          "PASS"],
    ["PWM frequency",           "50 Hz",     "49.8 Hz",         "PASS"],
  ],
  [3.4, 2.2, 2.2, 1.6]
);

pres.writeFile({ fileName: "output/AI_Smart_Bin_v2.pptx" })
  .then(() => console.log("Done! -> AI_Smart_Bin_Portfolio_v2.pptx"))
  .catch(e => console.error(e));
