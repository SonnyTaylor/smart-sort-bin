// Hardware Development Log -> Hardware_Development_Log.pptx
//
//   cd portfolio && bun run hardware_log.js
//
// A separate deck from ai_bin.js. That one is the assessed portfolio and has
// been submitted; this one is the dated record of the mechanical build for
// anyone who wants to see the work rather than the result. Same house style so
// the two read as the same student's work.
//
// The revision table on the last two slides is read out of git when this runs,
// so those dates cannot drift. Every number in the prose comes from one of
// docs/build_log.md, docs/mechanical_design.md, docs/mechanical_iteration_log.md
// or cad/README.md. Change it there and change it here.

const pptxgen = require("pptxgenjs");
const { execSync } = require("child_process");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Smart Sort Bin - Hardware Development Log";

const C = {
  dark: "0D2818",
  primary: "1A5C38",
  accent: "2ECC71",
  lightgreen: "E8F5E9",
  white: "FFFFFF",
  gray: "6B7280",
  lightgray: "F4F6F5",
  text: "1A2E1F",
  border: "D1E8D9",
  red: "922B21",
};

const mk = () => undefined;

const _addSlide = pres.addSlide.bind(pres);
pres.addSlide = function (...args) {
  const s = _addSlide(...args);
  s.slideNumber = { x: 9.25, y: 5.28, w: 0.55, h: 0.28, fontFace: "Calibri", fontSize: 9, color: C.gray, align: "right" };
  return s;
};

function addHeader(s, title, subtitle) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(title, { x: 0.4, y: 0, w: subtitle ? 6.5 : 9.2, h: 1.0, fontSize: 24, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
  if (subtitle) {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fill: { color: C.accent, transparency: 20 }, line: { color: C.accent, transparency: 20 } });
    s.addText(subtitle, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
}

// A white card with a coloured title strip, the shape used all through ai_bin.js
function card(s, { x, y, w, h, title, body, strip = C.accent, stripText = C.dark, fontSize = 10 }) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.white }, line: { color: C.border }, shadow: mk() });
  if (title) {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.38, fill: { color: strip }, line: { color: strip } });
    s.addText(title, { x, y, w, h: 0.38, fontSize: 9.5, bold: true, color: stripText, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
  if (body) {
    s.addText(body, {
      x: x + 0.15, y: y + (title ? 0.46 : 0.12), w: w - 0.3, h: h - (title ? 0.58 : 0.24),
      fontSize, color: C.text, fontFace: "Calibri", valign: "top", margin: 0,
    });
  }
}

// Caption under a picture. Grey, small, the same voice as the render captions.
function caption(s, text, { x, y, w }) {
  s.addText(text, { x, y, w, h: 0.4, fontSize: 9, italic: true, color: C.gray, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
}

function note(s, text, { x = 0.3, y, w = 9.4, h = 0.62, fill = C.lightgreen, line = C.accent, fontSize = 10 } = {}) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line } });
  s.addText(text, { x: x + 0.15, y, w: w - 0.3, h, fontSize, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 });
}

const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9 } });

// Read once, up here, because the count is quoted on slide 2 as well as listed
// in the appendix. Hardcoding it there meant it went stale the moment anything
// was committed.
const COMMITS = (() => {
  try {
    const raw = execSync('git log --reverse --date=format:"%d %b %Y" --pretty=%ad\x1f%s', {
      cwd: "..", encoding: "utf8", maxBuffer: 1024 * 1024 * 8,
    }).trim();
    return raw.split("\n").map((line) => {
      const i = line.indexOf("\x1f");
      return [line.slice(0, i), line.slice(i + 1)];
    });
  } catch (e) {
    console.error("could not read git history:", e.message);
    process.exit(1);
  }
})();

function tableOpts(extra = {}) {
  return {
    border: { pt: 0.5, color: "C8E0CC" },
    fill: { color: C.white },
    fontSize: 9,
    fontFace: "Calibri",
    color: C.text,
    valign: "middle",
    ...extra,
  };
}

