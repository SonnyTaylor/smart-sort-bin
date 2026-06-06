#include <Arduino.h>
// ═════════════════════════════════════════════════════════════════════════════
//  AI SMART BIN — ESP32-CAM Firmware
//  Camera + Servo + WS2812B + Web UI + OpenRouter AI Classification
// ═════════════════════════════════════════════════════════════════════════════

#include <ESP32Servo.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>
#include <Preferences.h>
#include <ESPmDNS.h>
#include "esp_camera.h"

// ── WiFi ────────────────────────────────────────────────────────────────────
const char* WIFI_SSID     = "OPTUS_7F6190N";
const char* WIFI_PASSWORD = "brood69634fn";

// ── Camera (AI-Thinker ESP32-CAM pinout) ──────────────────────────────────
#define CAM_PWDN    32
#define CAM_RESET   -1
#define CAM_XCLK     0
#define CAM_SIOD    26
#define CAM_SIOC    27
#define CAM_D7      35
#define CAM_D6      34
#define CAM_D5      39
#define CAM_D4      36
#define CAM_D3      21
#define CAM_D2      19
#define CAM_D1      18
#define CAM_D0       5
#define CAM_VSYNC   25
#define CAM_HREF    23
#define CAM_PCLK    22

// ── Peripherals ─────────────────────────────────────────────────────────────
#define SERVO_PIN    13
#define LED_PIN       4
#define LED_COUNT    16

// ── Defaults ────────────────────────────────────────────────────────────────
#define DEFAULT_ANGLE_GENERAL   45
#define DEFAULT_ANGLE_RECYCLING 90
#define DEFAULT_ANGLE_COMPOST  135

