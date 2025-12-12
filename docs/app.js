/**
 * WuXuxian TTRPG Alpha Test - Application Logic
 * 
 * Implements the server control state machine and UI management.
 * States: STOPPED -> STARTING -> READY -> STOPPING -> STOPPED
 */

// ========================================
// State Machine
// ========================================

const ServerState = {
    STOPPED: 'STOPPED',
    STARTING: 'STARTING',
    READY: 'READY',
    STOPPING: 'STOPPING'
};

// Application state
const app = {
    currentState: ServerState.STOPPED,
    pollIntervalId: null,
    pollStartTime: null,
    diagnosticData: {
        timestamp: null,
        services: {},
        errors: [],
        browser: navigator.userAgent
    }
};

// ========================================
// DOM Elements
// ========================================

function getElements() {
    return {
        btnStart: document.getElementById('btnStart'),
        btnStop: document.getElementById('btnStop'),
        btnEnter: document.getElementById('btnEnter'),
        statusBadge: document.getElementById('statusBadge'),
        statusDot: document.getElementById('statusDot'),
        statusText: document.getElementById('statusText'),
        errorMessage: document.getElementById('errorMessage'),
        errorMessageText: document.getElementById('errorMessageText'),
        spinnerStart: document.getElementById('spinnerStart'),
        spinnerStop: document.getElementById('spinnerStop'),
        consolePanel: document.getElementById('consolePanel'),
        diagnosticsGrid: document.getElementById('diagnosticsGrid')
    };
}

// ========================================
// Console Logging
// ========================================

function logToConsole(message, type = 'info') {
    const consolePanel = document.getElementById('consolePanel');
    if (!consolePanel) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = `<span class="console-timestamp">[${timestamp}]</span>${escapeHtml(message)}`;
    consolePanel.appendChild(line);
    consolePanel.scrollTop = consolePanel.scrollHeight;
}

function clearConsole() {
    const consolePanel = document.getElementById('consolePanel');
    if (consolePanel) {
        consolePanel.innerHTML = '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// UI State Management
// ========================================

function updateUI(state) {
    const elements = getElements();
    if (!elements.btnStart || !elements.btnStop || !elements.btnEnter) {
        console.error('Required UI elements not found');
        return;
    }
    
    // Reset all spinners
    if (elements.spinnerStart) elements.spinnerStart.classList.remove('show');
    if (elements.spinnerStop) elements.spinnerStop.classList.remove('show');
    
    // Hide error message by default
    if (elements.errorMessage) elements.errorMessage.classList.remove('show');
    
    switch (state) {
        case ServerState.STOPPED:
            // Start enabled, Stop disabled, Enter locked
            elements.btnStart.disabled = !CONFIG.FEATURES.ENABLE_SERVER_CONTROL;
            elements.btnStop.disabled = true;
            elements.btnEnter.disabled = true;
            elements.btnEnter.classList.add('locked');
            elements.btnEnter.textContent = CONFIG.TEXT.BUTTON_LOCKED;
            
            // Status badge
            elements.statusBadge.className = 'status-badge error';
            elements.statusDot.classList.remove('pulse');
            elements.statusText.textContent = CONFIG.TEXT.STATUS_STOPPED;
            break;
            
        case ServerState.STARTING:
            // Start disabled, Stop enabled (optional), Enter locked
            elements.btnStart.disabled = true;
            elements.btnStop.disabled = false;
            elements.btnEnter.disabled = true;
            elements.btnEnter.classList.add('locked');
            elements.btnEnter.textContent = CONFIG.TEXT.BUTTON_LOCKED;
            
            // Show spinner
            if (elements.spinnerStart) elements.spinnerStart.classList.add('show');
            
            // Status badge
            elements.statusBadge.className = 'status-badge loading';
            elements.statusDot.classList.add('pulse');
            elements.statusText.textContent = CONFIG.TEXT.STATUS_STARTING;
            break;
            
        case ServerState.READY:
            // Start disabled, Stop enabled, Enter UNLOCKED
            elements.btnStart.disabled = true;
            elements.btnStop.disabled = !CONFIG.FEATURES.ENABLE_SERVER_CONTROL;
            elements.btnEnter.disabled = false;
            elements.btnEnter.classList.remove('locked');
            elements.btnEnter.textContent = '🎮 ' + CONFIG.TEXT.BUTTON_ENTER;
            
            // Status badge
            elements.statusBadge.className = 'status-badge ready';
            elements.statusDot.classList.remove('pulse');
            elements.statusText.textContent = CONFIG.TEXT.STATUS_READY;
            break;
            
        case ServerState.STOPPING:
            // All buttons disabled
            elements.btnStart.disabled = true;
            elements.btnStop.disabled = true;
            elements.btnEnter.disabled = true;
            elements.btnEnter.classList.add('locked');
            elements.btnEnter.textContent = CONFIG.TEXT.BUTTON_LOCKED;
            
            // Show spinner
            if (elements.spinnerStop) elements.spinnerStop.classList.add('show');
            
            // Status badge
            elements.statusBadge.className = 'status-badge loading';
            elements.statusDot.classList.add('pulse');
            elements.statusText.textContent = CONFIG.TEXT.STATUS_STOPPING;
            break;
    }
    
    // Hide server control buttons if feature is disabled
    if (!CONFIG.FEATURES.ENABLE_SERVER_CONTROL) {
        elements.btnStart.classList.add('hidden');
        elements.btnStop.classList.add('hidden');
    }
    
    // Save state to session storage if enabled
    if (CONFIG.FEATURES.PERSIST_SESSION_STATE) {
        sessionStorage.setItem('wuxuxian_server_state', state);
    }
    
    app.currentState = state;
}

function showError(message) {
    const elements = getElements();
    if (elements.errorMessage && elements.errorMessageText) {
        elements.errorMessageText.textContent = message;
        elements.errorMessage.classList.add('show');
    }
    logToConsole('❌ ' + message, 'error');
}

// ========================================
// Server Health Check
// ========================================

// AbortController for cleanup of in-flight health check requests
let healthCheckController = null;

async function checkHealth() {
    // Abort any previous in-flight request
    if (healthCheckController) {
        healthCheckController.abort();
    }
    healthCheckController = new AbortController();
    
    try {
        const response = await fetch(CONFIG.CONTROL_API_BASE_URL + CONFIG.HEALTH_PATH, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            },
            signal: healthCheckController.signal
        });
        
        if (response.ok) {
            const data = await response.json();
            // Check for { status: "ok" } or { ready: true }
            if (data.status === 'ok' || data.ready === true) {
                return true;
            }
        }
        return false;
    } catch (error) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
            return false;
        }
        logToConsole(`Health check failed: ${error.message}`, 'warning');
        return false;
    }
}

