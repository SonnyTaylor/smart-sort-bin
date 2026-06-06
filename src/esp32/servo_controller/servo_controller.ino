#include <WiFi.h>
#include <WebServer.h>

// ==================== CONFIG ====================
const char* ssid     = "OPTUS_7F6190N";
const char* password = "brood69634fn";
const int servoPin   = 13;          // PWM signal pin
// ================================================

WebServer server(80);

// MG996R: 50 Hz, 500us - 2500us pulse
// 16-bit resolution: duty = (us / 20000) * 65535
const int SERVO_MIN_US = 500;
const int SERVO_MAX_US = 2500;
const int PWM_FREQ     = 50;
const int PWM_BITS     = 16;
const int DUTY_MIN     = (SERVO_MIN_US * 65535) / 20000;  // ~1638
const int DUTY_MAX     = (SERVO_MAX_US * 65535) / 20000;  // ~8192

int currentAngle = 90;

void setServo(int angle) {
  angle = constrain(angle, 0, 180);
  int duty = map(angle, 0, 180, DUTY_MIN, DUTY_MAX);
  ledcWrite(servoPin, duty);
  currentAngle = angle;
}

void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESP32 Servo Control</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #eaeaea;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  h1 { font-size: 1.6rem; margin-bottom: 8px; }
  .ip { color: #888; font-size: 0.85rem; margin-bottom: 28px; }
  .gauge-wrap {
    position: relative;
    width: 220px;
    height: 220px;
    margin: 0 auto 28px;
  }
  .gauge-bg, .gauge-fill {
    fill: none;
    stroke-width: 18;
    stroke-linecap: round;
  }
  .gauge-bg { stroke: rgba(255,255,255,0.08); }
  .gauge-fill {
    stroke: #00d4aa;
    stroke-dasharray: 345;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.3s ease, stroke 0.3s;
  }
  .gauge-text {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -40%);
    font-size: 3rem;
    font-weight: 700;
  }
  .gauge-label {
    position: absolute;
    top: 65%; left: 50%;
    transform: translateX(-50%);
    font-size: 0.85rem;
    color: #888;
  }
  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
    outline: none;
    margin: 24px 0;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #00d4aa;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(0,212,170,0.5);
    transition: transform 0.1s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); }
  input[type=range]::-moz-range-thumb {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #00d4aa;
    cursor: pointer;
    border: none;
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-top: 12px;
  }
  .presets button {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #eaeaea;
    padding: 10px 0;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  .presets button:hover {
    background: #00d4aa;
    color: #111;
    border-color: #00d4aa;
  }
  .status {
    margin-top: 18px;
    font-size: 0.8rem;
    color: #00d4aa;
    opacity: 0;
    transition: opacity 0.3s;
    height: 1.2em;
  }
  .status.show { opacity: 1; }
</style>
</head>
<body>
<div class="card">
  <h1>MG996R Servo</h1>
  <div class="ip" id="ip">Connecting...</div>

  <div class="gauge-wrap">
    <svg viewBox="0 0 140 140" style="transform: rotate(135deg);">
      <circle class="gauge-bg" cx="70" cy="70" r="58"/>
      <circle class="gauge-fill" id="gauge" cx="70" cy="70" r="58"/>
    </svg>
    <div class="gauge-text" id="val">90°</div>
    <div class="gauge-label">ANGLE</div>
  </div>

  <input type="range" id="slider" min="0" max="180" value="90">

  <div class="presets">
    <button onclick="go(0)">0°</button>
    <button onclick="go(45)">45°</button>
    <button onclick="go(90)">90°</button>
    <button onclick="go(135)">135°</button>
    <button onclick="go(180)">180°</button>
  </div>

  <div class="status" id="status">Updated</div>
</div>

<script>
  const slider = document.getElementById('slider');
  const valDisplay = document.getElementById('val');
  const gauge = document.getElementById('gauge');
  const status = document.getElementById('status');
  const ipDisplay = document.getElementById('ip');

  ipDisplay.textContent = window.location.host;

  function updateUI(a) {
    valDisplay.textContent = a + '°';
    const pct = a / 180;
    const offset = 345 - (pct * 270);
    gauge.style.strokeDashoffset = offset;
    const hue = 160 - (pct * 60);
    gauge.style.stroke = `hsl(${hue}, 100%, 50%)`;
  }

  function send(a) {
    fetch('/set?angle=' + a)
      .then(() => {
        status.textContent = 'Set to ' + a + '°';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 1000);
      });
  }

  function go(a) {
    slider.value = a;
    updateUI(a);
    send(a);
  }

  let debounce;
  slider.addEventListener('input', e => {
    const a = e.target.value;
    updateUI(a);
    clearTimeout(debounce);
    debounce = setTimeout(() => send(a), 50);
  });

  updateUI(90);
</script>
</body>
</html>
)rawliteral";

  server.send(200, "text/html", html);
}

void handleSet() {
  if (server.hasArg("angle")) {
    int angle = server.arg("angle").toInt();
    setServo(angle);
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Missing angle");
  }
}

void setup() {
  Serial.begin(115200);
  delay(100);

  ledcAttach(servoPin, PWM_FREQ, PWM_BITS);
  setServo(90);

  WiFi.mode(WIFI_AP);
  bool ok = WiFi.softAP("ESP32-SERVO", "12345678", 1, 0, 4);
  Serial.print("softAP result: ");
  Serial.println(ok ? "OK" : "FAILED");
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP: ");
  Serial.println(IP);
  Serial.print("MAC: ");
  Serial.println(WiFi.softAPmacAddress());

  server.on("/", HTTP_GET, handleRoot);
  server.on("/set", HTTP_GET, handleSet);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