// ═════════════════════════════════════════════════════════════════════════════
//  OBJECTS
// ═════════════════════════════════════════════════════════════════════════════
Servo myServo;
Adafruit_NeoPixel ring(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
WebServer server(80);
Preferences prefs;

// ═════════════════════════════════════════════════════════════════════════════
//  STATE
// ═════════════════════════════════════════════════════════════════════════════
struct {
  // Servo
  int  targetAngle    = 90;
  int  currentAngle   = 90;
  int  servoSpeed     = 8;
  bool sweeping       = false;
  int  sweepAngle     = 0;
  int  sweepDir       = 1;
  int  sweepInterval  = 15;
  unsigned long lastSweepTime = 0;

  // Category angles
  int angleGeneral   = DEFAULT_ANGLE_GENERAL;
  int angleRecycling = DEFAULT_ANGLE_RECYCLING;
  int angleCompost   = DEFAULT_ANGLE_COMPOST;

  // LED
  int  r = 0, g = 255, b = 136;
  int  brightness = 80;
  bool on = true;
  int  effect = 0; // 0=solid 1=rainbow 2=chase 3=breathe 4=sparkle 5=fire 6=comet
  int  chasePos = 0;
  int  breatheVal = 0, breatheDir = 1;
  unsigned long lastLedTime = 0;

  // System
  unsigned long startTime = 0;
  bool cameraReady = false;
} st;

// ═════════════════════════════════════════════════════════════════════════════
//  LED FX
// ═════════════════════════════════════════════════════════════════════════════
void runLeds(){
  if(!st.on){ ring.clear(); ring.show(); return; }
  unsigned long now = millis();

  switch(st.effect){
    case 0: // Solid
      for(int i=0;i<LED_COUNT;i++) ring.setPixelColor(i, ring.Color(st.r,st.g,st.b));
      ring.show();
      break;

    case 1: // Rainbow
      if(now-st.lastLedTime > 20){
        static uint16_t hue=0;
        for(int i=0;i<LED_COUNT;i++) ring.setPixelColor(i, ring.ColorHSV((hue+i*(65536/LED_COUNT))&0xFFFF));
        ring.show(); hue+=256; st.lastLedTime=now;
      }
      break;

    case 2: // Chase
      if(now-st.lastLedTime > 60){
        ring.clear();
        ring.setPixelColor(st.chasePos, ring.Color(st.r,st.g,st.b));
        ring.setPixelColor((st.chasePos+1)%LED_COUNT, ring.Color(st.r/3,st.g/3,st.b/3));
        ring.show(); st.chasePos=(st.chasePos+1)%LED_COUNT; st.lastLedTime=now;
      }
      break;

    case 3: // Breathe
      if(now-st.lastLedTime > 10){
        st.breatheVal += st.breatheDir*3;
        if(st.breatheVal>=255){ st.breatheVal=255; st.breatheDir=-1; }
        if(st.breatheVal<=0){ st.breatheVal=0; st.breatheDir=1; }
        float s = st.breatheVal/255.0;
        for(int i=0;i<LED_COUNT;i++) ring.setPixelColor(i, ring.Color(st.r*s,st.g*s,st.b*s));
        ring.show(); st.lastLedTime=now;
      }
      break;

    case 4: // Sparkle
      if(now-st.lastLedTime > 50){
        for(int i=0;i<LED_COUNT;i++) ring.setPixelColor(i, ring.Color(st.r,st.g,st.b));
        ring.setPixelColor(random(LED_COUNT), ring.Color(255,255,255));
        ring.show(); st.lastLedTime=now;
      }
      break;

    case 5: // Fire
      if(now-st.lastLedTime > 50){
        for(int i=0;i<LED_COUNT;i++){
          int flicker = random(0, 80);
          int r = constrain(st.r + flicker, 0, 255);
          int g = constrain(st.g + flicker/3, 0, 255);
          int b = 0;
          ring.setPixelColor(i, ring.Color(r,g,b));
        }
        ring.show(); st.lastLedTime=now;
      }
      break;

    case 6: // Comet
      if(now-st.lastLedTime > 40){
        static int pos=0;
        ring.clear();
        for(int i=0;i<5;i++){
          int p=(pos-i+LED_COUNT)%LED_COUNT;
          int br=255-(i*50);
          ring.setPixelColor(p, ring.Color(st.r*br/255,st.g*br/255,st.b*br/255));
        }
        ring.show(); pos=(pos+1)%LED_COUNT; st.lastLedTime=now;
      }
      break;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SMOOTH SERVO & SWEEP
// ═════════════════════════════════════════════════════════════════════════════
void updateServo(){
  // Smooth move toward target
  if(abs(st.targetAngle - st.currentAngle) > 0){
    int step = st.servoSpeed;
    if(abs(st.targetAngle - st.currentAngle) < step) step = 1;
    if(st.targetAngle > st.currentAngle) st.currentAngle += step;
    else st.currentAngle -= step;
    myServo.write(st.currentAngle);
  }

  // Sweep logic
  if(st.sweeping && millis()-st.lastSweepTime > st.sweepInterval){
    st.sweepAngle += st.sweepDir;
    if(st.sweepAngle >= 180){ st.sweepAngle=180; st.sweepDir=-1; }
    if(st.sweepAngle <= 0){ st.sweepAngle=0; st.sweepDir=1; }
    st.targetAngle = st.sweepAngle;
    st.lastSweepTime = millis();
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CONFIG SAVE / LOAD
// ═════════════════════════════════════════════════════════════════════════════
void saveConfig(){
  prefs.begin("smartbin", false);
  prefs.putInt("angle", st.targetAngle);
  prefs.putBool("sweep", st.sweeping);
  prefs.putInt("speed", st.servoSpeed);
  prefs.putInt("r", st.r);
  prefs.putInt("g", st.g);
  prefs.putInt("b", st.b);
  prefs.putInt("brt", st.brightness);
  prefs.putInt("fx", st.effect);
  prefs.putBool("on", st.on);
  prefs.putInt("angGen", st.angleGeneral);
  prefs.putInt("angRec", st.angleRecycling);
  prefs.putInt("angComp", st.angleCompost);
  prefs.end();
  Serial.println("Config saved");
}

void loadConfig(){
  prefs.begin("smartbin", true);
  st.targetAngle    = prefs.getInt("angle", 90);
  st.sweeping       = prefs.getBool("sweep", false);
  st.servoSpeed     = prefs.getInt("speed", 8);
  st.r              = prefs.getInt("r", 0);
  st.g              = prefs.getInt("g", 255);
  st.b              = prefs.getInt("b", 136);
  st.brightness     = prefs.getInt("brt", 80);
  st.effect         = prefs.getInt("fx", 0);
  st.on             = prefs.getBool("on", true);
  st.angleGeneral   = prefs.getInt("angGen", DEFAULT_ANGLE_GENERAL);
  st.angleRecycling = prefs.getInt("angRec", DEFAULT_ANGLE_RECYCLING);
  st.angleCompost   = prefs.getInt("angComp", DEFAULT_ANGLE_COMPOST);
  prefs.end();
  st.currentAngle = st.targetAngle;
  Serial.println("Config loaded");
}

// ═════════════════════════════════════════════════════════════════════════════
//  CAMERA
// ═════════════════════════════════════════════════════════════════════════════
bool initCamera(){
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = CAM_D0;
  config.pin_d1 = CAM_D1;
  config.pin_d2 = CAM_D2;
  config.pin_d3 = CAM_D3;
  config.pin_d4 = CAM_D4;
  config.pin_d5 = CAM_D5;
  config.pin_d6 = CAM_D6;
  config.pin_d7 = CAM_D7;
  config.pin_xclk = CAM_XCLK;
  config.pin_pclk = CAM_PCLK;
  config.pin_vsync = CAM_VSYNC;
  config.pin_href = CAM_HREF;
  config.pin_sscb_sda = CAM_SIOD;
  config.pin_sscb_scl = CAM_SIOC;
  config.pin_pwdn = CAM_PWDN;
  config.pin_reset = CAM_RESET;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_QVGA;     // 320x240 — small, fast upload
  config.jpeg_quality = 12;                // 0-63, lower=better
  config.fb_count = 1;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;

  if(psramFound()){
    config.fb_count = 2;
    config.fb_location = CAMERA_FB_IN_PSRAM;
    Serial.println("PSRAM found, using for camera buffers");
  } else {
    config.fb_location = CAMERA_FB_IN_DRAM;
    Serial.println("No PSRAM, using DRAM");
  }

  esp_err_t err = esp_camera_init(&config);
  if(err != ESP_OK){
    Serial.printf("Camera init failed: 0x%x\n", err);
    return false;
  }

  // Tweak sensor settings for better indoor photos
  sensor_t * s = esp_camera_sensor_get();
  if(s){
    s->set_brightness(s, 0);
    s->set_contrast(s, 1);
    s->set_saturation(s, 0);
    s->set_whitebal(s, 1);
    s->set_awb_gain(s, 1);
    s->set_wb_mode(s, 0);
    s->set_exposure_ctrl(s, 1);
    s->set_aec2(s, 1);
    s->set_gain_ctrl(s, 1);
    s->set_agc_gain(s, 0);
    s->set_gainceiling(s, (gainceiling_t)6);
    s->set_bpc(s, 0);
    s->set_wpc(s, 1);
    s->set_raw_gma(s, 1);
    s->set_lenc(s, 1);
    s->set_hmirror(s, 0);
    s->set_vflip(s, 0);
    s->set_dcw(s, 1);
  }

  Serial.println("Camera ready");
  return true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  WEB HANDLERS
// ═════════════════════════════════════════════════════════════════════════════

void sendCORS(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleRoot();
void handleStream();
void handleCapture();
void handleSet();
void handleSweep();
void handleServoSpeed();
void handleSort();
void handleConfigAngles();
void handleLedPower();
void handleLedBright();
void handleLedColor();
void handleLedEffect();
void handleConfigSave();
void handleReboot();
void handleInfo();

// handleRoot() defined after INDEX_HTML below

void handleStream(){
  WiFiClient client = server.client();
  String response = "HTTP/1.1 200 OK\r\n";
  response += "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n";
  response += "Access-Control-Allow-Origin: *\r\n\r\n";
  client.write(response.c_str());

  int frames = 0;
  unsigned long start = millis();
  while(client.connected()){
    camera_fb_t * fb = esp_camera_fb_get();
    if(!fb) break;

    String boundary = "--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ";
    boundary += String(fb->len) + "\r\n\r\n";
    client.write(boundary.c_str());
    client.write(fb->buf, fb->len);
    client.write("\r\n");
    esp_camera_fb_return(fb);

    frames++;
    // Simple FPS throttle: target ~15fps
    delay(60);

    // Safety: close stream after 60s to free server for other requests
    if(millis() - start > 60000) break;
  }
}

void handleCapture(){
  if(!st.cameraReady){
    server.send(503, "text/plain", "Camera not ready");
    return;
  }
  camera_fb_t * fb = esp_camera_fb_get();
  if(!fb){
    server.send(503, "text/plain", "Capture failed");
    return;
  }

  WiFiClient client = server.client();
  String response = "HTTP/1.1 200 OK\r\n";
  response += "Content-Type: image/jpeg\r\n";
  response += "Content-Length: " + String(fb->len) + "\r\n";
  response += "Access-Control-Allow-Origin: *\r\n";
  response += "Cache-Control: no-cache\r\n\r\n";
  client.write(response.c_str());
  client.write(fb->buf, fb->len);
  esp_camera_fb_return(fb);
}

void handleSet(){
  sendCORS();
  if(server.hasArg("angle")){
    st.targetAngle = constrain(server.arg("angle").toInt(),0,180);
    st.sweeping = false;
  }
  server.send(200,"text/plain","OK");
}

void handleSweep(){
  sendCORS();
  if(server.hasArg("state")){
    st.sweeping = server.arg("state")=="1";
    if(st.sweeping) st.sweepAngle = st.currentAngle;
  }
  server.send(200,"text/plain","OK");
}

void handleServoSpeed(){
  sendCORS();
  if(server.hasArg("val")) st.servoSpeed = constrain(server.arg("val").toInt(),1,30);
  server.send(200,"text/plain","OK");
}

void handleSort(){
  sendCORS();
  if(server.hasArg("category")){
    String cat = server.arg("category");
    st.sweeping = false;
    if(cat == "general"){
      st.targetAngle = st.angleGeneral;
      st.r=255; st.g=30; st.b=30; st.effect=0;
    } else if(cat == "recycling"){
      st.targetAngle = st.angleRecycling;
      st.r=255; st.g=180; st.b=0; st.effect=0;
    } else if(cat == "compost"){
      st.targetAngle = st.angleCompost;
      st.r=0; st.g=255; st.b=60; st.effect=0;
    }
  }
  server.send(200,"text/plain","OK");
}

void handleConfigAngles(){
  sendCORS();
  if(server.hasArg("general"))   st.angleGeneral   = constrain(server.arg("general").toInt(),0,180);
  if(server.hasArg("recycling")) st.angleRecycling = constrain(server.arg("recycling").toInt(),0,180);
  if(server.hasArg("compost"))   st.angleCompost   = constrain(server.arg("compost").toInt(),0,180);
  server.send(200,"text/plain","OK");
}

void handleLedPower(){
  sendCORS();
  if(server.hasArg("state")){
    st.on = server.arg("state")=="1";
    if(!st.on){ ring.clear(); ring.show(); }
  }
  server.send(200,"text/plain","OK");
}

void handleLedBright(){
  sendCORS();
  if(server.hasArg("val")){
    st.brightness = constrain(server.arg("val").toInt(),0,255);
    ring.setBrightness(st.brightness);
  }
  server.send(200,"text/plain","OK");
}

void handleLedColor(){
  sendCORS();
  if(server.hasArg("r")) st.r = constrain(server.arg("r").toInt(),0,255);
  if(server.hasArg("g")) st.g = constrain(server.arg("g").toInt(),0,255);
  if(server.hasArg("b")) st.b = constrain(server.arg("b").toInt(),0,255);
  st.effect = 0;
  server.send(200,"text/plain","OK");
}

void handleLedEffect(){
  sendCORS();
  if(server.hasArg("n")) st.effect = constrain(server.arg("n").toInt(),0,6);
  server.send(200,"text/plain","OK");
}

void handleConfigSave(){
  sendCORS();
  saveConfig();
  server.send(200,"text/plain","SAVED");
}

void handleReboot(){
  sendCORS();
  server.send(200,"text/plain","REBOOTING");
  delay(200);
  ESP.restart();
}

void handleInfo(){
  sendCORS();
  unsigned long uptime = (millis()-st.startTime)/1000;
  String json = "{";
  json += "\"angle\":"+String(st.currentAngle)+",";
  json += "\"target\":"+String(st.targetAngle)+",";
  json += "\"uptime\":"+String(uptime)+",";
  json += "\"sweep\":"+String(st.sweeping?"true":"false")+",";
  json += "\"ip\":\""+WiFi.localIP().toString()+"\",";
  json += "\"rssi\":"+String(WiFi.RSSI())+",";
  json += "\"camera\":"+String(st.cameraReady?"true":"false")+",";
  json += "\"clients\":"+String(WiFi.softAPgetStationNum())+",";
  json += "\"freeHeap\":"+String(ESP.getFreeHeap()/1024)+",";
  json += "\"angleGeneral\":"+String(st.angleGeneral)+",";
  json += "\"angleRecycling\":"+String(st.angleRecycling)+",";
  json += "\"angleCompost\":"+String(st.angleCompost)+",";
  json += "\"ledOn\":"+String(st.on?"true":"false")+",";
  json += "\"ledEffect\":"+String(st.effect)+",";
  json += "\"ledBrightness\":"+String(st.brightness)+",";
  json += "\"ledR\":"+String(st.r)+",";
  json += "\"ledG\":"+String(st.g)+",";
  json += "\"ledB\":"+String(st.b);
  json += "}";
  server.send(200,"application/json",json);
}

// ═════════════════════════════════════════════════════════════════════════════
//  HTML UI
// ═════════════════════════════════════════════════════════════════════════════
const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>AI Smart Bin</title>
<style>
:root{
  --bg:#06060a;--surface:#0f0f14;--surface2:#18181f;--border:#272730;--borderlt:#3f3f4e;
  --text:#e4e4e7;--dim:#a1a1aa;--muted:#71717a;--accent:#6366f1;--accent2:#8b5cf6;
  --general:#ef4444;--recycling:#f59e0b;--compost:#22c55e;--warn:#f97316;
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;font-family:'Segoe UI',system-ui,sans-serif}
body{background:var(--bg);color:var(--text);min-height:100vh;padding:16px;max-width:900px;margin:0 auto}

/* Header */
header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.brand{display:flex;align-items:center;gap:10px}
.brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:18px}
.brand h1{font-size:1.25rem;font-weight:800;letter-spacing:-0.5px}
.badge{font-size:0.65rem;padding:3px 10px;border-radius:99px;background:rgba(99,102,241,0.15);color:var(--accent);border:1px solid rgba(99,102,241,0.3);font-weight:600}
.status{display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--muted)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--compost);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}

/* Tabs */
.tabs{display:flex;gap:6px;margin-bottom:20px;background:var(--surface);padding:5px;border-radius:12px;border:1px solid var(--border)}
.tab{flex:1;padding:10px 8px;border-radius:8px;border:none;background:transparent;color:var(--dim);font-size:0.8rem;font-weight:600;cursor:pointer;transition:all .2s;text-align:center}
.tab:hover{color:var(--text)}
.tab.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.3)}

/* Sections */
.section{display:none;animation:fade .25s ease}
.section.active{display:block}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* Cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px}
.card-title{font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:8px}

/* Camera */
.cam-wrap{position:relative;background:#000;border-radius:12px;overflow:hidden;border:1px solid var(--border);aspect-ratio:4/3}
.cam-wrap img{width:100%;height:100%;object-fit:cover;display:block}
.cam-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);opacity:0;pointer-events:none;transition:opacity .2s}
.cam-overlay.on{opacity:1;pointer-events:auto}
.cam-overlay span{color:#fff;font-size:0.9rem;font-weight:600}
.cam-badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.7);color:var(--dim);font-size:0.65rem;padding:4px 10px;border-radius:6px;font-weight:600}
.cam-badge .rec{display:inline-block;width:7px;height:7px;border-radius:50%;background:#ef4444;margin-right:5px;animation:pulse 1.2s infinite}

/* Buttons */
.btn{padding:12px 20px;border-radius:10px;border:none;font-size:0.9rem;font-weight:700;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.btn:disabled{opacity:0.5;cursor:not-allowed}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.25)}
.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,0.35)}
.btn-primary:active:not(:disabled){transform:translateY(0)}
.btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
.btn-secondary:hover:not(:disabled){border-color:var(--borderlt);background:#1e1e28}
.btn-cat{width:100%;padding:14px;border-radius:10px;border:none;font-size:0.9rem;font-weight:700;cursor:pointer;color:#fff;transition:all .15s}
.btn-cat:hover{transform:translateY(-1px)}
.btn-gen{background:linear-gradient(135deg,#dc2626,#ef4444)}
.btn-rec{background:linear-gradient(135deg,#d97706,#f59e0b)}
.btn-com{background:linear-gradient(135deg,#16a34a,#22c55e)}

/* Toggle */
.toggle{display:flex;align-items:center;gap:10px;cursor:pointer}
.toggle input{display:none}
.tog-track{width:44px;height:24px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);position:relative;transition:.2s}
.tog-track::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:var(--dim);top:2px;left:2px;transition:.2s}
input:checked+.tog-track{background:rgba(99,102,241,0.2);border-color:var(--accent)}
input:checked+.tog-track::after{left:22px;background:var(--accent);box-shadow:0 0 8px var(--accent)}

/* Results */
.result-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-top:14px;display:none}
.result-box.on{display:block;animation:fade .3s ease}
.result-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.result-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}
.result-icon.gen{background:rgba(239,68,68,0.15);color:var(--general)}
.result-icon.rec{background:rgba(245,158,11,0.15);color:var(--recycling)}
.result-icon.com{background:rgba(34,197,94,0.15);color:var(--compost)}
.result-name{font-size:1.1rem;font-weight:700}
.result-cat{font-size:0.75rem;font-weight:600;padding:3px 10px;border-radius:6px;display:inline-block;margin-top:4px}
.result-cat.gen{background:rgba(239,68,68,0.15);color:var(--general)}
.result-cat.rec{background:rgba(245,158,11,0.15);color:var(--recycling)}
.result-cat.com{background:rgba(34,197,94,0.15);color:var(--compost)}
.conf-bar{height:6px;border-radius:3px;background:var(--surface);margin-top:10px;overflow:hidden}
.conf-fill{height:100%;border-radius:3px;transition:width .5s ease}
.conf-label{font-size:0.7rem;color:var(--dim);margin-top:6px;text-align:right}

/* Grid layouts */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}

/* Sliders */
input[type=range]{-webkit-appearance:none;width:100%;height:6px;background:var(--surface2);border-radius:3px;margin:12px 0 6px;outline:none;border:1px solid var(--border)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:var(--accent);cursor:pointer;border:3px solid var(--bg);box-shadow:0 0 10px rgba(99,102,241,0.3)}
.slider-labels{display:flex;justify-content:space-between;font-size:0.65rem;color:var(--dim)}

/* Angle display */
.angle-big{font-size:4rem;font-weight:800;text-align:center;color:var(--accent);line-height:1}
.angle-big span{font-size:1.2rem;color:var(--dim);font-weight:500}

/* Color picker row */
.color-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap}
input[type=color]{-webkit-appearance:none;width:50px;height:50px;border:2px solid var(--border);border-radius:10px;background:none;cursor:pointer;padding:3px}
input[type=color]::-webkit-color-swatch-wrapper{padding:0}
input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}

/* Effect buttons */
.eff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.eff-btn{padding:10px 6px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--dim);font-size:0.75rem;font-weight:600;cursor:pointer;transition:.15s;text-align:center}
.eff-btn:hover{border-color:var(--borderlt);color:var(--text)}
.eff-btn.on{background:rgba(99,102,241,0.12);color:var(--accent);border-color:var(--accent)}

