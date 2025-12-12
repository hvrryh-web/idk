/**
 * Landing Page Backend Server
 * 
 * Provides start/stop/status/health endpoints for the landing page control panel.
 * Used with MODE=api in the frontend.
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse allowed origins from environment or default to allow all
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",") 
    : null;

// =============================================================================
// Middleware
// =============================================================================

// CORS configuration
app.use(cors({
    origin: ALLOWED_ORIGINS || true, // Allow all origins if not specified
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// JSON body parser
app.use(express.json());

// =============================================================================
// Server State
// =============================================================================

/**
 * Internal server state
 * Valid values: "stopped", "starting", "running", "stopping", "error"
 */
let serverState = "stopped";

/**
 * Transition to a new state after a delay
 * @param {string} targetState - The state to transition to
 * @param {number} delayMs - Delay in milliseconds before transition
 */
function delayedTransition(targetState, delayMs) {
    setTimeout(() => {
        serverState = targetState;
        console.log(`[State] Transitioned to: ${serverState}`);
    }, delayMs);
}

// =============================================================================
// API Endpoints
// =============================================================================

/**
 * POST /api/start
 * Start the server (transitions from stopped to starting to running)
 */
app.post("/api/start", (req, res) => {
    console.log("[API] POST /api/start");
    
    if (serverState !== "stopped" && serverState !== "error") {
        return res.status(400).json({
            success: false,
            message: `Cannot start: server is currently ${serverState}`
        });
    }
    
    serverState = "starting";
    console.log(`[State] Transitioned to: ${serverState}`);
    
    // Simulate startup delay (1-2 seconds)
    const startupDelay = 1000 + Math.random() * 1000;
    delayedTransition("running", startupDelay);
    
    res.json({
        success: true,
        message: "Server starting",
        state: serverState
    });
});

/**
 * POST /api/stop
 * Stop the server (transitions from running to stopping to stopped)
 */
app.post("/api/stop", (req, res) => {
    console.log("[API] POST /api/stop");
    
    if (serverState !== "running" && serverState !== "starting") {
        return res.status(400).json({
            success: false,
            message: `Cannot stop: server is currently ${serverState}`
        });
    }
    
    serverState = "stopping";
    console.log(`[State] Transitioned to: ${serverState}`);
    
    // Simulate shutdown delay (0.5-1 second)
    const shutdownDelay = 500 + Math.random() * 500;
    delayedTransition("stopped", shutdownDelay);
    
    res.json({
        success: true,
        message: "Server stopping",
        state: serverState
    });
});

/**
 * GET /api/status
 * Get the current server status
 */
app.get("/api/status", (req, res) => {
    console.log(`[API] GET /api/status -> ${serverState}`);
    
    res.json({
        status: serverState
    });
});

/**
 * GET /health
 * Health check endpoint
 * Returns 200 with { ok: true } only when server is running
 * Returns 503 with { ok: false } otherwise
 */
app.get("/health", (req, res) => {
    console.log(`[API] GET /health -> ${serverState === "running" ? "healthy" : "unhealthy"}`);
    
    if (serverState === "running") {
        res.json({ ok: true });
    } else {
        res.status(503).json({ 
            ok: false,
            state: serverState
        });
    }
});

/**
 * GET /
 * Root endpoint - basic info
 */
app.get("/", (req, res) => {
    res.json({
        name: "Landing Page Backend",
        version: "1.0.0",
        endpoints: [
            "POST /api/start - Start the server",
            "POST /api/stop - Stop the server",
            "GET /api/status - Get server status",
            "GET /health - Health check"
        ]
    });
});

// =============================================================================
// Start Server
// =============================================================================

app.listen(PORT, () => {
    console.log(`Landing Backend Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Status: http://localhost:${PORT}/api/status`);
    console.log("");
    console.log("Endpoints:");
    console.log("  POST /api/start - Start the server");
    console.log("  POST /api/stop  - Stop the server");
    console.log("  GET  /api/status - Get server status");
    console.log("  GET  /health    - Health check");
});
