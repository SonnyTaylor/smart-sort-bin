# VCE Systems Engineering: Iteration Log

*This document records the iterative design process for the AI vision subsystem, demonstrating how testing and evaluation led to a pivot in the classification approach.*

---

## Iteration 1: Custom YOLO Model + Edge AI Board (Rejected)

### Implementation
The original plan was to train a custom YOLO11 object detection model and run it locally on an edge AI board (Jetson Nano or Sipeed MaixCAM Pro).

### Testing & Evaluation
- **Cost:** Edge AI boards are expensive -- MaixCAM Pro ~$80 AUD, Jetson Nano ~$200+ AUD. This pushed the total build well over the ~$150 budget target.
- **Complexity:** Training a custom YOLO model requires collecting and labelling thousands of images, which is time-consuming and difficult within the SAT timeline.
- **Accuracy Risk:** A custom-trained model on limited data may not generalise well to the wide variety of real-world waste items.
- **Verdict:** Too expensive and too complex for the project scope. The cost and training overhead do not justify the benefit of offline classification.

---

## Research & Modification

Cloud-hosted Vision Language Models (VLMs) such as GPT-4o, Gemini, and Llama Vision have become highly capable at general object recognition. They are pre-trained on vast datasets and can classify any everyday object out of the box -- no custom training required.

The ESP32-CAM module (~$10-15 AUD) has a built-in camera and WiFi, making it capable of capturing an image and sending it to a cloud VLM via HTTP. This eliminates the need for an expensive edge AI board entirely.

The key trade-off is a WiFi dependency and ~1-2 seconds of network latency per classification. Given that the mechanical sorting cycle (servo pan, tilt, home) already takes ~0.7-1 second, the total sort time remains within the <3 second parameter target.

---

## Iteration 2: ESP32-CAM + Cloud VLM -- Final Implementation

### Implementation
- ESP32-CAM captures a JPEG image when triggered by the HC-SR04 sensor.
- Image is sent over WiFi to a cloud Vision Language Model (e.g., GPT-4o, Gemini, Llama Vision via OpenRouter).
- VLM returns a JSON classification: category (general/recycling/compost), item label, and confidence score.
- ESP32-CAM sends the sort command to the ESP32 DevKit over UART.

### Evaluation

| Parameter | Target | Result |
| :--- | :--- | :--- |
| Classification Accuracy | >90% | Achieved. Cloud VLMs generalise well to everyday waste items without custom training data. |
| Total Cost (AI subsystem) | < $150 budget | Passed. ESP32-CAM costs ~$12 vs ~$80-200 for edge AI boards. |
| Sort Time | < 3 seconds | Met. ~1-2s VLM latency + ~1s mechanical = ~2-3s total. |
| Setup Complexity | Manageable for SAT | Passed. No model training, no dataset annotation, no quantisation pipeline. Arduino IDE + HTTP API call. |

### Trade-offs Accepted
- **WiFi Required:** The system cannot classify without an internet connection. This is acceptable for the target deployment (indoor schools and offices with reliable WiFi).
- **API Cost:** Cloud VLM queries cost a small amount per request (~$0.001-0.01 per image). Negligible for a prototype that processes a few hundred items per day.
- **Privacy:** Images are sent to a third-party API. Acceptable for waste classification (non-sensitive data).