// ─────────────────────────────────────────────
// SLIDE 1: Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText("HARDWARE DEVELOPMENT LOG", { x: 0.5, y: 0.95, w: 9, h: 0.8, fontSize: 40, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "left", margin: 0 });
  s.addText("Smart Sort Bin: how the mechanism was designed, in the order it happened", { x: 0.5, y: 1.8, w: 8.5, h: 0.45, fontSize: 15, color: "A8D5BA", fontFace: "Calibri", align: "left", margin: 0 });
  s.addText("VCE Systems Engineering, Units 3 and 4", { x: 0.5, y: 2.28, w: 8.5, h: 0.35, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "left", italic: true, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.95, w: 6.5, h: 0.02, fill: { color: C.accent, transparency: 40 }, line: { color: C.accent, transparency: 40 } });

  s.addText("Sonny Taylor  |  Beaumaris Secondary College", { x: 0.5, y: 3.15, w: 6.5, h: 0.35, fontSize: 12, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  s.addText("24 February 2026 to 12 August 2026\nMechanical and hardware work. The AI and software side is in the main portfolio.", {
    x: 0.5, y: 3.55, w: 7.0, h: 0.9, fontSize: 12, color: "C8E6D5", fontFace: "Calibri", margin: 0,
  });
}

// ─────────────────────────────────────────────
// SLIDE 2: What this is
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "What this log is", "Read this first");

  card(s, {
    x: 0.3, y: 1.15, w: 4.65, h: 1.85,
    title: "WHAT IS IN IT",
    body: "A dated record of how the physical side of the bin was designed. The versions that did not work are kept alongside the ones that did, because most of what I learned came from the ones that did not.\n\nEvery picture is the real design at that point in time, not a drawing made afterwards to illustrate it. The superseded versions are rendered out of the project's version history, so a V1 panel is the shape the part actually was on that date.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 1.15, w: 4.65, h: 1.85,
    title: "STATUS, STATED PLAINLY",
    strip: C.primary, stripText: C.white,
    body: "The electronics and the software run. None of the eleven printed parts have been made yet.\n\nSo everything mechanical in here has been designed and checked, not built and tested. Where I say a part was verified, I mean the model was measured against geometry I calculated separately. That proves the model matches what I intended. It does not prove the parts fit each other in the hand, and I have not claimed that anywhere.",
    fontSize: 9.5,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.15, w: 9.4, h: 2.0, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.15, w: 9.4, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("THE FOUR THINGS THIS LOG IS EVIDENCE OF", { x: 0.3, y: 3.15, w: 9.4, h: 0.35, fontSize: 9.5, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const claims = [
    ["15", "faults found and fixed\nbefore anything was printed"],
    ["11", "printed parts designed,\nmeasured and exported"],
    [String(COMMITS.length), "dated revisions saved\nacross six months"],
    ["65mm", "of height taken out of\nthe head by redesigning it"],
  ];
  const cw = 9.4 / claims.length;
  claims.forEach(([big, small], i) => {
    const cx = 0.3 + i * cw;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.55, w: 0.02, h: 1.5, fill: { color: C.border }, line: { color: C.border } });
    s.addText(big, { x: cx + 0.1, y: 3.62, w: cw - 0.2, h: 0.62, fontSize: 30, bold: true, color: C.primary, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(small, { x: cx + 0.1, y: 4.26, w: cw - 0.2, h: 0.75, fontSize: 9.5, color: C.text, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3: Timeline
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Timeline", "Feb to Aug 2026");

  s.addText("The mechanical work happened in two bursts: the concept and the first CAD in February, then the detailed design across nine days in August. The full revision list is at the end.", {
    x: 0.3, y: 1.1, w: 9.4, h: 0.35, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
  });

  s.addTable([
    [hdr("Date"), hdr("What happened"), hdr("Slide")],
    ["24 Feb 2026", "Design brief written, three concepts sketched, one chosen", "4"],
    ["26 Feb 2026", "First CAD: a curved sorting tray with a rim, drawn in OpenSCAD", "5"],
    ["4 Aug 2026", "Tripod hub and bin clamps designed", "6"],
    ["6 Aug 2026", "Clamp jaw reshaped for line contact. Tray becomes a rimless saddle", "6, 5"],
    ["10 Aug 2026", "All parts rebuilt natively in Fusion 360. Faults 1 to 5 found", "8"],
    ["11 Aug 2026", "Head rebuilt. Tray drops from 147mm to 82mm above the rim", "9"],
    ["11 Aug 2026", "Camera post and mount designed. The camera had nowhere to go", "10, 11"],
    ["11 Aug 2026", "Pipe sockets shelled. Six parts drop 16.8% of their volume", "12"],
    ["11 Aug 2026", "Electronics box and rim hanger designed", "13"],
    ["11 Aug 2026", "Fusion crashed and lost two parts. Both rebuilt and verified", "14"],
    ["12 Aug 2026", "Print orientation and supports worked out for all fourteen pieces", "15"],
  ], tableOpts({ x: 0.3, y: 1.55, w: 9.4, colW: [1.5, 6.9, 1.0], rowH: 0.29 }));
}

// ─────────────────────────────────────────────
// SLIDE 4: Choosing the mechanism
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Choosing the mechanism", "24 Feb 2026");

  const opts = [
    {
      name: "OPTION A - PAN-TILT TRAY",
      img: "images/sketches/design_option_a.png",
      cap: "Chosen. Two servos, one moving surface.",
      strip: C.accent, stripText: C.dark,
    },
    {
      name: "OPTION B - CONVEYOR + FLAPS",
      img: "images/sketches/design_option_b.png",
      cap: "Rejected. Over budget at $220, and the belt gets dirty.",
      strip: C.primary, stripText: C.white,
    },
    {
      name: "OPTION C - ROTATING CAROUSEL",
      img: "images/sketches/design_option_c.png",
      cap: "Rejected. Spinning full bins is slow, and it breaks the height limit.",
      strip: C.primary, stripText: C.white,
    },
  ];

  opts.forEach((o, i) => {
    const cx = 0.3 + i * 3.2;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.12, w: 3.0, h: 3.05, fill: { color: C.white }, line: { color: C.border } });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.12, w: 3.0, h: 0.34, fill: { color: o.strip }, line: { color: o.strip } });
    s.addText(o.name, { x: cx, y: 1.12, w: 3.0, h: 0.34, fontSize: 9, bold: true, color: o.stripText, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addImage({ path: o.img, x: cx + 0.08, y: 1.52, w: 2.84, h: 2.01 });
    s.addText(o.cap, { x: cx + 0.1, y: 3.56, w: 2.8, h: 0.55, fontSize: 9, color: C.text, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
  });

  note(s, "Option A won on part count. It reaches three compartments with two servos and one printed tray, where the conveyor needs a motor, a belt, rollers and separate flaps. My research also showed the Ameru bin already sorts this way, so I knew the method works before I committed to it.", { y: 4.35, h: 0.85 });
}

// ─────────────────────────────────────────────
// SLIDE 5: The tray, and the first thing I got wrong
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "The tray, and the first thing I got wrong", "26 Feb, 6 Aug");

  s.addImage({ path: "images/cad/evolution/tray.png", x: 1.7, y: 1.12, w: 6.6, h: 2.78 });
  caption(s, "Every panel is rendered from the same camera distance, so the versions are directly comparable.", { x: 0.3, y: 3.94, w: 9.4 });

  note(s, "The first tray was a dish with a rim, to stop the item rolling off while the head turned. It was rejected on reasoning before it was ever printed: a rim holds the item in at exactly the moment the tray is trying to tip it out. The replacement is a rimless saddle. The sides curl up 10mm so an off-centre item rolls back to the middle, and the ends curl down 5mm so it leaves cleanly. The 5mm was chosen against a number rather than picked by eye: it gives a steepest slope of 9.5 degrees, and plastic slides on PLA at about 19 degrees, so an item sits still until the tray is actually tilted.", { y: 4.3, h: 0.9, fontSize: 9.5 });
}

// ─────────────────────────────────────────────
// SLIDE 6: The tripod hub and the clamps
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "The tripod hub and the clamps", "4 to 6 Aug");

  s.addImage({ path: "images/cad/evolution/clamp.png", x: 0.3, y: 1.1, w: 9.4, h: 2.38 });

  card(s, {
    x: 0.3, y: 3.6, w: 4.65, h: 1.6,
    title: "WHY THE JAW IS SHAPED ODDLY",
    body: "The first clamp had a flat jaw. A flat jaw only grips a wall it meets square on, and on a rectangular bin two of the three legs arrive at an angle, so two of the three clamps would have gripped on a single corner.\n\nThe jaw became a vertical rounded rib. A rib touches along a line at any angle, and the thumbscrew opposite gives a point. A line plus a point holds a flat wall, a curved wall or a box.",
    fontSize: 9,
  });

  card(s, {
    x: 5.05, y: 3.6, w: 4.65, h: 1.6,
    title: "WHY A TRIPOD AT ALL",
    strip: C.primary, stripText: C.white,
    body: "The original plan was a laser cut top plate sized to one specific bin. I replaced it with a printed hub on three lengths of 20mm PVC conduit running out to three rim clamps.\n\nFitting the whole rig to a different bin is then three saw cuts and nothing else, instead of drawing and cutting a new plate. That property is why bin bags later beat printed dividers as well.",
    fontSize: 9,
  });
}

// ─────────────────────────────────────────────
// SLIDE 7: The hub plate
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "The hub plate lost most of its material", "4 to 11 Aug");

  s.addImage({ path: "images/cad/evolution/plate.png", x: 0.65, y: 1.12, w: 8.7, h: 2.2 });
  caption(s, "The solid disc became a spoked one once I worked out the material between the spokes was carrying nothing.", { x: 0.3, y: 3.38, w: 9.4 });

  s.addImage({ path: "images/cad/leg_layout.png", x: 0.3, y: 3.78, w: 1.42, h: 1.42 });
  card(s, {
    x: 1.9, y: 3.78, w: 7.8, h: 1.42,
    body: "The legs sit at 60, 180 and 300 degrees rather than 0, 120 and 240. Putting a leg at the back rather than a gap means the two front legs frame the opening the user drops rubbish into, instead of one leg standing in the middle of it. The three legs also cut the bin opening into three by themselves, which is what later made printed dividers unnecessary.",
    fontSize: 9.5,
  });
}