/* Inputs */
input[type=text],input[type=password],select{width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:0.9rem;outline:none;transition:.15s}
input[type=text]:focus,input[type=password]:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(99,102,241,0.1)}

/* Info grid */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.info-cell{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center}
.info-cell .il{font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--dim);display:block;margin-bottom:6px}
.info-cell .iv{font-size:1rem;font-weight:700;color:var(--text)}

/* Toast */
#toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--surface2);color:var(--text);padding:12px 24px;border-radius:12px;border:1px solid var(--border);font-size:0.85rem;font-weight:600;opacity:0;transition:all .3s;z-index:100;pointer-events:none;white-space:nowrap}
#toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
#toast.err{border-color:var(--general);color:var(--general);background:rgba(239,68,68,0.1)}

/* Loading spinner */
.spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,0.1);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}

/* Small util */
.mt10{margin-top:10px}.mt14{margin-top:14px}.mb10{margin-bottom:10px}
.text-dim{color:var(--dim)}.text-sm{font-size:0.8rem}.text-xs{font-size:0.7rem}
.flex{display:flex}.flex-col{flex-direction:column}.gap8{gap:8px}.gap10{gap:10px}
.items-center{align-items:center}.justify-between{justify-content:space-between}
.w100{width:100%}

/* Preset buttons */
.preset-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.preset-btn{padding:12px 0;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:0.85rem;font-weight:700;cursor:pointer;transition:.15s}
.preset-btn:hover{border-color:var(--accent);color:var(--accent)}
.preset-btn.on{background:rgba(99,102,241,0.12);border-color:var(--accent);color:var(--accent)}

