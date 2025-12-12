/**
 * Server Control Panel - Main Application
 * 
 * Finite State Machine implementation for server lifecycle management.
 * Supports four modes: mock, health-only, api, and wuxuxian.
 * 
 * Configuration can be set via URL parameters:
 *   ?mode=mock|health-only|api|wuxuxian
 *   &serverUrl=http://localhost:3000
 */

// =============================================================================
// Configuration
// =============================================================================

/**
 * Parse URL parameters for configuration overrides
 */
function getUrlParam(name, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || defaultValue;
}

const CONFIG = {
    /**
     * Operation mode:
     * - "mock": Simulates server start/stop without any backend
     * - "health-only": Polls a real /health endpoint but doesn't control server
     * - "api": Full API integration with start/stop/status/health endpoints
     * - "wuxuxian": Uses the existing WuXuxian FastAPI backend at port 8000
     * 
     * Can be overridden via URL parameter: ?mode=api
     */
    MODE: getUrlParam("mode", "mock"),
    
    /**
     * Base URL for the backend server (used in health-only, api, and wuxuxian modes)
     * - For landing-backend: "http://localhost:3000"
     * - For WuXuxian backend: "http://localhost:8000"
     * 
     * Can be overridden via URL parameter: ?serverUrl=http://localhost:3000
     */
    SERVER_BASE_URL: getUrlParam("serverUrl", "http://localhost:3000"),
    
    /**
     * WuXuxian backend URL (used when MODE === "wuxuxian")
     */
    WUXUXIAN_BACKEND_URL: "http://localhost:8000",
    
    /**
     * Interval in milliseconds between polling attempts
     */
    POLL_INTERVAL_MS: 1000,
    
    /**
     * Maximum number of polling attempts before giving up
     */
    MAX_POLL_ATTEMPTS: 30
};

// =============================================================================
// State Machine
// =============================================================================

const States = {
    STOPPED: "STOPPED",
    STARTING: "STARTING",
    RUNNING_UNCONFIRMED: "RUNNING_UNCONFIRMED",
    RUNNING_CONFIRMED: "RUNNING_CONFIRMED",
    STOPPING: "STOPPING",
    ERROR: "ERROR"
};

let currentState = States.STOPPED;
let pollAttempts = 0;
let pollInterval = null;

// =============================================================================
// DOM Elements
// =============================================================================

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const continueBtn = document.getElementById("continueBtn");
const statusText = document.getElementById("statusText");
const logContainer = document.getElementById("logContainer");

// =============================================================================
// Logging
// =============================================================================

/**
 * Add a timestamped log entry to the log panel
 * @param {string} message - The message to log
 * @param {string} type - The log type: info, success, warning, error
 */