async function pollHealthUntilReady() {
    app.pollStartTime = Date.now();
    
    const poll = async () => {
        // Check timeout
        if (Date.now() - app.pollStartTime > CONFIG.MAX_WAIT_TIMEOUT_MS) {
            stopPolling();
            updateUI(ServerState.STOPPED);
            showError(`Server startup timed out after ${CONFIG.MAX_WAIT_TIMEOUT_MS / 1000} seconds`);
            return;
        }
        
        logToConsole('Polling health endpoint...', 'info');
        const isReady = await checkHealth();
        
        if (isReady) {
            stopPolling();
            updateUI(ServerState.READY);
            logToConsole('✅ Server is ready!', 'success');
            
            // Update diagnostic card
            updateDiagnosticCard('backend', 'healthy', 'Online', CONFIG.CONTROL_API_BASE_URL);
        }
        // If not ready, continue polling (interval handles this)
    };
    
    // Initial check
    await poll();
    
    // Continue polling if not ready
    if (app.currentState === ServerState.STARTING) {
        app.pollIntervalId = setInterval(poll, CONFIG.POLL_INTERVAL_MS);
    }
}

function stopPolling() {
    if (app.pollIntervalId) {
        clearInterval(app.pollIntervalId);
        app.pollIntervalId = null;
    }
}

// ========================================
// Server Control API Calls
// ========================================

async function startServer() {
    logToConsole('Requesting server start...', 'info');
    updateUI(ServerState.STARTING);
    
    try {
        const response = await fetch(CONFIG.CONTROL_API_BASE_URL + CONFIG.START_PATH, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok || response.status === 202) {
            logToConsole('Start request accepted, polling for health...', 'info');
            await pollHealthUntilReady();
        } else {
            throw new Error(`Server returned ${response.status}`);
        }
    } catch (error) {
        logToConsole(`Start request failed: ${error.message}`, 'error');
        updateUI(ServerState.STOPPED);
        showError(`Failed to start server: ${error.message}`);
    }
}

