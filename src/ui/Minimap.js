/**
 * Minimap component for the asteroid game
 * Shows full asteroid field, player position, squadron ships, and asteroid density
 */
export class Minimap {
    constructor(canvas, gameState, gameWorld) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameState = gameState;
        this.gameWorld = gameWorld;
        
        // Minimap configuration
        this.size = 200;
        this.margin = 20;
        this.x = canvas.width - this.size - this.margin;
        this.y = canvas.height - this.size - this.margin;
        
        // Scaling factors
        this.scaleX = this.size / gameWorld.width;
        this.scaleY = this.size / gameWorld.height;
        
        // Visual properties
        this.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.borderColor = '#00ff00';
        this.playerColor = '#00ff00';
        this.squadronColor = '#ffff00';
        this.asteroidColor = '#888888';
        this.densityColor = 'rgba(255, 0, 0, 0.3)';
        
        // Interaction state
        this.isHovered = false;
        this.clickable = true;
        
        // Density grid for asteroid visualization
        this.densityGrid = [];
        this.densityGridSize = 10;
        this.initializeDensityGrid();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize the density grid for asteroid visualization
     */
    initializeDensityGrid() {
        const gridWidth = Math.ceil(this.gameWorld.width / this.densityGridSize);
        const gridHeight = Math.ceil(this.gameWorld.height / this.densityGridSize);
        
        this.densityGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
    }
    
    /**
     * Setup event listeners for minimap interaction
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            this.isHovered = this.isPointInMinimap(mouseX, mouseY);
            this.canvas.style.cursor = this.isHovered ? 'pointer' : 'default';
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (!this.clickable) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (this.isPointInMinimap(mouseX, mouseY)) {
                this.handleMinimapClick(mouseX, mouseY);
            }
        });
    }
    
    /**
     * Check if a point is within the minimap bounds
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if point is in minimap
     */
    isPointInMinimap(x, y) {
        return x >= this.x && x <= this.x + this.size &&
               y >= this.y && y <= this.y + this.size;
    }
    
    /**
     * Handle clicks on the minimap
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     */
    handleMinimapClick(mouseX, mouseY) {
        // Convert minimap coordinates to world coordinates
        const worldX = (mouseX - this.x) / this.scaleX;
        const worldY = (mouseY - this.y) / this.scaleY;
        
        // You could implement camera focusing or waypoint setting here
        // For now, we'll just provide visual feedback
        this.showClickFeedback(mouseX, mouseY);
    }
    
    /**
     * Show visual feedback for minimap clicks
     * @param {number} x - Click X coordinate
     * @param {number} y - Click Y coordinate
     */
    showClickFeedback(x, y) {
        // Create a temporary click effect
        const effect = {
            x: x,
            y: y,
            radius: 5,
            alpha: 1,
            duration: 500
        };
        
        // This would be handled by the main game loop
        if (this.gameState.effects) {
            this.gameState.effects.push(effect);
        }
    }
    
    /**
     * Update asteroid density grid
     */
    updateDensityGrid() {
        // Reset grid
        this.densityGrid.forEach(row => row.fill(0));
        
        // Count asteroids in each grid cell
        this.gameState.asteroids.forEach(asteroid => {
            const gridX = Math.floor(asteroid.x / this.densityGridSize);
            const gridY = Math.floor(asteroid.y / this.densityGridSize);
            
            if (gridX >= 0 && gridX < this.densityGrid[0].length &&
                gridY >= 0 && gridY < this.densityGrid.length) {
                this.densityGrid[gridY][gridX]++;
            }
        });
    }
    
    /**
     * Render the minimap
     */
    render() {
        this.ctx.save();
        
        // Update density grid
        this.updateDensityGrid();
        
        // Render background and border
        this.renderBackground();
        
        // Render density visualization
        this.renderDensityGrid();
        
        // Render asteroids
        this.renderAsteroids();
        
        // Render squadron ships
        this.renderSquadronShips();
        
        // Render player
        this.renderPlayer();
        
        // Render viewport indicator
        this.renderViewport();
        
        // Render title
        this.renderTitle();
        
        this.ctx.restore();
    }
    
    /**
     * Render minimap background and border
     */
    renderBackground() {
        // Background
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        
        // Border
        this.ctx.strokeStyle = this.isHovered ? '#ffff00' : this.borderColor;
        this.ctx.lineWidth = this.isHovered ? 3 : 2;
        this.ctx.strokeRect(this.x, this.y, this.size, this.size);
    }
    
