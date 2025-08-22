# Asteroids Game

A classic Asteroids arcade game built with HTML5 Canvas, JavaScript, and Test-Driven Development using Playwright.

## Features

- **Classic Gameplay**: Navigate your spaceship through an asteroid field
- **Controls**:
  - `W` - Move forward
  - `A` - Rotate left
  - `S` - Move backward  
  - `D` - Rotate right
  - `SPACE` - Shoot
  - `R` - Restart (when game over)
- **5 Lives System**: Start with 5 lives
- **Score Tracking**: Points for destroying asteroids (20/50/100 based on size)
- **Progressive Difficulty**: More asteroids spawn as score increases
- **Offline Capable**: No external dependencies, runs completely offline
- **Dockerized**: Containerized for easy deployment

## Quick Start

### Using Docker

```bash
# Build and run with Docker
docker build -t asteroid-game .
docker run -d -p 8080:80 --name asteroid-game asteroid-game

# Or use Docker Compose
docker-compose up -d
```

Access the game at: http://localhost:8080

### Local Development

```bash
# Install dependencies (for testing)
npm install

# Serve locally (requires Python 3)
npm run serve

# Run tests
npm test

# Run tests with visible browser
npm run test:headed
```

## Testing

The game is built using Test-Driven Development with Playwright:

```bash
# Run all tests
npm test

# Test against Docker container
npm run test:docker
```

## Game Mechanics

- **Ship**: Controlled with WASD keys, shoots with spacebar
- **Asteroids**: Three sizes (large, medium, small) that split when shot
- **Collision**: Ship loses a life when hitting asteroids
- **Invulnerability**: 3 seconds of invulnerability after respawning
- **Wrapping**: Objects wrap around screen edges
- **Physics**: Realistic momentum and rotation

## Technical Details

- **Pure JavaScript**: No frameworks, vanilla JS
- **HTML5 Canvas**: Hardware-accelerated rendering
- **Object-Oriented**: Clean class-based architecture
- **Docker**: nginx:alpine for minimal container size
- **TDD**: Comprehensive Playwright test suite

## Project Structure

```
asteroid-game/
├── public/           # Game files
│   ├── index.html   # Main HTML
│   ├── style.css    # Styling
│   └── game.js      # Game logic
├── tests/           # Playwright tests
├── docker/          # Docker configs
├── Dockerfile       # Container definition
└── docker-compose.yml
```

## Performance

- 60 FPS game loop
- Efficient collision detection
- Optimized rendering with canvas
- Minimal Docker image (~23MB)

## Browser Support

Works on all modern browsers that support HTML5 Canvas:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## License

Open source - feel free to use and modify!