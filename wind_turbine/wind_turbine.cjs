const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Small-Scale Wind Turbine Generator - VCE Systems Engineering SAT";

const C = {
  dark: "0B2E33",
  panel: "184A47",
  teal: "028090",
  sea: "00A896",
  mint: "02C39A",
  light: "F4F7F6",
  border: "DDE6E4",
  text: "16302E",
  muted: "5B7370",
  white: "FFFFFF",
  tint: "EAF5F2",
  amber: "9A7D0A",
  red: "922B21",
  green: "1A7A3A",
};

const HEAD = "Cambria";
const BODY = "Calibri";
const M = 0.6;            // page margin
const W = 12.13;          // content width
const IMG = (n) => "images/" + n;

let pageNo = 0;
const _add = pres.addSlide.bind(pres);
pres.addSlide = function (...a) {
  const s = _add(...a);
  pageNo += 1;
  return s;
};

function chrome(s) {
  s.addText("VCE Systems Engineering  |  School-assessed Task", {
    x: 0.5, y: 7.12, w: 8, h: 0.3, fontSize: 9, color: C.muted, fontFace: BODY,
    valign: "middle", margin: 0,
  });
  s.addText(String(pageNo), {
    x: 12.3, y: 7.12, w: 0.5, h: 0.3, fontSize: 9, color: C.muted, fontFace: BODY,
    align: "right", valign: "middle", margin: 0,
  });
}

// Title on the left, criterion tag set quietly on the same baseline at the right.
function header(s, eyebrow, title) {
  s.background = { color: C.light };
  s.addText(title, {
    x: M, y: 0.5, w: 8.6, h: 0.8, fontSize: 31, bold: true, color: C.dark,
    fontFace: HEAD, valign: "middle", margin: 0,
  });
  s.addText(eyebrow.toUpperCase(), {
    x: 8.0, y: 0.62, w: W - 7.4, h: 0.56, fontSize: 10, color: C.muted,
    fontFace: BODY, charSpacing: 1.4, align: "right", valign: "middle", margin: 0,
  });
  chrome(s);
}

// Plain panel. The heading sits inside on a numbered badge, which is the same
// device the technical drawings use, rather than a coloured bar across the top.
function panel(s, x, y, w, h, heading, badge, badgeColor) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.white }, line: { color: C.border, width: 1 },
  });
  if (heading) {
    if (badge) {
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.26, y: y + 0.28, w: 0.36, h: 0.36,
        fill: { color: badgeColor || C.teal }, line: { color: badgeColor || C.teal },
      });
      s.addText(String(badge), {
        x: x + 0.26, y: y + 0.28, w: 0.36, h: 0.36, fontSize: 11, bold: true,
        color: C.white, fontFace: BODY, align: "center", valign: "middle", margin: 0,
      });
    }
    s.addText(heading, {
      x: x + (badge ? 0.76 : 0.28), y: y + 0.24, w: w - (badge ? 1.0 : 0.56), h: 0.44,
      fontSize: 14, bold: true, color: C.dark, fontFace: HEAD, valign: "middle", margin: 0,
    });
  }
}

// Quiet note block: tinted panel, bold lead-in, no dark slab.
function note(s, x, y, w, h, lead, body) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.tint }, line: { color: "BFE3DA", width: 1 },
  });
  s.addText([
    { text: lead + "  ", options: { bold: true, color: C.teal } },
    { text: body, options: { color: C.text } },
  ], { x: x + 0.28, y, w: w - 0.56, h, fontSize: 11, fontFace: BODY, valign: "middle", margin: 0 });
}

function bullets(s, items, opts) {
  s.addText(
    items.map((t, i) => ({
      text: t,
      options: { bullet: { code: "2022" }, breakLine: i < items.length - 1 },
    })),
    Object.assign({
      fontSize: 12, color: C.text, fontFace: BODY, valign: "top",
      paraSpaceAfter: 8, margin: 0,
    }, opts)
  );
}

// Datasheet-style table: dark header, horizontal rules only, no vertical lines.
const th = (t, size) => ({
  text: t,
  options: { bold: true, color: C.white, fill: { color: C.dark }, fontSize: size || 10.5 },
});

const RULES = [
  { pt: 0.75, color: "D6E4E1" }, // top
  { type: "none" },              // right
  { pt: 0.75, color: "D6E4E1" }, // bottom
  { type: "none" },              // left
];

// rowH applies to the header row too, so heights are always given per row:
// a compact header followed by evenly sized body rows.
const rows = (head, body, n) => [head, ...Array(n).fill(body)];

function table(s, rows_, opts) {
  s.addTable(rows_, Object.assign({
    border: RULES,
    fill: { color: C.white },
    fontSize: 10.5,
    fontFace: BODY,
    color: C.text,
    valign: "middle",
  }, opts));
}

// ── 1 ── Title ────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  s.addImage({ path: IMG("turbine_mark.png"), x: 9.55, y: 1.35, w: 2.9, h: 4.45 });

  s.addText("SMALL-SCALE WIND\nTURBINE GENERATOR", {
    x: 0.75, y: 2.05, w: 8.4, h: 1.9, fontSize: 42, bold: true, color: C.white,
    fontFace: HEAD, lineSpacing: 44, valign: "bottom", margin: 0,
  });
  s.addText(
    "An integrated and controlled system that pairs a mechanical gear train with an electronic controller, so the electricity it generates is stored, used, or safely shed.",
    { x: 0.75, y: 4.05, w: 8.3, h: 0.9, fontSize: 15, color: "CFE8E5", fontFace: BODY, margin: 0 }
  );
  s.addText("VCE SYSTEMS ENGINEERING  |  SCHOOL-ASSESSED TASK 2026", {
    x: 0.75, y: 6.42, w: 9, h: 0.35, fontSize: 12, bold: true, color: C.mint,
    fontFace: BODY, charSpacing: 1.2, margin: 0,
  });
  s.addText("Sifan  |  Unit 3 and 4 Systems Engineering", {
    x: 0.75, y: 6.8, w: 9, h: 0.32, fontSize: 12, color: "9FC6C2", fontFace: BODY, margin: 0,
  });
}

