// Hardware Development Log -> Hardware_Development_Log.pptx
//
//   cd portfolio && bun run hardware_log.js
//
// A separate deck from ai_bin.js. That one is the assessed portfolio and has
// been submitted; this one is Sonny's record of how the mechanical side got
// designed. Same house style so the two read as the same student's work.
//
// Voice rules for anything added here: first person, short sentences, plain
// words. Sonny writes it, so it should sound like a Year 12 student explaining
// what he got wrong, not like an engineering report. Own the mistakes as things
// he had not learned yet. No em dashes, no emoji.
//
// Keep the text short. Every number comes from docs/build_log.md,
// docs/mechanical_design.md, docs/mechanical_iteration_log.md or cad/README.md.

const pptxgen = require("pptxgenjs");

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

function card(s, { x, y, w, h, title, body, strip = C.accent, stripText = C.dark, fontSize = 10 }) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.white }, line: { color: C.border }, shadow: mk() });
  if (title) {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.36, fill: { color: strip }, line: { color: strip } });
    s.addText(title, { x, y, w, h: 0.36, fontSize: 9.5, bold: true, color: stripText, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
  if (body) {
    s.addText(body, {
      x: x + 0.15, y: y + (title ? 0.44 : 0.12), w: w - 0.3, h: h - (title ? 0.56 : 0.24),
      fontSize, color: C.text, fontFace: "Calibri", valign: "top", margin: 0,
    });
  }
}

function caption(s, text, { x, y, w }) {
  s.addText(text, { x, y, w, h: 0.4, fontSize: 9, italic: true, color: C.gray, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
}

// The one-line takeaway band. Kept to a single sentence on purpose.
function note(s, text, { x = 0.3, y, w = 9.4, h = 0.5, fill = C.lightgreen, line = C.accent, fontSize = 10.5 } = {}) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line } });
  s.addText(text, { x: x + 0.15, y, w: w - 0.3, h, fontSize, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0 });
}

const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.primary }, fontSize: 9 } });

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
// 1. Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText("HARDWARE DEVELOPMENT LOG", { x: 0.5, y: 1.05, w: 9, h: 0.8, fontSize: 40, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "left", margin: 0 });
  s.addText("Smart Sort Bin: how I designed the sorting mechanism, and the faults I found doing it", { x: 0.5, y: 1.9, w: 8.5, h: 0.45, fontSize: 14, color: "A8D5BA", fontFace: "Calibri", align: "left", margin: 0 });
  s.addText("VCE Systems Engineering, Units 3 and 4", { x: 0.5, y: 2.38, w: 8.5, h: 0.35, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "left", italic: true, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.05, w: 6.5, h: 0.02, fill: { color: C.accent, transparency: 40 }, line: { color: C.accent, transparency: 40 } });

  s.addText("Sonny Taylor  |  Beaumaris Secondary College", { x: 0.5, y: 3.25, w: 6.5, h: 0.35, fontSize: 12, color: "A8D5BA", fontFace: "Calibri", margin: 0 });
  s.addText("February to August 2026", { x: 0.5, y: 3.65, w: 6.5, h: 0.35, fontSize: 12, color: "C8E6D5", fontFace: "Calibri", margin: 0 });
}