    /**
     * Render asteroid density grid
     */
    renderDensityGrid() {
        const cellWidth = this.size / this.densityGrid[0].length;
        const cellHeight = this.size / this.densityGrid.length;
        
        for (let y = 0; y < this.densityGrid.length; y++) {
            for (let x = 0; x < this.densityGrid[y].length; x++) {
                const density = this.densityGrid[y][x];
                if (density > 0) {
                    const alpha = Math.min(density / 5, 1); // Max alpha at 5 asteroids
                    this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.3})`;
                    
                    this.ctx.fillRect(
                        this.x + x * cellWidth,
                        this.y + y * cellHeight,
                        cellWidth,
                        cellHeight
                    );
                }
            }
        }
    }
    
    /**
     * Render asteroids on the minimap
     */
    renderAsteroids() {
        this.ctx.fillStyle = this.asteroidColor;
        
        this.gameState.asteroids.forEach(asteroid => {
            const minimapX = this.x + asteroid.x * this.scaleX;
            const minimapY = this.y + asteroid.y * this.scaleY;
            const size = Math.max(1, asteroid.size * this.scaleX * 0.5);
            
            this.ctx.fillRect(
                minimapX - size/2,
                minimapY - size/2,
                size,
                size
            );
        });
    }
    
    /**
     * Render squadron ships on the minimap
     */
    renderSquadronShips() {
        this.ctx.fillStyle = this.squadronColor;
        
        this.gameState.squadronShips.forEach(ship => {
            const minimapX = this.x + ship.x * this.scaleX;
            const minimapY = this.y + ship.y * this.scaleY;
            
            // Draw small triangle for squadron ships
            this.ctx.save();
            this.ctx.translate(minimapX, minimapY);
            this.ctx.rotate(ship.angle || 0);
            
            this.ctx.beginPath();
            this.ctx.moveTo(3, 0);
            this.ctx.lineTo(-2, -2);
            this.ctx.lineTo(-2, 2);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    /**
     * Render player on the minimap
     */
    renderPlayer() {
        if (!this.gameState.player) return;
        
        const minimapX = this.x + this.gameState.player.x * this.scaleX;
        const minimapY = this.y + this.gameState.player.y * this.scaleY;
        
        // Draw player as larger triangle
        this.ctx.save();
        this.ctx.translate(minimapX, minimapY);
        this.ctx.rotate(this.gameState.player.angle || 0);
        
        this.ctx.fillStyle = this.playerColor;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        this.ctx.moveTo(5, 0);
        this.ctx.lineTo(-3, -3);
        this.ctx.lineTo(-3, 3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Render viewport indicator (current camera view)
     */
    renderViewport() {
        if (!this.gameState.camera) return;
        
        const viewportWidth = this.canvas.width * this.scaleX;
        const viewportHeight = this.canvas.height * this.scaleY;
        
        const viewportX = this.x + (this.gameState.camera.x - this.canvas.width/2) * this.scaleX;
        const viewportY = this.y + (this.gameState.camera.y - this.canvas.height/2) * this.scaleY;
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        
        this.ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight);
        
        this.ctx.setLineDash([]); // Reset line dash
    }
    
    /**
     * Render minimap title
     */
    renderTitle() {
        this.ctx.font = '12px Courier New, monospace';
        this.ctx.fillStyle = this.borderColor;
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText('RADAR', this.x + this.size/2, this.y - 8);
        
        // Show asteroid count
        this.ctx.font = '10px Courier New, monospace';
        this.ctx.fillStyle = '#888888';
        this.ctx.fillText(
            `${this.gameState.asteroids.length} CONTACTS`,
            this.x + this.size/2,
            this.y + this.size + 15
        );
    }
    
    /**
     * Convert world coordinates to minimap coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} Minimap coordinates
     */
    worldToMinimap(worldX, worldY) {
        return {
            x: this.x + worldX * this.scaleX,
            y: this.y + worldY * this.scaleY
        };
    }
    
    /**
     * Convert minimap coordinates to world coordinates
     * @param {number} minimapX - Minimap X coordinate
     * @param {number} minimapY - Minimap Y coordinate
     * @returns {Object} World coordinates
     */
    minimapToWorld(minimapX, minimapY) {
        return {
            x: (minimapX - this.x) / this.scaleX,
            y: (minimapY - this.y) / this.scaleY
        };
    }
    
    /**
     * Update minimap position (in case canvas is resized)
     * @param {number} canvasWidth - New canvas width
     * @param {number} canvasHeight - New canvas height
     */
    updatePosition(canvasWidth, canvasHeight) {
        this.x = canvasWidth - this.size - this.margin;
        this.y = canvasHeight - this.size - this.margin;
    }
}