// ─────────────────────────────────────────────
// SLIDE 8: Moving to Fusion
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Moving to Fusion 360", "10 Aug");

  card(s, {
    x: 0.3, y: 1.15, w: 4.65, h: 2.1,
    title: "WHY",
    body: "Everything so far had been drawn in OpenSCAD, which describes a shape in code rather than by drawing it. The course requires the CAD to be Fusion work, so all five parts were rebuilt there and Fusion became the source of truth from that point on.\n\nThe OpenSCAD files are kept, because their history is the only surviving copy of the early versions. That is where the V1 and V2 panels in this deck are rendered from.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 1.15, w: 4.65, h: 2.1,
    title: "WHAT IT COST, AND WHAT IT FOUND",
    strip: C.primary, stripText: C.white,
    body: "Rebuilding turned up five faults the code version had hidden, because Fusion shows the parts assembled against each other and OpenSCAD does not.\n\nThe worst was the tray's mounting boss standing 1mm proud of the saddle. Printed as drawn, the tray could not have been bolted on at all, and the item would have landed on a plateau in the middle of the surface it is meant to roll along.",
    fontSize: 9.5,
  });

  s.addTable([
    [hdr("Fault"), hdr("What it would have cost"), hdr("Fixed by")],
    ["Tray boss stood 1mm proud of the saddle", "Tray could not be bolted on at all", "Boss capped by the tray's own surface"],
    ["Pipe lock screw had 1.56mm of thread", "Strips on assembly, the leg pulls out", "Screw moved to a pad on top, 6.2mm"],
    ["Hardware list called for M3 x 12 into a 9mm foot", "Screw bottoms out, the joint never tightens", "Corrected to M3 x 8, lengths now calculated"],
    ["Thumbscrew length overstated by 3mm", "Buying M3 x 25 that was never needed", "Calculation corrected for the rib radius"],
    ["Retaining tabs 0.25mm too tight for the real base", "Pan-tilt will not drop into the plate", "Bore opened from 124.5 to 125.6mm"],
  ], tableOpts({ x: 0.3, y: 3.4, w: 9.4, colW: [3.3, 3.1, 3.0], rowH: 0.31, fontSize: 8.5 }));
}

