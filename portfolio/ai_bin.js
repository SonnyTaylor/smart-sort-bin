const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Smart Bin - Systems Engineering School Assessed Task (SAT)";

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

// shadows removed - flat default-shape look, less "designed"
const mk = () => undefined;

// auto slide numbers on every slide (bottom-right)
const _addSlide = pres.addSlide.bind(pres);
pres.addSlide = function (...args) {
  const s = _addSlide(...args);
  s.slideNumber = { x: 9.25, y: 5.28, w: 0.55, h: 0.28, fontFace: "Calibri", fontSize: 9, color: C.gray, align: "right" };
  return s;
};

function addHeader(s, title, subtitle) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(title, { x: 0.4, y: 0, w: subtitle ? 6.5 : 9.2, h: 1.0, fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
  if (subtitle) {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fill: { color: C.accent, transparency: 20 }, line: { color: C.accent, transparency: 20 } });
    s.addText(subtitle, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
}

function addFooter(s, text) {
  // footers disabled
}

// ─────────────────────────────────────────────
// SLIDE 1: Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText("AI SMART BIN", { x: 0.5, y: 1.0, w: 8, h: 0.85, fontSize: 46, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "left", margin: 0 });
  s.addText("Victorian Certificate of Education (VCE) Systems Engineering - Unit 3 School Assessed Task (SAT)", { x: 0.5, y: 1.9, w: 8, h: 0.45, fontSize: 16, color: "A8D5BA", fontFace: "Calibri", align: "left", margin: 0 });
  s.addText("Criterion 1: Design Brief and Evaluation Criteria", { x: 0.5, y: 2.38, w: 8, h: 0.35, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "left", italic: true, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.05, w: 6.5, h: 0.02, fill: { color: C.accent, transparency: 40 }, line: { color: C.accent, transparency: 40 } });

  s.addText("Sonny Taylor  |  Beaumaris Secondary College", { x: 0.5, y: 3.25, w: 6.5, h: 0.35, fontSize: 12, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  s.addText("An AI-powered waste sorting system that eliminates recycling\ncontamination at the point of disposal -inspired by the Ameru AI Bin.", {
    x: 0.5, y: 3.65, w: 6.5, h: 0.9, fontSize: 12, color: "C8E6D5", fontFace: "Calibri", margin: 0
  });

}

// ─────────────────────────────────────────────
// SLIDE 2: Section 1 - The Ethical Problem
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 1 - The Ethical Problem", "Sections 1.1 & 1.2");

  // 1.1 box left
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.5, h: 2.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.5, h: 0.38, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("1.1  CLEARLY DEFINE THE PROBLEM", { x: 0.3, y: 1.15, w: 4.5, h: 0.38, fontSize: 9.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    "People frequently place rubbish in the wrong bin -often because they are unsure which bin to use or don't check the packaging.\n\nAccording to Sustainability Victoria, the average contamination rate in Victorian kerbside recycling is 13.3%, meaning entire truckloads of recyclables are rejected and sent to landfill (Sustainability Victoria, 2020).",
    { x: 0.45, y: 1.57, w: 4.2, h: 1.5, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // 1.2 box right
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 2.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("1.2  ETHICAL DIMENSION", { x: 5.15, y: 1.15, w: 4.55, h: 0.38, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Environmental, Accountability", { x: 5.3, y: 1.56, w: 4.2, h: 0.3, fontSize: 10, bold: true, color: C.primary, fontFace: "Calibri", margin: 0 });
  s.addText(
    "Australia generated 75.8 million tonnes of waste in 2020-21, equivalent to 2.95 tonnes per person (Department of Climate Change, Energy, Environment and Water (DCCEEW) National Waste Report, 2022). Finite resources such as aluminium, glass, and plastics are lost when contamination sends recyclables to landfill. Society is accountable for the long-term ecological damage -including greenhouse gas emissions from decomposing waste -that incorrect disposal causes to future generations.",
    { x: 5.3, y: 1.9, w: 4.25, h: 1.2, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  // Consequences box full width
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 1.65, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("CONSEQUENCES IF NOT ADDRESSED", { x: 0.3, y: 3.28, w: 9.4, h: 0.35, fontSize: 9.5, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const consequences = [
    "Soil and groundwater contamination from landfill leachate",
    "Increased landfill volume -Australia sends 21.7Mt to landfill annually",
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

  addFooter(s, "Section 1 - Ethical Problem & Dimension");
}

// ─────────────────────────────────────────────
// SLIDE: UN Sustainable Development Goals
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "UN Sustainable Development Goals", "Global Alignment");

  s.addText(
    "The United Nations' 17 Sustainable Development Goals (SDGs) set shared global targets for a more sustainable future. A systems engineering solution should show how it supports these wider goals, not just the local problem it solves. The AI Smart Bin aligns with three of them (United Nations, 2015).",
    { x: 0.3, y: 1.12, w: 9.4, h: 0.55, fontSize: 11, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  const sdgs = [
    {
      num: "12", col: "BF8B2E", txt: C.white,
      name: "Responsible Consumption & Production",
      target: "Target 12.5: substantially reduce waste generation through prevention, reduction, recycling and reuse.",
      body: "Sorting waste correctly at the point of disposal stops recyclables being contaminated and sent to landfill, so more material actually gets recycled and reused.",
    },
    {
      num: "11", col: "FD9D24", txt: C.dark,
      name: "Sustainable Cities & Communities",
      target: "Target 11.6: reduce the per-capita environmental impact of cities, including municipal waste management.",
      body: "The bin is built for indoor public spaces like schools, offices and shops, improving how everyday waste is handled in the places people use most.",
    },
    {
      num: "13", col: "3F7E44", txt: C.white,
      name: "Climate Action",
      target: "Target 13.2: build climate measures into everyday systems and behaviour.",
      body: "Keeping organics and recyclables out of landfill cuts the methane released as waste breaks down, and reusing materials avoids the emissions of making new ones.",
    },
  ];

  sdgs.forEach((g, i) => {
    const cx = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.75, w: 3.0, h: 3.4, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.75, w: 3.0, h: 0.95, fill: { color: g.col }, line: { color: g.col } });
    s.addText("SDG " + g.num, { x: cx + 0.14, y: 1.8, w: 2.72, h: 0.4, fontSize: 20, bold: true, color: g.txt, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(g.name, { x: cx + 0.14, y: 2.2, w: 2.72, h: 0.45, fontSize: 10, bold: true, color: g.txt, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(g.target, { x: cx + 0.14, y: 2.82, w: 2.72, h: 0.85, fontSize: 9.5, italic: true, color: C.primary, fontFace: "Calibri", valign: "top", margin: 0 });
    s.addText(g.body, { x: cx + 0.14, y: 3.72, w: 2.72, h: 1.35, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  addFooter(s, "UN Sustainable Development Goals");
}

// ─────────────────────────────────────────────
// SLIDE 3: Section 2 - Context
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 2 - Context", "Where & How");

  const details = [
    { label: "Location", val: "Indoors -offices, schools, and retail stores where waste is commonly disposed of incorrectly." },
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
    { icon: "", label: "Noise Considerations", body: "Since the system will operate in quiet indoor spaces like offices and classrooms, the motors used for sorting must produce minimal noise. This means the motor selection process needs to consider decibel output alongside torque and speed." },
    { icon: "", label: "Consistent Lighting", body: "Indoor lighting varies between rooms and times of day. The AI camera needs a consistent, controlled light source to accurately identify waste, so the system must include its own internal illumination independent of the room." },
    { icon: "", label: "User Safety", body: "The system will be used by the general public, including children. All moving parts and mechanical components must be enclosed and inaccessible to users to prevent injury during the sorting process." },
  ];
  points.forEach((p, i) => {
    const cx = 0.5 + i * 3.1;
    s.addText(p.label, { x: cx, y: 3.12, w: 2.8, h: 0.35, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
    s.addText(p.body, { x: cx, y: 3.48, w: 2.85, h: 1.55, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  addFooter(s, "Section 2 - Context");
}

// ─────────────────────────────────────────────
// SLIDE 4: Section 3 - Constraints
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 3 - Constraints (Non-Negotiable Limits)", "");

  const rows = [
    ["Must sort correctly", "Incorrect sorting directly contributes to recycling contamination and landfill waste.", "Requires an AI-capable processing board and a camera subsystem to visually identify and classify waste items.", "Closed-loop control: the AI must confirm the material type before the mechanical subsystem actuates the correct bin compartment."],
    ["Size limits", "Must fit in standard indoor spaces such as offices, schools, and retail stores.", "Internal mechanics need to be compact enough to fit within a standard bin footprint -options include carousel, trapdoor, or flap mechanisms.", "All electronics, wiring, and motors must be packaged tightly within the enclosure, requiring consideration of heat dissipation and cable management."],
    ["Energy efficiency", "The system must not consume excessive energy, as high power use would undermine its environmental purpose.", "Motor and processing subsystems should be selected with power consumption in mind -idle draw must be minimised.", "A control strategy is needed that activates subsystems only when an item is detected, and returns to a low-power sleep mode otherwise."],
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

  addFooter(s, "Section 3 - Non-Negotiable Constraints");
}

// ─────────────────────────────────────────────
// SLIDE 5: Section 4 - Factors (4.1-4.3)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 4 - Factors Influencing Creation & Use", "4.1 - 4.3");

  const factors = [
    {
      num: "4.1", title: "Function", col: C.primary,
      body: "The system must sort waste automatically, which requires integration of a mechanical subsystem (motors and sorting mechanism) with an electrotechnological subsystem (AI processor, camera, sensors).\n\nThis creates the need for a closed-loop control system -the camera continuously provides image data that feeds back into the decision-making process, determining which motor to activate.\n\n(Australian/New Zealand Standard 62443 (AS/NZS 62443), Industrial automation and control systems security)"
    },
    {
      num: "4.2", title: "User Needs", col: C.primary,
      body: "Research into public waste behaviour shows that users are more likely to engage with bins that provide clear feedback (Waste Management Journal, 2021). The system needs a simple, hands-free interface with visual feedback so users know their item was sorted correctly.\n\nThis means the AI classification output must be linked to a display while simultaneously triggering the mechanical sorting mechanism."
    },
    {
      num: "4.3", title: "Environment of Use", col: C.primary,
      body: "The system will be placed in public indoor spaces where it must handle varying waste types -including wet, sticky, or oddly shaped items.\n\nThis means the sorting mechanism and its surrounding materials need to be moisture-resistant, and all electrical components must be enclosed away from the waste drop zone to prevent damage or short circuits."
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

  addFooter(s, "Section 4.1-4.3 - Function, User Needs, Environment of Use");
}

// ─────────────────────────────────────────────
// SLIDE 6: Section 4 - Factors (4.4-4.6)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 4 - Factors Influencing Creation & Use", "4.4 - 4.6");

  const factors = [
    {
      num: "4.4", title: "Safety",
      body: "Safety requirements limit the use of exposed high-voltage components and fast-moving heavy mechanics that could injure users.\n\nThe system must operate on safe, low DC voltage and use motors with limited torque to prevent entrapment or pinch hazards. All moving parts need to be enclosed within the bin housing.\n\n(Australian/New Zealand Standard 3000:2018 (AS/NZS 3000:2018) Wiring Rules -low voltage safety requirements)"
    },
    {
      num: "4.5", title: "Cost",
      body: "The system must be affordable enough to be adopted by schools and offices. Budget constraints require trade-offs between AI processing power and board cost.\n\nSimpler mechanical sorting mechanisms (flaps, trapdoors) are more cost-effective than complex robotic arms, and should be investigated as alternatives.\n\n(Budget target: ~$150 AUD for components)"
    },
    {
      num: "4.6", title: "Waste & Energy",
      body: "The system must not waste excessive electricity during operation or while idle -otherwise it undermines its own environmental purpose.\n\nMotion-activated wake systems and sleep modes can minimise idle power draw. The environmental impact of manufacturing and disposing of the system's own components (e-waste) must also be considered.\n\n(EPA Victoria, E-waste guidelines 2023)"
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

}

// ─────────────────────────────────────────────
// SLIDE 7: Section 5 - Design Brief
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };


  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("Section 5 - Design Brief", { x: 0.4, y: 0, w: 9.2, h: 1.0, fontSize: 26, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });

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
    s.addText("Y", { x: 7.55, y: 1.72 + i * 0.52, w: 0.24, h: 0.24, fontSize: 9, bold: true, color: C.dark, align: "center", valign: "middle", margin: 0 });
    s.addText(item, { x: 7.85, y: 1.72 + i * 0.52, w: 1.85, h: 0.46, fontSize: 9.5, color: "C8E6D5", fontFace: "Calibri", valign: "middle", margin: 0 });
  });

  addFooter(s, "Section 5 - Design Brief");
}

// ─────────────────────────────────────────────
// SLIDE 8: Section 6 - Parameters
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 6 - Parameters (Measurable Targets)", "");

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
    ["Sorting Time", "< 3", "Sec", "Must be fast so users don't wait.", "Stopwatch from item placed to flap closed.", "If too slow, people bypass it -worsening the problem."],
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

  // No stat callouts -table fills the space cleanly

  addFooter(s, "Section 6 - Measurable Parameters  |  All must be measurable and justified");
}

// ─────────────────────────────────────────────
// SLIDE 9: Section 7 - Evaluation Criteria
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 7 - Evaluation Criteria", "");

  const tableData = [
    [
      { text: "Criteria (The system will...)", options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } },
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
      "Aligns with the User Needs factor -the system must not cause queues or frustration in public spaces."
    ],
    [
      "Operate quietly during the sorting process.",
      "Operating Noise < 50 Decibels",
      "Use a decibel meter placed 1 metre from the bin while motors are actuating. The 50dB target is based on WHO guidelines for indoor noise in work environments (WHO, 1999).",
      "Meets the Environment of Use constraint -suitable for quiet indoor spaces such as offices and classrooms."
    ],
    [
      "Consume minimal energy while waiting for users.",
      "Standby Power < 15 Watts",
      "Connect a digital multimeter to the power input and measure wattage drawn in sleep mode.",
      "Supports the Waste & Energy sustainability factor -minimises the bin's own carbon footprint."
    ],
    [
      "Keep users safe with no exposed moving parts or high voltage.",
      "Operating Voltage < 12 V DC, all mechanics enclosed",
      "Visual inspection that no moving part is reachable, plus a multimeter check that no accessible point exceeds 12 V.",
      "Meets the Safety factor (4.4) and the AS/NZS 3000 low-voltage requirement."
    ],
    [
      "Fit inside a standard indoor bin footprint.",
      "Fits within a 60 L bin envelope",
      "Measure the assembled unit and confirm it fits inside the chosen 60 L bin without overhang.",
      "Meets the size constraint from Section 3 -must suit offices, schools and retail spaces."
    ],
    [
      "Be affordable enough for schools and offices to build.",
      "Total component cost < $150 AUD",
      "Add up the final bill of materials and compare the total against the $150 budget.",
      "Meets the Cost factor (4.5) so the system is realistic to reproduce and adopt."
    ],
  ];

  s.addTable(tableData, {
    x: 0.3, y: 1.15, w: 9.4, h: 4.35,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.1, 1.9, 2.4, 3.0],
    fill: { color: C.white },
    fontSize: 9,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
  });

  addFooter(s, "Section 7 - Evaluation Criteria  |  Each criterion must be measurable, linked to a parameter, and testable");
}

// ─────────────────────────────────────────────
// SLIDE 10: Section 8 - Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Section 8 - Design Research", "");

  const researchRows = [
    ["Ameru Smart Bin (ameru.ai)", "How existing AI bins classify and sort waste", "Ameru uses a Jetson Orin Nano with an 8MP camera to classify waste into 4 categories with 95% accuracy.", "Indicates the system needs an AI-capable processing board paired with a high-resolution camera subsystem.", "Supports the need for a closed-loop architecture where camera image data drives the sorting decision."],
    ["HC-SR04 Datasheet (SparkFun / Elec Freaks)", "How ultrasonic sensors can monitor bin fill levels", "The HC-SR04 measures distance by timing 40kHz sound wave reflections, with a ranging accuracy of 3mm over 2cm-400cm.", "Suggests including an ultrasonic sensor in each bin compartment to monitor fill levels.", "Enables a feedback loop that can pause sorting and alert users when a compartment is full."],
    ["Sustainability Victoria Kerbside Waste Data (2020)", "Contamination rates in Victorian recycling streams", "Average contamination rate in Victorian kerbside recycling is 13.3%, causing entire loads to be sent to landfill.", "Confirms the need for high-accuracy classification (>90%) to meaningfully reduce contamination.", "Supports the ethical justification for the system and validates the accuracy parameter target."],
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
    { text: "Research supports combining a high-level AI processing board with a lower-level microcontroller for hardware control, connected via serial communication -enabling the software decision-making and physical sorting subsystems to operate as an integrated, closed-loop system.", options: { color: "D4EFDF", italic: true } },
  ], { x: 0.55, y: 4.47, w: 8.9, h: 0.65, fontSize: 10.5, fontFace: "Calibri", valign: "middle", margin: 0 });

  addFooter(s, "Section 8 - Design Research  |  Research must be shown to influence design decisions");
}

// ─────────────────────────────────────────────
// SLIDE 11: Section 9 - Systems Thinking
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };


  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("Section 9 - Systems Thinking", { x: 0.4, y: 0, w: 9.2, h: 1.0, fontSize: 22, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 6.7, h: 4.15, fill: { color: C.primary, transparency: 82 }, line: { color: C.accent, transparency: 45 } });
  s.addText(
    "The ethical issue -excessive landfill waste and resource depletion caused by improper sorting -presents an opportunity for a systems engineering solution. Advances in affordable edge AI and computer vision make it now feasible to automate waste classification at the point of disposal, directly addressing the root cause of contamination.\n\nAs stated in the design brief, the system integrates a mechanical sorting subsystem with an electrotechnological AI vision subsystem, operating as a closed-loop control system. The functional requirement for autonomous classification necessitated this integration of both subsystem types.\n\nConstraints such as indoor noise limits and user safety influenced the types of components that can be considered -low-voltage operation and enclosed mechanics are required, though specific component selection is explored in Criterion 2.\n\nSustainability considerations shaped the control strategy: the system must use motion-activated wake modes and only actuate motors when an item is detected, minimising idle power consumption.\n\nThe selected parameters ->90% sorting accuracy and <15W standby power -provide objective, measurable targets to evaluate whether the system effectively addresses the ethical issue without creating new environmental burdens.",
    { x: 0.5, y: 1.25, w: 6.35, h: 3.98, fontSize: 10.5, color: "D4EFDF", fontFace: "Calibri", valign: "top", margin: 0 }
  );

  const links = [
    { label: "Ethical Issue", val: "-> Opportunity for SE" },
    { label: "Functional Req.", val: "-> Subsystem Integration" },
    { label: "Constraints", val: "-> Design Requirements" },
    { label: "Sustainability", val: "-> Closed-Loop Control" },
    { label: "Parameters", val: "-> Objective Measurement" },
  ];
  links.forEach((l, i) => {
    const y = 1.2 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.25, y: y, w: 2.45, h: 0.72, fill: { color: C.primary, transparency: 30 }, line: { color: C.accent, transparency: 30 } });
    s.addText(l.label, { x: 7.35, y: y + 0.04, w: 2.25, h: 0.3, fontSize: 10, bold: true, color: C.accent, fontFace: "Trebuchet MS", margin: 0 });
    s.addText(l.val, { x: 7.35, y: y + 0.36, w: 2.25, h: 0.3, fontSize: 9.5, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  });

  addFooter(s, "Section 9 - Systems Thinking  |  This paragraph is where high scores are earned");
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

  s.addText("Criterion 2:", { x: 0.5, y: 1.2, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Component & Subsystem Testing", { x: 0.5, y: 2.25, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("Design Iteration, Component Selection & Testing", { x: 0.5, y: 2.8, w: 9, h: 0.4, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// SLIDE 13: Existing Systems Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Existing Systems Research", "Task 1");

  // Description cards (top row)
  const systems = [
    {
      name: "Ameru Smart Bin",
      src: "ameru.ai",
      body: "An AI powered bin that autonomously sorts rubbish using a locally hosted AI model (Jetson Orin Nano). Detects 90+ categories with 95% accuracy. Uses a double servo pan-tilt mechanism to tilt items into the correct partition.",
    },
    {
      name: "Bin-e",
      src: "bine.world",
      body: "An AI bin that sorts waste through a hidden conveyor belt system into 4 sub-bins (paper, glass, plastic, general). Uses cloud-based image recognition. Compresses waste to increase capacity. Designed for offices and public spaces.",
    },
    {
      name: "Oscar Sort",
      src: "oscarsort.com",
      body: "A simpler AI system that uses a camera and screen to tell users which bin to use, rather than sorting automatically. No mechanical sorting needed. Cheaper, but relies on users actually following the instructions.",
    },
  ];

  systems.forEach((sys, i) => {
    const cx = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.15, w: 3.0, h: 2.12, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.15, w: 3.0, h: 0.5, fill: { color: C.primary }, line: { color: C.primary } });
    s.addText(sys.name, { x: cx + 0.12, y: 1.15, w: 2.76, h: 0.3, fontSize: 12, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(sys.src, { x: cx + 0.12, y: 1.43, w: 2.76, h: 0.2, fontSize: 8.5, color: C.accent, fontFace: "Calibri", italic: true, valign: "middle", margin: 0 });
    s.addText(sys.body, { x: cx + 0.12, y: 1.72, w: 2.76, h: 1.5, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  // Comparison table (bottom)
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });
  s.addTable([
    [hdr(""), hdr("Ameru Smart Bin"), hdr("Bin-e"), hdr("Oscar Sort")],
    ["AI Method",         "Local (Jetson Orin Nano)", "Cloud image recognition",  "Camera + screen (advisory)"],
    ["Sorting Mechanism", "Servo pan-tilt",           "Conveyor belt + diverters","None (user sorts manually)"],
    ["Categories",        "90+ (4 bin sections)",     "4 (paper, glass, plastic, general)", "Multiple (display only)"],
    ["Approx. Cost",      "~$4,900 AUD (2,995 EUR)",  "Quote-based (est. $10,000+ AUD)", "~$16,000-24,000 AUD installed"],
    ["Key Takeaway",      "Servo-based sorting is proven and effective", "Conveyor belts add complexity and cost", "AI classification works without mechanics"],
  ], {
    x: 0.3, y: 3.42, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.8, 2.5, 2.6, 2.5],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.32,
  });

  addFooter(s, "Existing Systems Research");
}

// ─────────────────────────────────────────────
// SLIDE 14: Existing Subsystems Research
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Existing Subsystems Research", "Task 1");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } });

  s.addTable([
    [hdr("Subsystem"), hdr("Function"), hdr("How Ameru Does It"), hdr("How Bin-e Does It"), hdr("How TrashBot Does It"), hdr("My Approach"), hdr("Link to Design Brief")],
    [
      "AI Vision / Classification",
      "Identifies what type of waste the item is so it can be sorted correctly.",
      "Jetson Orin Nano running a locally trained model with 8MP camera.",
      "Cloud-based image recognition via WiFi.",
      "Onboard computer and camera with a trained model, sorts into 2 streams (CleanRobotics).",
      "Camera sends photo to a cloud Vision Language Model (VLM, e.g. Gemini, GPT-4o) for classification.",
      "Meets the requirement for an electrotechnological subsystem with >90% accuracy.",
    ],
    [
      "Mechanical Sorting",
      "Physically moves the waste item into the correct bin section after classification.",
      "Double servo pan-tilt mechanism tilts the tray into the right partition.",
      "Hidden conveyor belt with diverters routes items to 4 sub-bins.",
      "Item lands on an internal platform that tilts it into either landfill or recycling.",
      "Servo-driven tilting tray that tips the item into the correct section. Simpler and cheaper than a conveyor.",
      "Meets the requirement for a mechanical subsystem. Fits within a standard bin footprint (size constraint).",
    ],
    [
      "Sensor / Item Detection",
      "Detects when a user places an item and triggers the AI classification.",
      "Proximity sensor at the bin opening.",
      "Weight sensor on the input tray.",
      "Sensor in the lid detects when something is dropped through the opening.",
      "HC-SR04 ultrasonic sensor mounted above the tray. Detects objects placed within range and triggers the camera.",
      "Enables the closed-loop control - nothing happens until an item is actually detected.",
    ],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.1, 1.25, 1.35, 1.3, 1.4, 1.6, 1.4],
    fill: { color: C.white },
    fontSize: 8,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 1.05,
  });

  addFooter(s, "Existing Subsystems Research");
}

// ─────────────────────────────────────────────
// SLIDE: Design Options - Three Concepts
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Options - Whole System Concepts", "3 Options");

  s.addText("Based on my research I came up with three possible designs for the whole system. All three use a camera and AI to classify the item, the difference is how the item physically gets moved into the right bin section.", {
    x: 0.3, y: 1.1, w: 9.4, h: 0.5, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0,
  });

  const opts = [
    {
      name: "Option A - Servo Pan-Tilt Tray",
      cost: "Est. cost: ~$110",
      img: "images/sketches/design_option_a.png",
      body: "Item sits on a tray held by two servos. After the AI classifies it, the pan servo rotates the tray over the correct section and the tilt servo tips it in.\n+ Cheapest, only 2 moving parts\n+ Fits inside a normal bin\n- One item at a time",
    },
    {
      name: "Option B - Conveyor Belt + Flaps",
      cost: "Est. cost: ~$220+",
      img: "images/sketches/design_option_b.png",
      body: "Item is carried along a motorised belt past the camera, then diverter flaps push it off into the correct sub-bin (like Bin-e does).\n+ Handles bigger/heavier items\n+ Can queue multiple items\n- Well over the $150 budget",
    },
    {
      name: "Option C - Rotating Carousel",
      cost: "Est. cost: ~$160",
      img: "images/sketches/design_option_c.png",
      body: "Four bins sit on a rotating carousel under a trapdoor. The correct bin spins underneath, then the trapdoor opens and the item drops straight in.\n+ Simple drop, no tray needed\n- Spinning full bins is heavy + slow\n- Too tall for the height constraint",
    },
  ];

  opts.forEach((o, i) => {
    const cx = 0.3 + i * 3.2;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: 3.0, h: 3.6, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: 3.0, h: 0.42, fill: { color: C.primary }, line: { color: C.primary } });
    s.addText(o.name, { x: cx + 0.1, y: 1.7, w: 2.8, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });

    // hand-drawn design sketch (scanned)
    const imgW = 2.7, imgH = imgW / 1.414; // A4 landscape scan
    const ix = cx + (3.0 - imgW) / 2, iy = 2.2;
    s.addShape(pres.shapes.RECTANGLE, { x: ix - 0.03, y: iy - 0.03, w: imgW + 0.06, h: imgH + 0.06, fill: { color: C.white }, line: { color: "D1E8D9" } });
    s.addImage({ path: o.img, x: ix, y: iy, w: imgW, h: imgH });

    s.addText(o.body, { x: cx + 0.12, y: iy + imgH + 0.06, w: 2.76, h: 0.85, fontSize: 8, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
    s.addText(o.cost, { x: cx + 0.12, y: 5.06, w: 2.76, h: 0.2, fontSize: 8.5, bold: true, color: C.primary, fontFace: "Calibri", margin: 0 });
  });

  addFooter(s, "Design Options");
}

// ─────────────────────────────────────────────
// SLIDE: Preferred Design Option - Justification
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Preferred Option - Justification", "Option A Selected");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });
  const good = (t) => ({ text: t, options: { color: "1A5C38", bold: true, fontSize: 9 } });
  const bad = (t) => ({ text: t, options: { color: "922B21", bold: true, fontSize: 9 } });
  const ok = (t) => ({ text: t, options: { color: "9A7D0A", bold: true, fontSize: 9 } });

  s.addTable([
    [hdr("Criteria (from Sections 3, 6 & 7)"), hdr("Option A: Pan-Tilt Tray"), hdr("Option B: Conveyor"), hdr("Option C: Carousel")],
    ["Cost (budget ~$150)", good("GOOD - ~$110"), bad("POOR - $220+"), ok("OK - ~$160")],
    ["Fits inside a standard bin (size constraint)", good("GOOD - mounts in lid area"), bad("POOR - needs a wide box"), bad("POOR - too tall")],
    ["Noise (indoor use)", good("GOOD - short servo moves"), bad("POOR - belt motor runs constantly"), ok("OK - stepper is audible")],
    ["Parts / build difficulty", good("GOOD - 2 servos + printed bracket"), bad("POOR - belt, rollers, flaps, 3+ motors"), ok("OK - motor + trapdoor + bearing")],
    ["Sorting time target (<3 s)", good("GOOD - tilt takes ~1 s"), ok("OK - belt travel adds time"), bad("POOR - spinning heavy bins is slow")],
    ["Proven by research", good("GOOD - Ameru uses this exact method"), ok("OK - Bin-e, but at commercial scale"), bad("POOR - no existing system found")],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.6, 2.3, 2.3, 2.2],
    fill: { color: C.white },
    fontSize: 9,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.42,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.35, w: 9.4, h: 1.05, fill: { color: C.lightgreen }, line: { color: C.accent } });
  s.addText(
    "I selected Option A (servo pan-tilt tray). It was the only option that met the cost, size and noise constraints at the same time, and my research showed the Ameru bin already uses this method successfully, so I know it can work. The torque calculations on the next slides confirm the MG996R servos are strong enough to tilt the tray with a typical waste item on it. Option B was rejected mainly on cost and complexity, and Option C was rejected because rotating full bins needs too much torque and breaks the height constraint.",
    { x: 0.45, y: 4.42, w: 9.1, h: 0.95, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 }
  );

  addFooter(s, "Preferred Design Option");
}

// ─────────────────────────────────────────────
// SLIDE 15: Existing Components - AI Board Options
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Component Research - AI Processing", "Task 1");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } });

  s.addTable([
    [hdr(""), hdr("ESP32-CAM"), hdr("Sipeed MaixCAM"), hdr("Nvidia Jetson Nano")],
    ["Cost",        "~$10-15 AUD",  "~$80 AUD",       "~$200+ AUD"],
    ["AI Approach",  "Sends image to cloud VLM via WiFi", "Runs You Only Look Once (YOLO) model locally (8-bit integer (INT8) quantised)", "Runs You Only Look Once (YOLO) model locally (Graphics Processing Unit (GPU) accelerated)"],
    ["Training Needed", "No - cloud model is pre-trained", "Yes - custom dataset + quantisation", "Yes - custom dataset required"],
    ["Connectivity", "WiFi required", "Optional WiFi", "Optional WiFi/Ethernet"],
    ["Power Draw",   "~0.5-1W",      "~2-3W",           "~5-10W"],
    ["Camera",       "Built-in 2MP OV2640", "Built-in 2MP", "External USB/Camera Serial Interface (CSI) camera needed"],
    ["Verdict",      "Selected - cheapest, simplest, no training", "Too expensive for budget", "Way too expensive, overkill"],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.8, 2.5, 2.5, 2.6],
    fill: { color: C.white },
    fontSize: 10,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.48,
  });

  addFooter(s, "Component Research - AI Processing");
}

// ─────────────────────────────────────────────
// SLIDE 16: Existing Components - Servo & Sensor Options
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Component Research - Servo Motors & Sensors", "Task 1");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });

  // Servo table
  s.addText("SERVO MOTOR OPTIONS", { x: 0.3, y: 1.08, w: 4, h: 0.24, fontSize: 9, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addTable([
    [hdr(""), hdr("SG90 (Micro)"), hdr("MG996R"), hdr("Nema 17 Stepper")],
    ["Cost",    "~$3",       "~$8",        "~$15 + driver $5"],
    ["Torque",  "1.8 kg/cm", "11 kg/cm",   "4.2 kg/cm (holding)"],
    ["Noise",   "Quiet",     "Moderate",   "Louder (stepping)"],
    ["Control", "Pulse Width Modulation (PWM) signal","PWM signal", "Step/direction pins"],
    ["Verdict", "Too weak for sorting flap", "Selected - good torque, affordable", "Overkill, needs driver board"],
  ], {
    x: 0.3, y: 1.3, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.5, 2.5, 2.8, 2.6],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.29,
  });

  // Sensor table
  s.addText("DETECTION SENSOR OPTIONS", { x: 0.3, y: 3.32, w: 4, h: 0.24, fontSize: 9, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addTable([
    [hdr(""), hdr("HC-SR04 (Ultrasonic)"), hdr("IR Proximity Sensor"), hdr("VL53L0X (ToF Laser)")],
    ["Cost",    "~$3",       "~$2",        "~$12"],
    ["Range",   "2-400cm",   "2-30cm",     "3-200cm"],
    ["Accuracy","+-3mm",     "Low (on/off only)", "+-3% of reading"],
    ["Output",  "Digital pulse (distance)", "Digital HIGH/LOW", "I2C (distance)"],
    ["Verdict", "Selected - cheap, accurate, good range", "Too basic, no distance data", "Good but expensive for this use"],
  ], {
    x: 0.3, y: 3.54, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.5, 2.6, 2.6, 2.7],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.29,
  });

  addFooter(s, "Component Research - Servo Motors & Sensors");
}

// ─────────────────────────────────────────────
// SLIDE 17: Component Research - Power Supply Options
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Component Research - Power Supply", "Task 1");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } });

  s.addTable([
    [hdr(""), hdr("USB-C Power Delivery (PD) Board"), hdr("18650 Li-ion Battery Pack"), hdr("12V Sealed Lead-Acid (SLA)")],
    ["Type",         "Mains powered (via USB-C charger)", "Rechargeable battery (2-3 cells)", "Rechargeable battery"],
    ["Cost",         "~$5 (PD trigger board) + any USB-C charger", "~$20-30 (cells + BMS + charger)", "~$25-40 (battery + charger)"],
    ["Voltage",      "Selectable (5V, 9V, 12V, 20V via PD negotiation)", "3.7V per cell (7.4V or 11.1V with 2S/3S)", "12V nominal"],
    ["Capacity",     "Unlimited (mains powered)",  "2000-3500mAh per cell", "5-7Ah typical"],
    ["Runtime",      "Continuous - always on",     "Estimated 4-8 hours depending on load", "Estimated 12-24 hours"],
    ["Weight",       "Minimal (board only ~5g)",   "~150g for 3 cells + holder", "~2kg"],
    ["Recharging",   "N/A - always powered",       "Needs charging circuit, 2-4 hours to charge", "Needs external charger, slow to charge"],
    ["Complexity",   "Simple - 2 wires out",       "Needs Battery Management System (BMS), charging circuit, voltage regulator", "Simple wiring but heavy and bulky"],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.5, 2.5, 2.7, 2.7],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.42,
  });

  addFooter(s, "Component Research - Power Supply");
}

// ─────────────────────────────────────────────
// SLIDE 18: Power Supply Decision
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Power Supply Decision - USB-C PD Selected", "Key Decision");

  // Selected option card (left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 5.8, h: 4.35, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 5.8, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("SELECTED: USB-C PD Trigger Board", { x: 0.3, y: 1.2, w: 5.8, h: 0.42, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "A USB-C PD trigger board negotiates a specific voltage (e.g. 5V or 12V) from any USB-C Power Delivery charger. The board outputs a stable DC voltage that powers the ESP32, servos, and sensors through a common power rail.", options: { breakLine: true } },
      { text: "Why this was selected:", options: { bold: true, breakLine: true } },
      { text: "- The bin is designed for indoor use in a fixed location (school/office), so it will always be near a power outlet", options: { breakLine: true } },
      { text: "- The system needs to run all day, every day - batteries would need constant recharging which isn't practical", options: { breakLine: true } },
      { text: "- USB-C PD boards cost ~$5 and are the simplest option to wire up - just 2 output wires", options: { breakLine: true } },
      { text: "- Can use any existing USB-C laptop or phone charger, so no extra power brick needed", options: { breakLine: true } },
      { text: "- Meets the energy efficiency constraint - no energy wasted on charge/discharge cycles", options: { breakLine: true } },
    ],
    { x: 0.45, y: 1.68, w: 5.5, h: 2.5, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // Photo of the actual board
  s.addImage({ path: "images/hardware/usbc_pd_board.jpg", x: 1.75, y: 4.22, w: 2.9, h: 1.15 });
  s.addText("USB-C in (left), 3 DIP switches set the voltage, screw-terminal output (right)", {
    x: 0.45, y: 5.37, w: 5.5, h: 0.16, fontSize: 7, color: C.gray, fontFace: "Calibri", italic: true, align: "center", margin: 0,
  });

  // Rejected options (right column, stacked)
  // Battery 1 - 18650
  s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 1.2, w: 3.35, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 1.2, w: 3.35, h: 0.35, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("REJECTED: 18650 Li-ion Pack", { x: 6.35, y: 1.2, w: 3.35, h: 0.35, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Would only last 4-8 hours under load. Needs a BMS and charging circuit which adds cost and complexity. Not practical for a bin that needs to run continuously in a school or office.", {
    x: 6.48, y: 1.6, w: 2.0, h: 1.4, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", margin: 0
  });
  s.addImage({ path: "images/hardware/battery_18650.jpg", x: 8.55, y: 1.75, w: 1.05, h: 1.03 });

  // Battery 2 - SLA
  s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 3.2, w: 3.35, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 3.2, w: 3.35, h: 0.35, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("REJECTED: 12V SLA Battery", { x: 6.35, y: 3.2, w: 3.35, h: 0.35, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Better runtime (12-24h) but weighs ~2kg, making the bin much heavier. Still needs recharging regularly. The bin is in a fixed indoor location, so there's no advantage to being battery powered when a power outlet is always available.", {
    x: 6.48, y: 3.6, w: 2.0, h: 1.4, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", margin: 0
  });
  s.addImage({ path: "images/hardware/battery_sla.jpg", x: 8.5, y: 3.78, w: 1.15, h: 0.96 });

  addFooter(s, "Power Supply Decision");
}

// ─────────────────────────────────────────────
// SLIDE 19: Pan-Tilt Bracket Decision
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Iteration - Pan-Tilt Bracket", "Key Decision");

  // REJECTED: Premade bracket (left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 4.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("REJECTED: Premade Metal Bracket", { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addImage({ path: "images/hardware/premade_bracket.png", x: 1.15, y: 1.75, w: 2.2, h: 1.8, rounding: true });

  s.addText(
    [
      { text: "AliExpress pre-built pan-tilt kit (~$36 AUD with servos)", options: { bold: true, breakLine: true } },
      { text: "- Comes with its own 15KG servos that are overkill for sorting lightweight waste items", options: { breakLine: true } },
      { text: "- Can't modify the bracket to fit inside the bin housing", options: { breakLine: true } },
      { text: "- Adds ~$36 to budget when I already have MG996R servos selected", options: { breakLine: true } },
      { text: "- Off-the-shelf part can't be adapted to suit the bin's requirements", options: { breakLine: true } },
    ],
    { x: 0.45, y: 3.82, w: 4.2, h: 1.3, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );
  s.addText("Source: aliexpress.com/item/1005003703374257", {
    x: 0.45, y: 5.0, w: 4.2, h: 0.15, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, margin: 0,
    hyperlink: { url: "https://www.aliexpress.com/item/1005003703374257.html" },
  });

  // SELECTED: 3D printed bracket (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 4.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("SELECTED: 3D Printed (Adapted Design)", { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addImage({ path: "images/photos/3dprint_bracket.png", x: 6.15, y: 1.75, w: 2.2, h: 1.8, rounding: true });

  s.addText(
    [
      { text: "Open-source MakerWorld design, adapted for the bin", options: { bold: true, breakLine: true } },
      { text: "- Already designed for MG996R servos, so no compatibility issues", options: { breakLine: true } },
      { text: "- Base can be modified in CAD to mount directly inside the bin enclosure", options: { breakLine: true } },
      { text: "- Cost is just filament (~$1-2), saving ~$34 compared to the premade kit", options: { breakLine: true } },
      { text: "- The existing design can be evaluated and adapted to suit the bin's needs", options: { breakLine: true } },
    ],
    { x: 5.25, y: 3.82, w: 4.3, h: 1.3, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );
  s.addText("Source: makerworld.com/en/models/973248", {
    x: 5.25, y: 5.0, w: 4.3, h: 0.15, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, margin: 0,
    hyperlink: { url: "https://makerworld.com/en/models/973248-pan-tilt-servo-antenna-tracker-mg996r#profileId-945437" },
  });

  addFooter(s, "Pan-Tilt Bracket Decision");
}

// ─────────────────────────────────────────────
// SLIDE 20: Servo Torque Verification
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Servo Torque Verification - MG996R", "Calculations");

  // Datasheet specs box (top left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.0, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.0, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("MG996R KEY SPECS (FROM DATASHEET)", { x: 0.3, y: 1.15, w: 4.0, h: 0.35, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addTable([
    [
      { text: "Spec", options: { bold: true, color: C.white, fill: { color: C.accent }, fontSize: 9 } },
      { text: "Value", options: { bold: true, color: C.white, fill: { color: C.accent }, fontSize: 9 } },
    ],
    ["Stall Torque (5V)", "About 10 kgf-cm"],
    ["Stall Torque (6V)", "11 kgf-cm"],
    ["Operating Voltage", "4.8V to 7.2V"],
    ["Weight", "55g"],
  ], {
    x: 0.45, y: 1.58, w: 3.7,
    border: { pt: 0.5, color: "C8E0CC" },
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    colW: [2.0, 1.7],
    rowH: 0.24,
  });

  // Datasheet link (below table, inside box)
  s.addText("Datasheet: handsontec.com/dataspecs/motor_fan/MG996R.pdf", {
    x: 0.45, y: 2.82, w: 3.7, h: 0.15, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, margin: 0,
    hyperlink: { url: "https://www.handsontec.com/dataspecs/motor_fan/MG996R.pdf" },
  });

  // What we need to lift (top right)
  s.addShape(pres.shapes.RECTANGLE, { x: 4.55, y: 1.15, w: 5.15, h: 1.85, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.55, y: 1.15, w: 5.15, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("WHAT THE SERVO NEEDS TO MOVE", { x: 4.55, y: 1.15, w: 5.15, h: 0.35, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "The servo tilts the sorting tray to drop items into the right bin section.", options: { breakLine: true } },
      { text: "- Heaviest item I'd expect: about 200g (a full drink can)", options: { breakLine: true } },
      { text: "- Tray weight (3D printed): about 50g", options: { breakLine: true } },
      { text: "- Total mass to move: 250g (0.25 kg)", options: { breakLine: true } },
      { text: "- Distance from servo to centre of tray: 5 cm (0.05 m)", options: { breakLine: true } },
    ],
    { x: 4.7, y: 1.55, w: 4.85, h: 1.4, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // Calculation box (full width, below)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.18, w: 9.4, h: 1.55, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.18, w: 9.4, h: 0.35, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("TORQUE CALCULATION", { x: 0.3, y: 3.18, w: 9.4, h: 0.35, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "1. Force of gravity on the tray:  F = m x g = 0.25 x 9.8 = 2.45 N", options: { breakLine: true } },
      { text: "2. Torque needed:  T = F x d = 2.45 x 0.05 = 0.12 Nm  (which is 1.25 kgf-cm)", options: { breakLine: true } },
      { text: "3. Servo can provide about 10 kgf-cm at 5V", options: { breakLine: true } },
      { text: "4. So the MG996R has about 8x more torque than I actually need", options: { breakLine: true } },
    ],
    { x: 0.5, y: 3.58, w: 9.0, h: 1.1, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 4, margin: 0 }
  );

  // Verdict box (bottom full width)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 9.4, h: 0.55, fill: { color: C.dark }, line: { color: C.dark }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 0.12, h: 0.55, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText([
    { text: "Verdict:  ", options: { bold: true, color: C.accent } },
    { text: "The MG996R is way more than strong enough. Even if someone puts a heavier item on the tray, the servo has plenty of margin and can tilt quickly for fast sorting.", options: { color: "D4EFDF" } },
  ], { x: 0.55, y: 4.85, w: 8.9, h: 0.55, fontSize: 10, fontFace: "Calibri", valign: "middle", margin: 0 });

  addFooter(s, "Servo Torque Verification");
}

// ─────────────────────────────────────────────
// SLIDE: IPO Diagrams
// ─────────────────────────────────────────────
{
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });

  const ipos = [
    {
      title: "1. ITEM DETECTION (HC-SR04 + ESP32)",
      input: "Ultrasonic pulse bounces off item on tray",
      process: "ESP32 measures time between sent and received pulse, calculates distance",
      output: "Distance reading sent to main loop - if below threshold, triggers camera capture",
    },
    {
      title: "2. AI CLASSIFICATION (ESP32-CAM + CLOUD VLM)",
      input: "Camera captures image of the waste item",
      process: "Image is sent over WiFi to a cloud VLM which analyses it",
      output: "Classification result returned: general, recycling, or compost with confidence score",
    },
    {
      title: "3. MECHANICAL SORTING (SERVO PAN-TILT)",
      input: "Classification result from AI (which bin category)",
      process: "ESP32 looks up the servo angle for that category and sends PWM signal to pan servo, then tilts",
      output: "Tray tips the item into the correct bin section, then returns to home position",
    },
    {
      title: "4. USER FEEDBACK (STATUS LED + DISPLAY)",
      input: "Sort outcome (category + success or fail) from the control loop",
      process: "Controller drives an RGB status LED and shows the chosen bin on a small display",
      output: "User sees clear confirmation their item was sorted correctly, reinforcing correct use",
    },
    {
      title: "5. FILL-LEVEL MONITORING (HC-SR04 PER BIN)",
      input: "Ultrasonic sensor in each compartment pings the waste surface",
      process: "Controller converts each echo time into a fill percentage for that compartment",
      output: "When a bin reaches full, sorting pauses and that bin is flagged to be emptied",
    },
    {
      title: "6. POWER MANAGEMENT (USB-C PD)",
      input: "Mains power supplied through a USB-C Power Delivery (PD) trigger board",
      process: "Board negotiates the 5V and 12V rails; a regulator feeds the logic and servos, idle triggers sleep mode",
      output: "Stable power to every subsystem while holding standby draw under the <15W target",
    },
  ];

  const perPage = 3;
  const pages = Math.ceil(ipos.length / perPage);
  for (let p = 0; p < pages; p++) {
    let s = pres.addSlide();
    s.background = { color: C.lightgray };
    addHeader(s, "Input - Process - Output Diagrams", "Subsystem IPO Diagrams (" + (p + 1) + " of " + pages + ")");

    ipos.slice(p * perPage, p * perPage + perPage).forEach((io, j) => {
      const labelY = 1.25 + j * 1.5;
      s.addText(io.title, { x: 0.3, y: labelY, w: 9.4, h: 0.26, fontSize: 9.5, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
      s.addTable([
        [hdr("Input"), hdr("Process"), hdr("Output")],
        [io.input, io.process, io.output],
      ], {
        x: 0.3, y: labelY + 0.28, w: 9.4,
        border: { pt: 0.5, color: "C8E0CC" },
        colW: [2.8, 3.8, 2.8],
        fill: { color: C.white },
        fontSize: 9.5, fontFace: "Calibri", color: C.text, valign: "middle",
        rowH: [0.28, 0.58],
      });
    });

    addFooter(s, "IPO Diagrams");
  }
}

// ─────────────────────────────────────────────
// SLIDE: Control System Flowchart (Closed Loop)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Control System Flowchart - Closed Loop", "Flow Diagram");

  const box = (x, w, y, t, h = 0.8) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.white }, line: { color: C.primary, width: 1.25 }, rectRadius: 0.08, shadow: mk() });
    s.addText(t, { x: x + 0.05, y, w: w - 0.1, h, fontSize: 9, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  };
  const arrowR = (x, y) => s.addShape(pres.shapes.LINE, { x, y, w: 0.35, h: 0, line: { color: C.primary, width: 1.75, endArrowType: "triangle" } });
  const arrowL = (x, y) => s.addShape(pres.shapes.LINE, { x, y, w: 0.35, h: 0, line: { color: C.primary, width: 1.75, endArrowType: "triangle" }, flipH: true });

  // top row (left to right)
  box(0.35, 1.95, 1.35, "START\nItem placed on tray");
  arrowR(2.3, 1.75);
  box(2.65, 1.95, 1.35, "HC-SR04 measures distance to tray");
  arrowR(4.6, 1.75);
  // decision diamond
  s.addShape(pres.shapes.DIAMOND, { x: 4.95, y: 1.2, w: 2.05, h: 1.1, fill: { color: C.lightgreen }, line: { color: C.primary, width: 1.25 } });
  s.addText("Item closer than 25 cm?", { x: 5.15, y: 1.2, w: 1.65, h: 1.1, fontSize: 8.5, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("YES", { x: 7.0, y: 1.45, w: 0.4, h: 0.25, fontSize: 8, bold: true, color: C.primary, fontFace: "Calibri", margin: 0 });
  arrowR(7.0, 1.75);
  box(7.35, 2.25, 1.35, "Camera takes a photo of the item");

  // NO loop back to the sensor box
  s.addShape(pres.shapes.LINE, { x: 5.97, y: 2.3, w: 0, h: 0.45, line: { color: C.gray, width: 1.25 } });
  s.addShape(pres.shapes.LINE, { x: 3.62, y: 2.75, w: 2.35, h: 0, line: { color: C.gray, width: 1.25 } });
  s.addShape(pres.shapes.LINE, { x: 3.62, y: 2.15, w: 0, h: 0.6, line: { color: C.gray, width: 1.25, endArrowType: "triangle" }, flipV: true });
  s.addText("NO - keep checking", { x: 4.35, y: 2.78, w: 1.6, h: 0.22, fontSize: 7.5, italic: true, color: C.gray, fontFace: "Calibri", margin: 0 });

  // down to bottom row
  s.addShape(pres.shapes.LINE, { x: 8.47, y: 2.15, w: 0, h: 1.35, line: { color: C.primary, width: 1.75, endArrowType: "triangle" } });

  // bottom row (right to left)
  box(7.35, 2.25, 3.5, "Photo sent over WiFi to the cloud VLM");
  arrowL(7.0, 3.9);
  box(4.95, 2.05, 3.5, "VLM replies with bin category (recycling / compost / general)");
  arrowL(4.6, 3.9);
  box(2.65, 1.95, 3.5, "Pan servo rotates tray to that section, tilt servo tips it");
  arrowL(2.3, 3.9);
  box(0.35, 1.95, 3.5, "Item drops in, tray returns to home position");

  // closed loop arrow back to start
  s.addShape(pres.shapes.LINE, { x: 1.32, y: 2.2, w: 0, h: 1.3, line: { color: C.accent, width: 1.75, endArrowType: "triangle" }, flipV: true });
  s.addText("closed\nloop", { x: 0.45, y: 2.55, w: 0.8, h: 0.55, fontSize: 8, italic: true, bold: true, color: C.primary, fontFace: "Calibri", align: "center", margin: 0 });

  // note box
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 4.55, w: 9.25, h: 0.75, fill: { color: C.lightgreen }, line: { color: C.accent } });
  s.addText(
    "This is a closed-loop system because the output feeds back to the start: after sorting, the sensor confirms the tray is empty again before the system goes back to waiting. If the VLM is not confident about the category, the item defaults to general waste so the recycling stream does not get contaminated.",
    { x: 0.5, y: 4.6, w: 8.95, h: 0.65, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 }
  );

  addFooter(s, "Control System Flowchart");
}