function log(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span class="log-message">${escapeHtml(message)}</span>
    `;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// State Transition & UI Update
// =============================================================================

/**
 * Transition to a new state and update UI accordingly
 * @param {string} newState - The state to transition to
 */
function setState(newState) {
    const oldState = currentState;
    currentState = newState;
    
    log(`State: ${oldState} → ${newState}`, "info");
    
    // Update status text
    statusText.textContent = newState.replace(/_/g, " ");
    statusText.className = "status-text " + newState.toLowerCase().replace(/_/g, "-");
    
    // Update button states based on current state
    updateButtons();
}

/**
 * Update button enabled/disabled states based on current state
 */
function updateButtons() {
    switch (currentState) {
        case States.STOPPED:
            startBtn.disabled = false;
            stopBtn.disabled = true;
            continueBtn.disabled = true;
            continueBtn.classList.add("locked");
            break;
            
        case States.STARTING:
        case States.RUNNING_UNCONFIRMED:
            startBtn.disabled = true;
            stopBtn.disabled = false;
            continueBtn.disabled = true;
            continueBtn.classList.add("locked");
            break;
            
        case States.RUNNING_CONFIRMED:
            startBtn.disabled = true;
            stopBtn.disabled = false;
            continueBtn.disabled = false;
            continueBtn.classList.remove("locked");
            break;
            
        case States.STOPPING:
            startBtn.disabled = true;
            stopBtn.disabled = true;
            continueBtn.disabled = true;
            continueBtn.classList.add("locked");
            break;
            
        case States.ERROR:
            startBtn.disabled = false;
            stopBtn.disabled = true;
            continueBtn.disabled = true;
            continueBtn.classList.add("locked");
            break;
    }
}

// =============================================================================
// Polling
// =============================================================================

/**
 * Stop any active polling
 */
function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
    pollAttempts = 0;
}

/**
 * Poll for server confirmation based on mode
 */
async function pollForConfirmation() {
    pollAttempts++;
    
    if (pollAttempts > CONFIG.MAX_POLL_ATTEMPTS) {
        stopPolling();
        setState(States.ERROR);
        log(`Max poll attempts (${CONFIG.MAX_POLL_ATTEMPTS}) exceeded`, "error");
        return;
    }
    
    log(`Polling for confirmation (attempt ${pollAttempts}/${CONFIG.MAX_POLL_ATTEMPTS})...`, "info");
    
    try {
        if (CONFIG.MODE === "mock") {
            // Mock mode: confirm after a short delay (handled differently)
            return;
        }
        
        if (CONFIG.MODE === "health-only") {
            // Poll /health endpoint
            const response = await fetch(`${CONFIG.SERVER_BASE_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                if (data.ok === true) {
                    stopPolling();
                    setState(States.RUNNING_CONFIRMED);
                    log("Server confirmed via /health endpoint", "success");
                }
            }
        }
        
        if (CONFIG.MODE === "wuxuxian") {
            // Poll existing WuXuxian backend /health endpoint
            const response = await fetch(`${CONFIG.WUXUXIAN_BACKEND_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === "ok" || data.ok === true) {
                    stopPolling();
                    setState(States.RUNNING_CONFIRMED);
                    log("WuXuxian backend confirmed via /health endpoint", "success");
                }
            }
        }
        
        if (CONFIG.MODE === "api") {
            // Poll /api/status endpoint
            const response = await fetch(`${CONFIG.SERVER_BASE_URL}/api/status`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === "running") {
                    // Optionally verify with /health
                    const healthResponse = await fetch(`${CONFIG.SERVER_BASE_URL}/health`);
                    if (healthResponse.ok) {
                        const healthData = await healthResponse.json();
                        if (healthData.ok === true) {
                            stopPolling();
                            setState(States.RUNNING_CONFIRMED);
                            log("Server confirmed via /api/status and /health", "success");
                        }
                    }
                }
            }
        }
    } catch (error) {
        log(`Poll error: ${error.message}`, "warning");
    }
}

/**
 * Poll for server stop confirmation (API mode only)
 */
async function pollForStop() {
    pollAttempts++;
    
    if (pollAttempts > CONFIG.MAX_POLL_ATTEMPTS) {
        stopPolling();
        setState(States.ERROR);
        log(`Max poll attempts (${CONFIG.MAX_POLL_ATTEMPTS}) exceeded while stopping`, "error");
        return;
    }
    
    log(`Polling for stop confirmation (attempt ${pollAttempts}/${CONFIG.MAX_POLL_ATTEMPTS})...`, "info");
    
    try {
        const response = await fetch(`${CONFIG.SERVER_BASE_URL}/api/status`);
        if (response.ok) {
            const data = await response.json();
            if (data.status === "stopped") {
                stopPolling();
                setState(States.STOPPED);
                log("Server stopped confirmed via /api/status", "success");
            }
        }
    } catch (error) {
        // If we can't reach the server, assume it's stopped
        stopPolling();
        setState(States.STOPPED);
        log("Server appears to have stopped (connection refused)", "info");
    }
}

// =============================================================================
// Server Actions
// =============================================================================

/**
 * Start the server based on current mode
 */
async function startServer() {
    log(`Starting server (MODE: ${CONFIG.MODE})...`, "info");
    setState(States.STARTING);
    
    if (CONFIG.MODE === "mock") {
        // Mock mode: simulate startup delay then confirm
        log("Mock mode: Simulating server startup...", "info");
        setState(States.RUNNING_UNCONFIRMED);
        
        // Simulate 2-3 second startup delay
        const delay = 2000 + Math.random() * 1000;
        setTimeout(() => {
            if (currentState === States.RUNNING_UNCONFIRMED) {
                setState(States.RUNNING_CONFIRMED);
                log("Mock server confirmed!", "success");
            }
        }, delay);
        return;
    }
    
    if (CONFIG.MODE === "health-only") {
        // Health-only mode: just start polling the /health endpoint
        log("Health-only mode: Polling /health endpoint...", "info");
        setState(States.RUNNING_UNCONFIRMED);
        pollInterval = setInterval(pollForConfirmation, CONFIG.POLL_INTERVAL_MS);
        return;
    }
    
    if (CONFIG.MODE === "wuxuxian") {
        // WuXuxian mode: poll the existing FastAPI backend
        log("WuXuxian mode: Checking existing backend at " + CONFIG.WUXUXIAN_BACKEND_URL + "...", "info");
        log("Note: Start the backend with ./start-alpha.sh or manually", "info");
        setState(States.RUNNING_UNCONFIRMED);
        pollInterval = setInterval(pollForConfirmation, CONFIG.POLL_INTERVAL_MS);
        return;
    }
    
    if (CONFIG.MODE === "api") {
        // API mode: call /api/start then poll for status
        try {
            const response = await fetch(`${CONFIG.SERVER_BASE_URL}/api/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            
            if (!response.ok) {
                throw new Error(`Start request failed: ${response.status}`);
            }
            
            log("Start request sent, polling for confirmation...", "info");
            setState(States.RUNNING_UNCONFIRMED);
            pollInterval = setInterval(pollForConfirmation, CONFIG.POLL_INTERVAL_MS);
        } catch (error) {
            setState(States.ERROR);
            log(`Failed to start server: ${error.message}`, "error");
        }
        return;
    }
}

