# VCE Systems Engineering: Future Scope

As part of the Systems Engineering design process, several alternative approaches and enhancement paths have been identified. Some are now partially integrated (cloud LLM mode), while others remain candidates for future iterations.

---

## Integrated: Cloud LLM Mode (Available via Web Dashboard)

The cloud LLM classification mode has been implemented as a switchable option alongside the default local YOLO model. When enabled:

- The MaixCAM captures an image and sends it to a Vision Language Model (e.g., `meta-llama/llama-4-scout` via OpenRouter API).
- The VLM returns granular item identification (e.g., "Snickers bar wrapper") rather than just a broad category.
- A Python dictionary maps the VLM's text response to the correct servo output (General / Recycling / Compost).
- If the network is unavailable or the API times out (default 3s), the system automatically falls back to local YOLO.

**VLM Specifications:**
- **Model:** Llama-4-Scout (multi-modal image input, text output)
- **Performance:** ~338 Tokens Per Second, 0.16s latency
- **Cost:** ~$0.11 per 1M input tokens (negligible per-query cost)

**Current Limitation:** Requires Wi-Fi connectivity. School networks may block IoT devices, so YOLO remains the default mode.

---

## Future: Open-Source Hierarchical Datasets

### Concept
Train the YOLO11s model on an open-source dataset (e.g., [TACO -- Trash Annotations in Context](http://tacodataset.org/)) containing thousands of pre-labelled specific items (`"crushed can"`, `"tissue"`, `"apple core"`) instead of our 3 broad categories.

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

### Why It Is Deferred
Training on an external dataset introduces **domain shift** -- the backgrounds, lighting, and angles in open-source photos do not match the inside of our specific bin tray. A smaller, custom dataset captured on the actual tray under real operating conditions ensures higher operational reliability for the baseline prototype. This could be revisited once the baseline is stable and more custom data has been collected.

---

## Future: Multi-Bin Networked System

### Concept
Deploy multiple smart bins across a school campus, each reporting sorting data to a central server. A shared web dashboard would aggregate statistics across all bins and allow centralised model updates.

### Why It Is Deferred
Single-bin reliability must be proven first. Network infrastructure and server hosting add complexity beyond the VCE scope.

---

## Future: On-Device Retraining

### Concept
Allow the MaixCAM to flag low-confidence detections, save the images, and periodically retrain or fine-tune the model using transfer learning -- either on-device or by uploading flagged images to a Colab notebook.

### Why It Is Deferred
The MaixCAM's 256MB RAM is insufficient for on-device training. A manual Colab retraining workflow is more practical for the current prototype.
