# Asteroids Game 🚀

A classic Asteroids game built with HTML5 Canvas and JavaScript using Test-Driven Development (TDD).

[![Docker Build](https://github.com/jedarden-org/asteroids-game/actions/workflows/docker-build-deploy.yml/badge.svg)](https://github.com/jedarden-org/asteroids-game/actions/workflows/docker-build-deploy.yml)
[![Tests](https://github.com/jedarden-org/asteroids-game/actions/workflows/test.yml/badge.svg)](https://github.com/jedarden-org/asteroids-game/actions/workflows/test.yml)

## 🎮 Features

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
- **Dockerized**: Containerized for easy deployment with GHCR integration

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/jedarden-org/asteroids-game:latest

# Run the game
docker run -d -p 80:80 ghcr.io/jedarden-org/asteroids-game:latest
```

Access the game at: http://localhost

### Using Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Development
docker-compose up -d
```

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

## 🧪 Testing

The game is built using Test-Driven Development with Playwright:

```bash
# Run all tests
npm test

# Test against Docker container
npm run test:docker

# Run tests with visible browser
npm run test:headed
```

## 📦 Container Registry

Docker images are automatically built and published to GitHub Container Registry:

- **Latest**: `ghcr.io/jedarden-org/asteroids-game:latest`
- **Tagged Versions**: `ghcr.io/jedarden-org/asteroids-game:v1.0.0`
- **Branch Builds**: `ghcr.io/jedarden-org/asteroids-game:main`

## 🎯 Game Mechanics

- **Ship**: Controlled with WASD keys, shoots with spacebar
- **Asteroids**: Three sizes (large, medium, small) that split when shot
- **Collision**: Ship loses a life when hitting asteroids
- **Invulnerability**: 3 seconds of invulnerability after respawning
- **Wrapping**: Objects wrap around screen edges
- **Physics**: Realistic momentum and rotation

## 🏗️ CI/CD Pipeline

The repository includes automated workflows for:

- **Docker Build & Deploy**: Builds and publishes Docker images to GHCR
- **Test Suite**: Runs Playwright tests on every PR/push
- **Self-hosted Runners**: Optimized for jedarden-org infrastructure
- **Multi-branch Support**: Builds for main, develop, and tagged releases

## 🔧 Technical Details

- **Pure JavaScript**: No frameworks, vanilla JS for maximum performance
- **HTML5 Canvas**: Hardware-accelerated rendering
- **Object-Oriented**: Clean class-based architecture
- **Docker**: nginx:alpine for minimal container size (~23MB)
- **TDD**: Comprehensive Playwright test suite
- **GitHub Actions**: Automated CI/CD with self-hosted runners

## 📁 Project Structure

```
asteroid-game/
├── public/                    # Game files
│   ├── index.html            # Main HTML
│   ├── style.css             # Styling
│   └── game.js               # Game logic
├── tests/                    # Playwright tests
│   └── game.spec.js         # Test specifications
├── .github/workflows/        # GitHub Actions
│   ├── docker-build-deploy.yml
│   └── test.yml
├── docker-compose.prod.yml   # Production Docker Compose
├── Dockerfile               # Container definition
└── package.json            # Dependencies and scripts
```

## 🚀 Performance

- 60 FPS game loop with requestAnimationFrame
- Efficient collision detection algorithms
- Optimized rendering with HTML5 Canvas
- Minimal Docker image size (~23MB)
- Fast startup time

## 🌐 Browser Support

Works on all modern browsers that support HTML5 Canvas:
- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD approach)
4. Implement the feature
5. Ensure all tests pass (`npm test`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 🔒 Security

- Container runs with minimal privileges
- No sensitive data in Docker image
- Automated security scanning in CI/CD
- HTTPS-ready deployment configuration

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Test-Driven Development and containerized with Docker for the jedarden-org infrastructure.