/* Responsive */
@media(max-width:480px){
  .grid2{grid-template-columns:1fr}
  .preset-grid{grid-template-columns:repeat(3,1fr)}
  .brand h1{font-size:1rem}
}
</style>
</head>
<body>

<header>
  <div class="brand">
    <div class="brand-icon">♻️</div>
    <div>
      <h1>AI Smart Bin</h1>
    </div>
    <span class="badge">LIVE</span>
  </div>
  <div class="status">
    <div class="dot"></div>
    <span id="connStatus">Connected</span>
  </div>
</header>

<div class="tabs">
  <button class="tab active" onclick="switchTab('camera',this)">📷 Camera</button>
  <button class="tab" onclick="switchTab('manual',this)">🎮 Manual</button>
  <button class="tab" onclick="switchTab('settings',this)">⚙️ Settings</button>
</div>

<!-- ════════════════════════════════════════════════════════════════
     CAMERA TAB
     ════════════════════════════════════════════════════════════════ -->
<div class="section active" id="camera">

  <div class="card">
    <div class="cam-wrap">
      <img id="streamImg" src="/stream" alt="Camera stream" onerror="onStreamError()">
      <div class="cam-overlay" id="camOverlay"><span>📷 Stream disconnected</span></div>
      <div class="cam-badge"><span class="rec"></span>LIVE // 15 FPS</div>
    </div>

    <div class="flex items-center justify-between mt14">
      <label class="toggle">
        <input type="checkbox" id="autoSort" onchange="saveAutoSort()">
        <div class="tog-track"></div>
        <span class="text-sm text-dim">Auto-sort on classify</span>
      </label>
      <button class="btn btn-primary" id="classifyBtn" onclick="classify()">
        <span id="classifySpinner" style="display:none"><span class="spinner"></span></span>
        <span id="classifyText">🔍 Snap & Classify</span>
      </button>
    </div>
  </div>

  <!-- Result Panel -->
  <div class="result-box" id="resultBox">
    <div class="result-header">
      <div class="result-icon" id="resIcon">🗑️</div>
      <div>
        <div class="result-name" id="resLabel">Unknown</div>
        <span class="result-cat" id="resCat">general</span>
      </div>
    </div>
    <div class="conf-bar"><div class="conf-fill" id="confFill" style="width:0%"></div></div>
    <div class="conf-label" id="confLabel">Confidence: 0%</div>
    <div class="grid3 mt14" id="manualSortBtns">
      <button class="btn-cat btn-gen" onclick="sort('general')">🗑️ General</button>
      <button class="btn-cat btn-rec" onclick="sort('recycling')">♻️ Recycling</button>
      <button class="btn-cat btn-com" onclick="sort('compost')">🌱 Compost</button>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="card">
    <div class="card-title">📊 Live Stats</div>
    <div class="info-grid">
      <div class="info-cell"><span class="il">Servo</span><span class="iv" id="iAngle">90°</span></div>
      <div class="info-cell"><span class="il">Uptime</span><span class="iv" id="iUptime">0s</span></div>
      <div class="info-cell"><span class="il">WiFi</span><span class="iv" id="iRssi">- dBm</span></div>
      <div class="info-cell"><span class="il">Heap</span><span class="iv" id="iHeap">0k</span></div>
    </div>
  </div>