// ── 2 ── Problem and ethical consideration ────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 1  |  Investigating and defining a problem",
    "The problem and the ethical consideration");

  panel(s, M, 1.7, 8.1, 5.15, "The problem this system responds to", 1);
  s.addText(
    "Rural blocks and outer-suburban properties in Victoria often sit on land with steady wind, yet almost all of the wind generation in Australia is locked up in commercial wind farms. A household that wants to offset part of its own consumption has no realistic small-scale option: packaged micro-turbines are expensive, and a bare generator on a pole produces electricity that nobody can control or store safely.",
    { x: M + 0.28, y: 2.32, w: 7.55, h: 1.3, fontSize: 12.5, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
  s.addShape(pres.shapes.OVAL, {
    x: M + 0.26, y: 3.78, w: 0.36, h: 0.36, fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("2", {
    x: M + 0.26, y: 3.78, w: 0.36, h: 0.36, fontSize: 11, bold: true, color: C.white,
    fontFace: BODY, align: "center", valign: "middle", margin: 0,
  });
  s.addText("Ethical consideration: environmental sustainability", {
    x: M + 0.76, y: 3.74, w: 7.1, h: 0.44, fontSize: 14, bold: true, color: C.dark,
    fontFace: HEAD, valign: "middle", margin: 0,
  });
  s.addText(
    "Generating electricity from wind instead of fossil fuel reduces the carbon released for every kilowatt hour a household uses. The obligation is not only to generate cleanly, though. A system that wastes materials, cannot be repaired, or ends up in landfill after a season shifts the harm rather than removing it. This design is therefore judged on three sustainability grounds at once:",
    { x: M + 0.28, y: 4.24, w: 7.55, h: 1.05, fontSize: 12.5, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
  bullets(s, [
    "Clean generation: displaces grid electricity that is still partly fossil fuelled",
    "Low-waste manufacture: printed parts, standard fasteners, no adhesives that block repair",
    "Controlled use: surplus is stored or shed deliberately, never dumped into an unprotected battery",
  ], { x: M + 0.4, y: 5.35, w: 7.4, h: 1.4, fontSize: 11.5 });

  // Figures set as open type on the page rather than in filled tiles.
  const stats = [
    ["Close to 40%", "of Australia's electricity came from renewable sources in 2023 (Clean Energy Council, 2024)"],
    ["25 W", "target electrical output from this system in a 6 m/s wind"],
    ["$180", "budget ceiling for the whole build, so the design stays reproducible"],
  ];
  stats.forEach((st, i) => {
    const y = 1.78 + i * 1.72;
    s.addText(st[0], {
      x: 9.05, y, w: 3.68, h: 0.68, fontSize: 34, bold: true, color: C.teal,
      fontFace: HEAD, valign: "middle", margin: 0,
    });
    s.addText(st[1], {
      x: 9.05, y: y + 0.68, w: 3.6, h: 0.75, fontSize: 11, color: C.muted,
      fontFace: BODY, valign: "top", margin: 0,
    });
    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 9.05, y: y + 1.5, w: 3.68, h: 0.012,
        fill: { color: C.border }, line: { color: C.border },
      });
    }
  });
}

// ── 3 ── Context, constraints, considerations ─────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 1  |  Investigating and defining a problem",
    "Context, constraints and considerations");

  const cols = [
    {
      t: "Context", c: C.teal, items: [
        "A residential or rural block with open ground on at least one side and a mean wind speed near 5 to 6 m/s",
        "Mounted on a 3 m pole, clear of foot traffic, roof lines and overhanging trees",
        "Output feeds a 12 V battery bank, a low-power direct load, or a resistive dump load",
        "Operated by a household, not a technician, so nothing routine should require tools",
      ],
    },
    {
      t: "Constraints", c: C.sea, items: [
        "Total build cost must stay at or under $180",
        "Rotor diameter capped at 1.2 m by the mounting position and by what one person can lift",
        "Low-voltage DC only, no mains wiring, in line with AS/NZS 3000:2018",
        "Fabrication limited to the school workshop: 3D printing, hand tools and a drill press",
        "Ten teaching weeks from design freeze to evaluation",
      ],
    },
    {
      t: "Considerations", c: C.mint, items: [
        "Noise and vibration carried down the tower into the mount",
        "Weather ingress into the gearbox and the controller enclosure",
        "Overspeed in gusts, and over-voltage reaching the battery",
        "Recyclability of every printed part and of the battery at end of life",
        "Ease of getting at the gear train for inspection",
      ],
    },
  ];
  cols.forEach((col, i) => {
    const x = M + i * 4.13;
    panel(s, x, 1.7, 3.87, 5.15, col.t, i + 1);
    bullets(s, col.items, { x: x + 0.3, y: 2.42, w: 3.35, h: 4.3, fontSize: 11.5 });
  });
}

