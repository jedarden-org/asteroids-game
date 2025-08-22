/**
 * Game Over Screen component
 * Displays final score, statistics, and restart instructions
 */
export class GameOverScreen {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        
        // Animation state
        this.fadeInDuration = 1000; // 1 second fade in
        this.showTime = 0;
        this.isVisible = false;
        
        // Visual properties
        this.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.primaryColor = '#ff0000';
        this.secondaryColor = '#ffff00';
        this.accentColor = '#00ff00';
        
        // Statistics to display
        this.statistics = {
            finalScore: 0,
            wavesCompleted: 0,
            asteroidsDestroyed: 0,
            timeAlive: 0,
            squadronShipsLost: 0,
            accuracy: 0
        };
        
        // Restart key
        this.restartKey = 'r';
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for restart functionality
     */
    setupEventListeners() {
        this.boundKeyHandler = (e) => this.handleKeyPress(e);
        // Event listener will be added when game over screen is shown
    }
    
    /**
     * Handle key press events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        if (event.key.toLowerCase() === this.restartKey && this.isVisible) {
            this.restart();
        }
    }
    
    /**
     * Show the game over screen with statistics
     * @param {Object} finalStats - Final game statistics
     */
    show(finalStats = {}) {
        this.isVisible = true;
        this.showTime = 0;
        
        // Update statistics
        this.statistics = {
            finalScore: finalStats.score || this.gameState.score || 0,
            wavesCompleted: finalStats.wave || this.gameState.wave || 1,
            asteroidsDestroyed: finalStats.asteroidsDestroyed || 0,
            timeAlive: finalStats.timeAlive || 0,
            squadronShipsLost: finalStats.squadronShipsLost || 0,
            accuracy: finalStats.accuracy || 0,
            ...finalStats
        };
        
        // Add event listener for restart
        document.addEventListener('keydown', this.boundKeyHandler);
    }
    
    /**
     * Hide the game over screen
     */
    hide() {
        this.isVisible = false;
        document.removeEventListener('keydown', this.boundKeyHandler);
    }
    
    /**
     * Restart the game
     */
    restart() {
        this.hide();
        if (this.gameState.restart) {
            this.gameState.restart();
        }
    }
    
    /**
     * Update animations
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        if (this.isVisible) {
            this.showTime += deltaTime;
        }
    }
    
    /**
     * Render the game over screen
     */
    render() {
        if (!this.isVisible) return;
        
        this.ctx.save();
        
        // Calculate fade alpha
        const fadeAlpha = Math.min(1, this.showTime / this.fadeInDuration);
        
        // Render background
        this.renderBackground(fadeAlpha);
        
        // Render content with fade effect
        this.ctx.globalAlpha = fadeAlpha;
        
        // Render main title
        this.renderTitle();
        
        // Render statistics
        this.renderStatistics();
        
        // Render restart instructions
        this.renderRestartInstructions();
        
        // Render achievement notifications
        this.renderAchievements();
        
        this.ctx.restore();
    }
    