</div>

<!-- ════════════════════════════════════════════════════════════════
     MANUAL TAB
     ════════════════════════════════════════════════════════════════ -->
<div class="section" id="manual">

  <div class="card">
    <div class="card-title">🎯 Servo Position</div>
    <div class="angle-big" id="angleBig">90<span>°</span></div>
    <input type="range" min="0" max="180" value="90" id="slider" oninput="onSlider(this.value)">
    <div class="slider-labels"><span>0°</span><span>90°</span><span>180°</span></div>
    <div class="preset-grid mt14">
      <button class="preset-btn" onclick="goPreset(0)">0°</button>
      <button class="preset-btn" onclick="goPreset(45)">45°</button>
      <button class="preset-btn" onclick="goPreset(90)">90°</button>
      <button class="preset-btn" onclick="goPreset(135)">135°</button>
      <button class="preset-btn" onclick="goPreset(180)">180°</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">🔄 Auto Sweep</div>
    <button class="btn btn-secondary w100" id="sweepBtn" onclick="toggleSweep()">▶ Start Sweep</button>
  </div>

  <div class="card">
    <div class="card-title">⚡ Servo Speed</div>
    <input type="range" min="1" max="30" value="8" id="speedSlider" oninput="setServoSpeed(this.value)">
    <div class="slider-labels"><span>Slow</span><span id="speedVal">8</span><span>Fast</span></div>
  </div>

  <div class="card">
    <div class="card-title">💡 LED Control</div>
    <div class="flex items-center justify-between mb10">
      <span class="text-sm text-dim">Power</span>
      <label class="toggle">
        <input type="checkbox" id="ledToggle" checked onchange="toggleLed(this.checked)">
        <div class="tog-track"></div>
      </label>
    </div>
    <div class="mb10">
      <span class="text-sm text-dim">Brightness</span>
      <input type="range" min="0" max="255" value="80" id="brightSlider" oninput="setBrightness(this.value)">
      <div class="slider-labels"><span>0</span><span>128</span><span>255</span></div>
    </div>
    <div class="color-row">
      <input type="color" id="colorPicker" value="#00ff88" oninput="onColorPick(this.value)">
      <span class="text-sm text-dim" id="hexLabel">#00FF88</span>
    </div>
    <div class="mt10">
      <span class="text-sm text-dim mb10" style="display:block">Effects</span>
      <div class="eff-grid">
        <button class="eff-btn on" id="eff0" onclick="setEffect(0)">Solid</button>
        <button class="eff-btn" id="eff1" onclick="setEffect(1)">Rainbow</button>
        <button class="eff-btn" id="eff2" onclick="setEffect(2)">Chase</button>
        <button class="eff-btn" id="eff3" onclick="setEffect(3)">Breathe</button>
        <button class="eff-btn" id="eff4" onclick="setEffect(4)">Sparkle</button>
        <button class="eff-btn" id="eff5" onclick="setEffect(5)">Fire</button>
        <button class="eff-btn" id="eff6" onclick="setEffect(6)">Comet</button>
      </div>
    </div>
  </div>