async function stopServer() {
    logToConsole('Requesting server stop...', 'info');
    updateUI(ServerState.STOPPING);
    
    try {
        const response = await fetch(CONFIG.CONTROL_API_BASE_URL + CONFIG.STOP_PATH, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Give it a moment to stop
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateUI(ServerState.STOPPED);
        logToConsole('Server stopped', 'info');
        
        // Update diagnostic card
        updateDiagnosticCard('backend', 'unhealthy', 'Offline', CONFIG.CONTROL_API_BASE_URL);
        
    } catch (error) {
        logToConsole(`Stop request failed: ${error.message}`, 'warning');
        // Still transition to STOPPED since we can't control the server
        updateUI(ServerState.STOPPED);
    }
}

// ========================================
// Enter Game Navigation
// ========================================

function enterGame() {
    if (app.currentState !== ServerState.READY) {
        showError('Server must be running to enter the game');
        return;
    }
    
    logToConsole('Navigating to game...', 'success');
    
    // Try to open the game frontend
    // If it's the same origin or a valid URL, navigate there
    if (CONFIG.GAME_FRONTEND_URL && CONFIG.GAME_FRONTEND_URL !== '') {
        window.open(CONFIG.GAME_FRONTEND_URL, '_blank');
    } else {
        window.location.href = CONFIG.GAME_PAGE;
    }
}

// ========================================
// Diagnostics
// ========================================

function updateDiagnosticCard(serviceId, status, message, details = '') {
    const card = document.getElementById(`diagnostic-${serviceId}`);
    if (!card) return;
    
    card.className = `diagnostic-card ${status}`;
    
    const statusEl = card.querySelector('.diagnostic-card-status');
    if (statusEl) statusEl.textContent = message;
    
    const detailsEl = card.querySelector('.diagnostic-card-details');
    if (detailsEl) detailsEl.textContent = details;
    
    // Update diagnostic data
    app.diagnosticData.services[serviceId] = { status, message, details };
}

async function runDiagnostics() {
    clearConsole();
    logToConsole('🔍 Running diagnostics...', 'info');
    logToConsole(`Browser: ${navigator.userAgent}`, 'info');
    logToConsole(`Timestamp: ${new Date().toISOString()}`, 'info');
    logToConsole('─'.repeat(40), 'info');
    
    app.diagnosticData = {
        timestamp: new Date().toISOString(),
        services: {},
        errors: [],
        browser: navigator.userAgent
    };
    
    // Check backend
    updateDiagnosticCard('backend', 'checking', 'Checking...', CONFIG.CONTROL_API_BASE_URL);
    const backendOk = await checkBackendService();
    
    // Check frontend
    updateDiagnosticCard('frontend', 'checking', 'Checking...', CONFIG.GAME_FRONTEND_URL);
    const frontendOk = await checkFrontendService();
    
    logToConsole('─'.repeat(40), 'info');
    
    if (backendOk) {
        logToConsole('🎉 Backend is running! You can enter the game.', 'success');
        updateUI(ServerState.READY);
    } else {
        logToConsole('⚠️ Backend not detected. Please start the server.', 'warning');
        updateUI(ServerState.STOPPED);
    }
    
    logToConsole('Diagnostics complete.', 'success');
}

async function checkBackendService() {
    try {
        const start = Date.now();
        const response = await fetch(CONFIG.CONTROL_API_BASE_URL + CONFIG.HEALTH_PATH, {
            method: 'GET',
            mode: 'cors'
        });
        const latency = Date.now() - start;
        
        if (response.ok) {
            const data = await response.json();
            updateDiagnosticCard('backend', 'healthy', `Online (${latency}ms)`, CONFIG.CONTROL_API_BASE_URL);
            logToConsole(`✅ Backend healthy - Response: ${JSON.stringify(data)}`, 'success');
            return true;
        } else {
            updateDiagnosticCard('backend', 'unhealthy', `Error: ${response.status}`, CONFIG.CONTROL_API_BASE_URL);
            logToConsole(`❌ Backend returned status ${response.status}`, 'error');
            return false;
        }
    } catch (error) {
        updateDiagnosticCard('backend', 'unhealthy', 'Not responding', CONFIG.CONTROL_API_BASE_URL);
        logToConsole(`❌ Backend not reachable: ${error.message}`, 'error');
        app.diagnosticData.errors.push({ service: 'backend', error: error.message });
        return false;
    }
}

async function checkFrontendService() {
    try {
        const start = Date.now();
        // Using no-cors mode since frontend is typically on different origin
        // This returns opaque response, so we can only detect if the request completes
        // without network error - which indicates the server is reachable
        await fetch(CONFIG.GAME_FRONTEND_URL, {
            method: 'HEAD',
            mode: 'no-cors'
        });
        const latency = Date.now() - start;
        
        // no-cors returns opaque response, assume success if no network error
        // This is a limitation of cross-origin requests without CORS headers
        updateDiagnosticCard('frontend', 'healthy', `Reachable (${latency}ms)`, CONFIG.GAME_FRONTEND_URL);
        logToConsole('✅ Frontend reachable', 'success');
        return true;
    } catch (error) {
        updateDiagnosticCard('frontend', 'unhealthy', 'Not responding', CONFIG.GAME_FRONTEND_URL);
        logToConsole(`⚠️ Frontend not reachable: ${error.message}`, 'warning');
        return false;
    }
}

// ========================================
// GitHub Integration
// ========================================

function openGitHubIssue() {
    // For GitHub markdown context, we don't need HTML escaping
    // The values are URL-encoded when passed to the URL, which handles special characters
    const browser = navigator.userAgent;
    const timestamp = new Date().toISOString();
    
    const servicesText = Object.entries(app.diagnosticData.services)
        .map(([k, v]) => `- **${k}**: ${v.status} - ${v.message}`)
        .join('\n');
    
    const errorsText = app.diagnosticData.errors.length > 0 
        ? app.diagnosticData.errors.map(e => `- ${e.service}: ${e.error}`).join('\n') 
        : 'No errors detected';

    const body = `## Environment
- **Browser**: ${browser}
- **Timestamp**: ${timestamp}

## Service Status
${servicesText || 'No services checked yet'}

## Errors
${errorsText}

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior


## Actual Behavior


## Additional Context
<!-- Paste any relevant console output or screenshots here -->
`;
    
    // encodeURIComponent handles all special characters for URL safety
    const url = `${CONFIG.GITHUB_ISSUES_URL}/new?title=${encodeURIComponent('[Alpha Test] Issue Report')}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
    logToConsole('🐛 Opened GitHub issue form', 'success');
}

// ========================================
// Event Handlers
// ========================================

function setupEventListeners() {
    const elements = getElements();
    
    // Start button
    if (elements.btnStart) {
        elements.btnStart.addEventListener('click', async () => {
            if (CONFIG.FEATURES.ENABLE_SERVER_CONTROL) {
                await startServer();
            } else {
                // Just check if server is already running
                logToConsole('Checking if server is running...', 'info');
                updateUI(ServerState.STARTING);
                await pollHealthUntilReady();
            }
        });
    }
    
    // Stop button
    if (elements.btnStop) {
        elements.btnStop.addEventListener('click', async () => {
            stopPolling();
            if (CONFIG.FEATURES.ENABLE_SERVER_CONTROL) {
                await stopServer();
            } else {
                updateUI(ServerState.STOPPED);
                logToConsole('Stopped checking server health', 'info');
            }
        });
    }
    
    // Enter Game button
    if (elements.btnEnter) {
        elements.btnEnter.addEventListener('click', () => {
            enterGame();
        });
    }
    
    // Check Health button (if exists)
    const btnCheckHealth = document.getElementById('btnCheckHealth');
    if (btnCheckHealth) {
        btnCheckHealth.addEventListener('click', async () => {
            await runDiagnostics();
        });
    }
    
    // Report Issue button (if exists)
    const btnReportIssue = document.getElementById('btnReportIssue');
    if (btnReportIssue) {
        btnReportIssue.addEventListener('click', () => {
            openGitHubIssue();
        });
    }
}

// ========================================
// Initialization
// ========================================

async function init() {
    logToConsole('🎮 WuXuxian TTRPG Alpha Test', 'info');
    logToConsole('Initializing application...', 'info');
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for persisted state
    if (CONFIG.FEATURES.PERSIST_SESSION_STATE) {
        const savedState = sessionStorage.getItem('wuxuxian_server_state');
        if (savedState === ServerState.READY) {
            logToConsole('Restored session state, verifying server health...', 'info');
            const isReady = await checkHealth();
            if (isReady) {
                updateUI(ServerState.READY);
                logToConsole('✅ Session restored, server is ready', 'success');
                return;
            }
        }
    }
    
    // Initial state
    updateUI(ServerState.STOPPED);
    
    // Auto-check health on page load if enabled
    if (CONFIG.FEATURES.AUTO_CHECK_HEALTH) {
        logToConsole('Auto-checking server health...', 'info');
        await runDiagnostics();
    }
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
