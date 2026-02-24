# VCE Systems Engineering: Evaluated Alternatives & Future Scope

As part of the Systems Engineering design process, several alternative system architectures were evaluated before settling on the localised Edge AI approach. These remain viable paths for future iterations.

---

## Alternative 1: Cloud Vision Language Models (VLMs)

### Concept
Replace the $86 MaixCAM Pro with an ultra-cheap internet-connected board (e.g., Raspberry Pi Zero W or ESP32-CAM). When waste is detected, capture a photo and send it via Wi-Fi to a Cloud VLM API (e.g., `meta-llama/llama-4-scout` via OpenRouter).

### Specifications
- **Model:** Llama-4-Scout (multi-modal image input, text output)
- **Performance:** ~338 Tokens Per Second, 0.16s latency
- **Cost:** ~$0.11 per 1M input tokens (negligible per-query cost)

### Advantages
- Infinite classification intelligence -- can identify specific items (e.g., "Snickers Bar wrapper") rather than broad categories.
- Enables granular UI feedback for users.

### Why It Was Deferred
Introduces a critical dependency on continuous Wi-Fi connectivity. School networks often block IoT devices, and any network outage would render the bin non-functional. The localised Edge AI approach (MaixCAM) was chosen to guarantee 100% offline reliability.

---

## Alternative 2: Open-Source Hierarchical Datasets

### Concept
Continue using the MaixCAM Pro, but train the YOLO11s model on an open-source dataset (e.g., [TACO -- Trash Annotations in Context](http://tacodataset.org/)) containing thousands of pre-labelled specific items (`"crushed can"`, `"tissue"`, `"apple core"`) instead of our 3 broad categories.

### Implementation Path
A Python dictionary would act as middleware, mapping specific YOLO detections to servo outputs:
```python
CLASS_TO_BIN = {
    "apple_core": "compost",
    "crushed_can": "recycling",
    "tissue":     "general",
    # ...
}
```

### Why It Was Deferred
Training on an external dataset introduces **domain shift** -- the backgrounds, lighting, and angles in open-source photos do not match the inside of our specific bin tray. A smaller, custom dataset captured on the actual tray under real operating conditions ensures higher operational reliability for the baseline prototype.