</div>

<!-- ════════════════════════════════════════════════════════════════
     SETTINGS TAB
     ════════════════════════════════════════════════════════════════ -->
<div class="section" id="settings">

  <div class="card">
    <div class="card-title">🔑 OpenRouter</div>
    <label class="text-sm text-dim" style="display:block;margin-bottom:6px">API Key</label>
    <input type="password" id="apiKey" placeholder="sk-or-v1-..." oninput="saveSettings()">
    <label class="text-sm text-dim mt14" style="display:block;margin-bottom:6px">Model</label>
    <select id="modelSelect" onchange="saveSettings()">
      <option value="meta-llama/llama-4-scout">Llama 4 Scout (fast)</option>
      <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (cheap)</option>
      <option value="openai/gpt-4o-mini">GPT-4o Mini (balanced)</option>
      <option value="anthropic/claude-sonnet-4">Claude Sonnet 4 (best)</option>
      <option value="meta-llama/llama-4-maverick">Llama 4 Maverick</option>
    </select>
    <div class="text-xs text-dim mt10">Key is stored in your browser only (localStorage).</div>
  </div>

  <div class="card">
    <div class="card-title">🎯 Sort Angles</div>
    <div class="mb10">
      <span class="text-sm text-dim">General (red bin)</span>
      <input type="range" min="0" max="180" value="45" id="angGen" oninput="updateAngleLabels()">
      <div class="slider-labels"><span>0°</span><span id="lblGen">45°</span><span>180°</span></div>
    </div>
    <div class="mb10">
      <span class="text-sm text-dim">Recycling (yellow bin)</span>
      <input type="range" min="0" max="180" value="90" id="angRec" oninput="updateAngleLabels()">
      <div class="slider-labels"><span>0°</span><span id="lblRec">90°</span><span>180°</span></div>
    </div>
    <div class="mb10">
      <span class="text-sm text-dim">Compost (green bin)</span>
      <input type="range" min="0" max="180" value="135" id="angComp" oninput="updateAngleLabels()">
      <div class="slider-labels"><span>0°</span><span id="lblComp">135°</span><span>180°</span></div>
    </div>
    <button class="btn btn-primary w100 mt10" onclick="saveAngles()">💾 Save Angles to Device</button>
    <button class="btn btn-secondary w100 mt10" onclick="testServos()">🧪 Test All Positions</button>
  </div>

  <div class="card">
    <div class="card-title">🌐 Network</div>
    <div class="info-grid">
      <div class="info-cell"><span class="il">IP Address</span><span class="iv" id="netIp">...</span></div>
      <div class="info-cell"><span class="il">mDNS</span><span class="iv">smartbin.local</span></div>
      <div class="info-cell"><span class="il">SSID</span><span class="iv" id="netSsid">...</span></div>
      <div class="info-cell"><span class="il">RSSI</span><span class="iv" id="netRssi">...</span></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">🔧 System</div>
    <button class="btn btn-secondary w100 mb10" onclick="fetch('/config/save').then(()=>toast('Config saved to flash'))">💾 Save All Config</button>
    <button class="btn btn-secondary w100" style="color:var(--warn);border-color:var(--warn)" onclick="fetch('/reboot').then(()=>toast('Rebooting...'))">🔄 Reboot ESP32</button>
  </div>

</div>

<div id="toast"></div>