/**
 * Stop the server based on current mode
 */
async function stopServer() {
    log(`Stopping server (MODE: ${CONFIG.MODE})...`, "info");
    setState(States.STOPPING);
    stopPolling();
    
    if (CONFIG.MODE === "mock") {
        // Mock mode: immediate stop
        log("Mock mode: Server stopped immediately", "info");
        setState(States.STOPPED);
        return;
    }
    
    if (CONFIG.MODE === "health-only") {
        // Health-only mode: can't actually stop the server, just update local state
        log("Health-only mode: Cannot stop remote server. Updating local state only.", "warning");
        setState(States.STOPPED);
        return;
    }
    
    if (CONFIG.MODE === "wuxuxian") {
        // WuXuxian mode: can't stop the server from here, just update local state
        log("WuXuxian mode: Cannot stop backend from here. Use ./stop-alpha.sh", "warning");
        log("Updating local state only.", "info");
        setState(States.STOPPED);
        return;
    }
    
    if (CONFIG.MODE === "api") {
        // API mode: call /api/stop then poll for status
        try {
            const response = await fetch(`${CONFIG.SERVER_BASE_URL}/api/stop`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            
            if (!response.ok) {
                throw new Error(`Stop request failed: ${response.status}`);
            }
            
            log("Stop request sent, polling for confirmation...", "info");
            pollAttempts = 0;
            pollInterval = setInterval(pollForStop, CONFIG.POLL_INTERVAL_MS);
        } catch (error) {
            // If we can't reach the server, assume it's already stopped
            log(`Server may already be stopped: ${error.message}`, "warning");
            setState(States.STOPPED);
        }
        return;
    }
}

/**
 * Continue to the game page
 */
function continueToGame() {
    if (currentState === States.RUNNING_CONFIRMED) {
        log("Navigating to game page...", "success");
        window.location.href = "game.html";
    }
}

// =============================================================================
// Event Listeners
// =============================================================================

startBtn.addEventListener("click", startServer);
stopBtn.addEventListener("click", stopServer);
continueBtn.addEventListener("click", continueToGame);

// =============================================================================
// Initialization
// =============================================================================

document.addEventListener("DOMContentLoaded", function() {
    log("Application initialized", "info");
    log(`Mode: ${CONFIG.MODE}`, "info");
    log(`Server URL: ${CONFIG.SERVER_BASE_URL}`, "info");
    setState(States.STOPPED);
});