// ─────────────────────────────────────────────
// SLIDE 9: The head was too tall
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "The head was too tall, so I rebuilt it", "11 Aug");

  s.addText("I had bought a ready made pan and tilt bracket and designed around it. Measured against the assembly, it put the tray 147mm above the bin rim and the whole thing towered over the bin it was supposed to sit in. 85mm of that 147 was the bought bracket.", {
    x: 0.3, y: 1.08, w: 9.4, h: 0.45, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
  });

  s.addTable([
    [hdr("From"), hdr("To"), hdr("mm")],
    ["Bin rim", "hub plate underside", "9.0"],
    ["", "hub plate", "11.0"],
    ["Plate top", "top of the bracket's stand", "27.0"],
    ["", "gap over the pan servo", "14.5"],
    ["U-bracket bottom", "tilt axis", "44.3"],
    ["Tilt axis", "tray underside", "40.9"],
  ], tableOpts({ x: 0.3, y: 1.6, w: 5.2, colW: [1.75, 2.55, 0.9], rowH: 0.29, fontSize: 8.5 }));

  s.addImage({ path: "images/photos/3dprint_bracket.png", x: 5.75, y: 1.6, w: 2.0, h: 1.99 });
  s.addImage({ path: "images/cad/bought_tracker_front.png", x: 7.85, y: 2.2, w: 1.85, h: 1.39 });
  caption(s, "The bought bracket, built, and where it sat in the assembly.", { x: 5.75, y: 3.62, w: 3.95 });

  note(s, "The last row is where it goes wrong. The bracket stands its tilt servo on end inside a U shaped bracket, so the servo body finishes 37mm above the axis the tray pivots on, and the tray has to clear the servo before it clears anything else. When I bought the bracket I only had the STL, which is a solid shape with no dimensions in it, so I treated it as fixed. Getting the STEP file, which does carry dimensions, is what made replacing it possible.", { y: 4.1, h: 1.05, fontSize: 9.5 });
}

