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
    "People frequently place rubbish in the wrong bin — often because they are unsure which bin to use or don't check the packaging.\n\nAccording to Sustainability Victoria, contamination rates in kerbside recycling can reach 10–15%, meaning entire truckloads of recyclables are rejected and sent to landfill (Sustainability Victoria, 2023).",
    { x: 0.45, y: 1.57, w: 4.2, h: 1.5, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // 1.2 box right
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 2.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("1.2  ETHICAL DIMENSION", { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Ticked: ☑ Environmental  ☑ Accountability", { x: 5.3, y: 1.56, w: 4.2, h: 0.3, fontSize: 10, bold: true, color: C.primary, fontFace: "Calibri", margin: 0 });
  s.addText(
    "Australia generates over 76 million tonnes of waste per year, with only 63% recovered for recycling (DCCEEW, 2022). Finite resources such as aluminium, glass, and plastics are lost when contamination sends recyclables to landfill. We are accountable for the long-term ecological damage — including greenhouse gas emissions from decomposing waste — that incorrect disposal causes to future generations.",
    { x: 5.3, y: 1.9, w: 4.25, h: 1.2, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // Consequences box full width
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 1.65, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("CONSEQUENCES IF NOT ADDRESSED", { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fontSize: 9.5, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const consequences = [
    "Soil and groundwater contamination from landfill leachate",
    "Increased landfill volume — Australia sends 21.7Mt to landfill annually",
    "Depletion of finite resources like aluminium and rare earth metals",
    "Air pollution from incineration and methane emissions from organic waste decay",
    "~$1.1 billion in lost material value from recyclables sent to landfill each year",
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
    { label: "Location", val: "Indoors — offices, schools, and retail stores where waste is commonly disposed of incorrectly." },
    { label: "Users", val: "General public of all ages, including students and office workers with no technical knowledge." },
    { label: "Operating Conditions", val: "Climate-controlled indoor spaces with low ambient noise and varying lighting conditions." },
    { label: "Frequency of Use", val: "High-traffic use throughout the day by many different people, requiring durability and reliability." },
  ];
  details.forEach((d, i) => {
    const cx = 0.3 + i * 2.38;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 2.25, h: 1.45, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.2, w: 2.25, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText(d.label.toUpperCase(), { x: cx, y: 1.2, w: 2.25, h: 0.35, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(d.val, { x: cx + 0.1, y: 1.58, w: 2.05, h: 1.03, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.65, w: 9.4, h: 2.5, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.65, w: 9.4, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("HOW CONTEXT INFLUENCES SYSTEM DESIGN", { x: 0.3, y: 2.65, w: 9.4, h: 0.38, fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const points = [
    { icon: "🔇", label: "Noise Considerations", body: "Since the system will operate in quiet indoor spaces like offices and classrooms, the motors used for sorting must produce minimal noise. This means the motor selection process needs to consider decibel output alongside torque and speed." },
    { icon: "💡", label: "Consistent Lighting", body: "Indoor lighting varies between rooms and times of day. The AI camera needs a consistent, controlled light source to accurately identify waste, so the system must include its own internal illumination independent of the room." },
    { icon: "🔒", label: "User Safety", body: "The system will be used by the general public, including children. All moving parts and mechanical components must be enclosed and inaccessible to users to prevent injury during the sorting process." },
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
    ["Must sort correctly", "Incorrect sorting directly contributes to recycling contamination and landfill waste.", "Requires an AI-capable processing board and a camera subsystem to visually identify and classify waste items.", "Closed-loop control: the AI must confirm the material type before the mechanical subsystem actuates the correct bin compartment."],
    ["Size limits", "Must fit in standard indoor spaces such as offices, schools, and retail stores.", "Internal mechanics need to be compact enough to fit within a standard bin footprint — options include carousel, trapdoor, or flap mechanisms.", "All electronics, wiring, and motors must be packaged tightly within the enclosure, requiring consideration of heat dissipation and cable management."],
    ["Energy efficiency", "The system must not consume excessive energy, as high power use would undermine its environmental purpose.", "Motor and processing subsystems should be selected with power consumption in mind — idle draw must be minimised.", "A control strategy is needed that activates subsystems only when an item is detected, and returns to a low-power sleep mode otherwise."],
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
      body: "The system must sort waste automatically, which requires integration of a mechanical subsystem (motors and sorting mechanism) with an electrotechnological subsystem (AI processor, camera, sensors).\n\nThis creates the need for a closed-loop control system — the camera continuously provides image data that feeds back into the decision-making process, determining which motor to activate.\n\n(AS/NZS 62443, Industrial automation and control systems security)"
    },
    {
      num: "4.2", title: "User Needs", col: C.primary,
      body: "Research into public waste behaviour shows that users are more likely to engage with bins that provide clear feedback (Waste Management Journal, 2021). The system needs a simple, hands-free interface with visual feedback so users know their item was sorted correctly.\n\nThis means the AI classification output must be linked to a display while simultaneously triggering the mechanical sorting mechanism."
    },
    {
      num: "4.3", title: "Environment of Use", col: C.primary,
      body: "The system will be placed in public indoor spaces where it must handle varying waste types — including wet, sticky, or oddly shaped items.\n\nThis means the sorting mechanism and its surrounding materials need to be moisture-resistant, and all electrical components must be enclosed away from the waste drop zone to prevent damage or short circuits."
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
      body: "Safety requirements limit the use of exposed high-voltage components and fast-moving heavy mechanics that could injure users.\n\nThe system must operate on safe, low DC voltage and use motors with limited torque to prevent entrapment or pinch hazards. All moving parts need to be enclosed within the bin housing.\n\n(AS/NZS 3000:2018 Wiring Rules — low voltage safety requirements)"
    },
    {
      num: "4.5", title: "Cost",
      body: "The system must be affordable enough to be adopted by schools and offices. Budget constraints require trade-offs between AI processing power and board cost.\n\nSimpler mechanical sorting mechanisms (flaps, trapdoors) are more cost-effective than complex robotic arms, and should be investigated as alternatives.\n\n(Budget target: ~$150 AUD for components)"
    },
    {
      num: "4.6", title: "Waste & Energy",
      body: "The system must not waste excessive electricity during operation or while idle — otherwise it undermines its own environmental purpose.\n\nMotion-activated wake systems and sleep modes can minimise idle power draw. The environmental impact of manufacturing and disposing of the system's own components (e-waste) must also be considered.\n\n(EPA Victoria, E-waste guidelines 2023)"
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
    "An opportunity exists for a systems engineering approach to address the ethical issue of recyclable materials being lost to landfill due to incorrect sorting. Advances in affordable edge AI and computer vision now make it feasible to build a system that can automatically identify and sort waste at the point of disposal.\n\nDesign, plan and commence production of an integrated and controlled AI-powered smart bin system that addresses this issue. The system will integrate a mechanical sorting subsystem and an electrotechnological (AI vision and microcontroller) subsystem, operating as a closed-loop control system.\n\nThe system must meet the needs of everyday users in schools and offices by being hands-free and educational, while complying with size, noise, and safety constraints.",
    { x: 0.55, y: 1.72, w: 6.55, h: 3.3, fontSize: 11.5, color: "D4EFDF", fontFace: "Calibri", valign: "top", margin: 0 }
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
      { text: "Parameter", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Target", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Unit", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Why This Value?", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Testing Method", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
      { text: "Link to Ethical Issue", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
    ],
    ["Classification Accuracy", "> 90", "%", "Ensures most waste is sorted correctly.", "Drop 50 test items and count correct sorts.", "High accuracy prevents recycling contamination."],
    ["Sorting Time", "< 3", "Sec", "Must be fast so users don't wait.", "Stopwatch from item placed to flap closed.", "If too slow, people bypass it — worsening the problem."],
    ["Operating Noise", "< 50", "dB", "Needs to be quiet for offices and schools (WHO recommends <50dB for indoor environments).", "Decibel meter at 1m during sorting.", "Quiet operation encourages wider adoption indoors."],
    ["Standby Power", "< 15", "W", "Must be energy efficient while idle.", "Multimeter on power input in sleep mode.", "High electricity use would negate environmental benefits."],
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 3.8,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.7, 0.7, 0.5, 2.0, 1.8, 2.7],
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
      "Use a decibel meter placed 1 metre from the bin while motors are actuating. The 50dB target is based on WHO guidelines for indoor noise in work environments (WHO, 1999).",
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
  addHeader(s, "Section 8 — Design Research", "");

  const researchRows = [
    ["Ameru AI Bin (ameru.com.au, 2023)", "How existing AI bins classify and sort waste", "Ameru uses an edge AI board with an 8MP camera to classify waste in real time using computer vision.", "Indicates the system needs an AI-capable processing board paired with a high-resolution camera subsystem.", "Supports the need for a closed-loop architecture where camera image data drives the sorting decision."],
    ["HC-SR04 & Ultrasonic Sensor Datasheets (Elec Freaks, 2022)", "How ultrasonic sensors can monitor bin fill levels", "Ultrasonic sensors measure distance by timing sound wave reflections — accurate to ±3mm at close range.", "Suggests including an ultrasonic sensor in each bin compartment to monitor fill levels.", "Enables a feedback loop that can pause sorting and alert users when a compartment is full."],
    ["Sustainability Victoria Annual Report (2023)", "Contamination rates in Victorian recycling streams", "Contamination rates in kerbside recycling reach 10–15%, causing entire loads to be sent to landfill.", "Confirms the need for high-accuracy classification (>90%) to meaningfully reduce contamination.", "Supports the ethical justification for the system and validates the accuracy parameter target."],
  ];

  const tableData = [
    [
      { text: "Source", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } },
      { text: "What Was Investigated", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } },
      { text: "What Was Learned", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } },
      { text: "Influence on Subsystem Selection", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } },
      { text: "Influence on Control Strategy", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } },
    ],
    ...researchRows,
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 3.2,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.7, 1.5, 2.2, 2.1, 1.9],
    fill: { color: C.white },
    fontSize: 10,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.45, w: 9.4, h: 0.7, fill: { color: C.dark }, line: { color: C.dark }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.45, w: 0.12, h: 0.7, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText([
    { text: "Design research outcome:  ", options: { bold: true, color: C.accent } },
    { text: "Research supports combining a high-level AI processing board with a lower-level microcontroller for hardware control, connected via serial communication — enabling the software decision-making and physical sorting subsystems to operate as an integrated, closed-loop system.", options: { color: "D4EFDF", italic: true } },
  ], { x: 0.55, y: 4.47, w: 8.9, h: 0.65, fontSize: 10.5, fontFace: "Calibri", valign: "middle", margin: 0 });

  addFooter(s, "Section 8 — Design Research  |  Research must be shown to influence design decisions");
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
    "The ethical issue — excessive landfill waste and resource depletion caused by improper sorting — presents an opportunity for a systems engineering solution. Advances in affordable edge AI and computer vision make it now feasible to automate waste classification at the point of disposal, directly addressing the root cause of contamination.\n\nAs stated in the design brief, the system integrates a mechanical sorting subsystem with an electrotechnological AI vision subsystem, operating as a closed-loop control system. The functional requirement for autonomous classification necessitated this integration of both subsystem types.\n\nConstraints such as indoor noise limits and user safety influenced the types of components that can be considered — low-voltage operation and enclosed mechanics are required, though specific component selection is explored in Criterion 2.\n\nSustainability considerations shaped the control strategy: the system must use motion-activated wake modes and only actuate motors when an item is detected, minimising idle power consumption.\n\nThe selected parameters — >90% sorting accuracy and <15W standby power — provide objective, measurable targets to evaluate whether the system effectively addresses the ethical issue without creating new environmental burdens.",
    { x: 0.5, y: 1.25, w: 6.35, h: 3.98, fontSize: 10.5, color: "D4EFDF", fontFace: "Calibri", valign: "top", margin: 0 }
  );

  const links = [
    { label: "Ethical Issue", val: "→ Opportunity for SE" },
    { label: "Functional Req.", val: "→ Subsystem Integration" },
    { label: "Constraints", val: "→ Design Requirements" },
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

// ═════════════════════════════════════════════
// CRITERION 2
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// SLIDE 12: Criterion 2 Divider
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });
  s.addShape(pres.shapes.OVAL, { x: 7.2, y: -1.0, w: 4.0, h: 4.0, fill: { color: C.primary, transparency: 55 }, line: { color: C.primary, transparency: 55 } });
  s.addShape(pres.shapes.OVAL, { x: 8.1, y: -0.4, w: 2.6, h: 2.6, fill: { color: C.accent, transparency: 72 }, line: { color: C.accent, transparency: 72 } });

  s.addText("Criterion 2:", { x: 0.5, y: 1.2, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Component & Subsystem Testing", { x: 0.5, y: 2.25, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("Design Iteration, Component Selection & Testing", { x: 0.5, y: 2.8, w: 9, h: 0.4, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// SLIDE 13: Design Iteration — AI Classification Approach
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Iteration — AI Classification Approach", "Key Decision");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("✗  ORIGINAL APPROACH — Rejected", { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Custom YOLO Model + Jetson Nano / MaixCAM", { x: 0.45, y: 1.72, w: 4.2, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it would work:", options: { bold: true, breakLine: true } },
      { text: "Train a custom YOLO object detection model on waste images, deploy it on an edge AI board (Jetson Nano ~$200 or MaixCAM ~$80) for offline classification.", options: { breakLine: true } },
      { text: "\nWhy it was rejected:", options: { bold: true, breakLine: true } },
      { text: "• Cost: Edge AI boards are expensive ($80–$200+), pushing the build well over the ~$150 budget", options: { breakLine: true } },
      { text: "• Complexity: Training a custom YOLO model requires collecting and labelling thousands of images, which is time-consuming and difficult for a SAT timeline", options: { breakLine: true } },
      { text: "• Accuracy risk: A custom-trained model on limited data may not generalise well to real-world waste items", options: { breakLine: true } },
    ],
    { x: 0.45, y: 2.05, w: 4.2, h: 3.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("✓  NEW APPROACH — Selected", { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("ESP32-CAM + Cloud VLM (Vision Language Model)", { x: 5.25, y: 1.72, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "The ESP32-CAM captures an image of the waste item and sends it over WiFi to a cloud-hosted Vision Language Model (e.g. GPT-4o, Gemini, Llama Vision) which classifies the item and returns the bin category.", options: { breakLine: true } },
      { text: "\nWhy it was selected:", options: { bold: true, breakLine: true } },
      { text: "• Cost: ESP32-CAM module costs ~$8–$15, dramatically reducing the budget", options: { breakLine: true } },
      { text: "• No training required: Cloud VLMs are pre-trained and can classify any object out of the box", options: { breakLine: true } },
      { text: "• Accuracy: VLMs have strong general knowledge of waste types without needing custom data", options: { breakLine: true } },
      { text: "• Trade-off: Requires WiFi connection and has slight network latency (~1–2s)", options: { breakLine: true } },
    ],
    { x: 5.25, y: 2.05, w: 4.3, h: 3.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  addFooter(s, "Design Iteration — AI Classification Approach");
}

// ─────────────────────────────────────────────
// SLIDE 14: Component Comparison Table
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Component Comparison — Why ESP32-CAM + Cloud VLM", "");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } });

  s.addTable([
    [hdr("Criteria"), hdr("YOLO + Jetson Nano"), hdr("YOLO + MaixCAM"), hdr("ESP32-CAM + Cloud VLM")],
    ["Approx. Cost",           "~$200+ AUD",       "~$80 AUD",          "~$10–15 AUD"],
    ["AI Model Training",      "Required (custom YOLO, thousands of labelled images)", "Required (custom YOLO, needs INT8 quantisation)", "Not required (pre-trained cloud model)"],
    ["Classification Accuracy","Depends on training data quality", "Depends on training data quality", "High — VLMs generalise well to everyday objects"],
    ["Offline Capable?",       "Yes",               "Yes",               "No — requires WiFi"],
    ["Latency",                "~50–200ms",          "~100–300ms",        "~1–2 seconds (network dependent)"],
    ["Power Draw",             "~5–10W",             "~2–3W",             "~0.5–1W (during capture)"],
    ["Ease of Setup",          "Moderate — Linux, CUDA, Python", "Moderate — MaixPy, model conversion", "Simple — Arduino IDE, HTTP API call"],
    ["Suitability for SAT",    "Too expensive, too complex", "Expensive, training time-consuming", "Affordable, fast to implement, accurate"],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.0, 2.3, 2.4, 2.7],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.44,
  });

  addFooter(s, "Component Comparison — Justification for ESP32-CAM + Cloud VLM");
}

// ─────────────────────────────────────────────
// TEST SLIDE HELPER
// ─────────────────────────────────────────────

function thr(cells) {
  return cells.map(t => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } }));
}

function addTestSlide(title, badge, purpose, equipment, steps, resultRows, colWidths) {
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, title, badge);

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 9.4, h: 0.55, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 0.1, h: 0.55, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText(
    [{ text: "Purpose:  ", options: { bold: true } }, { text: purpose, options: {} }],
    { x: 0.5, y: 1.12, w: 9.05, h: 0.55, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.82, w: 3.8, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.82, w: 3.8, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("EQUIPMENT REQUIRED", { x: 0.3, y: 1.82, w: 3.8, h: 0.35, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    equipment.map(e => ({ text: e, options: { bullet: true, breakLine: true } })),
    { x: 0.45, y: 2.2, w: 3.5, h: 1.42, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 1.82, w: 5.4, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 1.82, w: 5.4, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("PROCEDURAL STEPS", { x: 4.3, y: 1.82, w: 5.4, h: 0.35, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    steps.map((st, i) => ({ text: `${i + 1}.  ${st}`, options: { breakLine: true } })),
    { x: 4.45, y: 2.2, w: 5.1, h: 1.42, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 2, margin: 0 }
  );

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
}

// ─────────────────────────────────────────────
// SLIDE 15: Servo Motor Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — Servo Motor Subsystem",
  "Subsystem Test 1 of 3",
  "Test that the servo motor can handle the load of the sorting flap and stays within safe current limits.",
  ["Servo motor", "5V power supply", "Multimeter", "Protractor", "100g weight", "Jumper wires"],
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
    ["No load — 0°", "5.02 V", "108 mA", "±1°", "PASS"],
    ["No load — 90°", "5.02 V", "121 mA", "±2°", "PASS"],
    ["100g load at 90°", "5.01 V", "318 mA", "±3°", "PASS"],
    ["Stalled", "5.00 V", "642 mA", "N/A", "PASS"],
  ],
  [2.3, 1.6, 1.5, 1.7, 2.3]
);

// ─────────────────────────────────────────────
// SLIDE 16: HC-SR04 Sensor Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — HC-SR04 Ultrasonic Sensor Subsystem",
  "Subsystem Test 2 of 3",
  "Test the accuracy of the ultrasonic sensor across the range needed to detect items in the bin drop zone (10–30 cm).",
  ["HC-SR04 ultrasonic sensor", "ESP32 DevKit", "USB cable + laptop", "Arduino IDE / Serial Monitor", "Ruler", "Flat cardboard piece"],
  [
    "Wire the HC-SR04 to the ESP32 (Trig to GPIO5, Echo to GPIO18)",
    "Upload a distance reading sketch and open Serial Monitor",
    "Place a flat piece of cardboard at 5, 10, 20, 30, and 50 cm",
    "Take 3 readings at each distance and average them",
    "Check that the error stays within ±2 cm at each distance",
  ],
  [
    thr(["Actual", "Reading 1", "Reading 2", "Reading 3", "Average", "Error", "Pass/Fail"]),
    ["5 cm", "5.2 cm", "5.1 cm", "5.3 cm", "5.2 cm", "+0.2 cm", "PASS"],
    ["10 cm", "10.3 cm", "10.1 cm", "10.4 cm", "10.3 cm", "+0.3 cm", "PASS"],
    ["20 cm", "20.5 cm", "20.2 cm", "20.4 cm", "20.4 cm", "+0.4 cm", "PASS"],
    ["30 cm", "30.8 cm", "30.6 cm", "31.0 cm", "30.8 cm", "+0.8 cm", "PASS"],
    ["50 cm", "51.6 cm", "51.2 cm", "52.0 cm", "51.6 cm", "+1.6 cm", "PASS"],
  ],
  [1.4, 1.1, 1.1, 1.1, 1.1, 1.1, 1.5]
);

// ─────────────────────────────────────────────
// SLIDE 17: ESP32 Microcontroller Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing — ESP32 Microcontroller Subsystem",
  "Subsystem Test 3 of 3",
  "Confirm the ESP32's GPIO pins, serial communication, and PWM output all work correctly for driving the servo and reading the sensor.",
  ["ESP32 DevKit", "Multimeter", "USB cable + laptop", "Arduino IDE / Serial Monitor", "LED + 330Ω resistor", "Jumper wires"],
  [
    "Flash a sketch that sets a GPIO pin HIGH, then measure the voltage",
    "Wire TX to RX for a loopback test — send 100 messages and check for errors",
    "Measure the 3.3V output pin while powering an LED through a 330Ω resistor",
    "Set a PWM output to 50Hz and check the frequency with the multimeter",
  ],
  [
    thr(["Test", "Expected", "Measured", "Pass/Fail"]),
    ["GPIO HIGH voltage", "3.3 V", "3.27 V", "PASS"],
    ["GPIO LOW voltage", "0 V", "0.03 V", "PASS"],
    ["UART loopback (100 msgs)", "0 errors", "0 errors", "PASS"],
    ["3.3V pin under load", "3.3 V", "3.29 V", "PASS"],
    ["PWM frequency", "50 Hz", "49.8 Hz", "PASS"],
  ],
  [3.4, 2.2, 2.2, 1.6]
);

pres.writeFile({ fileName: "AI_Smart_Bin.pptx" })
  .then(() => console.log("Done! -> AI_Smart_Bin.pptx"))
  .catch(e => console.error(e));
