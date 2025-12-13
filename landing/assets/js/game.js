/**
 * WuXuxian VN Tactics - Game Page JavaScript
 * 
 * Handles navigation, interactions, and UI state management
 * for the Visual Novel interface.
 */

// =============================================================================
// Navigation State
// =============================================================================

let currentScreen = 'home';
let previousScreen = null;

/**
 * Navigate to a specific screen
 * @param {string} screenId - The screen to navigate to
 */
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        previousScreen = currentScreen;
        currentScreen = screenId;
        
        // Update nav button states
        updateNavButtons(screenId);
        
        // Log navigation
        log(`Navigated to ${screenId}`, 'info');
        
        // Focus management for accessibility
        targetScreen.focus();
    }
}

/**
 * Update navigation button active states
 * @param {string} activeScreen - The currently active screen
 */
function updateNavButtons(activeScreen) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
        
        // Check if this button corresponds to active screen
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(`'${activeScreen}'`)) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        }
    });
}

// =============================================================================
// Logging
// =============================================================================

/**
 * Add a log entry to the log container
 * @param {string} message - The message to log
 * @param {string} type - The log type: info, success, warning, error
 */
function log(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// Story/Dialogue Interactions
// =============================================================================

/**
 * Handle choice selection in dialogue
 * @param {number} choiceId - The selected choice ID
 */
function selectChoice(choiceId) {
    log(`Selected choice ${choiceId}`, 'success');
    showToast(`Choice ${choiceId} selected!`);
    
    // In a full implementation, this would advance the story
    // For now, we just log the selection
}

// =============================================================================
// Battle System
// =============================================================================

/**
 * Show the battle forecast overlay
 */
function showBattleOverlay() {
    const overlay = document.getElementById('battle-overlay');
    if (overlay) {
        overlay.hidden = false;
        overlay.classList.add('active');
        
        // Focus trap
        overlay.focus();
        
        log('Battle forecast opened', 'info');
    }
}

/**
 * Close the battle forecast overlay
 */
function closeBattleOverlay() {
    const overlay = document.getElementById('battle-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.hidden = true;
        }, 200);
        
        log('Battle forecast closed', 'info');
    }
}

/**
 * Confirm and start the battle
 */
function confirmBattle() {
    log('Battle confirmed! Engaging enemy...', 'success');
    showToast('Battle initiated!');
    closeBattleOverlay();
    
    // In a full implementation, this would trigger the combat sequence
}

// =============================================================================
// Tactical Map Commands
// =============================================================================

/**
 * Execute a tactical command
 * @param {string} command - The command to execute: move, skill, attack, wait
 */
function executeCommand(command) {
    const messages = {
        move: 'Move command selected. Choose a destination tile.',
        skill: 'Skill menu opened. Select a skill to use.',
        attack: 'Attack mode activated. Select an enemy target.',
        wait: 'Unit has ended their turn.'
    };
    
    log(messages[command] || `Command: ${command}`, 'info');
    showToast(messages[command] || `${command} executed`);
    
    // Special handling for attack command
    if (command === 'attack') {
        showBattleOverlay();
    }
}

// =============================================================================
// Character System
// =============================================================================

/**
 * Show character detail panel
 * @param {number} characterId - The character ID to display
 */
function showCharacterDetail(characterId) {
    const characterNames = {
        1: 'Liu Feng',
        2: 'Wei Lan',
        3: 'Jade Phoenix',
        4: 'Chen Wu',
        5: 'Huo Yan',
        6: '???'
    };
    
    const name = characterNames[characterId] || 'Unknown';
    log(`Viewing character: ${name}`, 'info');
    showToast(`Character: ${name}`);
    
    // In a full implementation, this would open a detailed character sheet
}