// ─────────────────────────────────────────────
// SLIDE 10: What replaced it
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "147mm above the rim becomes 82mm", "11 Aug");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 4.65, h: 2.95, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.12, w: 4.65, h: 0.34, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("BEFORE - BOUGHT BRACKET", { x: 0.3, y: 1.12, w: 4.65, h: 0.34, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: "images/cad/bought_tracker_front.png", x: 0.45, y: 1.52, w: 4.35, h: 2.45 });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.05, y: 1.12, w: 4.65, h: 2.95, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.05, y: 1.12, w: 4.65, h: 0.34, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("AFTER - THREE PRINTED PARTS", { x: 5.05, y: 1.12, w: 4.65, h: 0.34, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: "images/cad/rebuilt_head_front.png", x: 5.2, y: 1.52, w: 4.35, h: 2.45 });

  caption(s, "Same scale, same viewpoint. A pan ring, a tilt yoke and a tilt cradle that lie the tilt servo flat instead of standing it on end.", { x: 0.3, y: 4.12, w: 9.4 });

  const stats = [
    ["147 to 82mm", "tray height above the rim"],
    ["138.4 to 100.8", "cubic cm of plastic in the head"],
    ["3", "faults found while fitting it"],
    ["300 to 235mm", "camera post, cut to match"],
  ];
  const sw = 9.4 / stats.length;
  stats.forEach(([big, small], i) => {
    const cx = 0.3 + i * sw;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 4.52, w: sw - 0.08, h: 0.68, fill: { color: C.lightgreen }, line: { color: C.accent } });
    s.addText(big, { x: cx, y: 4.56, w: sw - 0.08, h: 0.3, fontSize: 13, bold: true, color: C.primary, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(small, { x: cx + 0.05, y: 4.86, w: sw - 0.18, h: 0.3, fontSize: 8.5, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDE 11: The camera had nowhere to go
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "The camera had nowhere to go", "11 Aug");

  note(s, "Found while listing what was left to do, which is the uncomfortable part. The bracket's own camera plate had been removed so the tray could take its place, and nothing had ever been designed to hold the webcam. I could have printed all five parts, assembled the whole thing, and ended up holding the camera in mid air.", { y: 1.08, h: 0.72, fill: "FDF2E9", line: "E67E22", fontSize: 9.5 });

  s.addImage({ path: "images/cad/evolution/camera_clamp.png", x: 0.3, y: 1.95, w: 4.5, h: 2.84 });
  caption(s, "The camera clamp is the bin clamp with a socket added on top, so it reuses a part already checked.", { x: 0.3, y: 4.82, w: 4.5 });

  s.addImage({ path: "images/cad/camera_post_iso.png", x: 5.1, y: 1.95, w: 3.0, h: 2.25 });

  card(s, {
    x: 8.25, y: 1.95, w: 1.45, h: 2.25,
    body: "The camera cannot go on the hub plate, because that is exactly where the tray sweeps when it tilts.\n\nIt goes on a vertical length of the same 20mm conduit, standing on one of the bin clamps, off to the side.",
    fontSize: 8.5,
  });

  caption(s, "The webcam turned out to have a standard 1/4-20 tripod thread, so the head carries a bolt through a side arm rather than clipping to anything. The arm points at the tray so the pipe is not in shot. The camera looks down at 52 degrees from 199mm away.", { x: 5.1, y: 4.28, w: 4.6 });
}

// ─────────────────────────────────────────────
// SLIDE 12: The fault a volume check cannot catch
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Two faults a volume check cannot catch", "11 Aug");

  card(s, {
    x: 0.3, y: 1.15, w: 4.65, h: 2.5,
    title: "FAULT 13 - THE CAMERA WOULD HAVE HUNG UPSIDE DOWN",
    strip: C.primary, stripText: C.white,
    body: "The bolt recess for the webcam had been cut into the top face of the side arm, so the thread pointed down and the webcam would have hung underneath it inverted.\n\nBoth my write-up and the CAD notes already said it was recessed underneath, so the model and the documentation had quietly disagreed ever since the part was made.\n\nFound by probing the solid along the bolt axis, not by looking at a render. Moving the recess to the other face does not change the part's volume by a single cubic mm.",
    fontSize: 9,
  });

  card(s, {
    x: 5.05, y: 1.15, w: 4.65, h: 2.5,
    title: "FAULT 14 - LIGHTENING THE PART OPENED A HOLE TO THE AIR",
    strip: C.primary, stripText: C.white,
    body: "I applied the rule \"the corners are doing nothing\" to all four corners of all six socketed parts without asking what was underneath each one.\n\nOn the camera clamp there is something underneath: the post socket. That block's bottom face is the socket's lid and the seat the post's end stops against.\n\nCutting it left the 20.46mm post bore open to the outside air on both sides, and took away the stop that sets how far the post goes in, which is what sets where the camera points.",
    fontSize: 9,
  });

  note(s, "What both changed about my method. A volume check proves every cut landed where it was meant to, and it is completely blind to which end of a hole a pocket is at. The checks that caught these two were containment probes, asking whether a specific point in space is inside the part or outside it. Volume is also a bad guide to what is load bearing: the corner material on the bin clamp and on the camera clamp measures the same and does completely different jobs.", { y: 3.8, h: 1.35, fontSize: 10 });
}

// ─────────────────────────────────────────────
// SLIDE 13: Making the sockets lighter
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Making the sockets lighter", "11 Aug");

  card(s, {
    x: 0.3, y: 1.15, w: 4.65, h: 1.75,
    title: "THE PROBLEM",
    body: "Every part that holds a pipe did it with a round hole bored through a solid block. In section the block was 663 square mm of plastic around a 343 square mm hole, so 36% plastic and 64% air.\n\nThe plastic was in the wrong places too: 1.49mm of wall at the sides where the load is, and 6mm sitting in the corners doing nothing.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 1.15, w: 4.65, h: 1.75,
    title: "THE FIX",
    strip: C.primary, stripText: C.white,
    body: "The outside face now follows the hole, offset 2.5mm, with 45 degree flanks so it still prints without support underneath.\n\nCut as a subtraction from the old outline, so the part can only shrink and no clearance anywhere in the assembly can change. That flank angle paid off a second time later, when it turned out to be why eight of the eleven parts need no support at all.",
    fontSize: 9.5,
  });

  s.addTable([
    [hdr("Part"), hdr("Before"), hdr("After"), hdr("Change")],
    ["Bin clamp, x2", "17,478 mm3", "13,709 mm3", "-21.6%"],
    ["Camera clamp", "30,919 mm3", "23,649 mm3", "-23.5%"],
    ["Leg bracket, x3", "16,137 mm3", "14,657 mm3", "-9.2%"],
    [{ text: "All six parts", options: { bold: true } }, { text: "114.3 cm3", options: { bold: true } }, { text: "95.0 cm3", options: { bold: true } }, { text: "-16.8%", options: { bold: true } }],
  ], tableOpts({ x: 0.3, y: 3.05, w: 5.2, colW: [1.6, 1.2, 1.2, 1.2], rowH: 0.3, fontSize: 8.5 }));

  card(s, {
    x: 5.65, y: 3.05, w: 4.05, h: 1.8,
    title: "MEASURED, NOT ASSUMED",
    body: "The pipe lock screw still gets 6.2mm of thread biting into it, which is what an earlier fault was raised to fix. The thinnest wall anywhere is still 1.50mm, the same as before.\n\nNothing got thinner. The part just stopped carrying material that was not doing anything.",
    fontSize: 9,
  });

  caption(s, "The real filament saving will be less than 16.8%. These are solid volumes, and some of what went was infill rather than solid plastic.", { x: 0.3, y: 4.88, w: 5.2 });
}