// ─────────────────────────────────────────────
// 2. What this is
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "About this log", "Read this first");

  card(s, {
    x: 0.3, y: 1.2, w: 4.65, h: 1.5,
    title: "WHAT THIS COVERS",
    body: "How the mechanism got designed, in the order it happened. I kept the versions that did not work, because that is where I learned the most.\n\nThe old versions are the real ones, saved at the time. I did not redraw them afterwards.",
    fontSize: 10,
  });

  card(s, {
    x: 5.05, y: 1.2, w: 4.65, h: 1.5,
    title: "CURRENT STATUS",
    strip: C.primary, stripText: C.white,
    body: "The electronics and the software work. I have not printed any of the parts yet.\n\nSo everything in here is designed and checked, not built and tested. I have tried not to claim anything I have not actually done.",
    fontSize: 10,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.95, w: 9.4, h: 2.15, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.95, w: 9.4, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  s.addText("SUMMARY", { x: 0.3, y: 2.95, w: 9.4, h: 0.35, fontSize: 9.5, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  const claims = [
    ["15", "mistakes I caught\nbefore printing"],
    ["11", "parts designed\nand ready to print"],
    ["65mm", "of height I took out\nof the head"],
  ];
  const cw = 9.4 / claims.length;
  claims.forEach(([big, small], i) => {
    const cx = 0.3 + i * cw;
    if (i > 0) s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.4, w: 0.02, h: 1.55, fill: { color: C.border }, line: { color: C.border } });
    s.addText(big, { x: cx + 0.1, y: 3.5, w: cw - 0.2, h: 0.7, fontSize: 34, bold: true, color: C.primary, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(small, { x: cx + 0.1, y: 4.24, w: cw - 0.2, h: 0.72, fontSize: 10.5, color: C.text, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// 3. Timeline
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Development timeline", "Feb to Aug 2026");

  s.addTable([
    [hdr("Date"), hdr("Work done"), hdr("Slide")],
    ["24 Feb", "Sketched three concepts and selected one", "4"],
    ["26 Feb", "Drew the first sorting tray", "5"],
    ["4 Aug", "Designed the tripod hub and the bin clamps", "6, 7"],
    ["10 Aug", "Rebuilt all the parts in Fusion 360", "8"],
    ["11 Aug", "Redesigned the head to bring its height down", "9, 10"],
    ["11 Aug", "Designed the camera post and its mount", "11"],
    ["11 Aug", "Lightened the pipe sockets on six parts", "13"],
    ["11 Aug", "Designed the electronics enclosure", "14"],
    ["11 Aug", "Recovered two parts lost to a CAD crash", "15"],
    ["12 Aug", "Worked out print orientation and supports", "16"],
  ], tableOpts({ x: 0.3, y: 1.2, w: 9.4, colW: [1.3, 7.1, 1.0], rowH: 0.36, fontSize: 10 }));
}

// ─────────────────────────────────────────────
// 4. Three ideas
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Concept selection", "24 Feb");

  const opts = [
    { name: "A - PAN-TILT TRAY", img: "images/sketches/design_option_a.png", cap: "Picked it. Two servos and one tray.", strip: C.accent, stripText: C.dark },
    { name: "B - CONVEYOR + FLAPS", img: "images/sketches/design_option_b.png", cap: "Too expensive, and the belt gets dirty.", strip: C.primary, stripText: C.white },
    { name: "C - ROTATING CAROUSEL", img: "images/sketches/design_option_c.png", cap: "Spinning full bins is slow, and it is too tall.", strip: C.primary, stripText: C.white },
  ];

  opts.forEach((o, i) => {
    const cx = 0.3 + i * 3.2;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.15, w: 3.0, h: 3.0, fill: { color: C.white }, line: { color: C.border } });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.15, w: 3.0, h: 0.34, fill: { color: o.strip }, line: { color: o.strip } });
    s.addText(o.name, { x: cx, y: 1.15, w: 3.0, h: 0.34, fontSize: 9.5, bold: true, color: o.stripText, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addImage({ path: o.img, x: cx + 0.08, y: 1.55, w: 2.84, h: 2.01 });
    s.addText(o.cap, { x: cx + 0.1, y: 3.6, w: 2.8, h: 0.5, fontSize: 9.5, color: C.text, fontFace: "Calibri", align: "center", valign: "top", margin: 0 });
  });

  note(s, "I picked A because it needs the fewest parts, and because the Ameru bin already sorts this way so I knew it works.", { y: 4.45, h: 0.6 });
}

// ─────────────────────────────────────────────
// 5. The tray
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Redesigning the sorting tray", "26 Feb, 6 Aug");

  s.addImage({ path: "images/cad/evolution/tray.png", x: 1.7, y: 1.15, w: 6.6, h: 2.78 });

  card(s, {
    x: 0.3, y: 4.05, w: 4.65, h: 1.15,
    body: "I made the tray by hollowing out a curved block, which left a wall standing all the way round the edge. I did not put it there on purpose and I left it in, because I thought it would stop things rolling off. It does the opposite. It holds the item in at exactly the moment the tray is trying to tip it out.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 4.05, w: 4.65, h: 1.15,
    body: "The new one has no rim. The sides curl up 10mm so things roll back to the middle, and the ends drop 5mm so they slide off. That gives a 9.5 degree slope, and plastic needs about 19 degrees to start sliding, so it stays put until I tip it.",
    fontSize: 10,
  });
}

// ─────────────────────────────────────────────
// 6. The clamps
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Redesigning the bin clamp", "4 to 6 Aug");

  s.addImage({ path: "images/cad/evolution/clamp.png", x: 0.3, y: 1.15, w: 9.4, h: 2.38 });

  card(s, {
    x: 0.3, y: 3.68, w: 4.65, h: 1.25,
    title: "THE PROBLEM",
    body: "I drew a flat jaw, because a bin wall is flat. But two of my three legs arrive at the rim on an angle, so two of the three clamps would have gripped on one corner.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 3.68, w: 4.65, h: 1.25,
    title: "THE FIX",
    strip: C.primary, stripText: C.white,
    body: "A rounded rib instead of a flat face. It touches along a line no matter what angle it comes in at, and the thumbscrew opposite gives it a second contact point.",
    fontSize: 9.5,
  });

  note(s, "It also grips a round bin or a cardboard box now, which I was not aiming for.", { y: 5.0, w: 8.8, h: 0.4, fontSize: 10 });
}

// ─────────────────────────────────────────────
// 7. The hub plate
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Reducing material in the hub plate", "4 to 11 Aug");

  s.addImage({ path: "images/cad/evolution/plate.png", x: 0.65, y: 1.15, w: 8.7, h: 2.2 });

  s.addImage({ path: "images/cad/leg_layout.png", x: 0.3, y: 3.6, w: 1.5, h: 1.5 });
  card(s, {
    x: 2.0, y: 3.6, w: 7.7, h: 1.5,
    body: "I started with a solid disc because it was the easy thing to draw. Once I looked at where the load actually goes, the middle of it was doing nothing, so it became three spokes.\n\nThe legs sit at 60, 180 and 300 degrees rather than 0, 120 and 240. That puts a leg at the back instead of a gap, so the two front legs frame the opening you drop rubbish into rather than one leg standing in the middle of it.",
    fontSize: 10,
  });
}

// ─────────────────────────────────────────────
// 8. Redrawing in Fusion
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Rebuilding the parts in Fusion 360", "10 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 4.65, h: 1.6,
    title: "REASON FOR THE CHANGE",
    body: "I had drawn everything in OpenSCAD, which builds shapes from code. The course wants Fusion, so I rebuilt all five parts there.\n\nI thought this would be a waste of a day. It was not.",
    fontSize: 10,
  });

  card(s, {
    x: 5.05, y: 1.2, w: 4.65, h: 1.6,
    title: "WHAT IT EXPOSED",
    strip: C.primary, stripText: C.white,
    body: "Fusion puts the parts together against each other and OpenSCAD does not. As soon as they were assembled I could see five things wrong that I had not been able to see before.",
    fontSize: 10,
  });

  s.addTable([
    [hdr("Fault"), hdr("Consequence if it had been printed")],
    ["The tray's mounting boss stood 1mm proud of the surface", "The tray could not have been bolted on at all"],
    ["The pipe lock screw only had 1.56mm of thread in it", "It strips as you tighten it and the leg pulls out"],
    ["I wrote down M3 x 12 screws going into a 9mm deep hole", "The screw hits the bottom and the joint never tightens"],
    ["I worked out the thumbscrew 3mm too long", "I buy screws I do not need"],
    ["My retaining tabs were 0.25mm too tight for the real part", "The pan-tilt will not drop into the plate"],
  ], tableOpts({ x: 0.3, y: 3.1, w: 9.4, colW: [5.0, 4.4], rowH: 0.34, fontSize: 9 }));
}