// ─────────────────────────────────────────────
// SLIDE: Control Software - Main Loop
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Control Software - Main Loop (Python)", "Programming");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 5.6, h: 4.2, fill: { color: C.dark }, line: { color: C.primary } });
  s.addText(
    [
      { text: "while True:", options: { breakLine: true } },
      { text: "    dist = read_distance()        # HC-SR04", options: { breakLine: true } },
      { text: "    if dist < 25:                 # item on tray", options: { breakLine: true } },
      { text: "        photo = camera.capture()", options: { breakLine: true } },
      { text: "        category = ask_vlm(photo) # cloud VLM", options: { breakLine: true } },
      { text: "        if category not in ANGLES:", options: { breakLine: true } },
      { text: '            category = "general"  # not sure', options: { breakLine: true } },
      { text: "        pan.angle(ANGLES[category])", options: { breakLine: true } },
      { text: "        time.sleep(0.5)           # let it move", options: { breakLine: true } },
      { text: "        tilt.angle(60)            # tip item in", options: { breakLine: true } },
      { text: "        time.sleep(1)", options: { breakLine: true } },
      { text: "        tilt.angle(0)             # back to flat", options: { breakLine: true } },
      { text: "        pan.angle(90)             # home position", options: { breakLine: true } },
    ],
    { x: 0.5, y: 1.35, w: 5.3, h: 3.9, fontSize: 10.5, color: "A8D5BA", fontFace: "Consolas", valign: "top", margin: 0 }
  );

  const notes = [
    ["Runs forever on the Pi", "The while True loop is the whole control system - it just keeps cycling: check sensor, classify, sort, reset."],
    ["ANGLES dictionary", "Maps each bin category to a pan servo angle, e.g. recycling = 45, compost = 90, general = 135. Found by testing and written down during calibration."],
    ["sleep() calls", "The servo needs real time to physically move. Without the sleep the tilt would start before the pan finished and the item would miss the section."],
    ["Default to general", "If the VLM reply doesn't match a known category the item goes to general waste. Wrong items in general waste are less of a problem than contaminating recycling."],
  ];
  notes.forEach((n, i) => {
    const y = 1.15 + i * 1.07;
    s.addShape(pres.shapes.RECTANGLE, { x: 6.1, y, w: 3.6, h: 0.97, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addText(n[0], { x: 6.25, y: y + 0.06, w: 3.3, h: 0.25, fontSize: 10, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
    s.addText(n[1], { x: 6.25, y: y + 0.32, w: 3.35, h: 0.62, fontSize: 8.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });
  });

  addFooter(s, "Control Software");
}

// ─────────────────────────────────────────────
// SLIDE 21: Design Iteration - AI Classification Approach
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Iteration - AI Classification Approach", "Key Decision");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("ORIGINAL APPROACH - Rejected", { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Custom YOLO Model + Jetson Nano / MaixCAM", { x: 0.45, y: 1.72, w: 4.2, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it would work:", options: { bold: true, breakLine: true } },
      { text: "Train a custom YOLO object detection model on waste images, deploy it on an edge AI board (Jetson Nano ~$200 or MaixCAM ~$80) for offline classification.", options: { breakLine: true } },
      { text: "\nWhy it was rejected:", options: { bold: true, breakLine: true } },
      { text: "- Cost: Edge AI boards are expensive ($80-$200+), pushing the build well over the ~$150 budget", options: { breakLine: true } },
      { text: "- Complexity: Training a custom YOLO model requires collecting and labelling thousands of images, which is time-consuming and difficult for a SAT timeline", options: { breakLine: true } },
      { text: "- Accuracy risk: A custom-trained model on limited data may not generalise well to real-world waste items", options: { breakLine: true } },
    ],
    { x: 0.45, y: 2.05, w: 4.2, h: 3.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("NEW APPROACH - Selected", { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("ESP32-CAM + Cloud VLM", { x: 5.25, y: 1.72, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "The ESP32-CAM captures an image of the waste item and sends it over WiFi to a cloud-hosted VLM (e.g. GPT-4o, Gemini, Llama Vision) which classifies the item and returns the bin category.", options: { breakLine: true } },
      { text: "\nWhy it was selected:", options: { bold: true, breakLine: true } },
      { text: "- Cost: ESP32-CAM module costs ~$8-$15, much cheaper than an edge AI board", options: { breakLine: true } },
      { text: "- No training required: Cloud VLMs are pre-trained and can classify any object out of the box", options: { breakLine: true } },
      { text: "- Accuracy: VLMs have strong general knowledge of waste types without needing custom data", options: { breakLine: true } },
      { text: "- Trade-off: Requires WiFi connection and has slight network latency (~1-2s)", options: { breakLine: true } },
    ],
    { x: 5.25, y: 2.05, w: 4.3, h: 3.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  addFooter(s, "Design Iteration - AI Classification Approach");
}

// ─────────────────────────────────────────────
// SLIDE 14: Component Comparison Table
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Component Comparison - Why ESP32-CAM + Cloud VLM", "");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 10 } });

  s.addTable([
    [hdr("Criteria"), hdr("YOLO + Jetson Nano"), hdr("YOLO + MaixCAM"), hdr("ESP32-CAM + Cloud VLM")],
    ["Approx. Cost",           "~$200+ AUD",       "~$80 AUD",          "~$10-15 AUD"],
    ["AI Model Training",      "Required (custom YOLO, thousands of labelled images)", "Required (custom YOLO, needs INT8 quantisation)", "Not required (pre-trained cloud model)"],
    ["Classification Accuracy","Depends on training data quality", "Depends on training data quality", "High -VLMs generalise well to everyday objects"],
    ["Offline Capable?",       "Yes",               "Yes",               "No -requires WiFi"],
    ["Latency",                "~50-200ms",          "~100-300ms",        "~1-2 seconds (network dependent)"],
    ["Power Draw",             "~5-10W",             "~2-3W",             "~0.5-1W (during capture)"],
    ["Ease of Setup",          "Moderate -Linux, CUDA, Python", "Moderate -MaixPy, model conversion", "Simple -Arduino Integrated Development Environment (IDE), Hypertext Transfer Protocol (HTTP) Application Programming Interface (API) call"],
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

  addFooter(s, "Component Comparison - Justification for ESP32-CAM + Cloud VLM");
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

  addFooter(s, "Component Testing - " + title.replace("Component Testing - ", ""));
}

// ─────────────────────────────────────────────
// SLIDE: HC-SR04 Sensor Subsystem Test
// ─────────────────────────────────────────────
addTestSlide(
  "Component Testing - HC-SR04 Ultrasonic Sensor Subsystem",
  "Subsystem Test 1 of 2",
  "Test the accuracy of the ultrasonic sensor across the range needed to detect items in the bin drop zone (10-30 cm).",
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
  "Component Testing - ESP32 Microcontroller Subsystem",
  "Subsystem Test 2 of 2",
  "Confirm the ESP32's General Purpose Input/Output (GPIO) pins, serial communication, and PWM output all work correctly for driving the servo and reading the sensor.",
  ["ESP32 DevKit", "Multimeter", "USB cable + laptop", "Arduino IDE / Serial Monitor", "LED + 330Ω resistor", "Jumper wires"],
  [
    "Flash a sketch that sets a GPIO pin HIGH, then measure the voltage",
    "Wire the Universal Asynchronous Receiver-Transmitter (UART) Transmit (TX) pin to Receive (RX) for a loopback test -send 100 messages and check for errors",
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

// ─────────────────────────────────────────────
// SLIDE: Prototype Build Incident
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Prototype Build Incident - Power Supply Failure", "Lessons Learned");

  // Top warning banner
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 9.4, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("COMPONENT FAILURE DURING INITIAL PROTOTYPE ASSEMBLY", { x: 0.3, y: 1.15, w: 9.4, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  // What happened box (left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.65, w: 3.35, h: 2.45, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.65, w: 3.35, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("WHAT HAPPENED", { x: 0.3, y: 1.65, w: 3.35, h: 0.35, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "A rough prototype was assembled on the bench to verify power delivery and basic servo control.", options: { breakLine: true } },
      { text: "\nThe USB-C PD trigger board uses 3 DIP switches to select output voltage (5V-20V). The switch diagram was checked, but misread - the switches were set to ", options: { breakLine: false } },
      { text: "20V", options: { bold: true, color: "C0392B" } },
      { text: " instead of ", options: { breakLine: false } },
      { text: "5V", options: { bold: true, color: C.accent } },
      { text: ".", options: { breakLine: true } },
      { text: "\nWhen power was applied, 20V hit both the ESP32 (5V input max) and the MG996R servo (rated 4.8V-7.2V).", options: { breakLine: true } },
    ],
    { x: 0.45, y: 2.05, w: 3.05, h: 2.0, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // DIP switch diagram (middle)
  s.addShape(pres.shapes.RECTANGLE, { x: 3.8, y: 1.65, w: 2.55, h: 2.45, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.8, y: 1.65, w: 2.55, h: 0.35, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("THE MISREAD DIAGRAM", { x: 3.8, y: 1.65, w: 2.55, h: 0.35, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: "images/diagrams/dip_switch_diagram.jpg", x: 4.16, y: 2.06, w: 1.83, h: 1.83 });
  s.addText("DIP switch voltage table from the product listing", {
    x: 3.9, y: 3.9, w: 2.35, h: 0.18, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, align: "center", margin: 0,
  });

  // Damage box (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.65, w: 3.2, h: 2.45, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.65, w: 3.2, h: 0.35, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("DAMAGED COMPONENTS", { x: 6.5, y: 1.65, w: 3.2, h: 0.35, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "ESP32 DevKit", options: { bold: true, breakLine: true } },
      { text: "- Voltage regulator and USB-UART bridge destroyed. Board no longer powers on or appears as a COM port.", options: { breakLine: true } },
      { text: "\nMG996R Servo", options: { bold: true, breakLine: true } },
      { text: "- Internal control board and potentiometer fried. Draws excessive current, ignores PWM.", options: { breakLine: true } },
      { text: "\nBoth components had to be reordered before testing could continue.", options: { breakLine: true } },
    ],
    { x: 6.65, y: 2.05, w: 2.9, h: 2.0, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // Lessons learned / next steps (bottom full width)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.2, w: 9.4, h: 0.95, fill: { color: C.dark }, line: { color: C.dark }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.2, w: 0.12, h: 0.95, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText(
    [
      { text: "Lesson learned:  ", options: { bold: true, color: C.accent } },
      { text: "Always verify output voltage with a multimeter before connecting sensitive electronics. The DIP switch settings on the USB-C PD board were misread. In future, the power rail will be checked with a multimeter before any components are connected.", options: { color: "D4EFDF" } },
      { text: "\n\nNext steps:  ", options: { bold: true, color: C.accent } },
      { text: "Order a replacement MG996R servo. Rather than buying another ESP32, the controller platform was reconsidered (next slide). The PD trigger board itself was unharmed and was reconfigured correctly to 5V.", options: { color: "D4EFDF" } },
    ],
    { x: 0.55, y: 4.24, w: 8.9, h: 0.88, fontSize: 9, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  addFooter(s, "Prototype Build Incident - Power Supply Failure");
}

// ─────────────────────────────────────────────
// SLIDE: Design Iteration - Controller Platform Swap
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Iteration - Controller Platform", "Key Decision");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("ORIGINAL APPROACH - Superseded", { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Dual ESP32 Setup (ESP32-CAM + ESP32 DevKit)", { x: 0.45, y: 1.7, w: 4.2, h: 0.28, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it worked:", options: { bold: true, breakLine: true } },
      { text: "An ESP32-CAM uploads images to the cloud VLM, while a separate ESP32 DevKit reads the HC-SR04 and drives the servos, coordinating over a serial link.", options: { breakLine: true } },
      { text: "\nWhy it was superseded:", options: { bold: true, breakLine: true } },
      { text: "- The ESP32-CAM's 2MP OV2640 gives low image quality, limiting accuracy", options: { breakLine: true } },
      { text: "- Coordinating two microcontrollers over serial added complexity and failure points", options: { breakLine: true } },
      { text: "- Limited memory made the HTTPS VLM API requests hard to implement reliably", options: { breakLine: true } },
      { text: "- The DevKit was destroyed in the power incident, so continuing meant a replacement anyway", options: { breakLine: true } },
    ],
    { x: 0.45, y: 1.98, w: 4.2, h: 1.9, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );
  s.addImage({ path: "images/hardware/esp32_cam.jpg", x: 0.6, y: 4.02, w: 1.32, h: 1.12 });
  s.addText(
    [
      { text: "ESP32-CAM (2MP OV2640)\n", options: { bold: true, color: C.primary } },
      { text: "The low-res onboard camera that capped classification accuracy.", options: { italic: true, color: C.gray } },
    ],
    { x: 2.1, y: 4.15, w: 2.55, h: 0.9, fontSize: 8.5, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("NEW APPROACH - Selected", { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Raspberry Pi 3B (Already Owned)", { x: 5.25, y: 1.72, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "A single Pi 3B runs the whole control loop in Python - reading the sensor, capturing webcam images, calling the VLM API, and driving the servos.", options: { breakLine: true } },
      { text: "\nWhy it was selected:", options: { bold: true, breakLine: true } },
      { text: "- Full Linux makes complex control code far easier to write and debug", options: { breakLine: true } },
      { text: "- Cheap USB webcams give far higher image quality than the 2MP OV2640", options: { breakLine: true } },
      { text: "- More GPIO with mature libraries for servo PWM, sensors and power control", options: { breakLine: true } },
      { text: "- Cost: $0 - reuses an old Pi 3B already owned, replacing two boards with one", options: { breakLine: true } },
      { text: "- Trade-off: ~2W idle draw, still well within the <15W standby parameter", options: { breakLine: true } },
    ],
    { x: 5.25, y: 2.02, w: 4.3, h: 1.75, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );
  s.addImage({ path: "images/hardware/pi_3b.jpg", x: 6.6, y: 3.92, w: 1.6, h: 1.15 });

  addFooter(s, "Design Iteration - Controller Platform");
}

// ─────────────────────────────────────────────
// SLIDE: Prototype Build - Pan-Tilt Assembly
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Prototype Build - Pan-Tilt Assembly", "Prototype");

  // Photo (left)
  s.addImage({ path: "images/photos/prototype_pantilt.jpg", x: 0.3, y: 1.18, w: 5.3, h: 4.0, rounding: true });

  // Description card (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.18, w: 3.95, h: 4.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.18, w: 3.95, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("FIRST WORKING PROTOTYPE", { x: 5.75, y: 1.18, w: 3.95, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText(
    [
      { text: "With replacement components installed, the sorting mechanism was assembled and bench tested.", options: { breakLine: true } },
      { text: "\nWhat the photo shows:", options: { bold: true, breakLine: true } },
      { text: "- The adapted 3D printed pan-tilt bracket, printed in silk PLA. The silk finish can reduce layer adhesion strength slightly, but for a prototype this is acceptable", options: { breakLine: true } },
      { text: "- Two MG996R servos - one in the base for pan, one in the bracket for tilt", options: { breakLine: true } },
      { text: "- The printed tray platform mounted on the tilt axis", options: { breakLine: true } },
      { text: "- Servo signal wires routed through a breadboard to the Raspberry Pi 3B for movement testing", options: { breakLine: true } },
      { text: "\nApplying the lesson from the power supply incident, the 5V rail was verified with a multimeter before any components were connected. The mechanism sweeps to all bin positions under software control.", options: { breakLine: true } },
    ],
    { x: 5.9, y: 1.7, w: 3.65, h: 3.4, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  addFooter(s, "Prototype Build - Pan-Tilt Assembly");
}

// ─────────────────────────────────────────────
// SLIDE: Prototype Wiring Diagram
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Prototype Wiring Diagram", "Prototype");

  // Wiring diagram (left) - 1600x870 source, keep aspect
  s.addImage({ path: "images/diagrams/wiring_diagram.png", x: 0.3, y: 1.74, w: 5.3, h: 2.88 });

  // Description card (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.18, w: 3.95, h: 4.0, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.18, w: 3.95, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("HOW THE PROTOTYPE IS WIRED", { x: 5.75, y: 1.18, w: 3.95, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText(
    [
      { text: "A single 5V rail powers everything:", options: { bold: true, breakLine: true } },
      { text: "- The USB-C PD trigger board (DIP switches set to 5V) feeds the breadboard power rails from a standard USB-C wall charger", options: { breakLine: true } },
      { text: "- The Pi 3B is powered from the rail through header pins 2 (5V) and 6 (GND)", options: { breakLine: true } },
      { text: "- Both MG996R servos take power directly from the rail - never from the Pi, which can't supply their stall current", options: { breakLine: true } },
      { text: "\nControl signals:", options: { bold: true, breakLine: true } },
      { text: "- Pan servo signal -> GPIO 17 (pin 11), tilt servo signal -> GPIO 27 (pin 13)", options: { breakLine: true } },
      { text: "- The pigpio library generates hardware-timed 50Hz PWM (500-2500 microsecond pulses), eliminating the servo jitter that software PWM caused", options: { breakLine: true } },
      { text: "\nA 1000 microfarad capacitor across the rails absorbs current spikes when the servos start moving, preventing the Pi from browning out. The shared GND rail gives the PWM signals a common reference.", options: { breakLine: true } },
    ],
    { x: 5.9, y: 1.7, w: 3.65, h: 3.4, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  addFooter(s, "Prototype Wiring Diagram");
}

// ─────────────────────────────────────────────
// SLIDE: Circuit Schematic
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.white };
  addHeader(s, "Circuit Schematic - Full System", "Schematic");

  const RED = "C0392B", BLK = "111111", GRN = "2E86C1"; // signal wires in blue so they stand out from GND
  const blk = (x, y, w, h, t) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.lightgray }, line: { color: BLK, width: 1.25 } });
    s.addText(t, { x: x + 0.05, y, w: w - 0.1, h: 0.45, fontSize: 9, bold: true, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  };
  const wire = (x, y, w, h, color, width = 1.5) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color, width } });
  const pin = (x, y, t, align = "left") => s.addText(t, { x, y, w: 1.15, h: 0.2, fontSize: 7.5, color: C.text, fontFace: "Consolas", align, margin: 0 });

  // power rails
  wire(0.7, 1.55, 8.9, 0, RED, 2);
  s.addText("+5V rail", { x: 8.6, y: 1.28, w: 1.0, h: 0.22, fontSize: 8.5, bold: true, color: RED, fontFace: "Calibri", margin: 0 });
  wire(0.7, 4.95, 8.9, 0, BLK, 2);
  s.addText("GND rail", { x: 8.6, y: 4.98, w: 1.0, h: 0.22, fontSize: 8.5, bold: true, color: BLK, fontFace: "Calibri", margin: 0 });

  // PSU
  blk(0.35, 2.55, 1.55, 1.15, "USB-C PD trigger board (5V 3A)");
  wire(0.85, 1.55, 0, 1.0, RED);
  wire(1.4, 3.7, 0, 1.25, BLK);
  pin(0.9, 2.32, "+5V");
  pin(1.45, 3.72, "GND");

  // 1000uF cap across the rails
  wire(2.35, 1.55, 0, 1.5, RED);
  wire(2.2, 3.05, 0.3, 0, BLK, 2);
  wire(2.2, 3.2, 0.3, 0, BLK, 2);
  wire(2.35, 3.2, 0, 1.75, BLK);
  s.addText("1000uF", { x: 2.05, y: 3.35, w: 0.85, h: 0.2, fontSize: 7.5, color: C.text, fontFace: "Consolas", margin: 0 });

  // Raspberry Pi
  blk(2.9, 2.25, 1.75, 2.05, "Raspberry Pi 3B");
  wire(3.3, 1.55, 0, 0.7, RED);
  pin(3.35, 1.75, "pin 2 (5V)");
  wire(4.2, 4.3, 0, 0.65, BLK);
  pin(4.25, 4.35, "pin 6");
  pin(3.5, 2.85, "GPIO23", "left");
  pin(3.5, 3.1, "GPIO24", "left");
  pin(3.5, 3.5, "GPIO17", "left");
  pin(3.5, 3.85, "GPIO27", "left");

  // HC-SR04
  blk(5.75, 2.4, 1.5, 1.1, "HC-SR04");
  wire(6.1, 1.55, 0, 0.85, RED);
  pin(6.15, 1.75, "VCC");
  wire(6.95, 3.5, 0, 1.45, BLK);
  pin(7.0, 3.55, "GND");
  // Trig (Pi GPIO23 -> Trig)
  wire(4.65, 2.95, 1.1, 0, GRN);
  pin(4.85, 2.72, "Trig");
  // Echo through voltage divider
  wire(5.4, 3.2, 0.35, 0, GRN);
  s.addShape(pres.shapes.RECTANGLE, { x: 4.95, y: 3.09, w: 0.45, h: 0.22, fill: { color: C.white }, line: { color: BLK, width: 1 } });
  s.addText("1k", { x: 4.95, y: 3.09, w: 0.45, h: 0.22, fontSize: 7, color: C.text, fontFace: "Consolas", align: "center", valign: "middle", margin: 0 });
  wire(4.65, 3.2, 0.3, 0, GRN);
  wire(5.5, 3.2, 0, 1.0, BLK); // junction down to 2k
  s.addShape(pres.shapes.RECTANGLE, { x: 5.28, y: 4.2, w: 0.45, h: 0.22, fill: { color: C.white }, line: { color: BLK, width: 1 } });
  s.addText("2k", { x: 5.28, y: 4.2, w: 0.45, h: 0.22, fontSize: 7, color: C.text, fontFace: "Consolas", align: "center", valign: "middle", margin: 0 });
  wire(5.5, 4.42, 0, 0.53, BLK);
  pin(4.95, 3.33, "Echo");

  // Servos
  blk(7.7, 2.1, 1.75, 0.85, "Servo 1: MG996R (pan)");
  blk(7.7, 3.45, 1.75, 0.85, "Servo 2: MG996R (tilt)");
  wire(8.3, 1.55, 0, 0.55, RED);
  pin(8.35, 1.72, "V+");
  // servo 2 V+ drops down the gap between the sensor and the servos
  wire(7.6, 1.55, 0, 2.0, RED);
  wire(7.6, 3.55, 0.1, 0, RED);
  pin(7.65, 1.75, "V+");
  // servo 1 GND routed around servo 2 to the GND rail
  wire(9.2, 2.95, 0, 0.2, BLK);
  wire(9.2, 3.15, 0.35, 0, BLK);
  wire(9.55, 3.15, 0, 1.8, BLK);
  wire(9.2, 4.3, 0, 0.65, BLK);
  pin(8.9, 2.98, "GND");
  // signal wires with elbows
  wire(4.65, 3.6, 2.85, 0, GRN);
  wire(7.5, 2.5, 0, 1.1, GRN);
  wire(7.5, 2.5, 0.2, 0, GRN);
  pin(6.0, 3.62, "pan PWM");
  wire(4.65, 3.95, 2.85, 0, GRN);
  wire(7.5, 3.85, 0, 0.1, GRN);
  wire(7.5, 3.85, 0.2, 0, GRN);
  pin(6.0, 3.97, "tilt PWM");

  // USB webcam (powered over USB, no GPIO)
  blk(0.35, 4.05, 1.0, 0.6, "USB webcam");
  wire(1.35, 4.2, 1.55, 0, GRN);
  pin(2.35, 3.97, "USB");

  // legend + note
  wire(0.4, 5.32, 0.35, 0, RED, 2);
  s.addText("5V", { x: 0.8, y: 5.22, w: 0.4, h: 0.2, fontSize: 8, color: C.text, fontFace: "Calibri", margin: 0 });
  wire(1.25, 5.32, 0.35, 0, BLK, 2);
  s.addText("GND", { x: 1.65, y: 5.22, w: 0.5, h: 0.2, fontSize: 8, color: C.text, fontFace: "Calibri", margin: 0 });
  wire(2.2, 5.32, 0.35, 0, GRN, 2);
  s.addText("signal", { x: 2.6, y: 5.22, w: 0.6, h: 0.2, fontSize: 8, color: C.text, fontFace: "Calibri", margin: 0 });

  s.addText(
    "Unlike the wiring diagram on the previous slide (which shows how the prototype is physically laid out on the breadboard), this schematic shows the complete system circuit including the HC-SR04, which is not wired into the prototype yet. The HC-SR04 Echo pin outputs 5V but the Pi GPIO pins are only 3.3V tolerant, so a 1k/2k voltage divider drops Echo down to ~3.3V.",
    { x: 3.4, y: 5.12, w: 6.3, h: 0.5, fontSize: 8, italic: true, color: C.gray, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  addFooter(s, "Circuit Schematic");
}

// ─────────────────────────────────────────────
// SLIDE: Web Dashboard - Control Interface
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Web Dashboard - Control Interface", "Prototype");

  // Screenshot (left) - 1903x1999 source, keep aspect
  const dImgH = 4.15, dImgW = dImgH * (1903 / 1999); // ~3.95
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: dImgW + 0.06, h: dImgH + 0.06, fill: { color: C.white }, line: { color: "D1E8D9" } });
  s.addImage({ path: "images/screens/dashboard.png", x: 0.33, y: 1.15, w: dImgW, h: dImgH });
  s.addText("Screenshot taken in development mode on a laptop, so the camera panel is blank (no webcam attached).", {
    x: 0.3, y: 5.3, w: dImgW + 0.06, h: 0.28, fontSize: 7.5, italic: true, color: C.gray, fontFace: "Calibri", align: "center", valign: "top", margin: 0,
  });

  // Description card (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 4.5, y: 1.12, w: 5.2, h: 4.15, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.5, y: 1.12, w: 5.2, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("BROWSER-BASED CONTROL & MONITORING", { x: 4.5, y: 1.12, w: 5.2, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText(
    [
      { text: "The Raspberry Pi runs a Flask web server, so the whole system is controlled from one page in any browser on the same network. No screen or keyboard is plugged into the Pi itself.", options: { breakLine: true } },
      { text: "\nWhat the dashboard does:", options: { bold: true, color: C.primary, breakLine: true } },
      { text: "- Live camera view with Snap & Sort, which runs the full capture, classify and sort pipeline in one click", options: { breakLine: true } },
      { text: "- Servo control: drag the XY pad or use the sliders, keyboard or a gamepad to move the pan and tilt head", options: { breakLine: true } },
      { text: "- Sort-to-bin buttons and a calibration tab to set each bin's position without changing any code", options: { breakLine: true } },
      { text: "- Activity log and stats: every sort is saved to a database with its category and confidence score", options: { breakLine: true } },
      { text: "- Provider settings to switch between cloud AI models (OpenRouter, OpenAI, Gemini) or a local one", options: { breakLine: true } },
    ],
    { x: 4.68, y: 1.68, w: 4.85, h: 3.5, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 2, margin: 0 }
  );

  addFooter(s, "Web Dashboard - Control Interface");
}

// ═════════════════════════════════════════════
// CRITERION 3
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// SLIDE: Criterion 3 Divider
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText("Criterion 3:", { x: 0.5, y: 1.2, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Work Plan & Risk Management", { x: 0.5, y: 2.25, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("Budget, Project Schedule, Milestones & Safety Assessment", { x: 0.5, y: 2.8, w: 9, h: 0.4, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// SLIDE: Parts List & Budget
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Parts List & Budget", "Criterion 3");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });

  s.addTable([
    [hdr("Part"), hdr("Qty"), hdr("Source"), hdr("Cost (AUD)")],
    ["Raspberry Pi 3B", "1", "Already owned (desk drawer)", "$0"],
    ["USB webcam (720p)", "1", "Already owned (from my PC)", "$0"],
    ["HC-SR04 ultrasonic sensor", "1", "AliExpress", "$3"],
    ["MG996R servo", "2", "AliExpress", "$18"],
    ["USB-C PD trigger board", "1", "AliExpress", "$6"],
    ["PLA filament for bracket + tray (~250 g)", "1", "Home 3D printer", "$8"],
    ["Breadboard + jumper wires kit", "1", "AliExpress", "$9"],
    ["1k / 2k resistors + 1000uF capacitor", "-", "AliExpress", "$0"],
    ["M3 screws and nuts", "1 pack", "Bunnings", "$6"],
    ["60 L bin + corflute partitions", "1", "Bunnings (still to buy)", "$32"],
    [
      { text: "TOTAL", options: { bold: true, fill: { color: C.lightgreen } } },
      { text: "", options: { fill: { color: C.lightgreen } } },
      { text: "", options: { fill: { color: C.lightgreen } } },
      { text: "$82", options: { bold: true, fill: { color: C.lightgreen } } },
    ],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [3.7, 0.8, 3.0, 1.9],
    fill: { color: C.white },
    fontSize: 9.5,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.3,
  });

  s.addText(
    "I set a ~$150 budget back in Section 4 and came in at $82, so I've got about $68 left if a print fails or I wreck a servo. The only things I still need to buy are the bin and the corflute partitions, I already have everything else. The cloud AI calls work out to about $0.002 a photo so I'm not really counting those.",
    { x: 0.3, y: 4.95, w: 9.4, h: 0.5, fontSize: 9.5, italic: true, color: C.gray, fontFace: "Calibri", valign: "top", margin: 0 }
  );

  addFooter(s, "Criterion 3 - Parts List & Budget");
}

// ─────────────────────────────────────────────
// SLIDE: Project Schedule & Milestones (Gantt)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Project Schedule & Milestones", "Criterion 3");

  // Gantt chart image (authored in GanttProject, rendered to PNG)
  s.addImage({ path: "images/diagrams/AI_Smart_Bin_Gantt.png", x: 0.3, y: 1.02, w: 5.29, h: 4.3 });

  // Right column - reading guide
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.02, w: 3.95, h: 2.45, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 1.02, w: 3.95, h: 0.38, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("READING THE CHART", { x: 5.75, y: 1.02, w: 3.95, h: 0.38, fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "The whole SAT mapped across its four assessment criteria.\n", options: { breakLine: true } },
    { text: "Solid green", options: { bold: true, color: "1A7A3A" } },
    { text: " = completed work (Criteria 1-3 and the prototype build).\n", options: { breakLine: true } },
    { text: "Dashed green", options: { bold: true, color: "9A7D0A" } },
    { text: " = outstanding testing and evaluation.\n", options: { breakLine: true } },
    { text: "Red dashed line", options: { bold: true, color: "C0392B" } },
    { text: " = today's date.   ", options: {} },
    { text: "Black diamonds", options: { bold: true, color: C.dark } },
    { text: " = phase milestones.", options: {} },
  ], { x: 5.92, y: 1.5, w: 3.6, h: 1.85, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 3 });

  // Right column - attribution note
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 3.62, w: 3.95, h: 1.7, fill: { color: C.lightgreen }, line: { color: C.accent } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 3.62, w: 3.95, h: 0.38, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("ABOUT THIS SCHEDULE", { x: 5.75, y: 3.62, w: 3.95, h: 0.38, fontSize: 10, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "Written in ", options: {} },
    { text: "GanttProject", options: { bold: true, color: C.primary } },
    { text: " (", options: {} },
    { text: "ganttproject.biz", options: { color: C.primary, underline: true, hyperlink: { url: "https://www.ganttproject.biz" } } },
    { text: "), then exported and converted to this PNG using AI.\n\n", options: { breakLine: true } },
    { text: "Note: ", options: { bold: true, color: "9A7D0A" } },
    { text: "the chart was made after the project had already started, so the dates are estimates worked back from what I did, not a plan locked in on day one.", options: {} },
  ], { x: 5.92, y: 4.06, w: 3.62, h: 1.2, fontSize: 9, color: C.text, fontFace: "Calibri", valign: "top", margin: 0 });

  addFooter(s, "Criterion 3 - Project Schedule");
}

// ─────────────────────────────────────────────
// SLIDE: Safety & Risk Assessment - Hierarchy of Control
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Safety & Risk Assessment - Hierarchy of Control", "Criterion 3");

  // Hierarchy of control strip (most to least effective)
  const levels = ["Elimination", "Substitution", "Isolation", "Engineering", "Administrative", "PPE"];
  const lvlW = 9.4 / levels.length;
  levels.forEach((lvl, i) => {
    const cx = 0.3 + i * lvlW;
    s.addShape(pres.shapes.RECTANGLE, { x: cx + 0.03, y: 1.12, w: lvlW - 0.06, h: 0.4, fill: { color: C.primary }, line: { color: C.primary } });
    s.addText(lvl, { x: cx + 0.03, y: 1.12, w: lvlW - 0.06, h: 0.4, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  });
  s.addText("Most effective", { x: 0.3, y: 1.54, w: 3, h: 0.2, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, align: "left", margin: 0 });
  s.addText("Least effective", { x: 6.7, y: 1.54, w: 3, h: 0.2, fontSize: 7.5, color: C.gray, fontFace: "Calibri", italic: true, align: "right", margin: 0 });

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });

  s.addTable([
    [hdr("Hazard"), hdr("Risk"), hdr("Control Measure"), hdr("Hierarchy Level")],
    ["Mains electricity", "Electric shock during use or assembly", "The system runs entirely on low-voltage DC from a certified USB-C charger - no mains wiring is built or handled.", "Elimination"],
    ["3D printer hot end and bed (200°C+)", "Burns when removing or adjusting prints", "The printer's enclosure keeps hands away from hot parts; prints are only removed after the bed has cooled.", "Isolation"],
    ["Soldering iron", "Burns and inhalation of flux fumes", "Soldering is done in a ventilated area with fume extraction, and the iron is always returned to its stand.", "Engineering"],
    ["Servo pinch points", "Finger entrapment in the moving tray mechanism", "All moving parts are enclosed inside the bin housing so users cannot reach them during operation.", "Engineering"],
    ["Incorrect supply voltage", "Component damage and overheating (as occurred in the 20V incident)", "Written procedure: the power rail voltage is verified with a multimeter before any component is connected.", "Administrative"],
    ["Craft knife and hand tools", "Cuts while trimming 3D print supports", "Cutting is done away from the body on a cutting mat, with safety glasses worn when snipping supports.", "Administrative + PPE"],
  ], {
    x: 0.3, y: 1.82, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [1.5, 2.2, 4.1, 1.6],
    fill: { color: C.white },
    fontSize: 9,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    rowH: 0.5,
  });

  addFooter(s, "Criterion 3 - Safety & Risk Assessment");
}

// ═════════════════════════════════════════════
// CRITERION 4
// ═════════════════════════════════════════════

// ─────────────────────────────────────────────
// SLIDE: Criterion 4 Divider
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText("Criterion 4:", { x: 0.5, y: 1.2, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Testing & Evaluation", { x: 0.5, y: 2.25, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("Testing Against the Evaluation Criteria, Honest Evaluation & Recommendations", { x: 0.5, y: 2.8, w: 9, h: 0.4, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// SLIDE: Testing Against Evaluation Criteria
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Testing Against Evaluation Criteria", "Criterion 4");

  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9.5 } });
  const met = (t) => ({ text: t, options: { bold: true, color: "1A7A3A", fontSize: 8.5 } });
  const part = (t) => ({ text: t, options: { bold: true, color: "9A7D0A", fontSize: 8.5 } });
  const todo = (t) => ({ text: t, options: { bold: true, color: "922B21", fontSize: 8.5 } });

  s.addTable([
    [hdr("Evaluation Criterion"), hdr("Target"), hdr("How Tested"), hdr("Status at Submission")],
    ["Classify & sort waste accurately", "> 90% correct", "Drop 50 items, count correct", todo("NOT TESTED - 50-item run outstanding")],
    ["Process & sort quickly", "< 3 s", "Stopwatch: item -> tray home", part("PARTIAL - tilt ~1 s; full pipeline not yet timed")],
    ["Operate quietly", "< 50 dB @ 1 m", "Decibel meter 1 m away", todo("NOT TESTED - no meter reading yet")],
    ["Low standby power", "< 15 W", "Multimeter on input, idle", part("ESTIMATED - Pi idle ~2 W (spec); not measured")],
    ["Safe: low voltage, enclosed", "< 12 V DC, no exposed parts", "Multimeter + visual check", met("MET BY DESIGN - 5-12 V; enclosure to finish")],
    ["Fit a standard bin footprint", "60 L envelope", "Measure unit in the bin", todo("NOT VERIFIED - bin not bought; sized to fit")],
    ["Affordable to build", "< $150 AUD", "Sum the bill of materials", met("MET - $82 total")],
  ], {
    x: 0.3, y: 1.15, w: 9.4,
    border: { pt: 0.5, color: "C8E0CC" },
    colW: [2.3, 1.5, 2.5, 3.1],
    fill: { color: C.white },
    fontSize: 8.5, fontFace: "Calibri", color: C.text, valign: "middle", rowH: 0.42,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 5.0, w: 9.4, h: 0.48, fill: { color: C.lightgreen }, line: { color: C.accent } });
  s.addText([
    { text: "Summary:  ", options: { bold: true, color: C.primary } },
    { text: "The project reached working-prototype stage. 2 criteria met (cost, safety by design), 2 partly evidenced (sort time, standby power), 3 still to test (accuracy, noise, physical fit). Completing the enclosure and running the full-system tests is the main remaining work.", options: { color: C.text } },
  ], { x: 0.45, y: 5.03, w: 9.1, h: 0.42, fontSize: 9, fontFace: "Calibri", valign: "middle", margin: 0 });

  addFooter(s, "Criterion 4 - Testing Against Evaluation Criteria");
}

// ─────────────────────────────────────────────
// SLIDE: Evaluation & Recommendations
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Evaluation & Recommendations", "Criterion 4");

  const cards = [
    { title: "WHAT WAS ACHIEVED", col: C.primary, body: "- Defined the ethical problem with data (13.3% contamination) and a full design brief, parameters and evaluation criteria\n- Researched existing systems and subsystems (Ameru, Bin-e, Oscar Sort)\n- Generated three whole-system concepts and justified selecting the pan-tilt tray\n- Selected and justified every component; verified MG996R torque by calculation\n- Built a working pan-tilt prototype with wiring and circuit diagrams\n- Came in well under budget ($82 of $150)" },
    { title: "NOT COMPLETED", col: "9A7D0A", body: "- The system was not fully integrated into a finished, enclosed unit\n- Full-system tests (accuracy, noise, standby power, physical fit) were not run\n- The 60 L bin and partitions were not yet purchased\n- A power-supply incident destroyed the ESP32 DevKit and forced a mid-project swap to a Raspberry Pi 3B\n- Work stayed at prototype stage, so integration and testing are the outstanding steps" },
    { title: "RECOMMENDATIONS / NEXT STEPS", col: C.dark, body: "- Finish the enclosure and mount the mechanism inside a 60 L bin\n- Run the 50-item accuracy test; measure noise and standby power with instruments\n- Add fill-level sensing and user status feedback (from the IPO plan)\n- Trial a higher-resolution camera to lift classification accuracy\n- Re-test against all seven criteria once assembled" },
  ];

  cards.forEach((c, i) => {
    const cx = 0.3 + i * 3.16;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.12, w: 3.0, h: 3.35, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.12, w: 3.0, h: 0.42, fill: { color: c.col }, line: { color: c.col } });
    s.addText(c.title, { x: cx + 0.1, y: 1.12, w: 2.8, h: 0.42, fontSize: 9.5, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
    s.addText(c.body, { x: cx + 0.14, y: 1.62, w: 2.72, h: 2.75, fontSize: 8.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0, paraSpaceAfter: 2 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.6, w: 9.4, h: 0.82, fill: { color: C.dark }, line: { color: C.dark }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.6, w: 0.12, h: 0.82, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText([
    { text: "Conclusion:  ", options: { bold: true, color: C.accent } },
    { text: "The prototype shows the concept is feasible - AI classification paired with a simple servo pan-tilt can sort waste at the point of disposal. It does not yet prove every measurable target, but the design, planning and partial build give a clear, well-justified path to a system that would address recycling contamination. The outstanding tests are the main work left.", options: { color: "D4EFDF", italic: true } },
  ], { x: 0.55, y: 4.64, w: 8.95, h: 0.74, fontSize: 9.5, fontFace: "Calibri", valign: "middle", margin: 0 });

  addFooter(s, "Criterion 4 - Evaluation & Recommendations");
}

// ─────────────────────────────────────────────
// SLIDE 18: References
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "References", "");

  const refs = [
    "Ameru (2024). Ameru Smart Bin - AI-Powered Waste Management Solution. https://www.ameru.ai/",
    "Ameru (2024). Get a Quote - Smart Bin Pricing. https://www.ameru.ai/buy",
    "Bin-e (2024). Bin-e Smart Waste Bin. https://www.bine.world/",
    "DCCEEW (2022). National Waste Report 2022. https://www.dcceew.gov.au/environment/protection/waste/national-waste-reports/2022",
    "Elec Freaks / SparkFun (n.d.). HC-SR04 Ultrasonic Ranging Module Datasheet. https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf",
    "EPA Victoria (2023). Electronic Waste. https://www.epa.vic.gov.au/for-business/find-a-topic/e-waste",
    "Espressif (n.d.). ESP32-CAM Product Page. https://www.espressif.com/en/products/devkits",
    "Intuitive AI (2024). Oscar Sort - AI Recycling Assistant. https://intuitiveai.ca/oscar-sort",
    "Standards Australia (2018). AS/NZS 3000:2018 - Electrical Installations (Wiring Rules). https://www.standards.org.au/",
    "Sustainability Victoria (2020). Victoria's Kerbside Waste Data. https://www.sustainability.vic.gov.au/research-data-and-insights/waste-data/interactive-waste-data/victorias-kerbside-waste-data",
    "TowerPro (n.d.). MG996R Servo Motor Datasheet. https://www.towerpro.com.tw/product/mg996r/",
    "United Nations (2015). Transforming Our World: The 2030 Agenda for Sustainable Development (The 17 Sustainable Development Goals). https://sdgs.un.org/goals",
    "WHO (1999). Guidelines for Community Noise. https://www.who.int/publications/i/item/a68672",
  ];

  s.addText(
    refs.map(r => ({ text: r, options: { bullet: true, breakLine: true } })),
    { x: 0.4, y: 1.15, w: 9.2, h: 4.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 6, margin: 0 }
  );

  addFooter(s, "References");
}

pres.writeFile({ fileName: "AI_Smart_Bin.pptx" })
  .then(() => console.log("Done! -> AI_Smart_Bin.pptx"))
  .catch(e => console.error(e));