// ── 4 ── Research ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 1  |  Investigating and defining a problem",
    "Research that shaped the design");

  table(s, [
    [th("Source"), th("What was investigated"), th("What was learned"), th("How it changed the design")],
    ["Bureau of Meteorology climate data for the site (2024)",
      "Mean and seasonal wind speed at 10 m, and how often the wind drops below 3 m/s",
      "The site averages roughly 5 to 6 m/s, but sits under 3 m/s for long stretches in summer",
      "Confirmed that a direct-drive rotor would spend most of the year below the generator's useful speed, so a step-up gear train is needed"],
    ["Manwell, McGowan and Rogers (2009), Wind energy explained",
      "The relationship between rotor speed, wind speed and power capture",
      "A three-blade rotor works best at a tip speed ratio near 5, and power rises with the cube of wind speed",
      "Set the design point at 6 m/s and a tip speed ratio of 5, which fixes the rotor speed the gear train has to work from"],
    ["Betz (1966) limit and published rotor efficiencies",
      "The maximum share of wind energy any rotor can convert",
      "No rotor exceeds 59.3 per cent, and a small printed rotor realistically reaches about 30 per cent",
      "Kept the output target at a defensible 25 W rather than an optimistic figure that testing would never meet"],
    ["Safe Work Australia (2020) and AS/NZS 3000:2018",
      "How to rate and control the hazards of a rotating, electrically live outdoor build",
      "Risk must be controlled by the hierarchy of control, and low-voltage DC avoids the mains wiring rules entirely",
      "Locked the system to low-voltage DC, and made a guarded gearbox and a fused output non-negotiable"],
  ], { x: M, y: 1.7, w: W, colW: [2.35, 2.85, 3.4, 3.53], rowH: rows(0.42, 1.18, 4), fontSize: 10 });
}

// ── 5 ── Design brief and evaluation criteria ─────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 1  |  Investigating and defining a problem",
    "Design brief and evaluation criteria");

  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 1.66, w: W, h: 1.56, fill: { color: C.white }, line: { color: C.border, width: 1 },
  });
  s.addText("DESIGN BRIEF", {
    x: M + 0.32, y: 1.78, w: 6, h: 0.28, fontSize: 10, bold: true, color: C.teal,
    fontFace: BODY, charSpacing: 1.4, margin: 0,
  });
  s.addText(
    "Design, produce and test a small-scale wind turbine generator for a residential or rural block. The system must convert wind into shaft rotation, step that rotation up through a gear train so a low-cost DC generator reaches a useful speed, and use an electronic controller to direct the electricity produced to battery storage, to a direct load, or to a dump load. It must be built for under $180 from low-impact, mostly recyclable materials, run entirely on low-voltage DC, and be safe for a household to operate.",
    { x: M + 0.32, y: 2.08, w: 11.45, h: 1.05, fontSize: 12.5, italic: true, color: C.text, fontFace: HEAD, valign: "top", margin: 0 }
  );

  table(s, [
    [th("#"), th("Evaluation criterion"), th("Measurable target"), th("How it will be tested")],
    ["EC1", "Generate a usable DC output in moderate wind", "At least 12 V open circuit at 6 m/s", "Multimeter across the DC bus while the rotor is driven at the design speed"],
    ["EC2", "Step the generator speed up mechanically", "Measured step-up ratio of 2.4 : 1, within 5 per cent", "Optical tachometer on both shafts, ten runs averaged"],
    ["EC3", "Direct the output to three destinations", "Battery, direct load and dump load each switch on demand", "Sweep the bus voltage and log which path carries current at each step"],
    ["EC4", "Protect the battery from overcharge", "Charging stops above 14.4 V and resumes below 13.2 V", "Bench supply on the sense input, record the switching thresholds"],
    ["EC5", "Be safe to operate and to build", "No reachable rotating part, no exposed conductor above 24 V, fused output", "Guard inspection against the risk register, plus a continuity and fuse check"],
    ["EC6", "Stay within budget", "Total build cost at or under $180", "Sum the final materials list against receipts"],
    ["EC7", "Use low-impact materials", "At least 70 per cent of parts recyclable or reusable", "Audit every line of the materials list by material type"],
  ], { x: M, y: 3.42, w: W, colW: [0.6, 3.3, 3.6, 4.63], rowH: rows(0.4, 0.42, 7), fontSize: 10 });
}

// ── 6 ── Mechanical subsystem options ─────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Mechanical subsystem: gear train options");

  table(s, [
    [th("Option"), th("How it works"), th("Strengths"), th("Weaknesses")],
    [{ text: "A\nDirect drive", options: { bold: true } },
      "The blade shaft couples straight onto the generator, with no gearing between them.",
      "Fewest moving parts, no gear friction, nothing to align, quietest of the three",
      "At the design wind speed the rotor turns near 480 rpm, well under the speed this generator needs for a useful voltage"],
    [{ text: "B\nSingle-stage spur gear step-up", options: { bold: true } },
      "A 24 tooth gear on the blade shaft drives a 10 tooth pinion on the generator shaft.",
      "Lifts generator speed by 2.4 times, both gears print in one job, ratio is easy to change by reprinting one gear",
      "Adds a meshing loss of roughly 3 per cent, and needs a housing, two bearings and accurate centre distance"],
    [{ text: "C\nTwo-stage gear train", options: { bold: true } },
      "Two gear pairs in series give a much larger overall step-up.",
      "Reaches a high generator speed even in light wind, so it produces something on marginal days",
      "Twice the parts and twice the friction, harder to align, and the extra drag raises the wind speed needed to start turning at all"],
  ], { x: M, y: 1.7, w: W, colW: [2.1, 3.3, 3.4, 3.33], rowH: rows(0.4, 1.16, 3), fontSize: 10.5 });

  note(s, M, 5.75, W, 1.05, "Option B selected.",
    "The generator needs roughly 1000 rpm before it produces a useful voltage, and the rotor reaches about 480 rpm at the 6 m/s design point. A 2.4 : 1 step-up closes that gap with one gear pair. Option A never reaches the speed, and Option C buys speed the system does not need while adding friction that raises the cut-in wind speed.");
}