// ─────────────────────────────────────────────
// 9. The head was too tall
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Reducing the height of the head", "11 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 5.3, h: 1.55,
    body: "I bought a ready made pan and tilt bracket early on and designed everything around it. When I finally measured the whole assembly, it was holding the tray 147mm above the bin rim and the thing towered over the bin it is meant to sit in.\n\n85mm of that was the bracket I had bought.",
    fontSize: 10,
  });

  s.addImage({ path: "images/photos/3dprint_bracket.png", x: 5.85, y: 1.2, w: 1.85, h: 1.84 });
  s.addImage({ path: "images/cad/bought_tracker_front.png", x: 7.9, y: 1.66, w: 1.8, h: 1.35 });
  caption(s, "The bracket I bought, and where it ended up sitting.", { x: 5.85, y: 3.08, w: 3.85 });

  card(s, {
    x: 0.3, y: 3.55, w: 9.4, h: 1.6,
    title: "WHY IT WAS NOT CAUGHT EARLIER",
    body: "When I bought it I only had the STL file, which is just a shape with no dimensions attached, so I could not measure it properly and I treated it as fixed. I did not know at the time that a STEP file would have given me the actual sizes. Once I got hold of one I could see the problem straight away: the bracket stands its tilt servo up on its end, so the servo body finishes 37mm above the point the tray pivots on, and the tray has to clear the servo before it clears anything else.",
    fontSize: 10,
  });
}

