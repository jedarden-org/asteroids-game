# UI System Documentation

This directory contains the user interface components for the asteroid squadron game.

## Components

### UIManager (`UIManager.js`)
Main coordinator for all UI components. Handles:
- Component lifecycle management
- Event coordination between UI elements
- Message system
- Performance tracking
- Game state change detection

**Key Features:**
- Automatic squadron mode change notifications
- Message queue with expiration
- Debug mode toggle (F1)
- Pause functionality (ESC)
- Controls help toggle (H)

### HUD (`HUD.js`)
Heads-Up Display showing essential game information:
- Score and lives
- Current wave
- Asteroid count
- Squadron mode with visual feedback
- Directional indicators to nearest asteroids
- Control instructions panel

**Visual Effects:**
- Mode change flash animation
- Color-coded threat indicators
- Warning colors for low lives

### Minimap (`Minimap.js`)
Interactive radar showing the full game world:
- Real-time asteroid positions
- Player and squadron ship indicators
- Asteroid density heat map
- Clickable for potential navigation
- Viewport indicator showing current view

**Features:**
- Hover effects
- Density visualization using grid system
- Coordinate conversion utilities
- Responsive positioning

### GameOverScreen (`GameOverScreen.js`)
End-game statistics and restart interface:
- Final score and statistics
- Achievement system
- Animated restart prompt
- Fade-in effects
- Time formatting utilities

**Statistics Tracked:**
- Final score
- Waves completed
- Asteroids destroyed
- Time survived
- Squadron ships lost
- Shooting accuracy

## Usage Example

```javascript
import { UIManager } from './ui/index.js';

const uiManager = new UIManager(canvas, gameState, gameWorld);

// Game loop
function update(deltaTime) {
    uiManager.update(deltaTime);
}

function render() {
    uiManager.render();
}
```

## Event Handling

The UI system handles these keyboard shortcuts:
- **H** - Toggle control help
- **F1** - Toggle debug info
- **ESC** - Pause/unpause game
- **R** - Restart game (when game over)

## Performance Considerations

- Canvas-based rendering for optimal performance
- Efficient density grid calculation
- Minimal DOM interactions
- Optimized text rendering
- Smart update cycles

## Styling

All UI elements use a retro space theme with:
- **Primary Color**: `#00ff00` (green)
- **Secondary Color**: `#ffff00` (yellow)
- **Warning Color**: `#ff0000` (red)
- **Font**: Courier New monospace
- **Background**: Semi-transparent overlays