<script>
// ── State ──
let sweeping=false,lastResult=null;
const CAT_COLORS={general:'#ef4444',recycling:'#f59e0b',compost:'#22c55e'};
const CAT_ICONS={general:'🗑️',recycling:'♻️',compost:'🌱'};

// ── Init ──
function init(){
  document.getElementById('apiKey').value=localStorage.getItem('sb_apiKey')||'';
  document.getElementById('modelSelect').value=localStorage.getItem('sb_model')||'meta-llama/llama-4-scout';
  document.getElementById('autoSort').checked=localStorage.getItem('sb_autoSort')==='true';
  loadAngles();
  poll();
  setInterval(poll,800);
  // Keyboard shortcuts
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
    if(e.key==='1')sort('general');
    if(e.key==='2')sort('recycling');
    if(e.key==='3')sort('compost');
    if(e.key==='c'||e.key==='C')classify();
    if(e.key==='m'||e.key==='M')switchTab('manual',document.querySelectorAll('.tab')[1]);
    if(e.key==='s'||e.key==='S')switchTab('settings',document.querySelectorAll('.tab')[2]);
  });
}

// ── Tabs ──
function switchTab(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  el.classList.add('active');
}

// ── Toast ──
let toastTimer;
function toast(msg,err){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className=err?'on err':'on';
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('on'),3000);
}

// ── Stream ──
function onStreamError(){
  document.getElementById('camOverlay').classList.add('on');
  // Retry stream after 2s
  setTimeout(()=>{
    const img=document.getElementById('streamImg');
    img.src='/stream?t='+Date.now();
    document.getElementById('camOverlay').classList.remove('on');
  },2000);
}

// ── Classification ──
async function classify(){
  const apiKey=document.getElementById('apiKey').value.trim();
  if(!apiKey){toast('Enter OpenRouter API key in Settings','err');switchTab('settings',document.querySelectorAll('.tab')[2]);return;}

  const btn=document.getElementById('classifyBtn');
  const spin=document.getElementById('classifySpinner');
  const txt=document.getElementById('classifyText');
  btn.disabled=true;spin.style.display='inline-block';txt.textContent='Capturing...';

  try{
    // 1. Capture from ESP32-CAM
    txt.textContent='Reading camera...';
    const blob=await fetch('/capture').then(r=>{if(!r.ok)throw new Error('Camera failed');return r.blob()});

    // 2. Convert to base64
    txt.textContent='Encoding...';
    const base64=await blobToBase64(blob);
    const b64data=base64.split(',')[1];

    // 3. Call OpenRouter
    txt.textContent='AI thinking...';
    const model=document.getElementById('modelSelect').value;
    const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+apiKey,
        'HTTP-Referer':'https://github.com/ai-smart-bin',
        'X-Title':'AI Smart Bin'
      },
      body:JSON.stringify({
        model:model,
        messages:[
          {role:'system',content:'You are a waste classification AI for an Australian smart bin. Classify items in the photo into: general, recycling, or compost. Ignore people, hands, and backgrounds. Respond ONLY with JSON: {"items":[{"category":"general|recycling|compost","label":"item name","confidence":0.9}]}'},
          {role:'user',content:[
            {type:'text',text:'Classify the waste items in this image:'},
            {type:'image_url',image_url:{url:'data:image/jpeg;base64,'+b64data}}
          ]}
        ],
        max_tokens:300,
        temperature:0.1,
        response_format:{type:'json_object'}
      })
    });

    if(!response.ok){
      const err=await response.text();
      throw new Error('OpenRouter '+response.status+': '+err.slice(0,200));
    }

    const data=await response.json();
    const content=data.choices?.[0]?.message?.content||'';
    let result;
    try{result=JSON.parse(content);}catch(e){result=JSON.parse(content.replace(/```json|```/g,'').trim());}

    const items=result.items||[];
    if(items.length===0){toast('No items detected','err');return;}

    const item=items[0];
    const cat=item.category||'general';
    const label=item.label||'Unknown';
    const conf=Math.min(1,Math.max(0,parseFloat(item.confidence)||0.8));

    showResult(cat,label,conf);

    if(document.getElementById('autoSort').checked){
      setTimeout(()=>sort(cat),600);
    }

  }catch(e){
    toast('Classify failed: '+e.message,'err');
    console.error(e);
  }finally{
    btn.disabled=false;spin.style.display='none';txt.textContent='🔍 Snap & Classify';
  }
}

function blobToBase64(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onloadend=()=>resolve(reader.result);
    reader.onerror=reject;
    reader.readAsDataURL(blob);
  });
}

function showResult(cat,label,conf){
  const box=document.getElementById('resultBox');
  const icon=document.getElementById('resIcon');
  const lbl=document.getElementById('resLabel');
  const c=document.getElementById('resCat');
  const fill=document.getElementById('confFill');
  const clbl=document.getElementById('confLabel');

  box.classList.add('on');
  icon.textContent=CAT_ICONS[cat]||'🗑️';
  icon.className='result-icon '+cat.substring(0,3);
  lbl.textContent=label;
  c.textContent=cat;
  c.className='result-cat '+cat.substring(0,3);
  fill.style.width=(conf*100)+'%';
  fill.style.background=CAT_COLORS[cat];
  clbl.textContent='Confidence: '+(conf*100).toFixed(1)+'%';
}

// ── Sort ──
function sort(cat){
  fetch('/sort?category='+cat).then(()=>{
    toast('Sorted to '+cat+'!');
  });
}

// ── Servo ──
function onSlider(v){
  document.getElementById('angleBig').innerHTML=v+'<span>°</span>';
  fetch('/set?angle='+v);
}
function goPreset(a){
  document.getElementById('slider').value=a;
  document.getElementById('angleBig').innerHTML=a+'<span>°</span>';
  fetch('/set?angle='+a);
}
function toggleSweep(){
  sweeping=!sweeping;
  fetch('/sweep?state='+(sweeping?'1':'0'));
  const b=document.getElementById('sweepBtn');
  b.textContent=sweeping?'⏹ Stop Sweep':'▶ Start Sweep';
}
function setServoSpeed(v){
  document.getElementById('speedVal').textContent=v;
  fetch('/servo/speed?val='+v);
}