// ─────────────────────────────────────────────
// 10. 147 becomes 82
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Head redesign, before and after", "11 Aug");

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.65, h: 2.95, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.15, w: 4.65, h: 0.34, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText("BEFORE - THE BRACKET I BOUGHT", { x: 0.3, y: 1.15, w: 4.65, h: 0.34, fontSize: 9, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: "images/cad/bought_tracker_front.png", x: 0.45, y: 1.55, w: 4.35, h: 2.45 });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.05, y: 1.15, w: 4.65, h: 2.95, fill: { color: C.white }, line: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.05, y: 1.15, w: 4.65, h: 0.34, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("AFTER - THREE PARTS I DREW", { x: 5.05, y: 1.15, w: 4.65, h: 0.34, fontSize: 9, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addImage({ path: "images/cad/rebuilt_head_front.png", x: 5.2, y: 1.55, w: 4.35, h: 2.45 });

  caption(s, "Same scale and same view. I laid the tilt servo down flat instead of standing it on its end.", { x: 0.3, y: 4.15, w: 9.4 });

  const stats = [
    ["147 to 82mm", "how high the tray sits"],
    ["138 to 101", "cubic cm of plastic"],
    ["300 to 235mm", "camera post, cut to match"],
  ];
  const sw = 9.4 / stats.length;
  stats.forEach(([big, small], i) => {
    const cx = 0.3 + i * sw;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 4.5, w: sw - 0.1, h: 0.7, fill: { color: C.lightgreen }, line: { color: C.accent } });
    s.addText(big, { x: cx, y: 4.55, w: sw - 0.1, h: 0.3, fontSize: 14, bold: true, color: C.primary, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText(small, { x: cx + 0.05, y: 4.87, w: sw - 0.2, h: 0.28, fontSize: 9, color: C.text, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  });
}

// ─────────────────────────────────────────────
// 11. The camera had nowhere to go
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Mounting the camera", "11 Aug");

  note(s, "I took the bracket's camera plate off so the tray could go there, and never asked myself where the camera was supposed to sit instead.", { y: 1.15, h: 0.5, fill: "FDF2E9", line: "E67E22" });

  s.addImage({ path: "images/cad/evolution/camera_clamp.png", x: 0.3, y: 1.85, w: 4.3, h: 2.72 });
  caption(s, "The camera clamp is just my bin clamp with a socket on top.", { x: 0.3, y: 4.6, w: 4.3 });

  s.addImage({ path: "images/cad/camera_post_iso.png", x: 4.9, y: 1.85, w: 2.6, h: 1.95 });

  card(s, {
    x: 7.6, y: 1.85, w: 2.1, h: 1.95,
    body: "It could not go on the hub plate, because that is exactly where the tray swings when it tips.\n\nSo it goes on a bit of the same conduit, standing on one of the clamps, off to the side.",
    fontSize: 9,
  });

  card(s, {
    x: 4.9, y: 3.95, w: 4.8, h: 1.25,
    title: "A SECOND FAULT ON THE SAME PART",
    body: "The webcam has a tripod thread underneath it, so I cut a recess for the bolt. I cut it into the top of the arm, which would have left the camera hanging under it upside down. I checked the volume of the part and it matched what I expected, so I thought it was fine. A volume cannot tell you which side a hole is cut into.",
    fontSize: 8.5,
  });
}

// ─────────────────────────────────────────────
// 12. What I did not know about servos
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Designing around a real servo", "11 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 9.4, h: 1.15,
    body: "I drew my three head parts around the servo as it looks in the datasheet picture, which is a neat rectangular box. A real MG996R is not. Three of my parts were sitting on surfaces that are not actually flat, and I only found out when I put them together in Fusion.",
    fontSize: 10.5,
  });

  s.addTable([
    [hdr("What the real servo does"), hdr("What it did to my part")],
    ["The top face is a stepped stack that sticks up 2.3mm above the case", "My ring and my yoke were both resting on it, so the head would not sit flat"],
    ["There is a 1mm rib running down the middle of the mounting flange", "The flange rocks on the rib instead of being clamped down"],
    ["The flange is wider than I allowed for", "The servo will not drop into its tower at all"],
  ], tableOpts({ x: 0.3, y: 2.55, w: 9.4, colW: [4.7, 4.7], rowH: 0.5, fontSize: 9.5 }));

  note(s, "This is the one I would not have caught by being more careful. I just did not know it yet.", { y: 4.68, h: 0.5 });
}

