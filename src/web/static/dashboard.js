/*
 * AI Smart Bin – Dashboard JS (Alpine.js + Chart.js)
 *
 * Reactive dashboard with webcam, LLM classification, SSE updates,
 * Chart.js visualisations, image gallery, and batched settings save.
 */

let _activityId = 0;

/* ── Item Icon Mapping (Iconify) ──
 * Curated map of common waste item labels → Iconify icon IDs.
 * Used to display a vector graphic of the classified item.
 * Falls back to Iconify search API, then to a generic category icon.
 */
const ITEM_ICONS = {
  // ── Recycling ──
  'plastic bottle': 'lucide-lab:bottle-plastic',
  'water bottle': 'lucide-lab:bottle-plastic',
  'drink bottle': 'lucide-lab:bottle-plastic',
  'pet bottle': 'lucide-lab:bottle-plastic',
  'bottle': 'lucide-lab:bottle-plastic',
  'aluminium can': 'hugeicons:soda-can',
  'aluminum can': 'hugeicons:soda-can',
  'soda can': 'hugeicons:soda-can',
  'beer can': 'hugeicons:soda-can',
  'tin can': 'hugeicons:soda-can',
  'metal can': 'hugeicons:soda-can',
  'steel can': 'hugeicons:soda-can',
  'can': 'hugeicons:soda-can',
  'glass bottle': 'game-icons:wine-bottle',
  'wine bottle': 'game-icons:wine-bottle',
  'beer bottle': 'game-icons:wine-bottle',
  'glass jar': 'game-icons:wine-bottle',
  'jar': 'game-icons:wine-bottle',
  'cardboard box': 'game-icons:cardboard-box',
  'cardboard': 'game-icons:cardboard-box',
  'newspaper': 'mdi:newspaper',
  'paper': 'mdi:newspaper',
  'magazine': 'mdi:newspaper',
  'milk carton': 'mdi:cup-water',
  'juice box': 'mdi:cup-water',
  'cereal box': 'game-icons:cardboard-box-closed',
  'envelope': 'mdi:email-outline',

  // ── Compost ──
  'banana peel': 'game-icons:banana-peel',
  'banana': 'game-icons:banana-peeled',
  'apple core': 'mingcute:apple-fruit-fill',
  'apple': 'mingcute:apple-fruit-fill',
  'food scraps': 'mdi:food-drumstick',
  'food waste': 'mdi:food-drumstick',
  'coffee grounds': 'iconoir:coffee-cup',
  'coffee cup': 'iconoir:coffee-cup',
  'tea bag': 'game-icons:tea',
  'tea': 'game-icons:tea',
  'egg shell': 'mdi:egg-outline',
  'egg shells': 'mdi:egg-outline',
  'egg': 'mdi:egg-outline',
  'vegetable scraps': 'game-icons:carrot',
  'vegetables': 'game-icons:carrot',
  'carrot': 'game-icons:carrot',
  'fruit peel': 'mingcute:apple-fruit-line',
  'fruit': 'mingcute:apple-fruit-line',
  'bread': 'game-icons:sliced-bread',
  'leaves': 'mdi:leaf',
  'leaf': 'mdi:leaf',
  'grass clippings': 'mdi:grass',
  'grass': 'mdi:grass',
  'orange peel': 'mingcute:apple-fruit-line',
  'potato peel': 'game-icons:potato',

  // ── General Waste ──
  'plastic bag': 'mdi:shopping-outline',
  'chip packet': 'game-icons:potato-chips',
  'chips packet': 'game-icons:potato-chips',
  'chips': 'game-icons:potato-chips',
  'snack wrapper': 'mdi:candy-outline',
  'candy wrapper': 'mdi:candy-outline',
  'wrapper': 'mdi:candy-outline',
  'styrofoam': 'mdi:package-variant',
  'foam': 'mdi:package-variant',
  'diaper': 'mdi:baby-buggy',
  'nappy': 'mdi:baby-buggy',
  'cigarette butt': 'mdi:smoking',
  'cigarette': 'mdi:smoking',
  'plastic wrap': 'mdi:package-variant-closed',
  'cling wrap': 'mdi:package-variant-closed',
  'tissue': 'mdi:paper-roll-outline',
  'tissues': 'mdi:paper-roll-outline',
  'paper towel': 'mdi:paper-roll-outline',
  'light bulb': 'mdi:lightbulb-outline',
  'battery': 'mdi:battery',
  'batteries': 'mdi:battery',
  'pen': 'mdi:pen',
  'straw': 'mdi:cup-water',
  'cutlery': 'mdi:silverware-fork-knife',
  'utensils': 'mdi:silverware-fork-knife',
  'fork': 'mdi:silverware-fork-knife',
  'spoon': 'mdi:silverware-fork-knife',
  'knife': 'mdi:silverware-fork-knife',
  'pizza box': 'mdi:pizza',
  'takeaway container': 'mdi:package-variant',
  'foam container': 'mdi:package-variant',
  'cup': 'mdi:cup',
  'plastic cup': 'mdi:cup',
  'paper cup': 'mdi:cup',
  'toothbrush': 'mdi:toothbrush',
  'razor': 'mdi:razor-double-edge',
  'sponge': 'game-icons:sponge',
  'clothes': 'mdi:tshirt-crew-outline',
  'clothing': 'mdi:tshirt-crew-outline',
  'shoe': 'mdi:shoe-formal',
  'shoes': 'mdi:shoe-formal',
};

