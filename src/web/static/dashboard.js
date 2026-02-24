/*
 * AI Smart Bin - Dashboard JavaScript
 *
 * Handles API calls, SSE real-time updates, and UI interactions.
 * No external dependencies - vanilla JS only.
 */

// =========================================================================
// State
// =========================================================================

let currentMode = "yolo";
const activityItems = [];
const MAX_ACTIVITY = 100;

// =========================================================================
// API helpers
// =========================================================================

async function api(endpoint, options = {}) {
    const res = await fetch(`/api/${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    return res.json();
}

// =========================================================================
// Load initial data
// =========================================================================

async function loadStats() {
    const stats = await api("stats");
    document.getElementById("total-sorted").textContent = stats.total_sorted;
    updateBars(stats.breakdown, stats.total_sorted);
}

async function loadMode() {
    const data = await api("mode");
    currentMode = data.mode;
    updateModeUI();
}

async function loadHealth() {
    const h = await api("health");
    document.getElementById("health-temp").textContent = h.cpu_temp_c + " C";
    document.getElementById("health-uptime").textContent = formatUptime(h.uptime_seconds);
    document.getElementById("health-inference").textContent = h.inference_ms + " ms";
    document.getElementById("health-uart").textContent = h.uart_connected ? "Connected" : "Disconnected";
    document.getElementById("health-wifi").textContent = h.wifi_connected ? "Connected" : "Disconnected";
}

async function loadServos() {
    const angles = await api("servos");
    for (const [cat, angle] of Object.entries(angles)) {
        const slider = document.getElementById(`slider-${cat}`);
        const label = document.getElementById(`angle-${cat}`);
        if (slider) slider.value = angle;
        if (label) label.textContent = angle;
    }
}

async function loadHistory() {
    const events = await api("history?limit=30");
    // Events come newest-first from the API
    events.reverse().forEach(e => addActivityItem(e, false));
}

// =========================================================================
// Mode switching
// =========================================================================

async function setMode(mode) {
    await api("mode", {
        method: "POST",
        body: JSON.stringify({ mode }),
    });
    currentMode = mode;
    updateModeUI();
}

function updateModeUI() {
    const btnYolo = document.getElementById("btn-yolo");
    const btnLlm = document.getElementById("btn-llm");
    const desc = document.getElementById("mode-desc");

    btnYolo.classList.toggle("active", currentMode === "yolo");
    btnLlm.classList.toggle("active", currentMode === "llm");

    desc.textContent = currentMode === "yolo"
        ? "Offline edge AI - YOLO11s on NPU"
        : "Cloud VLM via OpenRouter (requires Wi-Fi)";
}

// =========================================================================
// Servo controls
// =========================================================================

function updateAngleLabel(category, value) {
    document.getElementById(`angle-${category}`).textContent = value;
}

async function setServoAngle(category, angle) {
    await api("servos", {
        method: "POST",
        body: JSON.stringify({ category, angle: parseInt(angle, 10) }),
    });
}

async function manualSort() {
    await api("sort", { method: "POST" });
}

async function homeServos() {
    await api("home", { method: "POST" });
}

// =========================================================================
// Bar chart update
// =========================================================================

function updateBars(breakdown, total) {
    for (const cat of ["general", "recycling", "compost"]) {
        const count = breakdown[cat] || 0;
        const pct = total > 0 ? ((count / total) * 100) : 0;
        document.getElementById(`bar-${cat}`).style.width = pct + "%";
        document.getElementById(`count-${cat}`).textContent = count;
    }
}

// =========================================================================
// Activity feed
// =========================================================================

function addActivityItem(event, prepend = true) {
    const list = document.getElementById("activity-list");
    const empty = list.querySelector(".empty-state");
    if (empty) empty.remove();

    const div = document.createElement("div");
    div.className = "activity-item";

    const label = event.label || event.category;
    const confPct = Math.round((event.confidence || 0) * 100);
    const timeStr = event.timestamp
        ? new Date(event.timestamp * 1000).toLocaleTimeString()
        : new Date().toLocaleTimeString();

    div.innerHTML = `
        <span class="activity-dot ${event.category}"></span>
        <span class="activity-category">${event.category}</span>
        <span class="activity-label">${label}</span>
        <span class="activity-conf">${confPct}%</span>
        <span class="activity-time">${timeStr}</span>
    `;

    if (prepend) {
        list.prepend(div);
    } else {
        list.append(div);
    }

    // Trim old items
    activityItems.push(div);
    while (activityItems.length > MAX_ACTIVITY) {
        const old = activityItems.shift();
        old.remove();
    }
}

// =========================================================================
// SSE (Server-Sent Events)
// =========================================================================

function connectSSE() {
    const dot = document.getElementById("connection-status");
    const evtSource = new EventSource("/api/events");

    evtSource.addEventListener("connected", () => {
        dot.className = "status-dot connected";
        dot.title = "SSE connected";
    });

    evtSource.addEventListener("sort_event", (e) => {
        const event = JSON.parse(e.data);
        addActivityItem(event, true);
        // Refresh stats after each sort
        loadStats();
    });

    evtSource.addEventListener("mode_change", (e) => {
        const data = JSON.parse(e.data);
        currentMode = data.mode;
        updateModeUI();
    });

    evtSource.addEventListener("servo_update", (e) => {
        const data = JSON.parse(e.data);
        const slider = document.getElementById(`slider-${data.category}`);
        const label = document.getElementById(`angle-${data.category}`);
        if (slider) slider.value = data.angle;
        if (label) label.textContent = data.angle;
    });

    evtSource.onerror = () => {
        dot.className = "status-dot disconnected";
        dot.title = "SSE disconnected - reconnecting...";
    };
}

// =========================================================================
// Utilities
// =========================================================================

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// =========================================================================
// Init
// =========================================================================

document.addEventListener("DOMContentLoaded", async () => {
    // Load all initial data in parallel
    await Promise.all([
        loadStats(),
        loadMode(),
        loadHealth(),
        loadServos(),
        loadHistory(),
    ]);

    // Connect SSE for real-time updates
    connectSSE();

    // Refresh health every 5 seconds
    setInterval(loadHealth, 5000);
});