// ─────────────────────────────────────────────
// 13. Making the clamps lighter
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Lightening the pipe sockets", "11 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 4.65, h: 1.5,
    title: "THE CHANGE",
    body: "Every part that holds a pipe was a solid block with a round hole through it, which is 36% plastic and 64% air. The plastic was in the wrong place too: 1.5mm of wall at the sides where the load is, and 6mm sitting in the corners.\n\nSo I cut the corners off all six parts.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 1.2, w: 4.65, h: 1.5,
    title: "WHAT IT BROKE",
    strip: C.primary, stripText: C.white,
    body: "I applied the same rule to every corner without checking what each one was holding up. On the camera clamp there was something underneath: the socket the camera post sits in.\n\nCutting the corners opened that hole to the outside air and took away the stop that sets how far the post goes in.",
    fontSize: 9.5,
  });

  s.addTable([
    [hdr("Part"), hdr("Before"), hdr("After"), hdr("Saved")],
    ["Bin clamp, x2", "17,478 mm3", "13,709 mm3", "-21.6%"],
    ["Camera clamp", "30,919 mm3", "23,649 mm3", "-23.5%"],
    ["Leg bracket, x3", "16,137 mm3", "14,657 mm3", "-9.2%"],
  ], tableOpts({ x: 0.3, y: 2.95, w: 5.2, colW: [1.6, 1.2, 1.2, 1.2], rowH: 0.32, fontSize: 8.5 }));

  card(s, {
    x: 5.65, y: 2.95, w: 4.05, h: 1.6,
    title: "WHY TWO PARTS SAVE LESS",
    body: "Because I put the bottom corners back on the camera clamp and the leg bracket, where something is attached underneath. They only come off the bin clamp, where nothing is.",
    fontSize: 9,
  });

  note(s, "The corners on two of these parts measure exactly the same and do completely different jobs. Size is not a good way to tell what is holding something up.", { y: 4.7, h: 0.5, fontSize: 10 });
}