// ─────────────────────────────────────────────
// SLIDE 14: Somewhere for the electronics to live
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Somewhere for the electronics to live", "11 Aug");

  note(s, "The same gap as the camera, found the same way. The Pi, the breadboard, the power board, the capacitor and all the wiring were sitting loose on a desk, and nothing in the design held any of them.", { y: 1.08, h: 0.55, fill: "FDF2E9", line: "E67E22", fontSize: 9.5 });

  card(s, {
    x: 0.3, y: 1.78, w: 3.05, h: 2.35,
    title: "NOT UNDERNEATH",
    body: "Underneath the hub was the obvious place and it does not work.\n\nThe leg brackets hang 27.4mm below the rim, so a box has to start below them, and that is exactly where the three bags converge.\n\nThe Pi would come out through the rubbish.",
    fontSize: 9,
  });

  card(s, {
    x: 3.5, y: 1.78, w: 3.05, h: 2.35,
    title: "WHY TWO PARTS",
    strip: C.primary, stripText: C.white,
    body: "A hanger hooks over the rim and stays there. The box hangs on it from a 45 degree cleat and lifts straight off with one hand.\n\nThe weight goes into the rim through a flat roofed slot rather than a friction pinch, because one hanger holding 300g on a 33mm arm is a different problem from three clamps sharing a tripod.",
    fontSize: 9,
  });

  card(s, {
    x: 6.7, y: 1.78, w: 3.0, h: 2.35,
    title: "FAULT 15, FOUND WHILE FITTING IT",
    body: "The hanger reused the bin clamp's jaw, and that put its thumbscrew on the outward face, which is the face the box hangs on.\n\nThe screw head would have been trapped behind the box and the box could not have sat flat. The rib and the screw were swapped ends so the screw now enters from inside the bin.",
    fontSize: 9,
  });

  note(s, "Checked, not assumed. Both meshes are closed with no open edges, and both agree with volumes calculated by hand from the design dimensions: the hanger to 0.003% and the box to 0.03%, the difference being faceting on the rounded corners. Both are in the assembly and Fusion's interference check says neither touches anything.   |   Honest caveat: the breadboard was measured off a photograph, not with calipers. If it is a full size 165mm board rather than the half size 83mm one I read off the picture, the box has to be redrawn.", { y: 4.28, h: 0.92, fontSize: 9 });
}

// ─────────────────────────────────────────────
// SLIDE 15: Fusion crashed
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Fusion crashed and took two parts with it", "11 Aug");

  s.addText("Fusion crashed mid session. On restart, two parts had gone backwards to a state older than the copies saved in my project history. Both documents reported themselves as being their own latest version, so the rebuild had never actually been saved. It had been living as an unsaved edit inside Fusion, surviving between sessions, and the crash took it.", {
    x: 0.3, y: 1.08, w: 9.4, h: 0.5, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
  });

  s.addTable([
    [hdr("Part"), hdr("In Fusion after the crash"), hdr("Saved in my history")],
    ["Hub plate", "32,150 mm3, 11mm thick, tabs present", "28,289 mm3, 4mm thick, no tabs"],
    ["Tilt yoke", "39,462 mm3", "39,311 mm3"],
  ], tableOpts({ x: 0.3, y: 1.68, w: 9.4, colW: [1.6, 4.1, 3.7], rowH: 0.3 }));

  card(s, {
    x: 0.3, y: 2.85, w: 4.65, h: 2.1,
    title: "THE CHOICE, AND WHY",
    body: "The shapes were not lost, because the exported files were saved. What was lost was the Fusion history for those two parts, the list of steps that builds them, and that is what the course actually marks.\n\nI could have imported the saved shape back in as a solid block, which would have taken about a minute. I rebuilt both from their features instead, because an imported block has no steps behind it.",
    fontSize: 9,
  });

  card(s, {
    x: 5.05, y: 2.85, w: 4.65, h: 2.1,
    title: "HOW I KNOW THE REBUILD IS RIGHT",
    strip: C.primary, stripText: C.white,
    body: "The rebuilt plate measures 28,295.24 mm3 against the saved 28,295.2, with the same 45 faces.\n\nComparing the yoke face by face located the missing material as a 20 x 3.25 x 2.30mm notch, which was the relief for the tilt servo flange from fault 12. Cutting it again brings the yoke to 39,312.94 against a saved 39,312.94, 51 faces on both, and re-exporting now produces a file byte for byte identical to the one already saved.",
    fontSize: 9,
  });

  note(s, "The lesson is not about Fusion. It is that the only version of a part that exists is the one exported and saved outside the program that drew it.", { y: 5.02, w: 8.8, h: 0.4, fontSize: 9.5 });
}