// ── LED ──
function toggleLed(on){fetch('/led/power?state='+(on?'1':'0'));}
function setBrightness(v){fetch('/led/bright?val='+v);}
function onColorPick(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  document.getElementById('hexLabel').textContent=hex.toUpperCase();
  fetch('/led/color?r='+r+'&g='+g+'&b='+b);
}
function setEffect(n){
  document.querySelectorAll('.eff-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('eff'+n).classList.add('on');
  fetch('/led/effect?n='+n);
}

// ── Settings ──
function saveSettings(){
  localStorage.setItem('sb_apiKey',document.getElementById('apiKey').value);
  localStorage.setItem('sb_model',document.getElementById('modelSelect').value);
}
function saveAutoSort(){
  localStorage.setItem('sb_autoSort',document.getElementById('autoSort').checked);
}
function updateAngleLabels(){
  document.getElementById('lblGen').textContent=document.getElementById('angGen').value+'°';
  document.getElementById('lblRec').textContent=document.getElementById('angRec').value+'°';
  document.getElementById('lblComp').textContent=document.getElementById('angComp').value+'°';
}
function saveAngles(){
  const g=document.getElementById('angGen').value;
  const r=document.getElementById('angRec').value;
  const c=document.getElementById('angComp').value;
  fetch('/config/angles?general='+g+'&recycling='+r+'&compost='+c).then(()=>toast('Angles saved to device'));
}
function loadAngles(){
  fetch('/info').then(r=>r.json()).then(d=>{
    document.getElementById('angGen').value=d.angleGeneral||45;
    document.getElementById('angRec').value=d.angleRecycling||90;
    document.getElementById('angComp').value=d.angleCompost||135;
    updateAngleLabels();
  }).catch(()=>{});
}
async function testServos(){
  const poses=[['general',document.getElementById('angGen').value],['recycling',document.getElementById('angRec').value],['compost',document.getElementById('angComp').value]];
  for(const [cat,ang] of poses){
    toast('Testing '+cat+'...');
    await fetch('/sort?category='+cat);
    await new Promise(r=>setTimeout(r,1200));
  }
  toast('Servo test complete');
}

// ── Poll ──
function poll(){
  fetch('/info').then(r=>r.json()).then(d=>{
    document.getElementById('iAngle').textContent=d.angle+'°';
    document.getElementById('iUptime').textContent=fmtTime(d.uptime);
    document.getElementById('iRssi').textContent=(d.rssi||0)+' dBm';
    document.getElementById('iHeap').textContent=d.freeHeap+'k';
    document.getElementById('netIp').textContent=d.ip;
    document.getElementById('netRssi').textContent=(d.rssi||0)+' dBm';
    document.getElementById('netSsid').textContent='deez nutz';
    document.getElementById('connStatus').textContent='Connected';
    document.querySelector('.dot').style.background='var(--compost)';
  }).catch(()=>{
    document.getElementById('connStatus').textContent='Disconnected';
    document.querySelector('.dot').style.background='var(--general)';
  });
}
function fmtTime(s){
  if(s<60)return s+'s';
  if(s<3600)return Math.floor(s/60)+'m '+(s%60)+'s';
  return Math.floor(s/3600)+'h '+Math.floor((s%3600)/60)+'m';
}

init();
</script>
</body>
</html>
)rawliteral";

// ── handleRoot must come after INDEX_HTML is declared ──
void handleRoot(){
  WiFiClient client = server.client();
  String header = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n";
  client.write(header.c_str());

  const char* p = INDEX_HTML;
  size_t total = strlen(p);
  size_t sent = 0;
  while(sent < total){
    size_t chunk = total - sent;
    if(chunk > 1024) chunk = 1024;
    client.write(p + sent, chunk);
    sent += chunk;
    yield();
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SETUP
// ═════════════════════════════════════════════════════════════════════════════
void setup(){
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=== AI SMART BIN ===");

  // Load persisted settings
  loadConfig();

  // Servo
  myServo.attach(SERVO_PIN,500,2400);
  myServo.write(st.currentAngle);

  // LEDs
  ring.begin();
  ring.setBrightness(st.brightness);
  ring.show();

  // Camera
  st.cameraReady = initCamera();

  // WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  int wifiAttempts = 0;
  while(WiFi.status() != WL_CONNECTED && wifiAttempts < 30){
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }

  if(WiFi.status() == WL_CONNECTED){
    Serial.println("\nWiFi connected");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi failed, starting AP fallback");
    WiFi.softAP("SmartBin-Setup", "setup1234");
    Serial.print("AP IP: ");
    Serial.println(WiFi.softAPIP());
  }

  if(MDNS.begin("smartbin")){
    Serial.println("mDNS: smartbin.local");
  }

  // Routes
  server.on("/",             handleRoot);
  server.on("/stream",       handleStream);
  server.on("/capture",      handleCapture);
  server.on("/set",          handleSet);
  server.on("/sweep",        handleSweep);
  server.on("/servo/speed",  handleServoSpeed);
  server.on("/sort",         handleSort);
  server.on("/config/angles",handleConfigAngles);
  server.on("/led/power",    handleLedPower);
  server.on("/led/bright",   handleLedBright);
  server.on("/led/color",    handleLedColor);
  server.on("/led/effect",   handleLedEffect);
  server.on("/config/save",  handleConfigSave);
  server.on("/reboot",       handleReboot);
  server.on("/info",         handleInfo);
  server.begin();

  Serial.println("Server ready on port 80");
  st.startTime = millis();
}

// ═════════════════════════════════════════════════════════════════════════════
//  LOOP
// ═════════════════════════════════════════════════════════════════════════════
void loop(){
  server.handleClient();
  updateServo();
  runLeds();
}