// ─────────────────────────────────────────────
// 14. The electronics box
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Housing the electronics", "11 Aug");

  note(s, "Same mistake as the camera. The Pi, the breadboard, the power board and all the wiring were loose on the desk, and I had not designed anything to hold them.", { y: 1.15, h: 0.5, fill: "FDF2E9", line: "E67E22" });

  card(s, {
    x: 0.3, y: 1.85, w: 3.05, h: 2.0,
    title: "WHY NOT UNDERNEATH",
    body: "Underneath was my first idea and it does not work. The leg brackets hang 27mm below the rim, so a box has to start below them, and that is where the three bags meet.\n\nThe Pi would come out through the rubbish.",
    fontSize: 9.5,
  });

  card(s, {
    x: 3.5, y: 1.85, w: 3.05, h: 2.0,
    title: "HANGING IT OUTSIDE",
    strip: C.primary, stripText: C.white,
    body: "A hanger hooks over the rim and stays there. The box sits on it and lifts straight off with one hand.\n\nThe weight goes into the rim through a flat slot rather than a friction grip, because one box on a 33mm arm is a lot more load than a clamp sees.",
    fontSize: 9.5,
  });

  card(s, {
    x: 6.7, y: 1.85, w: 3.0, h: 2.0,
    title: "A FAULT FOUND WHILE FITTING IT",
    body: "I reused the bin clamp's jaw for the hanger, which put the thumbscrew on the outside face. That is the face the box hangs on.\n\nThe screw head would have been trapped behind the box. I swapped the rib and the screw around so it comes in from inside the bin.",
    fontSize: 9.5,
  });

  note(s, "Still to check: I measured the breadboard off a photo instead of with calipers. If it is the bigger 165mm one, I have to redraw the box.", { y: 4.05, h: 0.5, fontSize: 10 });
}

// ─────────────────────────────────────────────
// 15. Fusion crashed
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Recovering two lost parts", "11 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 9.4, h: 1.15,
    body: "Fusion crashed while I was working. When it came back, two of my parts had gone backwards to older versions. Both of them said they were saved and up to date, so I had been working on edits that had never actually been written anywhere. I had trusted it because it told me it had saved.",
    fontSize: 10.5,
  });

  card(s, {
    x: 0.3, y: 2.55, w: 4.65, h: 1.65,
    title: "THE DECISION",
    body: "The shapes themselves were not gone, because I had exported them. What was gone was the Fusion history, the list of steps that builds each part.\n\nI could have imported the exported shape back in as one solid lump in about a minute. I redrew both properly instead, because a lump has no steps behind it and the steps are the part that gets marked.",
    fontSize: 9.5,
  });

  card(s, {
    x: 5.05, y: 2.55, w: 4.65, h: 1.65,
    title: "VERIFYING THE REBUILD",
    strip: C.primary, stripText: C.white,
    body: "I compared both against the versions I had exported earlier. The plate came out at 28,295.24 against 28,295.2, with the same number of faces.\n\nThe yoke was missing a small notch, which turned out to be the relief I had cut for the servo flange. Once I cut it again the yoke matched exactly.",
    fontSize: 9.5,
  });

  note(s, "I now export a part as soon as I am happy with it, instead of trusting that it is safe inside the program.", { y: 4.4, h: 0.5 });
}

