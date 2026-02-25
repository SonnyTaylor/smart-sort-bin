/*
 * AI Smart Bin - Dashboard JS (Alpine.js)
 *
 * Reactive dashboard with webcam, LLM classification, SSE updates,
 * and batched settings save.
 */

let _activityId = 0;

document.addEventListener("alpine:init", () => {
  Alpine.data("dashboard", () => ({
    // UI state
    tab: "dashboard",
    mockMode: true,
    sseConnected: false,

    // Data
    stats: {
      total_sorted: 0,
      breakdown: { general: 0, recycling: 0, compost: 0 },
      average_confidence: 0,
      average_duration_ms: 0,
    },
    mode: "yolo",
    health: {
      cpu_temp_c: 0,
      uptime_seconds: 0,
      inference_ms: 0,
      uart_connected: false,
      wifi_connected: false,
    },
    servos: { general: 0, recycling: 120, compost: 240 },
    activity: [],
    providers: [],

    // Camera
    cameraSource: "browser",
    deviceCameraUrl: "",
    deviceCameraError: false,
    webcamActive: false,
    webcamStream: null,
    classifying: false,
    lastResult: null,
    classifyError: "",
    capturedImage: null,

    // Dataset
    datasetStats: { general: 0, recycling: 0, compost: 0, total: 0 },
    datasetSaveStatus: "",
    selectedDatasetCategory: "general",

    // Settings
    selectedProvider: "",
    pendingSettings: {}, // { providerId: { api_key, model, base_url } }
    settingsDirty: false,
    settingsToast: "",
    settingsToastError: false,
    clearingData: false,
    _toastTimer: null,

    // Computed-ish
    get activeProviderName() {
      const active = this.providers.find((p) => p.is_active);
      return active ? active.name : "None";
    },

    // ---- Init ----

    async init() {
      await Promise.all([
        this.loadStats(),
        this.loadMode(),
        this.loadHealth(),
        this.loadServos(),
        this.loadHistory(),
        this.loadProviders(),
        this.loadDatasetStats(),
      ]);
      this.connectSSE();
      setInterval(() => this.loadHealth(), 5000);
    },

    // ---- API helpers ----

    async api(endpoint, options = {}) {
      const res = await fetch(`/api/${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      return res.json();
    },

    // ---- Data loading ----

    async loadStats() {
      this.stats = await this.api("stats");
    },

    async loadMode() {
      const data = await this.api("mode");
      this.mode = data.mode;
    },

    async loadHealth() {
      this.health = await this.api("health");
    },

    async loadServos() {
      this.servos = await this.api("servos");
    },

    async loadHistory() {
      const events = await this.api("history?limit=30");
      this.activity = events.map((e) => ({ ...e, _id: ++_activityId }));
    },

    async loadProviders() {
      this.providers = await this.api("providers");
      // Auto-select first provider if none selected
      if (!this.selectedProvider && this.providers.length > 0) {
        const active = this.providers.find((p) => p.is_active);
        this.selectedProvider = active ? active.id : this.providers[0].id;
      }
    },

    // ---- Mode ----

    async setMode(mode) {
      await this.api("mode", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      this.mode = mode;
    },

    // ---- Servos ----

    async setServoAngle(cat, val) {
      await this.api("servos", {
        method: "POST",
        body: JSON.stringify({ category: cat, angle: parseInt(val, 10) }),
      });
    },

    async manualSort() {
      await this.api("sort", { method: "POST" });
    },

    async homeServos() {
      await this.api("home", { method: "POST" });
    },

    // ---- Webcam ----

    handleCameraSourceChange() {
      if (this.webcamActive) {
        this.stopWebcam();
        this.startWebcam();
      }
    },

    async toggleWebcam() {
      if (this.webcamActive) {
        this.stopWebcam();
      } else {
        await this.startWebcam();
      }
    },

    async startWebcam() {
      this.deviceCameraError = false;
      if (this.cameraSource === "browser") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });
          this.webcamStream = stream;
          this.$refs.webcamVideo.srcObject = stream;
          this.webcamActive = true;
        } catch (err) {
          console.error("Webcam error:", err);
          this.classifyError = "Could not access webcam: " + err.message;
        }
      } else {
        // Device camera logic (mocking MJPEG stream or static image)
        this.deviceCameraUrl = "/api/camera/stream?" + Date.now();
        this.webcamActive = true;
      }
    },

    stopWebcam() {
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach((t) => t.stop());
        this.webcamStream = null;
      }
      this.deviceCameraUrl = "";
      this.webcamActive = false;
    },

    async captureAndClassify() {
      if (
        !this.webcamActive ||
        this.classifying ||
        (this.cameraSource === "device" && this.deviceCameraError)
      )
        return;

      this.classifying = true;
      this.classifyError = "";
      this.lastResult = null;

      let requestBody = {};

      if (this.cameraSource === "browser") {
        const video = this.$refs.webcamVideo;
        const canvas = this.$refs.webcamCanvas;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        this.capturedImage = dataUrl;
        requestBody = { image: dataUrl };
      } else {
        // For the device camera, we assume the backend takes the photo directly from its hardware
        requestBody = { source: "device" };
        this.capturedImage = null; // Backend might return it, but clear for now
      }

      try {
        const res = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();

        if (data.error) {
          this.classifyError = data.error;
        } else {
          this.lastResult = data;
          this.datasetSaveStatus = "";
          this.selectedDatasetCategory = data.category || "general";
          if (data.image) {
            this.capturedImage = "data:image/jpeg;base64," + data.image;
          } else if (this.cameraSource === "device") {
            // Fallback snapshot if backend doesn't return the captured frame
            this.capturedImage = this.deviceCameraUrl;
          }
        }
      } catch (err) {
        this.classifyError = "Request failed: " + err.message;
      } finally {
        this.classifying = false;
      }
    },

    // ---- Dataset ----

    async loadDatasetStats() {
      try {
        const res = await fetch("/api/dataset/stats");
        this.datasetStats = await res.json();
      } catch (err) {
        console.error("Failed to load dataset stats", err);
      }
    },

    async saveToDataset() {
      if (!this.capturedImage || !this.selectedDatasetCategory) return;

      this.datasetSaveStatus = "saving";
      try {
        const res = await fetch("/api/dataset/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: this.capturedImage,
            category: this.selectedDatasetCategory,
          }),
        });
        const data = await res.json();
        if (data.error) {
          this.datasetSaveStatus = "error";
          console.error(data.error);
        } else {
          this.datasetSaveStatus = "saved";
          await this.loadDatasetStats();
        }
      } catch (err) {
        this.datasetSaveStatus = "error";
        console.error(err);
      }
    },

    exportDataset() {
      window.location.href = "/api/dataset/export";
    },

    async clearDataset() {
      if (
        !confirm("Are you sure you want to delete all images in the dataset?")
      )
        return;

      try {
        await fetch("/api/dataset/clear", { method: "POST" });
        await this.loadDatasetStats();
      } catch (err) {
        console.error("Failed to clear dataset", err);
      }
    },

    // ---- Provider settings ----

    selectProvider(id) {
      this.selectedProvider = id;
    },

    /**
     * Track a pending change for a provider field.
     * Changes are NOT sent to the server until Save is clicked.
     */
    setPending(providerId, field, value) {
      if (!this.pendingSettings[providerId]) {
        this.pendingSettings[providerId] = {};
      }
      this.pendingSettings[providerId][field] = value;
      this.settingsDirty = true;
    },

    /**
     * Check whether a provider has unsaved changes.
     */
    hasProviderChanges(providerId) {
      const pending = this.pendingSettings[providerId];
      if (!pending) return false;
      return Object.values(pending).some((v) => v !== "" && v !== undefined);
    },

    /**
     * Save all pending changes for a specific provider via PATCH.
     */
    async saveProviderSettings(providerId) {
      const pending = this.pendingSettings[providerId];
      if (!pending) return;

      // Build payload with only non-empty fields
      const payload = {};
      if (pending.api_key) payload.api_key = pending.api_key;
      if (pending.model !== undefined && pending.model !== "")
        payload.model = pending.model;
      if (pending.base_url !== undefined) payload.base_url = pending.base_url;

      if (Object.keys(payload).length === 0) return;

      try {
        const res = await this.api(`providers/${providerId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        if (res.error) {
          this.showToast("Error: " + res.error, true);
          return;
        }

        // Clear pending state for this provider
        delete this.pendingSettings[providerId];
        this.settingsDirty = Object.keys(this.pendingSettings).some((k) =>
          this.hasProviderChanges(k),
        );

        await this.loadProviders();
        this.showToast("Settings saved");
      } catch (err) {
        this.showToast("Save failed: " + err.message, true);
      }
    },

    async setActiveProvider(id) {
      await this.api(`providers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: true }),
      });
      await this.loadProviders();
      this.showToast("Provider activated");
    },

    /**
     * Return a placeholder hint for the model input based on provider.
     */
    getModelPlaceholder(providerId) {
      const hints = {
        openrouter: "e.g. meta-llama/llama-4-scout",
        openai: "e.g. gpt-4o-mini",
        google: "e.g. gemini-2.5-flash",
        custom: "e.g. my-model-name",
      };
      return hints[providerId] || "Model ID";
    },

    /**
     * Show a temporary toast notification.
     */
    showToast(message, isError = false) {
      this.settingsToast = message;
      this.settingsToastError = isError;
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.settingsToast = "";
      }, 3000);
    },

    /**
     * Clear all sort history from the database.
     */
    async clearData() {
      if (
        !confirm(
          "Are you sure you want to clear all sort history? This cannot be undone.",
        )
      ) {
        return;
      }
      this.clearingData = true;
      try {
        const res = await this.api("data/clear", { method: "POST" });
        if (res.error) {
          this.showToast("Error: " + res.error, true);
        } else {
          this.activity = [];
          await this.loadStats();
          this.showToast("All data cleared");
        }
      } catch (err) {
        this.showToast("Failed to clear data: " + err.message, true);
      } finally {
        this.clearingData = false;
      }
    },

    // ---- SSE ----

    connectSSE() {
      const evtSource = new EventSource("/api/events");

      evtSource.addEventListener("connected", () => {
        this.sseConnected = true;
      });

      evtSource.addEventListener("sort_event", (e) => {
        const event = JSON.parse(e.data);
        event._id = ++_activityId;
        if (!event.timestamp) event.timestamp = Date.now() / 1000;
        this.activity.unshift(event);
        if (this.activity.length > 100) this.activity.pop();
        this.loadStats();
      });

      evtSource.addEventListener("mode_change", (e) => {
        this.mode = JSON.parse(e.data).mode;
      });

      evtSource.addEventListener("servo_update", (e) => {
        const d = JSON.parse(e.data);
        this.servos[d.category] = d.angle;
      });

      evtSource.addEventListener("provider_update", () => {
        this.loadProviders();
      });

      evtSource.onerror = () => {
        this.sseConnected = false;
      };
    },

    // ---- Utils ----

    formatUptime(s) {
      if (!s) return "--";
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${sec}s`;
      return `${sec}s`;
    },

    formatTime(ts) {
      if (!ts) return "";
      return new Date(ts * 1000).toLocaleTimeString();
    },
  }));
});
