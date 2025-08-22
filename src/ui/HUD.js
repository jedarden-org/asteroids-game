/**
 * HUD (Heads-Up Display) component for the asteroid game
 * Displays lives, score, squadron mode, and other game information
 */
export class HUD {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        
        // HUD styling
        this.fontSize = 18;
        this.smallFontSize = 14;
        this.padding = 20;
        this.lineHeight = 25;
        
        // Colors
        this.primaryColor = '#00ff00';
        this.secondaryColor = '#ffff00';
        this.warningColor = '#ff0000';
        this.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        
        // Animation state
        this.modeChangeFlash = 0;
        this.lastModeChange = 0;
    }
    
    /**
     * Update HUD animations and effects
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    update(deltaTime) {
        // Update mode change flash effect
        if (this.modeChangeFlash > 0) {
            this.modeChangeFlash -= deltaTime;
        }
    }
    
    /**
     * Trigger visual feedback for squadron mode changes
     * @param {string} newMode - The new squadron mode
     */
    onModeChange(newMode) {
        this.modeChangeFlash = 500; // Flash for 500ms
        this.lastModeChange = Date.now();
    }
    
    /**
     * Render the HUD elements
     */
    render() {
        this.ctx.save();
        
        // Set up text styling
        this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Render main HUD panel
        this.renderMainPanel();
        
        // Render squadron status
        this.renderSquadronStatus();
        
        // Render directional indicators
        this.renderDirectionalIndicators();
        
        // Render game messages
        this.renderMessages();
        
        this.ctx.restore();
    }
    
    /**
     * Render the main HUD panel with score, lives, etc.
     */
    renderMainPanel() {
        const x = this.padding;
        const y = this.padding;
        
        // Background panel
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(x - 10, y - 10, 200, 120);
        
        // Border
        this.ctx.strokeStyle = this.primaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - 10, y - 10, 200, 120);
        
        // Score
        this.ctx.fillStyle = this.primaryColor;
        this.ctx.fillText(`SCORE: ${this.gameState.score.toLocaleString()}`, x, y);
        
        // Lives
        const livesColor = this.gameState.lives <= 1 ? this.warningColor : this.primaryColor;
        this.ctx.fillStyle = livesColor;
        this.ctx.fillText(`LIVES: ${this.gameState.lives}`, x, y + this.lineHeight);
        
        // Wave/Level
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.fillText(`WAVE: ${this.gameState.wave}`, x, y + this.lineHeight * 2);
        
        // Asteroid count
        this.ctx.fillStyle = this.primaryColor;
        this.ctx.fillText(`ASTEROIDS: ${this.gameState.asteroidCount}`, x, y + this.lineHeight * 3);
    }
    
    /**
     * Render squadron status and mode information
     */
    renderSquadronStatus() {
        const x = this.padding;
        const y = this.canvas.height - 150;
        
        // Background panel
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(x - 10, y - 10, 220, 100);
        
        // Border with mode change flash effect
        const borderColor = this.modeChangeFlash > 0 ? this.secondaryColor : this.primaryColor;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = this.modeChangeFlash > 0 ? 3 : 2;
        this.ctx.strokeRect(x - 10, y - 10, 220, 100);
        
        // Squadron mode
        this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        this.ctx.fillStyle = this.modeChangeFlash > 0 ? this.secondaryColor : this.primaryColor;
        this.ctx.fillText(`MODE: ${this.gameState.squadronMode.toUpperCase()}`, x, y);
        
        // Squadron ship count
        this.ctx.font = `${this.smallFontSize}px 'Courier New', monospace`;
        this.ctx.fillStyle = this.primaryColor;
        this.ctx.fillText(`Squadron Ships: ${this.gameState.squadronShips.length}`, x, y + this.lineHeight);
        
        // Mode description
        const modeDescription = this.getModeDescription(this.gameState.squadronMode);
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.fillText(modeDescription, x, y + this.lineHeight + 15);
    }
    
    /**
     * Get description text for squadron modes
     * @param {string} mode - Squadron mode
     * @returns {string} Mode description
     */
    getModeDescription(mode) {
        switch (mode) {
            case 'formation':
                return 'Ships follow in formation';
            case 'escort':
                return 'Ships protect the player';
            case 'attack':
                return 'Ships attack independently';
            case 'defend':
                return 'Ships form defensive perimeter';
            default:
                return 'Squadron mode active';
        }
    }
    
    /**
     * Render directional indicators to nearest threats
     */
    renderDirectionalIndicators() {
        if (!this.gameState.player || !this.gameState.asteroids.length) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const indicatorRadius = 100;
        
        // Find nearest asteroids
        const nearestAsteroids = this.findNearestAsteroids(3);
        
        nearestAsteroids.forEach((asteroid, index) => {
            const dx = asteroid.x - this.gameState.player.x;
            const dy = asteroid.y - this.gameState.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            // Calculate indicator position
            const indicatorX = centerX + Math.cos(angle) * indicatorRadius;
            const indicatorY = centerY + Math.sin(angle) * indicatorRadius;
            
            // Draw indicator
            this.ctx.save();
            this.ctx.translate(indicatorX, indicatorY);
            this.ctx.rotate(angle);
            
            // Color based on distance (red = close, yellow = far)
            const threat = Math.max(0, 1 - distance / 300);
            const red = Math.floor(255 * threat + 255 * (1 - threat));
            const green = Math.floor(255 * (1 - threat));
            
            this.ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
            this.ctx.strokeStyle = this.primaryColor;
            this.ctx.lineWidth = 2;
            
            // Draw arrow
            this.ctx.beginPath();
            this.ctx.moveTo(15, 0);
            this.ctx.lineTo(0, -5);
            this.ctx.lineTo(5, 0);
            this.ctx.lineTo(0, 5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    /**
     * Find the nearest asteroids to the player
     * @param {number} count - Number of asteroids to return
     * @returns {Array} Array of nearest asteroids
     */
    findNearestAsteroids(count) {
        if (!this.gameState.player) return [];
        
        return this.gameState.asteroids
            .map(asteroid => ({
                ...asteroid,
                distance: Math.sqrt(
                    Math.pow(asteroid.x - this.gameState.player.x, 2) +
                    Math.pow(asteroid.y - this.gameState.player.y, 2)
                )
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, count);
    }
    
    /**
     * Render game messages and notifications
     */
    renderMessages() {
        if (!this.gameState.messages || !this.gameState.messages.length) return;
        
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2 - 100;
        
        this.ctx.font = `${this.fontSize + 4}px 'Courier New', monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        
        this.gameState.messages.forEach((message, index) => {
            const messageY = y + (index * this.lineHeight);
            this.ctx.strokeText(message, x, messageY);
            this.ctx.fillText(message, x, messageY);
        });
        
        // Reset text alignment
        this.ctx.textAlign = 'left';
    }
    
    /**
     * Render control instructions
     */
    renderControls() {
        const x = this.canvas.width - 250;
        const y = this.padding;
        
        // Background panel
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(x - 10, y - 10, 240, 160);
        
        // Border
        this.ctx.strokeStyle = this.primaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - 10, y - 10, 240, 160);
        
        // Controls text
        this.ctx.font = `${this.smallFontSize}px 'Courier New', monospace`;
        this.ctx.fillStyle = this.primaryColor;
        
        const controls = [
            'CONTROLS:',
            'WASD - Move',
            'SPACE - Shoot',
            '1-4 - Squadron Modes',
            'R - Restart (Game Over)',
            '',
            'SQUADRON MODES:',
            '1 - Formation',
            '2 - Escort',
            '3 - Attack',
            '4 - Defend'
        ];
        
        controls.forEach((line, index) => {
            const color = line.includes('CONTROLS') || line.includes('SQUADRON') ? 
                this.secondaryColor : this.primaryColor;
            this.ctx.fillStyle = color;
            this.ctx.fillText(line, x, y + (index * 14));
        });
    }
}