// ── 7 ── Electronic control options ───────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Electronic subsystem: controller options");

  table(s, [
    [th("Option"), th("How it works"), th("Strengths"), th("Weaknesses")],
    [{ text: "A\nBlocking diode only", options: { bold: true } },
      "A diode stops the battery discharging back through the generator. The battery charges whenever the rotor turns.",
      "Cheapest possible, almost nothing to fail, no programming",
      "No overcharge protection at all, and no way to choose between storing, using or shedding the output"],
    [{ text: "B\nManual switch selector", options: { bold: true } },
      "A rotary switch routes the current to the battery, a direct load or a dump-load resistor.",
      "Gives real choice over how the electricity is used, and is simple to demonstrate",
      "Only works while someone is watching it, so the battery is still exposed to overcharge overnight"],
    [{ text: "C\nMicrocontroller charge controller", options: { bold: true } },
      "The controller reads the bus and battery voltage through a divider and switches one of three output paths on.",
      "Automatic, protects the battery on set thresholds, logs its own behaviour, and closes the control loop the brief asks for",
      "Most components, needs programming and debugging, and a fault in the code can leave the battery unprotected"],
  ], { x: M, y: 1.7, w: W, colW: [2.1, 3.5, 3.5, 3.03], rowH: rows(0.4, 1.16, 3), fontSize: 10.5 });

  note(s, M, 5.75, W, 1.05, "Option C selected.",
    "The design brief requires the system to decide how the generated electricity is used, and only Option C does that without a person present. It is also the only option that meets EC4, since it is the one that can stop charging at 14.4 V. The programming risk is managed by testing each switching threshold on a bench supply before the controller is ever connected to the turbine.");
}

// ── 8 ── Preferred design + block diagram ─────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Preferred design: the integrated system");

  s.addImage({ path: IMG("system_block.png"), x: M, y: 1.62, w: 12.13, h: (12.13 * 5.2) / 12.0 });
}

// ── 9 ── IPO ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Input, process and output across the three subsystems");
  s.addImage({ path: IMG("ipo.png"), x: M, y: 1.72, w: 12.13, h: (12.13 * 5.3) / 12.0 });
}

// ── 10 ── Mechanical subsystem diagram ────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Mechanical subsystem: the gear train");

  const iw = 8.35, ih = (iw * 5.0) / 11.0;
  s.addImage({ path: IMG("mech_subsystem.png"), x: M, y: 1.75, w: iw, h: ih });

  panel(s, M + iw + 0.3, 1.7, W - iw - 0.3, 5.15, "How it works");
  s.addText(
    [
      { text: "The rotor shaft carries a 24 tooth spur gear that meshes with a 10 tooth pinion on the generator shaft. Every turn of the rotor becomes 2.4 turns of the generator.", options: { breakLine: true } },
      { text: "\nWhy 24 and 10:", options: { bold: true, color: C.teal, breakLine: true } },
      { text: "Ten teeth is the smallest pinion that prints cleanly at 2 mm module without the teeth undercutting. Pairing it with 24 teeth gives the 2.4 : 1 ratio the generator needs, and both gears fit inside a 120 mm housing.", options: { breakLine: true } },
      { text: "\nBearings:", options: { bold: true, color: C.teal, breakLine: true } },
      { text: "Two sealed ball bearings carry the rotor shaft so the printed gear never takes a side load from the blades. Sealed units keep grit and water out of the mesh.", options: { breakLine: true } },
      { text: "\nTrade-off accepted:", options: { bold: true, color: C.teal, breakLine: true } },
      { text: "Torque at the generator falls by the same 2.4 times that speed rises. That is fine here, because the generator needs speed rather than torque, but it does raise the wind speed at which the rotor first breaks away.", options: {} },
    ],
    { x: M + iw + 0.5, y: 2.42, w: W - iw - 0.7, h: 4.3, fontSize: 11, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
}

// ── 11 ── Exploded assembly ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Exploded assembly view of the nacelle");
  const iw = 11.2, ih = (iw * 4.9) / 11.0;
  s.addImage({ path: IMG("exploded.png"), x: (13.333 - iw) / 2, y: 1.62, w: iw, h: ih });
  s.addText(
    "Item numbers correspond to the materials list. The whole drive train slides onto one shaft, so the nose cone and gearbox cover come off for inspection without taking the nacelle off the tower.",
    { x: M, y: 1.62 + ih + 0.14, w: W, h: 0.4, fontSize: 11.5, italic: true, color: C.muted, fontFace: BODY, align: "center", margin: 0 }
  );
}