// ─────────────────────────────────────────────
// 16. Printing
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Preparing the parts for printing", "12 Aug");

  card(s, {
    x: 0.3, y: 1.2, w: 9.4, h: 0.9,
    body: "Everything was drawn and exported and I still had no idea which way up any of it goes on the printer. I tried each part all six ways it can sit and measured how much of it would be hanging in mid air. Eight of the eleven need no support at all, which is because of the 45 degree edges I had already put on them for a different reason.",
    fontSize: 10.5,
  });

  s.addTable([
    [hdr("Needs support"), hdr("Where"), hdr("How much")],
    ["Camera clamp", "the roof over the camera post socket", "363 mm2"],
    ["Tilt yoke", "the roof of the servo horn pocket", "427 mm2"],
    ["Tray", "nearly the whole underside", "8.6 cm2"],
  ], tableOpts({ x: 0.3, y: 2.3, w: 5.25, colW: [1.45, 2.85, 0.95], rowH: 0.34, fontSize: 9 }));

  card(s, {
    x: 5.75, y: 2.3, w: 3.95, h: 1.36,
    title: "THE TRAY IS THE EXCEPTION",
    body: "It is a curved saddle, so it has no flat face anywhere. Laid down it only touches the bed on two edges. It gets printed flat with supports and a brim anyway, because standing it up puts the layers the wrong way in a part that gets pushed sideways.",
    fontSize: 9,
  });

  card(s, {
    x: 0.3, y: 3.9, w: 9.4, h: 1.3,
    title: "FIRST PART TO BE PRINTED",
    strip: C.primary, stripText: C.white,
    body: "One leg bracket. It is the smallest structural part at 14.7 cubic cm, and it is the only one that tests a brass insert hole, a conduit socket and a lock screw all at once. Those are three of the numbers I am least sure about, so one small print tells me whether they work before I commit to the other thirteen pieces. All fourteen come to about 440g of plastic if they were solid, so probably 200 to 265g once sliced properly.",
    fontSize: 10,
  });
}

// ─────────────────────────────────────────────
// 17. All fifteen
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Faults found before printing", "15 total");

  s.addText("All of these were caught before I printed anything. Most of them are things I did not know yet rather than things I was careless about, which is the reason I have written them all down.", {
    x: 0.3, y: 1.08, w: 9.4, h: 0.36, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "middle", margin: 0,
  });

  const faults = [
    ["1", "Tray boss stood 1mm proud of the surface", "Tray could not be bolted on"],
    ["2", "Pipe lock screw only had 1.56mm of thread", "Strips, and the leg pulls out"],
    ["3", "M3 x 12 screws into a 9mm hole", "Joint never tightens"],
    ["4", "Thumbscrew worked out 3mm too long", "Buying screws I do not need"],
    ["5", "Retaining tabs 0.25mm too tight", "Part will not drop in"],
    ["6", "Tray spacer could not bolt to the arm", "Tray cannot be attached"],
    ["7", "Spacer 15mm tall for no reason", "Head taller and floppier"],
    ["8", "Mount plate offset 6.5mm from the boss", "Looks wrong, boss unsupported"],
    ["9", "Pan ring screws broke into the bracket holes", "Neither joint pulls up tight"],
    ["10", "Servo top is stepped, not flat", "Head will not seat flat"],
    ["11", "Rib down the servo flange", "Flange rocks instead of clamping"],
    ["12", "Servo flange fouled the yoke", "Servo will not go in"],
    ["13", "Camera bolt recess on the wrong face", "Webcam hangs upside down"],
    ["14", "Cutting corners opened the post socket", "Camera aim is not set by anything"],
    ["15", "Hanger thumbscrew on the face the box sits on", "Box cannot sit flat"],
  ];

  const half = 8;
  [faults.slice(0, half), faults.slice(half)].forEach((col, ci) => {
    s.addTable([
      [hdr("#"), hdr("Fault"), hdr("Consequence if built")],
      ...col,
    ], tableOpts({ x: 0.3 + ci * 4.75, y: 1.55, w: 4.6, colW: [0.42, 2.28, 1.9], rowH: 0.36, fontSize: 7.5 }));
  });
}