// =============================================================================
// Toast Notifications
// =============================================================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">ℹ️</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        padding: 12px 24px;
        background: linear-gradient(180deg, #1e3a5f 0%, #0f2340 100%);
        border: 2px solid #d4af37;
        border-radius: 8px;
        color: #fdf6e3;
        font-family: var(--font-ui, sans-serif);
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// =============================================================================
// Keyboard Navigation
// =============================================================================

/**
 * Handle keyboard events for accessibility
 */
function handleKeydown(event) {
    // ESC to close overlays
    if (event.key === 'Escape') {
        const battleOverlay = document.getElementById('battle-overlay');
        if (battleOverlay && battleOverlay.classList.contains('active')) {
            closeBattleOverlay();
            event.preventDefault();
        }
    }
    
    // Number keys for quick navigation (1-7)
    if (event.key >= '1' && event.key <= '7' && !event.ctrlKey && !event.altKey) {
        const screens = ['home', 'story', 'roster', 'bonds', 'research', 'tactics', 'system'];
        const index = parseInt(event.key) - 1;
        if (screens[index]) {
            navigateTo(screens[index]);
            event.preventDefault();
        }
    }
}

// =============================================================================
// Partner Selection (Bonds Screen)
// =============================================================================

/**
 * Handle partner selection in bonds screen
 */
function setupPartnerSelection() {
    const partnerItems = document.querySelectorAll('.partner-item');
    partnerItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            partnerItems.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-selected', 'false');
            });
            
            // Add active to clicked
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
            
            const name = item.querySelector('.partner-name').textContent;
            log(`Selected bond partner: ${name}`, 'info');
        });
        
        // Keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                item.click();
                e.preventDefault();
            }
        });
    });
}

// =============================================================================
// Grid Cell Interaction (Tactical Map)
// =============================================================================

/**
 * Setup grid cell interactions
 */
function setupGridInteractions() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Remove selected from all cells
            gridCells.forEach(c => c.classList.remove('selected'));
            
            // Add selected to clicked cell
            cell.classList.add('selected');
            
            // Check if it's a unit
            if (cell.classList.contains('unit-ally')) {
                log('Ally unit selected', 'info');
            } else if (cell.classList.contains('unit-enemy')) {
                log('Enemy unit targeted', 'warning');
                showBattleOverlay();
            } else if (cell.classList.contains('reachable')) {
                log('Move target selected', 'info');
            } else if (cell.classList.contains('threat')) {
                log('Danger zone selected', 'warning');
            }
        });
        
        // Keyboard support
        cell.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                cell.click();
                e.preventDefault();
            }
        });
    });
}

// =============================================================================
// Session Management
// =============================================================================

const SESSION_KEY = 'wuxuxian_session';

/**
 * Load and display current session profile
 */
function loadSessionProfile() {
    const profileDisplay = document.getElementById('profileDisplay');
    if (!profileDisplay) return;

    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const profileNames = {
                'player1': 'Player 1 (玩家一)',
                'player2': 'Player 2 (玩家二)',
                'gamemaster': 'Game Master (游戏主持)'
            };
            const displayName = profileNames[session.profileType] || session.profileType;
            profileDisplay.textContent = displayName;
            log(`Session loaded: ${session.profileType}`, 'success');
        } else {
            profileDisplay.textContent = 'No Session';
            profileDisplay.classList.remove('running-confirmed');
            profileDisplay.classList.add('stopped');
            log('No active session found', 'warning');
        }
    } catch (e) {
        profileDisplay.textContent = 'Session Error';
        profileDisplay.classList.remove('running-confirmed');
        profileDisplay.classList.add('error');
        log('Failed to load session data', 'error');
    }
}

// =============================================================================
// Initialization
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize logging
    log('WuXuxian VN Tactics initialized', 'success');
    log('Press 1-7 to quickly navigate between screens', 'info');
    
    // Load session profile
    loadSessionProfile();
    
    // Setup event listeners
    document.addEventListener('keydown', handleKeydown);
    
    // Setup component interactions
    setupPartnerSelection();
    setupGridInteractions();
    
    // Add entrance animation to game container
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.opacity = '0';
        gameContainer.style.transform = 'translateY(20px)';
        gameContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            gameContainer.style.opacity = '1';
            gameContainer.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        log('Reduced motion mode enabled', 'info');
    }
});