// ── 12 ── Circuit ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Electronic subsystem: controller circuit");

  const iw = 8.6, ih = (iw * 4.9) / 12.0;
  s.addImage({ path: IMG("circuit.png"), x: M, y: 2.0, w: iw, h: ih });

  panel(s, M + iw + 0.3, 1.7, W - iw - 0.3, 5.15, "Reading the circuit");
  s.addText(
    [
      { text: "1.  Rectify.", options: { bold: true, color: C.teal } },
      { text: "  The generator output is rectified so current can only flow one way into the system.", options: { breakLine: true } },
      { text: "\n2.  Smooth.", options: { bold: true, color: C.teal } },
      { text: "  A capacitor across the rails flattens the ripple, giving the controller a steady voltage to measure.", options: { breakLine: true } },
      { text: "\n3.  Sense.", options: { bold: true, color: C.teal } },
      { text: "  A two-resistor divider scales the bus voltage down into the controller's input range, so a 20 V bus reads as about 2.6 V.", options: { breakLine: true } },
      { text: "\n4.  Switch.", options: { bold: true, color: C.teal } },
      { text: "  Three switching devices sit between the bus and the battery, the direct load and the dump load. The controller closes exactly one at a time.", options: { breakLine: true } },
      { text: "\n5.  Protect.", options: { bold: true, color: C.teal } },
      { text: "  A fuse in the positive rail clears a short before the wiring heats, and the dump load always gives the rotor somewhere to push current.", options: {} },
    ],
    { x: M + iw + 0.5, y: 2.42, w: W - iw - 0.7, h: 4.3, fontSize: 10.5, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
}

// ── 13 ── Engineering calculations ────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 2  |  Generating and designing",
    "Engineering calculations behind the design");

  const calcs = [
    {
      t: "1.  Power available in the wind",
      lines: [
        "Swept area  A = πr² = π × 0.6² = 1.13 m²",
        "P = ½ ρ A v³ = 0.5 × 1.225 × 1.13 × 6³",
        "P = 150 W available at 6 m/s",
      ],
      note: "Rotor diameter is fixed at 1.2 m by the mounting position.",
    },
    {
      t: "2.  Realistic electrical output",
      lines: [
        "Betz limit: 150 × 0.593 = 89 W",
        "Printed rotor at Cp = 0.30: 150 × 0.30 = 45 W",
        "Drivetrain and generator at 55%: 45 × 0.55 = 25 W",
      ],
      note: "This is where the 25 W target in EC1 comes from.",
    },
    {
      t: "3.  Rotor speed and gear ratio",
      lines: [
        "At tip speed ratio λ = 5:  ω = λv / r = 5 × 6 / 0.6 = 50 rad/s",
        "N = 50 × 60 / 2π = 478 rpm at the rotor",
        "Gear ratio = 24 / 10 = 2.4 : 1  →  478 × 2.4 = 1147 rpm",
      ],
      note: "Meets the generator's need for roughly 1000 rpm.",
    },
    {
      t: "4.  Torque and gear tooth load",
      lines: [
        "Rotor torque  T = P / ω = 45 / 50 = 0.90 N·m",
        "Driver gear pitch radius (2 mm module, 24 teeth) = 0.024 m",
        "Tooth force  F = T / r = 0.90 / 0.024 = 37.5 N",
      ],
      note: "Well inside what a 12 mm wide printed PLA tooth carries.",
    },
    {
      t: "5.  Dump load sizing",
      lines: [
        "Shed the full output at the 12 V bus:",
        "R = V² / P = 12² / 25 = 5.8 Ω",
        "Chosen: 5.6 Ω rated 50 W, so it runs at half its rating",
      ],
      note: "Derating keeps the resistor surface temperature down.",
    },
    {
      t: "6.  Fuse and sense divider",
      lines: [
        "Steady current  I = P / V = 25 / 12 = 2.1 A  →  3 A fuse",
        "Divider for a 20 V worst case into a 3.3 V input:",
        "68 kΩ and 10 kΩ  →  20 × 10 / 78 = 2.6 V",
      ],
      note: "Leaves headroom before the input is over-driven.",
    },
  ];

  calcs.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 4.13, y = 1.7 + row * 2.62;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.87, h: 2.42, fill: { color: C.white }, line: { color: C.border, width: 1 },
    });
    s.addText(c.t, {
      x: x + 0.22, y: y + 0.14, w: 3.43, h: 0.34, fontSize: 12.5, bold: true,
      color: C.teal, fontFace: HEAD, valign: "middle", margin: 0,
    });
    s.addText(
      c.lines.map((l, j) => ({ text: l, options: { breakLine: j < c.lines.length - 1 } })),
      { x: x + 0.22, y: y + 0.55, w: 3.43, h: 1.25, fontSize: 10.5, color: C.text, fontFace: BODY, valign: "top", paraSpaceAfter: 4, margin: 0 }
    );
    s.addText(c.note, {
      x: x + 0.22, y: y + 1.86, w: 3.43, h: 0.44, fontSize: 9.5, italic: true,
      color: C.muted, fontFace: BODY, valign: "top", margin: 0,
    });
  });
}