// ─────────────────────────────────────────────
// 18. What I learned
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "What the faults had in common", "Looking back");

  const lessons = [
    ["Draw it assembled, not part by part", "Nearly everything I got wrong only showed up once the parts were sitting against each other. On their own they all looked fine."],
    ["Measure the thing, not the picture of it", "The servo, the bought bracket and the breadboard all caught me out because I went off a datasheet drawing or a photo instead of the real object."],
    ["A number matching does not mean it is right", "I checked the camera head's volume, it matched, and the bolt hole was still on the wrong side. The check I was using could not see that kind of mistake."],
    ["Ask what a bit of material is doing before removing it", "I saved plastic on six parts with one rule and broke one of them, because I never asked what each corner was holding up."],
  ];

  lessons.forEach(([title, body], i) => {
    const x = 0.3 + (i % 2) * 4.75;
    const y = 1.35 + Math.floor(i / 2) * 1.85;
    card(s, { x, y, w: 4.6, h: 1.55, title: title.toUpperCase(), body, fontSize: 10, strip: i % 2 === 0 ? C.accent : C.primary, stripText: i % 2 === 0 ? C.dark : C.white });
  });
}

// ─────────────────────────────────────────────
// 19. Where it is up to
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Current status", "12 Aug 2026");

  s.addImage({ path: "images/photos/prototype_pantilt.jpg", x: 0.3, y: 1.2, w: 4.5, h: 3.39 });
  caption(s, "The half that works. Everything here moves and classifies. None of it is a part I designed yet.", { x: 0.3, y: 4.62, w: 4.5 });

  card(s, {
    x: 4.95, y: 1.2, w: 4.75, h: 1.35,
    title: "WORKING",
    body: "The Pi, both servos, the camera and the whole dashboard. Servo jitter is fixed. I can classify an item and drive the head to a bin from a web page.",
    fontSize: 9.5,
  });

  card(s, {
    x: 4.95, y: 2.65, w: 4.75, h: 1.35,
    title: "DESIGNED, NOT MADE",
    strip: C.primary, stripText: C.white,
    body: "All eleven printed parts. Eleven designs, fourteen pieces off the printer. I have not bought the bin, the conduit, the inserts or the bags yet either.",
    fontSize: 9.5,
  });

  card(s, {
    x: 4.95, y: 4.1, w: 4.75, h: 1.1,
    title: "DROPPED",
    body: "The ultrasonic sensor and the LED ring. Both were from my older two board design and the dashboard already does what they were for. The code stays, so the ring is a solder job if I change my mind.",
    fontSize: 9,
  });
}

// ─────────────────────────────────────────────
// 20. What is next
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Next steps", "What happens now");

  s.addImage({ path: "images/cad/rebuilt_assembly_iso.png", x: 0.3, y: 1.2, w: 4.6, h: 3.45 });
  caption(s, "The whole thing in a 60L bin, as it stands now.", { x: 0.3, y: 4.68, w: 4.6 });

  const steps = [
    ["1", "Print one leg bracket", "and see if the three numbers I am unsure about hold up"],
    ["2", "Measure the breadboard properly", "before I commit to the box"],
    ["3", "Print the other thirteen pieces", "and photograph anything that does not fit"],
    ["4", "Mount the webcam and calibrate", "the three bin positions"],
    ["5", "Test it with real rubbish", "and write down how many out of how many land right"],
  ];
  steps.forEach(([n, what, detail], i) => {
    const y = 1.2 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y, w: 4.6, h: 0.62, fill: { color: C.white }, line: { color: C.border } });
    s.addShape(pres.shapes.OVAL, { x: 5.22, y: y + 0.14, w: 0.34, h: 0.34, fill: { color: C.accent }, line: { color: C.accent } });
    s.addText(n, { x: 5.22, y: y + 0.14, w: 0.34, h: 0.34, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
    s.addText([
      { text: what + "  ", options: { bold: true, color: C.primary } },
      { text: detail, options: { color: C.text } },
    ], { x: 5.66, y: y + 0.04, w: 3.9, h: 0.54, fontSize: 9, fontFace: "Calibri", valign: "middle", margin: 0 });
  });
}

pres.writeFile({ fileName: "Hardware_Development_Log.pptx" })
  .then(() => console.log("Done! -> Hardware_Development_Log.pptx"))
  .catch((e) => console.error(e));