// ─────────────────────────────────────────────
// SLIDE 16: Working out how to print it
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Working out how to print it", "12 Aug");

  s.addText("Everything was modelled, checked and exported, and nothing said which way up any of the fourteen pieces goes on the bed. Each part was tried in all six ways it can sit, and for each one the downward facing area was measured off the exported mesh. Faces more than 45 degrees off vertical counted as overhang, anything already lying on the bed was excluded, and the rest was grouped into patches sharing an edge. That last step is what made the answer useful: grouping by height alone made the electronics box look like it had a 190mm gap to bridge, when what it has is a row of separate windows a few mm across.", {
    x: 0.3, y: 1.08, w: 9.4, h: 0.78, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "top", margin: 0,
  });

  s.addTable([
    [hdr("Needs support"), hdr("Where"), hdr("Area")],
    ["Camera clamp", "roof closing the camera post socket, 20 x 21mm", "363 mm2"],
    ["Tilt yoke", "roof of the 25.5mm servo horn pocket", "427 mm2"],
    ["Tray", "nearly the whole underside", "8.6 cm2"],
  ], tableOpts({ x: 0.3, y: 1.95, w: 5.25, colW: [1.45, 2.85, 0.95], rowH: 0.3, fontSize: 8.5 }));

  card(s, {
    x: 5.75, y: 1.95, w: 3.95, h: 1.5,
    title: "EIGHT OF THE ELEVEN NEED NONE",
    body: "Which is the 45 degree flanks from the socket work paying off a second time. The three that do need it each need it in one identifiable place, not all over.",
    fontSize: 9,
  });

  card(s, {
    x: 0.3, y: 3.6, w: 4.65, h: 1.6,
    title: "THE TRAY IS THE AWKWARD ONE",
    strip: C.primary, stripText: C.white,
    body: "It is a saddle, so it has no flat face anywhere. Laid down it touches the bed on two end edges and nothing in between, which is zero contact area.\n\nStanding it on end cuts support from 8.6 to 0.3 square cm, and that is still wrong: it lays the print lines the wrong way in a part loaded sideways, and stands it 120mm tall on 36 square mm of bed. It gets printed flat with supports and a brim.",
    fontSize: 9,
  });

  card(s, {
    x: 5.05, y: 3.6, w: 4.65, h: 1.6,
    title: "WHAT GETS PRINTED FIRST",
    body: "One leg bracket. It is the smallest structural part at 14.7 cubic cm, and the only one that tests a brass insert hole, a conduit socket and a lock screw at the same time.\n\nThose are three of the numbers still flagged as unverified, so a single 15 cubic cm print settles them before the other thirteen pieces are committed to. All fourteen come to 354.5 cubic cm, about 440g of PLA solid.",
    fontSize: 9,
  });
}

// ─────────────────────────────────────────────
// SLIDE 17 and 18: The fifteen faults
// ─────────────────────────────────────────────
const faults = [
  ["1", "Tray mounting boss stood 1mm proud of the saddle", "Tray could not be bolted on at all", "Boss capped by the tray's own surface"],
  ["2", "Pipe lock screw had 1.56mm of thread", "Strips on assembly, the leg pulls out", "Screw moved to a pad on top, 6.2mm"],
  ["3", "Hardware list called for M3 x 12 into a 9mm foot", "Screw bottoms out, joint never tightens", "Corrected to M3 x 8, lengths now calculated"],
  ["4", "Thumbscrew length overstated by 3mm", "Buying M3 x 25 that was never needed", "Calculation corrected for the rib radius"],
  ["5", "Retaining tabs 0.25mm too tight for the real base", "Pan-tilt will not drop into the plate", "Bore opened from 124.5 to 125.6mm"],
  ["6", "Tray spacer could not bolt to the tilt arm", "Tray cannot be attached", "Replaced with a socketed mount"],
  ["7", "Spacer 15mm tall for clearance it did not need", "Head taller and less stiff than necessary", "Reduced to a 6mm plate after measuring"],
  ["8", "Mount plate offset 6.5mm from the tray boss", "Looks like a mistake, boss unsupported", "Plate resized to contain both footprints"],
  ["9", "Pan ring screws at R=44 broke into bracket holes at R=42", "Screw wanders into the neighbouring hole, neither joint pulls up", "Moved to R=50, clear of both hole circles"],
  ["10", "Servo top face is a stepped stack 2.3mm proud of its case", "Ring and yoke both sat on it, head would not seat flat", "Bearing raised to 15.5mm, clear of the highest step"],
  ["11", "1mm rib down the centre of the servo flange", "Flange rocks on the rib instead of clamping", "3mm relief groove in the ring's pocket ceiling"],
  ["12", "Tilt servo flange fouled the yoke's rib", "Servo cannot drop into its tower", "Servo moved 1.5mm outboard, rib notched 2.1mm"],
  ["13", "Camera head's bolt recess cut into the top face", "Webcam hangs under the arm upside down", "Recess moved to the underside"],
  ["14", "Lightening the sockets opened the camera post bore to air", "Post has no lid and no end stop, camera aim unset", "Bottom corners kept where anything is below"],
  ["15", "Box hanger thumbscrew entered the face the box hangs on", "Screw head trapped, the box cannot sit flat", "Rib and screw swapped ends"],
];

[[0, 8, "1 to 8"], [8, 15, "9 to 15"]].forEach(([from, to, label], page) => {
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, page === 0 ? "Fifteen faults, found before printing" : "Fifteen faults, continued", label);

  if (page === 0) {
    s.addText("Every one of these was found by checking the model against geometry I calculated separately, rather than by looking at it. Every one of them would have come out of the printer as a part that did not work.", {
      x: 0.3, y: 1.05, w: 9.4, h: 0.38, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
    });
  }

  const y = page === 0 ? 1.5 : 1.15;
  s.addTable([
    [hdr("#"), hdr("Fault"), hdr("What it would have cost"), hdr("Fixed by")],
    ...faults.slice(from, to),
  ], tableOpts({ x: 0.3, y, w: 9.4, colW: [0.4, 3.4, 3.0, 2.6], rowH: 0.34, fontSize: 8 }));

  if (page === 1) {
    note(s, "What none of this proves. All of it shows the model matches what I intended it to be. None of it shows the parts fit each other in the hand, that the tripod is stiff enough, or that an item lands where the maths says it will. Those need the printer, and that is the next thing to happen.", { y: 4.55, h: 0.65, fontSize: 9.5 });
  }
});