// ── 14 ── Materials list and budget ───────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 3  |  Planning", "Materials list and budget");

  const items = [
    ["1", "Nose cone", "3D printed PLA", "1", "$2"],
    ["2", "Blades", "3D printed PLA, 600 mm", "3", "$9"],
    ["3", "Blade hub", "3D printed PLA", "1", "$3"],
    ["4", "Main shaft", "8 mm bright steel rod, 200 mm", "1", "$6"],
    ["5", "Bearings", "8 mm sealed ball bearing", "2", "$8"],
    ["6", "Driver gear, 24 tooth", "3D printed PLA, 2 mm module", "1", "$2"],
    ["7", "Pinion, 10 tooth", "3D printed PLA, 2 mm module", "1", "$1"],
    ["8", "Gearbox housing and cover", "3D printed PLA on a plywood plate", "1", "$7"],
  ];
  const items2 = [
    ["9", "DC generator", "Permanent magnet DC motor run as a generator", "1", "$18"],
    ["10", "Base plate and tower", "25 mm steel tube, plywood base", "1", "$22"],
    ["11", "Controller board", "Microcontroller board and protoboard", "1", "$14"],
    ["12", "Rectifier, capacitor, resistors, fuse", "Passive components and holder", "1 set", "$9"],
    ["13", "Switching devices", "Logic-level transistor with heatsink", "3", "$9"],
    ["14", "Battery", "12 V 7 Ah sealed lead acid", "1", "$28"],
    ["15", "Dump load resistor", "5.6 Ω, 50 W wirewound", "1", "$6"],
    ["16", "Wiring, connectors, fasteners", "Cable, terminals, M4 hardware", "1 set", "$11"],
  ];
  const cols = [0.45, 2.05, 2.45, 0.55, 0.65];
  const head = [th("#", 9.5), th("Item", 9.5), th("Material or specification", 9.5), th("Qty", 9.5), th("Cost", 9.5)];

  table(s, [head, ...items], { x: M, y: 1.7, w: 6.15, colW: cols, rowH: rows(0.36, 0.4, 8), fontSize: 9.5 });
  table(s, [head, ...items2], { x: M + 6.3, y: 1.7, w: 6.15, colW: cols, rowH: rows(0.36, 0.4, 8), fontSize: 9.5 });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M, y: 5.44, w: W, h: 0.02, fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("TOTAL BUILD COST", {
    x: M, y: 5.56, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.muted,
    fontFace: BODY, charSpacing: 1.4, margin: 0,
  });
  s.addText("$155", {
    x: M, y: 5.82, w: 2.2, h: 0.6, fontSize: 32, bold: true, color: C.teal,
    fontFace: HEAD, valign: "middle", margin: 0,
  });
  s.addText("against a $180 budget, leaving $25 for reprints and replacement parts", {
    x: M + 2.2, y: 5.82, w: 5.4, h: 0.6, fontSize: 12, color: C.text, fontFace: BODY,
    valign: "middle", margin: 0,
  });

  s.addText(
    "Sustainability audit: items 1, 2, 3, 6, 7 and 8 are printed PLA and can be reground. Items 4, 5, 9, 10 and 13 are metal and recyclable, and item 14 goes to a lead-acid recycler. Twelve of sixteen lines, or 75 per cent, are recyclable or reusable, which meets EC7.",
    { x: M + 7.7, y: 5.5, w: 4.43, h: 1.4, fontSize: 10.5, color: C.muted, fontFace: BODY, valign: "top", margin: 0 }
  );
}

// ── 15 ── Work plan and Gantt ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 3  |  Planning", "Work plan and milestones");
  const iw = 9.24, ih = (iw * 5.9) / 11.6;
  s.addImage({ path: IMG("gantt.png"), x: (13.333 - iw) / 2, y: 1.6, w: iw, h: ih });
  note(s, M, 6.4, W, 0.62, "Reading the chart:",
    "solid teal is complete, green is in progress, pale teal is still scheduled, diamonds are the five milestones and the dashed red line is the current week. Modelling and printing are front-loaded so a failed print surfaces before the electronics work starts, and testing gets two full weeks because wind conditions cannot be scheduled.");
}

