// AI Smart Bin — Criterion 2: Component & Subsystem Testing
// Run: bun run ai_bin_c2.js

const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Smart Bin – Criterion 2";

const C = {
  dark: "0D2818",
  primary: "1A5C38",
  accent: "2ECC71",
  white: "FFFFFF",
  lightgray: "F4F6F5",
  text: "1A2E1F",
};

const mk = () => ({ type: "outer", blur: 7, offset: 3, angle: 135, color: "000000", opacity: 0.11 });

function addHeader(s, title, badge) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(title, { x: 0.4, y: 0, w: badge ? 6.5 : 9.2, h: 1.0, fontSize: 24, bold: true, color: C.white, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
  if (badge) {
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fill: { color: C.accent, transparency: 20 }, line: { color: C.accent, transparency: 20 } });
    s.addText(badge, { x: 7.2, y: 0.15, w: 2.55, h: 0.7, fontSize: 11, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  }
}

function addFooter(s, text) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: C.primary }, line: { color: C.primary } });
  s.addText(text, { x: 0.4, y: 5.3, w: 9.2, h: 0.325, fontSize: 9, color: "A8D5BA", fontFace: "Calibri", italic: true, valign: "middle", margin: 0 });
}

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
  return s;
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

  s.addText("Criterion 2:", { x: 0.5, y: 1.2, w: 9, h: 1.0, fontSize: 52, bold: true, color: C.accent, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });
  s.addText("Component & Subsystem Testing", { x: 0.5, y: 2.25, w: 9, h: 0.5, fontSize: 18, color: "A8D5BA", fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
  s.addText("Design Iteration, Component Selection & Testing", { x: 0.5, y: 2.8, w: 9, h: 0.4, fontSize: 13, color: "7EC8A0", fontFace: "Calibri", align: "center", italic: true, margin: 0 });

  addFooter(s, "Systems Engineering 3 & 4 Portfolio  |  AI Smart Bin Project");
}

// ─────────────────────────────────────────────
// SLIDE 2: Design Iteration — AI Classification Approach
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.lightgray };
  addHeader(s, "Design Iteration — AI Classification Approach", "Key Decision");

  // Original approach card (left)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fill: { color: "C0392B" }, line: { color: "C0392B" } });
  s.addText("✗  ORIGINAL APPROACH — Rejected", { x: 0.3, y: 1.2, w: 4.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText("Custom YOLO Model + Jetson Nano / MaixCAM", { x: 0.45, y: 1.72, w: 4.2, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it would work:", options: { bold: true, breakLine: true } },
      { text: "Train a custom YOLO object detection model on waste images, deploy it on an edge AI board (Jetson Nano ~$200 or MaixCAM ~$80) for offline classification.", options: { breakLine: true, breakLine: true } },
      { text: "\nWhy it was rejected:", options: { bold: true, breakLine: true } },
      { text: "• Cost: Edge AI boards are expensive ($80–$200+), pushing the build well over the ~$150 budget", options: { breakLine: true } },
      { text: "• Complexity: Training a custom YOLO model requires collecting and labelling thousands of images, which is time-consuming and difficult for a SAT timeline", options: { breakLine: true } },
      { text: "• Accuracy risk: A custom-trained model on limited data may not generalise well to real-world waste items", options: { breakLine: true } },
    ],
    { x: 0.45, y: 2.05, w: 4.2, h: 3.0, fontSize: 10, color: C.text, fontFace: "Calibri", valign: "top", paraSpaceAfter: 1, margin: 0 }
  );

  // New approach card (right)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 3.95, fill: { color: C.white }, line: { color: "D1E8D9" }, shadow: mk() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("✓  NEW APPROACH — Selected", { x: 5.1, y: 1.2, w: 4.6, h: 0.42, fontSize: 10.5, bold: true, color: C.dark, fontFace: "Trebuchet MS", align: "center", valign: "middle", margin: 0 });

  s.addText("ESP32-CAM + Cloud VLM (Vision Language Model)", { x: 5.25, y: 1.72, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: "Trebuchet MS", margin: 0 });
  s.addText(
    [
      { text: "How it works:", options: { bold: true, breakLine: true } },
      { text: "The ESP32-CAM captures an image of the waste item and sends it over WiFi to a cloud-hosted Vision Language Model (e.g. GPT-4o, Gemini, Llama Vision) which classifies the item and returns the bin category.", options: { breakLine: true, breakLine: true } },
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
// SLIDE 3: Component Comparison Table
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
// SLIDE 4: Servo Motor Subsystem Test
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
// SLIDE 5: HC-SR04 Sensor Subsystem Test
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
// SLIDE 6: ESP32 Microcontroller Subsystem Test
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

pres.writeFile({ fileName: "output/AI_Smart_Bin_C2.pptx" })
  .then(() => console.log("Done! -> output/AI_Smart_Bin_C2.pptx"))
  .catch(e => console.error(e));