    /**
     * Render the background overlay
     * @param {number} alpha - Alpha transparency value
     */
    renderBackground(alpha) {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${0.9 * alpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add subtle grid pattern
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * alpha})`;
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Render the game over title
     */
    renderTitle() {
        const centerX = this.canvas.width / 2;
        const titleY = this.canvas.height / 2 - 200;
        
        // Main title
        this.ctx.font = 'bold 72px Courier New, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.primaryColor;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 4;
        
        this.ctx.strokeText('GAME OVER', centerX, titleY);
        this.ctx.fillText('GAME OVER', centerX, titleY);
        
        // Subtitle
        this.ctx.font = '24px Courier New, monospace';
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.fillText('SQUADRON ELIMINATED', centerX, titleY + 50);
    }
    
    /**
     * Render game statistics
     */
    renderStatistics() {
        const centerX = this.canvas.width / 2;
        const startY = this.canvas.height / 2 - 80;
        const lineHeight = 35;
        
        this.ctx.font = '20px Courier New, monospace';
        this.ctx.textAlign = 'center';
        
        // Statistics background
        const panelWidth = 400;
        const panelHeight = 280;
        const panelX = centerX - panelWidth / 2;
        const panelY = startY - 20;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        
        this.ctx.strokeStyle = this.accentColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Statistics title
        this.ctx.fillStyle = this.accentColor;
        this.ctx.fillText('FINAL STATISTICS', centerX, startY + 10);
        
        // Statistics data
        const stats = [
            { label: 'FINAL SCORE', value: this.statistics.finalScore.toLocaleString(), color: this.primaryColor },
            { label: 'WAVES COMPLETED', value: this.statistics.wavesCompleted, color: this.secondaryColor },
            { label: 'ASTEROIDS DESTROYED', value: this.statistics.asteroidsDestroyed, color: this.accentColor },
            { label: 'TIME SURVIVED', value: this.formatTime(this.statistics.timeAlive), color: this.accentColor },
            { label: 'SQUADRON SHIPS LOST', value: this.statistics.squadronShipsLost, color: this.primaryColor },
            { label: 'ACCURACY', value: `${Math.round(this.statistics.accuracy)}%`, color: this.secondaryColor }
        ];
        
        stats.forEach((stat, index) => {
            const y = startY + 50 + (index * lineHeight);
            
            // Label
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(stat.label, centerX - 150, y);
            
            // Value
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = stat.color;
            this.ctx.fillText(stat.value, centerX + 150, y);
        });
    }
    
    /**
     * Render restart instructions
     */
    renderRestartInstructions() {
        const centerX = this.canvas.width / 2;
        const y = this.canvas.height - 100;
        
        // Animated "Press R" text
        const pulse = Math.sin(this.showTime / 200) * 0.3 + 0.7;
        
        this.ctx.font = 'bold 28px Courier New, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        
        this.ctx.strokeText('PRESS [R] TO RESTART', centerX, y);
        this.ctx.fillText('PRESS [R] TO RESTART', centerX, y);
        
        // Additional instructions
        this.ctx.font = '16px Courier New, monospace';
        this.ctx.fillStyle = '#888888';
        this.ctx.fillText('ESC to return to main menu', centerX, y + 30);
    }
    
    /**
     * Render achievement notifications
     */
    renderAchievements() {
        const achievements = this.calculateAchievements();
        if (achievements.length === 0) return;
        
        const startX = 50;
        const startY = this.canvas.height / 2 + 150;
        
        this.ctx.font = 'bold 18px Courier New, monospace';
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('ACHIEVEMENTS UNLOCKED:', startX, startY);
        
        this.ctx.font = '14px Courier New, monospace';
        this.ctx.fillStyle = this.accentColor;
        
        achievements.forEach((achievement, index) => {
            this.ctx.fillText(`★ ${achievement}`, startX + 20, startY + 25 + (index * 20));
        });
    }
    
    /**
     * Calculate achievements based on game statistics
     * @returns {Array} Array of achievement strings
     */
    calculateAchievements() {
        const achievements = [];
        
        if (this.statistics.finalScore >= 10000) {
            achievements.push('Score Master - Reached 10,000 points');
        }
        
        if (this.statistics.wavesCompleted >= 5) {
            achievements.push('Wave Warrior - Survived 5 waves');
        }
        
        if (this.statistics.asteroidsDestroyed >= 50) {
            achievements.push('Asteroid Hunter - Destroyed 50 asteroids');
        }
        
        if (this.statistics.accuracy >= 80) {
            achievements.push('Sharpshooter - 80% accuracy or better');
        }
        
        if (this.statistics.squadronShipsLost === 0 && this.statistics.asteroidsDestroyed > 0) {
            achievements.push('Perfect Commander - No squadron losses');
        }
        
        if (this.statistics.timeAlive >= 300000) { // 5 minutes
            achievements.push('Survivor - Lasted 5 minutes');
        }
        
        return achievements;
    }
    
    /**
     * Format time in milliseconds to readable string
     * @param {number} timeMs - Time in milliseconds
     * @returns {string} Formatted time string
     */
    formatTime(timeMs) {
        const seconds = Math.floor(timeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }
    
    /**
     * Get current visibility state
     * @returns {boolean} True if screen is visible
     */
    isShown() {
        return this.isVisible;
    }
}