// ── 16 ── Risk assessment ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 3  |  Planning", "Safety and risk assessment");

  table(s, [
    [th("ID", 9.5), th("Hazard", 9.5), th("Control measure", 9.5), th("Hierarchy level", 9.5)],
    ["R1", "Blade or rotor strikes a person", "Turbine mounted on a 3 m pole, out of reach, with rounded blade tips and a rotor lock for maintenance", "Isolation"],
    ["R2", "Gear train traps fingers", "The mesh runs inside a closed printed housing that needs a tool to open", "Engineering"],
    ["R3", "Battery overcharges, vents or overheats", "Controller stops charging at 14.4 V, and a fused output limits fault current", "Engineering"],
    ["R4", "Rotor overspeeds in a gust", "Dump load absorbs surplus energy and brakes the rotor electrically as the bus voltage climbs", "Engineering"],
    ["R5", "Burns and fumes while soldering", "Bench soldering with fume extraction, iron always returned to its stand, safety glasses worn", "Administrative and PPE"],
    ["R6", "Cuts while trimming printed parts", "Cutting on a mat away from the body, with a fresh blade and cut-resistant glove", "Administrative and PPE"],
  ], { x: M, y: 1.7, w: 7.7, colW: [0.5, 1.85, 3.55, 1.8], rowH: rows(0.4, 0.78, 6), fontSize: 9.5 });

  const iw = 4.1, ih = (iw * 4.4) / 7.2;
  s.addImage({ path: IMG("risk_matrix.png"), x: M + 7.9, y: 1.7, w: iw, h: ih });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 7.9, y: 1.7 + ih + 0.2, w: iw, h: 6.85 - (1.7 + ih + 0.2),
    fill: { color: C.tint }, line: { color: "BFE3DA", width: 1 },
  });
  s.addText(
    [
      { text: "Hierarchy of control", options: { bold: true, color: C.dark, breakLine: true } },
      { text: "\nElimination is not available here, since the hazard is the moving rotor the system exists to turn. Every risk is therefore pushed as far up the hierarchy as the design allows, which is isolation for R1 and engineering controls for R2 to R4. Only the workshop hazards fall back to administrative controls and personal protective equipment.", options: {} },
    ],
    { x: M + 8.1, y: 1.7 + ih + 0.36, w: iw - 0.4, h: 6.6 - (1.7 + ih + 0.2), fontSize: 10.5, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
}

// ── 17 ── Implementing ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 4  |  Implementing processes and tools", "Building the system");

  const cols = [
    {
      t: "Production processes", c: C.teal, items: [
        "Gears, hub, blades and housing printed in PLA at 40 per cent infill, gears printed flat so the layer lines run across the tooth face",
        "Shaft cut and deburred on the lathe, then bearing seats reamed to an 8 mm slip fit",
        "Tower tube drilled and bolted to the plywood base plate through the drill press",
        "Controller assembled on protoboard, soldered joint by joint and continuity checked before power is applied",
        "Subsystems bolted to the base plate with M4 hardware, so any one of them can be removed on its own",
      ],
    },
    {
      t: "Tools and OHS compliance", c: C.sea, items: [
        "Printer enclosure kept shut while the hot end is above 60 °C",
        "Lathe and drill press used with guards fitted, long hair tied back, no gloves near rotating tooling",
        "Soldering done with fume extraction running and safety glasses on",
        "A current-limited bench supply used for every electronics test, so a wiring fault trips the limit instead of heating the board",
        "Every session logged with the hazards present and the controls used, as planned in Criterion 3",
      ],
    },
    {
      t: "Risk management in practice", c: C.mint, items: [
        "First pinion print stripped under load, so the second was printed at 60 per cent infill with three perimeters",
        "Gear mesh ran noisy until the centre distance was corrected by 0.4 mm, which also removed a vibration felt in the tower",
        "A wiring short during bench testing tripped the supply's current limit rather than damaging the board, which is exactly what the control was for",
        "Build stages photographed as evidence of safe practice and to support the modification log",
      ],
    },
  ];
  cols.forEach((col, i) => {
    const x = M + i * 4.13;
    panel(s, x, 1.7, 3.87, 5.15, col.t, i + 1);
    bullets(s, col.items, { x: x + 0.3, y: 2.42, w: 3.35, h: 4.3, fontSize: 10.5 });
  });
}

// ── 18 ── Testing ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 5  |  Realisation of the system", "Testing against the evaluation criteria");

  const met = (t) => ({ text: t, options: { bold: true, color: C.green, fontSize: 9.5 } });
  const part = (t) => ({ text: t, options: { bold: true, color: C.amber, fontSize: 9.5 } });
  const open = (t) => ({ text: t, options: { bold: true, color: C.red, fontSize: 9.5 } });

  table(s, [
    [th("#", 9.5), th("Target", 9.5), th("Method", 9.5), th("Result", 9.5), th("Status", 9.5)],
    ["EC1", "12 V or more at 6 m/s", "Bus voltage measured while the rotor was driven at 478 rpm on the bench", "12.6 V open circuit", met("Met")],
    ["EC2", "Step-up ratio 2.4 : 1", "Optical tachometer on both shafts, ten runs averaged", "2.37 : 1, which is 1.3 per cent low", met("Met")],
    ["EC3", "Three output paths switch", "Bus voltage swept from 10 V to 15 V, path carrying current logged at each step", "All three paths switched on demand", met("Met")],
    ["EC4", "Charging stops at 14.4 V", "Bench supply on the sense input, thresholds recorded", "Stopped at 14.35 V, resumed at 13.2 V", met("Met")],
    ["EC5", "Guarded and fused", "Guard inspection against the risk register, plus a fuse and continuity check", "Housing closed, 3 A fuse fitted, no conductor above 24 V", met("Met")],
    ["EC6", "$180 or under", "Final materials list summed against receipts", "$155", met("Met")],
    ["EC7", "70 per cent recyclable", "Materials list audited by material type", "75 per cent of lines recyclable or reusable", met("Met")],
    ["EC1", "Output in real wind", "Log output on site across a week of varying conditions", "Bench only so far, no site data yet", open("Outstanding")],
    ["EC5", "Survives sustained gusts", "Run through a full storm cycle and re-inspect the mount", "One 40 minute run completed, longer runs pending", part("Partial")],
  ], { x: M, y: 1.7, w: 7.55, colW: [0.5, 1.55, 2.6, 1.85, 1.05], rowH: rows(0.36, 0.45, 9), fontSize: 9.5 });

  s.addChart(pres.charts.LINE, [
    {
      name: "Predicted",
      labels: ["100", "200", "300", "400", "480", "560"],
      values: [2.6, 5.3, 7.9, 10.6, 12.7, 14.8],
    },
    {
      name: "Measured on the bench",
      labels: ["100", "200", "300", "400", "480", "560"],
      values: [2.2, 4.9, 7.4, 10.1, 12.6, 14.2],
    },
  ], {
    x: M + 7.75, y: 1.7, w: 4.38, h: 3.35,
    showTitle: true, title: "Bus voltage against rotor speed",
    titleFontSize: 12, titleColor: C.dark, titleFontFace: HEAD,
    chartColors: [C.mint, C.teal],
    lineDataSymbol: "circle", lineDataSymbolSize: 6, lineSize: 2,
    showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: C.muted,
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    catAxisLabelFontSize: 9, valAxisLabelFontSize: 9,
    catAxisTitle: "Rotor speed (rpm)", showCatAxisTitle: true,
    catAxisTitleColor: C.muted, catAxisTitleFontSize: 9,
    valAxisTitle: "DC bus voltage (V)", showValAxisTitle: true,
    valAxisTitleColor: C.muted, valAxisTitleFontSize: 9,
    valGridLine: { color: C.border, size: 1 },
    catGridLine: { style: "none" },
    valAxisMaxVal: 16, valAxisMinVal: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: M + 7.75, y: 5.25, w: 4.38, h: 1.6, fill: { color: C.tint }, line: { color: "BFE3DA", width: 1 },
  });
  s.addText(
    [
      { text: "What the data shows", options: { bold: true, color: C.dark, breakLine: true } },
      { text: "\nMeasured voltage tracks the prediction closely and falls only about 4 per cent short across the range, which is consistent with the gear mesh loss measured in EC2. The system clears the 12 V target at the design speed with margin.", options: {} },
    ],
    { x: M + 7.95, y: 5.4, w: 4.0, h: 1.35, fontSize: 10.5, color: C.text, fontFace: BODY, valign: "top", margin: 0 }
  );
}

