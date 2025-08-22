/**
 * UI Manager - Coordinates all UI components for the asteroid game
 * Manages HUD, Minimap, Game Over Screen, and UI state
 */
import { HUD } from './HUD.js';
import { Minimap } from './Minimap.js';
import { GameOverScreen } from './GameOverScreen.js';

export class UIManager {
    constructor(canvas, gameState, gameWorld) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        this.gameWorld = gameWorld;
        
        // Initialize UI components
        this.hud = new HUD(canvas, gameState);
        this.minimap = new Minimap(canvas, gameState, gameWorld);
        this.gameOverScreen = new GameOverScreen(canvas, gameState);
        
        // UI state
        this.showControls = false;
        this.debugMode = false;
        this.paused = false;
        
        // Performance tracking
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 60;
        
        // Message system
        this.messages = [];
        this.messageHistory = [];
        this.maxMessages = 3;
        this.messageDuration = 3000; // 3 seconds
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize game state message system
        if (!this.gameState.messages) {
            this.gameState.messages = [];
        }
    }
    
    /**
     * Setup event listeners for UI controls
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Handle canvas resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * Handle key press events for UI controls
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        switch (event.key.toLowerCase()) {
            case 'h':
                this.showControls = !this.showControls;
                break;
            case 'f1':
                this.debugMode = !this.debugMode;
                event.preventDefault();
                break;
            case 'escape':
                this.paused = !this.paused;
                if (this.gameState.setPaused) {
                    this.gameState.setPaused(this.paused);
                }
                break;
        }
    }
    
    /**
     * Handle canvas resize
     */
    handleResize() {
        // Update minimap position for new canvas size
        this.minimap.updatePosition(this.canvas.width, this.canvas.height);
    }
    
    /**
     * Update all UI components
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        // Update performance tracking
        this.updatePerformanceMetrics();
        
        // Update messages
        this.updateMessages(deltaTime);
        
        // Update UI components
        this.hud.update(deltaTime);
        this.gameOverScreen.update(deltaTime);
        
        // Handle game state changes
        this.handleGameStateChanges();
    }
    
    /**
     * Update performance metrics (FPS calculation)
     */
    updatePerformanceMetrics() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        
        this.frameCount++;
        
        // Update FPS every 30 frames
        if (this.frameCount % 30 === 0) {
            this.fps = Math.round(1000 / deltaTime);
        }
        
        this.lastFrameTime = currentTime;
    }
    
    /**
     * Update message system
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    updateMessages(deltaTime) {
        // Remove expired messages
        this.messages = this.messages.filter(message => {
            message.timeLeft -= deltaTime;
            return message.timeLeft > 0;
        });
        
        // Update game state messages
        this.gameState.messages = this.messages.map(msg => msg.text);
    }
    
    /**
     * Handle game state changes and trigger UI updates
     */
    handleGameStateChanges() {
        // Check for squadron mode changes
        if (this.gameState.lastSquadronMode !== this.gameState.squadronMode) {
            this.hud.onModeChange(this.gameState.squadronMode);
            this.showMessage(`Squadron Mode: ${this.gameState.squadronMode.toUpperCase()}`, 2000);
            this.gameState.lastSquadronMode = this.gameState.squadronMode;
        }
        
        // Check for game over
        if (this.gameState.gameOver && !this.gameOverScreen.isShown()) {
            this.showGameOver();
        }
        
        // Check for new wave
        if (this.gameState.lastWave !== this.gameState.wave) {
            if (this.gameState.lastWave !== undefined) {
                this.showMessage(`WAVE ${this.gameState.wave}`, 3000);
            }
            this.gameState.lastWave = this.gameState.wave;
        }
    }
    
    /**
     * Show a temporary message
     * @param {string} text - Message text
     * @param {number} duration - Duration in milliseconds
     * @param {string} type - Message type (info, warning, error)
     */
    showMessage(text, duration = 3000, type = 'info') {
        const message = {
            text: text,
            timeLeft: duration,
            type: type,
            timestamp: Date.now()
        };
        
        this.messages.push(message);
        this.messageHistory.push({ ...message, duration });
        
        // Limit number of simultaneous messages
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
    }
    
    /**
     * Show the game over screen with final statistics
     */
    showGameOver() {
        const finalStats = {
            score: this.gameState.score,
            wave: this.gameState.wave,
            asteroidsDestroyed: this.gameState.asteroidsDestroyed || 0,
            timeAlive: this.gameState.gameTime || 0,
            squadronShipsLost: this.gameState.squadronShipsLost || 0,
            accuracy: this.calculateAccuracy()
        };
        
        this.gameOverScreen.show(finalStats);
    }
    
    /**
     * Calculate shooting accuracy
     * @returns {number} Accuracy percentage
     */
    calculateAccuracy() {
        const shotsFired = this.gameState.shotsFired || 0;
        const shotsHit = this.gameState.shotsHit || 0;
        
        if (shotsFired === 0) return 0;
        return (shotsHit / shotsFired) * 100;
    }
    
    /**
     * Render all UI components
     */
    render() {
        // Don't render UI if game over screen is showing
        if (this.gameOverScreen.isShown()) {
            this.gameOverScreen.render();
            return;
        }
        
        // Render main UI components
        this.hud.render();
        this.minimap.render();
        
        // Render additional UI elements
        if (this.showControls) {
            this.hud.renderControls();
        }
        
        if (this.debugMode) {
            this.renderDebugInfo();
        }
        
        if (this.paused) {
            this.renderPauseOverlay();
        }
    }
    
    /**
     * Render debug information
     */
    renderDebugInfo() {
        const x = this.canvas.width - 200;
        const y = 200;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x - 10, y - 10, 190, 150);
        
        // Border
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - 10, y - 10, 190, 150);
        
        // Debug text
        this.ctx.font = '12px Courier New, monospace';
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.textAlign = 'left';
        
        const debugInfo = [
            'DEBUG INFO:',
            `FPS: ${this.fps}`,
            `Player: ${this.gameState.player ? 'Active' : 'None'}`,
            `Asteroids: ${this.gameState.asteroids.length}`,
            `Squadron: ${this.gameState.squadronShips.length}`,
            `Messages: ${this.messages.length}`,
            `Canvas: ${this.canvas.width}x${this.canvas.height}`,
            `Mode: ${this.gameState.squadronMode || 'None'}`,
            `Camera: ${this.gameState.camera ? 'Active' : 'None'}`,
            '',
            'F1 - Toggle Debug',
            'H - Toggle Controls'
        ];
        
        debugInfo.forEach((line, index) => {
            this.ctx.fillText(line, x, y + (index * 14));
        });
        
        this.ctx.restore();
    }
    
    /**
     * Render pause overlay
     */
    renderPauseOverlay() {
        this.ctx.save();
        
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Pause text
        this.ctx.font = 'bold 48px Courier New, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.strokeText('PAUSED', centerX, centerY);
        this.ctx.fillText('PAUSED', centerX, centerY);
        
        // Instructions
        this.ctx.font = '20px Courier New, monospace';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Press ESC to resume', centerX, centerY + 50);
        
        this.ctx.restore();
    }
    
    /**
     * Get UI interaction area for collision detection
     * @returns {Array} Array of UI element bounds
     */
    getUIBounds() {
        return [
            {
                name: 'minimap',
                x: this.minimap.x,
                y: this.minimap.y,
                width: this.minimap.size,
                height: this.minimap.size
            },
            {
                name: 'hud',
                x: 0,
                y: 0,
                width: 250,
                height: 140
            }
        ];
    }
    
    /**
     * Check if a point is within any UI element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object|null} UI element at point or null
     */
    getUIElementAtPoint(x, y) {
        const bounds = this.getUIBounds();
        
        for (const bound of bounds) {
            if (x >= bound.x && x <= bound.x + bound.width &&
                y >= bound.y && y <= bound.y + bound.height) {
                return bound;
            }
        }
        
        return null;
    }
    
    /**
     * Toggle control display
     */
    toggleControls() {
        this.showControls = !this.showControls;
    }
    
    /**
     * Toggle debug mode
     */
    toggleDebug() {
        this.debugMode = !this.debugMode;
    }
    
    /**
     * Reset UI state for new game
     */
    reset() {
        this.messages = [];
        this.messageHistory = [];
        this.gameState.messages = [];
        this.gameOverScreen.hide();
        this.paused = false;
        
        // Reset tracking variables
        delete this.gameState.lastSquadronMode;
        delete this.gameState.lastWave;
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        this.gameOverScreen.hide();
        // Remove any remaining event listeners if needed
    }
}