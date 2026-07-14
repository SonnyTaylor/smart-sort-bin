# VCE Systems Engineering: Future Scope

As part of the Systems Engineering design process, several alternative approaches and enhancement paths have been identified for future iterations.

---

## Future: Local AI Classification (Offline Mode)

### Concept
Add a local YOLO object detection model running on a more capable edge AI board (e.g., Sipeed MaixCAM Pro) as a fallback for environments without reliable WiFi. The system would default to cloud VLM when connected and fall back to local YOLO when offline.

### Why It Is Deferred
The ESP32-CAM + cloud VLM approach was selected for the current prototype due to its significantly lower cost (~$12 vs ~$80+) and zero training requirements. Adding local AI would require purchasing an edge AI board, collecting a custom dataset, training and quantising a YOLO model -- all of which exceed the current budget and SAT timeline. This is the most logical upgrade path if budget allows in future.

---

## Future: Multi-Bin Networked System

### Concept
Deploy multiple smart bins across a school campus, each reporting sorting data to a central server. A shared web dashboard would aggregate statistics across all bins and allow centralised configuration updates.

### Why It Is Deferred
Single-bin reliability must be proven first. Network infrastructure and server hosting add complexity beyond the VCE scope.

---

## Future: On-Device Dataset Collection for Retraining

### Concept
Use the web dashboard's dataset collection feature to save images of items that the cloud VLM classifies with low confidence. These flagged images could be used to fine-tune a local model in the future, or to evaluate VLM accuracy over time.

### Why It Is Deferred
The web dashboard already supports dataset collection and export (ZIP download). However, since the current system relies entirely on cloud VLMs which are continually updated by their providers, active retraining is not required. The dataset feature remains useful for accuracy auditing and future local model training if the system is upgraded.

---

## Future: Multiple VLM Provider Fallback Chain

### Concept
If the primary cloud VLM provider (e.g., OpenRouter) fails or times out, automatically try a secondary provider (e.g., Google Gemini) before giving up. The web dashboard already supports configuring multiple providers -- this would add automatic failover logic.

### Why It Is Deferred
Single-provider reliability has been sufficient in testing. Adding failover logic increases code complexity on the ESP32-CAM, which has limited RAM. A simpler approach is to let the user switch providers manually via the dashboard if one goes down.