const CATEGORY_FALLBACK_ICONS = {
  general: 'mdi:trash-can-outline',
  recycling: 'mdi:recycle',
  compost: 'mdi:compost',
};

document.addEventListener("alpine:init", () => {
  Alpine.data("dashboard", () => ({
    // ── UI state ──
    tab: "dashboard",
    mockMode: true,
    sseConnected: false,
    loaded: false,
    currentTime: "",
    dangerExpanded: false,

    // ── Data ──
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
    hourlyStats: [],

    // Animated values
    animatedTotal: 0,
    _totalAnimFrame: null,

    // Activity filter
    activityFilter: "all",

    // Charts
    _donutChart: null,
    _hourlyChart: null,

    // ── Camera ──
    cameraSource: "browser",
    deviceCameraUrl: "",
    deviceCameraError: false,
    webcamActive: false,
    webcamStream: null,
    classifying: false,
    lastResult: null,
    classifyError: "",
    capturedImage: null,
    classificationHistory: [],
    itemIcons: [],
    itemIconsLoading: false,

    // ── Dataset ──
    datasetStats: { general: 0, recycling: 0, compost: 0, total: 0 },
    datasetSaveStatus: "",
    selectedDatasetCategory: "general",
    datasetImages: [],
    galleryFilter: "all",
    lightboxImage: null,

    // ── Settings ──
    selectedProvider: "",
    pendingSettings: {},
    settingsDirty: false,
    settingsToast: "",
    settingsToastError: false,
    clearingData: false,
    testingProvider: null,
    testResult: "",
    testResultError: false,
    _toastTimer: null,

    // ── Getters ──

    get activeProviderName() {
      const active = this.providers.find((p) => p.is_active);
      return active ? active.name : "None";
    },

    get filteredActivity() {
      if (this.activityFilter === "all") return this.activity;
      return this.activity.filter((a) => a.category === this.activityFilter);
    },

    get filteredGalleryImages() {
      if (this.galleryFilter === "all") return this.datasetImages;
      return this.datasetImages.filter(
        (img) => img.category === this.galleryFilter,
      );
    },

    // ══════════════════════════════════════════════════════════════
    // INIT
    // ══════════════════════════════════════════════════════════════

    async init() {
      // Kick off clock
      this._tickClock();
      setInterval(() => this._tickClock(), 1000);

      // Load all data in parallel
      await Promise.all([
        this.loadStats(),
        this.loadMode(),
        this.loadHealth(),
        this.loadServos(),
        this.loadHistory(),
        this.loadProviders(),
        this.loadDatasetStats(),
        this.loadHourlyStats(),
      ]);

      this.loaded = true;
      this.connectSSE();
      setInterval(() => this.loadHealth(), 5000);

      // Render charts after Alpine tick so refs exist
      this.$nextTick(() => {
        this.renderDonutChart();
        this.renderHourlyChart();
      });
    },

    _tickClock() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },

    // ══════════════════════════════════════════════════════════════
    // API HELPERS
    // ══════════════════════════════════════════════════════════════

    async api(endpoint, options = {}) {
      const res = await fetch(`/api/${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      return res.json();
    },

    // ══════════════════════════════════════════════════════════════
    // DATA LOADING
    // ══════════════════════════════════════════════════════════════

    async loadStats() {
      this.stats = await this.api("stats");
      this._animateTotal(this.stats.total_sorted);
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
      const events = await this.api("history?limit=50");
      this.activity = events.map((e) => ({ ...e, _id: ++_activityId }));
    },

    async loadProviders() {
      this.providers = await this.api("providers");
      if (!this.selectedProvider && this.providers.length > 0) {
        const active = this.providers.find((p) => p.is_active);
        this.selectedProvider = active ? active.id : this.providers[0].id;
      }
    },

    async loadHourlyStats() {
      try {
        this.hourlyStats = await this.api("stats/hourly");
      } catch (e) {
        console.error("Failed to load hourly stats", e);
      }
    },

    // ══════════════════════════════════════════════════════════════
    // ANIMATED COUNT-UP
    // ══════════════════════════════════════════════════════════════

    _animateTotal(target) {
      if (this._totalAnimFrame) cancelAnimationFrame(this._totalAnimFrame);
      const start = this.animatedTotal;
      const diff = target - start;
      if (diff === 0) return;
      const duration = 600; // ms
      const t0 = performance.now();
      const step = (now) => {
        const elapsed = now - t0;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        this.animatedTotal = Math.round(start + diff * eased);
        if (progress < 1) {
          this._totalAnimFrame = requestAnimationFrame(step);
        }
      };
      this._totalAnimFrame = requestAnimationFrame(step);
    },

    // ══════════════════════════════════════════════════════════════
    // CHARTS (Chart.js)
    // ══════════════════════════════════════════════════════════════

    renderDonutChart() {
      const canvas = this.$refs.donutChart;
      if (!canvas) return;

      if (this._donutChart) this._donutChart.destroy();

      const bd = this.stats.breakdown;
      this._donutChart = new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["General", "Recycling", "Compost"],
          datasets: [
            {
              data: [bd.general || 0, bd.recycling || 0, bd.compost || 0],
              backgroundColor: ["#ef4444", "#3b82f6", "#22c55e"],
              borderColor: "#18181b",
              borderWidth: 3,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          cutout: "68%",
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#18181b",
              titleColor: "#e4e4e7",
              bodyColor: "#a1a1aa",
              borderColor: "#27272a",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
            },
          },
        },
      });
    },

    renderHourlyChart() {
      const canvas = this.$refs.hourlyChart;
      if (!canvas) return;

      if (this._hourlyChart) this._hourlyChart.destroy();

      const labels = this.hourlyStats.map((h) => h.hour);
      const data = this.hourlyStats.map((h) => h.count);

      this._hourlyChart = new Chart(canvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Sorts",
              data,
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#6366f1",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          scales: {
            x: {
              grid: { color: "rgba(39,39,42,0.5)" },
              ticks: { color: "#71717a", font: { size: 10 }, maxRotation: 0 },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(39,39,42,0.3)" },
              ticks: {
                color: "#71717a",
                font: { size: 10 },
                stepSize: 1,
                precision: 0,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#18181b",
              titleColor: "#e4e4e7",
              bodyColor: "#a1a1aa",
              borderColor: "#27272a",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
            },
          },
        },
      });
    },

    _updateCharts() {
      // Update donut
      if (this._donutChart) {
        const bd = this.stats.breakdown;
        this._donutChart.data.datasets[0].data = [
          bd.general || 0,
          bd.recycling || 0,
          bd.compost || 0,
        ];
        this._donutChart.update("none");
      }
      // Re-fetch hourly and update
      this.loadHourlyStats().then(() => {
        if (this._hourlyChart) {
          this._hourlyChart.data.labels = this.hourlyStats.map((h) => h.hour);
          this._hourlyChart.data.datasets[0].data = this.hourlyStats.map(
            (h) => h.count,
          );
          this._hourlyChart.update("none");
        }
      });
    },

    // ══════════════════════════════════════════════════════════════
    // MODE
    // ══════════════════════════════════════════════════════════════

    async setMode(mode) {
      await this.api("mode", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      this.mode = mode;
    },

    // ══════════════════════════════════════════════════════════════
    // SERVOS
    // ══════════════════════════════════════════════════════════════

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

    // ══════════════════════════════════════════════════════════════
    // WEBCAM / CLASSIFY
    // ══════════════════════════════════════════════════════════════

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
      this.itemIcons = [];
      this.itemIconsLoading = false;

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
        requestBody = { source: "device" };
        this.capturedImage = null;
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
          const items = data.items || [];

          if (items.length === 0) {
            // No waste items detected (e.g. only person visible)
            this.lastResult = { items: [], duration_ms: data.duration_ms || 0 };
            this.datasetSaveStatus = "";
          } else {
            // Sort by confidence descending — primary item is first
            items.sort((a, b) => b.confidence - a.confidence);
            data.items = items;
            this.lastResult = data;
            this.datasetSaveStatus = "";
            this.selectedDatasetCategory = items[0].category || "general";

            if (data.image) {
              this.capturedImage = "data:image/jpeg;base64," + data.image;
            } else if (this.cameraSource === "device") {
              this.capturedImage = this.deviceCameraUrl;
            }

            // Fetch icons for all detected items
            this.fetchItemIcons(items);

            // Push to classification history (sidebar)
            this.classificationHistory.unshift({
              ts: Date.now(),
              items: items,
              category: items[0].category,
              label: items[0].label || items[0].category,
              confidence: items[0].confidence || 0,
              itemCount: items.length,
              thumb: this.capturedImage,
            });
            if (this.classificationHistory.length > 10) {
              this.classificationHistory.pop();
            }
          }
        }
      } catch (err) {
        this.classifyError = "Request failed: " + err.message;
      } finally {
        this.classifying = false;
      }
    },

    /**
     * Resolve an icon ID from a label using the curated map + Iconify search.
     * Returns the Iconify icon ID string (e.g. "mdi:newspaper").
     */
    async _resolveIconId(label, category) {
      const normalised = (label || '').toLowerCase().trim();
      let iconId = null;

      // Tier 1 – exact match in curated map
      if (ITEM_ICONS[normalised]) {
        iconId = ITEM_ICONS[normalised];
      } else {
        // Try partial matching
        for (const [key, id] of Object.entries(ITEM_ICONS)) {
          if (normalised.includes(key) || key.includes(normalised)) {
            iconId = id;
            break;
          }
        }
      }

      // Tier 2 – Iconify search API
      if (!iconId) {
        try {
          const searchRes = await fetch(
            `https://api.iconify.design/search?query=${encodeURIComponent(normalised)}&limit=1`
          );
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.icons && searchData.icons.length > 0) {
              iconId = searchData.icons[0];
            }
          }
        } catch (_) {}
      }

      // Tier 3 – generic category fallback
      if (!iconId) {
        iconId = CATEGORY_FALLBACK_ICONS[category] || CATEGORY_FALLBACK_ICONS.general;
      }

      return iconId;
    },

    /**
     * Fetch an SVG string from an Iconify icon ID.
     */
    async _fetchIconSvg(iconId) {
      try {
        const [prefix, name] = iconId.split(':');
        const svgRes = await fetch(
          `https://api.iconify.design/${prefix}/${name}.svg?height=64`
        );
        if (svgRes.ok) return await svgRes.text();
      } catch (_) {}
      return null;
    },

    /**
     * Resolve item icon SVGs for all detected items in parallel.
     */
    async fetchItemIcons(items) {
      this.itemIcons = [];
      this.itemIconsLoading = true;

      try {
        const results = await Promise.all(
          items.map(async (item) => {
            const iconId = await this._resolveIconId(item.label, item.category);
            const svg = await this._fetchIconSvg(iconId);
            return svg;
          })
        );
        this.itemIcons = results;
      } catch (_) {
        this.itemIcons = items.map(() => null);
      } finally {
        this.itemIconsLoading = false;
      }
    },

    toggleFullscreen() {
      const el = this.$refs.cameraContainer;
      if (!el) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen().catch(() => {});
      }
    },

    // ══════════════════════════════════════════════════════════════
    // DATASET
    // ══════════════════════════════════════════════════════════════

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
        this.datasetImages = [];
      } catch (err) {
        console.error("Failed to clear dataset", err);
      }
    },

    async loadDatasetImages() {
      try {
        const data = await this.api("dataset/images");
        this.datasetImages = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("Failed to load dataset images", err);
      }
    },

    openLightbox(img) {
      this.lightboxImage = img;
    },

    closeLightbox() {
      this.lightboxImage = null;
    },

    // ══════════════════════════════════════════════════════════════
    // PROVIDER SETTINGS
    // ══════════════════════════════════════════════════════════════

    selectProvider(id) {
      this.selectedProvider = id;
      this.testResult = "";
    },

    setPending(providerId, field, value) {
      if (!this.pendingSettings[providerId]) {
        this.pendingSettings[providerId] = {};
      }
      this.pendingSettings[providerId][field] = value;
      this.settingsDirty = true;
    },

    hasProviderChanges(providerId) {
      const pending = this.pendingSettings[providerId];
      if (!pending) return false;
      return Object.values(pending).some((v) => v !== "" && v !== undefined);
    },

    async saveProviderSettings(providerId) {
      const pending = this.pendingSettings[providerId];
      if (!pending) return;

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

    async testProvider(providerId) {
      this.testingProvider = providerId;
      this.testResult = "";
      this.testResultError = false;
      try {
        const res = await fetch(`/api/providers/${providerId}/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
          this.testResult = "Error: " + data.error;
          this.testResultError = true;
        } else {
          this.testResult = "\u2713 Connection successful!";
          this.testResultError = false;
        }
      } catch (err) {
        this.testResult = "Request failed: " + err.message;
        this.testResultError = true;
      } finally {
        this.testingProvider = null;
      }
    },

    getModelPlaceholder(providerId) {
      const hints = {
        openrouter: "e.g. meta-llama/llama-4-scout",
        openai: "e.g. gpt-4o-mini",
        google: "e.g. gemini-2.5-flash",
        custom: "e.g. my-model-name",
      };
      return hints[providerId] || "Model ID";
    },

    // ══════════════════════════════════════════════════════════════
    // TOAST
    // ══════════════════════════════════════════════════════════════

    showToast(message, isError = false) {
      this.settingsToast = message;
      this.settingsToastError = isError;
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.settingsToast = "";
      }, 3000);
    },

    // ══════════════════════════════════════════════════════════════
    // DANGER ZONE
    // ══════════════════════════════════════════════════════════════

    async clearData() {
      if (
        !confirm(
          "Are you sure you want to clear all sort history? This cannot be undone.",
        )
      )
        return;

      this.clearingData = true;
      try {
        const res = await this.api("data/clear", { method: "POST" });
        if (res.error) {
          this.showToast("Error: " + res.error, true);
        } else {
          this.activity = [];
          await this.loadStats();
          this._updateCharts();
          this.showToast("All data cleared");
        }
      } catch (err) {
        this.showToast("Failed to clear data: " + err.message, true);
      } finally {
        this.clearingData = false;
      }
    },

    // ══════════════════════════════════════════════════════════════
    // ACTIVITY FEED
    // ══════════════════════════════════════════════════════════════

    exportActivityCSV() {
      if (this.activity.length === 0) return;
      const header = "timestamp,category,label,confidence,duration_ms\n";
      const rows = this.activity
        .map(
          (a) =>
            `${new Date(a.timestamp * 1000).toISOString()},${a.category},${(a.label || "").replace(/,/g, ";")},${a.confidence},${a.duration_ms || ""}`,
        )
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `smartbin_activity_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },

    // ══════════════════════════════════════════════════════════════
    // SSE
    // ══════════════════════════════════════════════════════════════

    connectSSE() {
      const evtSource = new EventSource("/api/events");

      evtSource.addEventListener("connected", () => {
        this.sseConnected = true;
      });

      evtSource.addEventListener("sort_event", (e) => {
        const event = JSON.parse(e.data);
        const ts = event.timestamp || Date.now() / 1000;
        const items = event.items || [];
        // Expand each item into an individual activity entry
        for (const item of items) {
          const entry = {
            _id: ++_activityId,
            timestamp: ts,
            category: item.category,
            label: item.label || item.category,
            confidence: item.confidence || 0,
            duration_ms: event.duration_ms || 0,
          };
          this.activity.unshift(entry);
        }
        if (this.activity.length > 100) {
          this.activity.length = 100;
        }
        this.loadStats();
        this._updateCharts();
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

    // ══════════════════════════════════════════════════════════════
    // UTILITIES
    // ══════════════════════════════════════════════════════════════

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

    formatTimeRelative(ts) {
      if (!ts) return "";
      const diff = Math.floor(Date.now() / 1000 - ts);
      if (diff < 5) return "just now";
      if (diff < 60) return diff + "s ago";
      if (diff < 3600) return Math.floor(diff / 60) + "m ago";
      if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
      return Math.floor(diff / 86400) + "d ago";
    },

    formatTimeFull(ts) {
      if (!ts) return "";
      return new Date(ts * 1000).toLocaleString();
    },
  }));
});
