/*
 * AI Smart Bin - Dashboard JS (Alpine.js)
 *
 * Reactive dashboard with webcam, LLM classification, and SSE updates.
 */

let _activityId = 0;

document.addEventListener("alpine:init", () => {
    Alpine.data("dashboard", () => ({
        // UI state
        tab: "dashboard",
        mockMode: true,
        sseConnected: false,

        // Data
        stats: { total_sorted: 0, breakdown: { general: 0, recycling: 0, compost: 0 }, average_confidence: 0, average_duration_ms: 0 },
        mode: "yolo",
        health: { cpu_temp_c: 0, uptime_seconds: 0, inference_ms: 0, uart_connected: false, wifi_connected: false },
        servos: { general: 0, recycling: 120, compost: 240 },
        activity: [],
        providers: [],

        // Camera
        webcamActive: false,
        webcamStream: null,
        classifying: false,
        lastResult: null,
        classifyError: "",
        capturedImage: null,

        // Computed-ish
        get activeProviderName() {
            const active = this.providers.find(p => p.is_active);
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
            this.activity = events.map(e => ({ ...e, _id: ++_activityId }));
        },

        async loadProviders() {
            this.providers = await this.api("providers");
        },

        // ---- Mode ----

        async setMode(mode) {
            await this.api("mode", { method: "POST", body: JSON.stringify({ mode }) });
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

        async toggleWebcam() {
            if (this.webcamActive) {
                this.stopWebcam();
            } else {
                await this.startWebcam();
            }
        },

        async startWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
                    audio: false,
                });
                this.webcamStream = stream;
                this.$refs.webcamVideo.srcObject = stream;
                this.webcamActive = true;
            } catch (err) {
                console.error("Webcam error:", err);
                this.classifyError = "Could not access webcam: " + err.message;
            }
        },

        stopWebcam() {
            if (this.webcamStream) {
                this.webcamStream.getTracks().forEach(t => t.stop());
                this.webcamStream = null;
            }
            this.webcamActive = false;
        },

        async captureAndClassify() {
            if (!this.webcamActive || this.classifying) return;

            this.classifying = true;
            this.classifyError = "";
            this.lastResult = null;

            const video = this.$refs.webcamVideo;
            const canvas = this.$refs.webcamCanvas;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);

            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            this.capturedImage = dataUrl;

            try {
                const res = await fetch("/api/classify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: dataUrl }),
                });
                const data = await res.json();

                if (data.error) {
                    this.classifyError = data.error;
                } else {
                    this.lastResult = data;
                    // Stats will update via SSE
                }
            } catch (err) {
                this.classifyError = "Request failed: " + err.message;
            } finally {
                this.classifying = false;
            }
        },

        // ---- Provider settings ----

        async updateProviderKey(id, key) {
            if (!key) return;
            await this.api(`providers/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ api_key: key }),
            });
            await this.loadProviders();
        },

        async updateProviderModel(id, model) {
            await this.api(`providers/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ model }),
            });
            await this.loadProviders();
        },

        async updateProviderUrl(id, url) {
            await this.api(`providers/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ base_url: url }),
            });
            await this.loadProviders();
        },

        async setActiveProvider(id) {
            await this.api(`providers/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ is_active: true }),
            });
            await this.loadProviders();
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
