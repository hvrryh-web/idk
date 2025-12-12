/**
 * Configuration for the WuXuxian TTRPG Alpha Test Application
 * 
 * This file contains all configurable settings for the static landing page.
 * Modify these values based on your deployment environment.
 */

const CONFIG = {
    // Base URL for the control/game API
    // For local development, this is the backend server
    // For production, this should be your deployed server URL
    CONTROL_API_BASE_URL: 'http://localhost:8000',
    
    // API endpoint paths
    START_PATH: '/start',
    STOP_PATH: '/stop', 
    HEALTH_PATH: '/health',
    
    // Health check polling settings
    POLL_INTERVAL_MS: 1500,        // How often to poll health endpoint (milliseconds)
    MAX_WAIT_TIMEOUT_MS: 60000,    // Maximum time to wait for server to be ready (milliseconds)
    
    // Game frontend URL (where "Enter Game" button navigates)
    GAME_FRONTEND_URL: 'http://localhost:5173',
    
    // Static game page (fallback if frontend not running)
    GAME_PAGE: 'game.html',
    
    // GitHub repository information
    GITHUB_REPO_URL: 'https://github.com/hvrryh-web/idk',
    GITHUB_ISSUES_URL: 'https://github.com/hvrryh-web/idk/issues',
    GITHUB_ACTIONS_URL: 'https://github.com/hvrryh-web/idk/actions',
    
    // Feature flags
    FEATURES: {
        // If true, Start/Stop buttons will attempt to call server control endpoints
        // If false, they will be hidden and only health check will work
        ENABLE_SERVER_CONTROL: false,
        
        // If true, show detailed diagnostics panel
        SHOW_DIAGNOSTICS: true,
        
        // If true, store session state in sessionStorage
        PERSIST_SESSION_STATE: true,
        
        // If true, automatically check server health on page load
        AUTO_CHECK_HEALTH: true
    },
    
    // UI text customization
    TEXT: {
        APP_TITLE: 'WuXuxian TTRPG',
        APP_SUBTITLE: 'Cultivate Your Path to Immortality',
        STATUS_STOPPED: 'Server Offline',
        STATUS_STARTING: 'Starting Server...',
        STATUS_READY: 'Server Ready',
        STATUS_STOPPING: 'Stopping Server...',
        STATUS_ERROR: 'Connection Error',
        BUTTON_START: 'Start Server',
        BUTTON_STOP: 'Stop Server', 
        BUTTON_ENTER: 'Enter Game',
        BUTTON_LOCKED: '🔒 Enter Game (Server Required)'
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.FEATURES);
Object.freeze(CONFIG.TEXT);