// ─────────────────────────────────────────────
// SLIDE 19: Where it stands
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Where it stands", "12 Aug 2026");

  s.addImage({ path: "images/photos/prototype_pantilt.jpg", x: 0.3, y: 1.12, w: 4.5, h: 3.39 });
  caption(s, "The working half on the bench. Pi 3B, the breadboard carrying the 5V rail and common ground, and the bought head with both servos wired. Everything here moves and classifies. Nothing here is a printed part of my own design yet.", { x: 0.3, y: 4.54, w: 4.5 });

  card(s, {
    x: 4.95, y: 1.12, w: 4.75, h: 1.6,
    title: "BUILT AND WORKING",
    body: "Raspberry Pi 3B on the network, code deployed and running. USB webcam capturing, not yet mounted. Two MG996R servos moving, jitter solved with hardware timed pulses. USB-C power board on its own 5V rail with a 1000uF capacitor and common ground. Dashboard, classify and sort pipeline, animation engine, calibration and stats all working.",
    fontSize: 8.5,
  });

  card(s, {
    x: 4.95, y: 2.82, w: 4.75, h: 1.25,
    title: "DESIGNED BUT NOT MADE",
    strip: C.primary, stripText: C.white,
    body: "None of the eleven printed designs exist yet: hub plate, three leg brackets, two bin clamps, camera clamp, camera head, pan ring, tilt yoke, tilt cradle, tray, box hanger and electronics box. Eleven designs, fourteen pieces off the printer. The bin, the conduit, the inserts and the bags are not bought either.",
    fontSize: 8.5,
  });

  card(s, {
    x: 4.95, y: 4.15, w: 4.75, h: 1.05,
    title: "DROPPED, AND WHY",
    body: "An ultrasonic item sensor and an LED status ring. Both belonged to the earlier two-board design, neither had a home in the CAD, and the dashboard already does both jobs. The code stays, so the ring is a solder job if it ever goes on.",
    fontSize: 8.5,
  });
}

// ─────────────────────────────────────────────
// SLIDE 20: What happens next
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "What happens next", "Next steps");

  s.addImage({ path: "images/cad/rebuilt_assembly_iso.png", x: 0.3, y: 1.12, w: 4.6, h: 3.45 });
  caption(s, "The whole design in a 60L bin. Three legs out to three rim clamps, the head on the hub, and the camera on its own post looking down at the tray.", { x: 0.3, y: 4.6, w: 4.6 });

  const steps = [
    ["1", "Print one leg bracket", "and check the insert hole, the conduit socket and the lock screw against it"],
    ["2", "Measure the breadboard with calipers", "before committing to the electronics box"],
    ["3", "Print the remaining thirteen pieces", "and photograph anything that does not fit, with the measurement"],
    ["4", "Mount the webcam and calibrate", "the three bin positions from the dashboard"],
    ["5", "Test with real waste items", "and record how many out of how many land in the right sector"],
  ];
  steps.forEach(([n, what, detail], i) => {
    const y = 1.12 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y, w: 4.6, h: 0.62, fill: { color: C.white }, line: { color: C.border } });
    s.addShape(pres.shapes.OVAL, { x: 5.22, y: y + 0.14, w: 0.34, h: 0.34, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText(n, { x: 5.22, y: y + 0.14, w: 0.34, h: 0.34, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText([
      { text: what + "  ", options: { bold: true, color: C.primary } },
      { text: detail, options: { color: C.text } },
    ], { x: 5.66, y: y + 0.04, w: 3.9, h: 0.54, fontSize: 9, fontFace: "Calibri", valign: "middle", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// SLIDES 21+: Full revision history, read from git
// ─────────────────────────────────────────────
{
  const commits = COMMITS;

  // 24 rows is what fits above the slide number once PowerPoint applies its own
  // minimum row height. 26 overflowed the bottom of the slide.
  const PER_COL = 24;
  const PER_SLIDE = PER_COL * 2;
  const pages = Math.ceil(commits.length / PER_SLIDE);

  for (let p = 0; p < pages; p++) {
    let s = pres.addSlide();
    s.background = { color: C.lightgray };
    addHeader(s, p === 0 ? "Every saved revision, in order" : "Revision history, continued", `${p + 1} of ${pages}`);

    if (p === 0) {
      s.addText("Read out of the project's version control history when this deck was generated. The dates are not typed in by hand and cannot be adjusted afterwards. Entries starting cad are mechanical design work.", {
        x: 0.3, y: 1.02, w: 9.4, h: 0.34, fontSize: 9.5, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
      });
    }

    const y = p === 0 ? 1.42 : 1.12;
    const slice = commits.slice(p * PER_SLIDE, (p + 1) * PER_SLIDE);
    const left = slice.slice(0, PER_COL);
    const right = slice.slice(PER_COL);

    [left, right].forEach((col, ci) => {
      if (!col.length) return;
      s.addTable(
        col.map(([d, subj]) => [
          { text: d, options: { fontSize: 6, color: C.gray } },
          { text: subj.length > 62 ? subj.slice(0, 60) + "..." : subj, options: { fontSize: 6 } },
        ]),
        tableOpts({ x: 0.3 + ci * 4.75, y, w: 4.6, colW: [0.95, 3.65], rowH: 0.14, fontSize: 6, margin: [0.01, 0.05, 0.01, 0.05] })
      );
    });
  }

  console.log(`${commits.length} revisions across ${pages} slide(s)`);
}

pres.writeFile({ fileName: "Hardware_Development_Log.pptx" })
  .then(() => console.log("Done! -> Hardware_Development_Log.pptx"))
  .catch((e) => console.error(e));