// ── 19 ── Evaluation ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "Criterion 5  |  Realisation of the system",
    "Evaluation, modifications and recommendations");

  const cards = [
    {
      t: "What the system achieves", c: C.teal, items: [
        "Produces 12.6 V at the design wind speed, clearing EC1 with margin",
        "The gear train delivers the ratio it was designed for, within 1.3 per cent",
        "The controller switches all three output paths without a person present, which is the requirement the brief turns on",
        "Built for $155 from parts that are 75 per cent recyclable",
      ],
    },
    {
      t: "Modifications made and why", c: C.sea, items: [
        "Pinion reprinted at 60 per cent infill after the first one stripped under load",
        "Gear centre distance corrected by 0.4 mm, which cut both the mesh noise and the vibration in the tower",
        "Heatsink added to the dump-load resistor after it reached 90 °C in a sustained shed test",
        "Sense divider changed from 47 kΩ to 68 kΩ so the controller input keeps headroom at a 20 V bus",
      ],
    },
    {
      t: "What is still outstanding", c: C.amber, items: [
        "No site data yet: everything so far has been driven on the bench rather than by wind",
        "Long-duration gust testing incomplete, so bearing and mount wear is unproven",
        "No weather sealing on the controller enclosure, which the outdoor context requires",
      ],
    },
    {
      t: "Recommendations", c: C.dark, items: [
        "Log a full week of site output before claiming EC1 in real conditions",
        "Fit a gasket and cable gland to the controller box, then repeat the ingress check",
        "Print the next pinion in a tougher filament and compare tooth wear against PLA",
        "Add a small display so the household can see which path is active, which would make the control loop visible to the user",
      ],
    },
  ];
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 6.16, y = 1.68 + row * 2.4;
    panel(s, x, y, 5.97, 2.26, c.t, i + 1, c.c);
    bullets(s, c.items, { x: x + 0.3, y: y + 0.62, w: 5.45, h: 1.56, fontSize: 10.5, paraSpaceAfter: 4 });
  });

  note(s, M, 6.5, W, 0.55, "Conclusion:",
    "all seven evaluation criteria are met on bench evidence, and two of them still need confirming in real wind. The concept holds up: a printed gear train and a low-cost controller can make small-scale wind generation both useful and safe.");
}

// ── 20 ── References ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  header(s, "References", "References (APA 7th edition)");

  const refs = [
    "Betz, A. (1966). Introduction to the theory of flow machines. Pergamon Press.",
    "Budynas, R. G., & Nisbett, J. K. (2020). Shigley's mechanical engineering design (11th ed.). McGraw-Hill Education.",
    "Bureau of Meteorology. (2024). Climate data online: Mean wind speed. Australian Government. http://www.bom.gov.au/climate/data/",
    "Clean Energy Council. (2024). Clean energy Australia report 2024. https://www.cleanenergycouncil.org.au/resources/resources-hub/clean-energy-australia-report",
    "Department of Climate Change, Energy, the Environment and Water. (2024). Australian energy update 2024. Australian Government. https://www.energy.gov.au/publications/australian-energy-update-2024",
    "Hau, E. (2013). Wind turbines: Fundamentals, technologies, application, economics (3rd ed.). Springer.",
    "Manwell, J. F., McGowan, J. G., & Rogers, A. L. (2009). Wind energy explained: Theory, design and application (2nd ed.). John Wiley & Sons.",
    "Safe Work Australia. (2020). Model code of practice: How to manage work health and safety risks. https://www.safeworkaustralia.gov.au/doc/model-code-practice-how-manage-work-health-and-safety-risks",
    "Standards Australia. (2018). AS/NZS 3000:2018 Electrical installations (known as the Australian/New Zealand wiring rules). Standards Australia.",
    "Victorian Curriculum and Assessment Authority. (n.d.). VCE Systems Engineering. https://www.vcaa.vic.edu.au/curriculum/vce/vce-study-designs/systemsengineering/Pages/Index.aspx",
  ];

  s.addText(
    refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1 } })),
    {
      x: M, y: 1.75, w: W, h: 5.1, fontSize: 12, color: C.text, fontFace: BODY,
      valign: "top", paraSpaceAfter: 12, indentLevel: 0, margin: 0,
    }
  );
}

pres.writeFile({ fileName: process.argv[2] || "Wind_Turbine_SAT_final.pptx" })
  .then(() => console.log("Done -> Wind_Turbine_SAT_final.pptx"))
  .catch((e) => console.error(e));
