class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(v) {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }
    
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class GameObject {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.rotation = 0;
        this.radius = 10;
        this.active = true;
    }
    
    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.wrapPosition();
    }
    
    wrapPosition() {
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
        if (this.position.y > canvas.height) this.position.y = 0;
    }
    
    checkCollision(other) {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }
}

class Ship extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.radius = 10;
        this.thrustPower = 300;
        this.rotationSpeed = 5;
        this.maxSpeed = 400;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }
    
    thrust(forward, deltaTime) {
        const direction = new Vector2D(
            Math.cos(this.rotation),
            Math.sin(this.rotation)
        );
        const thrust = direction.multiply(this.thrustPower * deltaTime * (forward ? 1 : -0.5));
        this.velocity = this.velocity.add(thrust);
        
        const speed = this.velocity.magnitude();
        if (speed > this.maxSpeed) {
            this.velocity = this.velocity.multiply(this.maxSpeed / speed);
        }
    }
    
    rotate(direction, deltaTime) {
        this.rotation += direction * this.rotationSpeed * deltaTime;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.velocity = this.velocity.multiply(0.99);
        
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        
        if (this.invulnerable && Math.floor(this.invulnerableTime * 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    respawn(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.rotation = 0;
        this.invulnerable = true;
        this.invulnerableTime = 3;
    }
}

class Bullet extends GameObject {
    constructor(x, y, rotation) {
        super(x, y);
        this.radius = 2;
        this.speed = 600;
        this.lifetime = 1.5;
        const direction = new Vector2D(Math.cos(rotation), Math.sin(rotation));
        this.velocity = direction.multiply(this.speed);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Asteroid extends GameObject {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.radius = size === 'large' ? 40 : size === 'medium' ? 25 : 15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        
        const speed = size === 'large' ? 50 : size === 'medium' ? 80 : 120;
        const angle = Math.random() * Math.PI * 2;
        this.velocity = new Vector2D(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        this.vertices = [];
        const vertexCount = 8 + Math.floor(Math.random() * 4);
        for (let i = 0; i < vertexCount; i++) {
            const angle = (i / vertexCount) * Math.PI * 2;
            const variance = 0.8 + Math.random() * 0.4;
            this.vertices.push({
                x: Math.cos(angle) * this.radius * variance,
                y: Math.sin(angle) * this.radius * variance
            });
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += this.rotationSpeed * deltaTime;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    split() {
        if (this.size === 'small') return [];
        
        const newSize = this.size === 'large' ? 'medium' : 'small';
        const asteroids = [];
        for (let i = 0; i < 2; i++) {
            const asteroid = new Asteroid(this.position.x, this.position.y, newSize);
            asteroids.push(asteroid);
        }
        return asteroids;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        
        this.reset();
        this.setupEventListeners();
        this.lastTime = 0;
        this.keys = {};
    }
    
    reset() {
        this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2);
        this.bullets = [];
        this.asteroids = [];
        this.score = 0;
        this.lives = 5;
        this.gameOver = false;
        this.canShoot = true;
        this.shootCooldown = 0;
        
        this.spawnAsteroids(5);
        this.updateUI();
        this.gameOverScreen.classList.add('hidden');
    }
    
    spawnAsteroids(count) {
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (Math.sqrt((x - this.ship.position.x) ** 2 + (y - this.ship.position.y) ** 2) < 150);
            
            this.asteroids.push(new Asteroid(x, y, 'large'));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key.toLowerCase() === 'r' && this.gameOver) {
                this.reset();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    handleInput(deltaTime) {
        if (this.gameOver) return;
        
        if (this.keys['w']) {
            this.ship.thrust(true, deltaTime);
        }
        if (this.keys['s']) {
            this.ship.thrust(false, deltaTime);
        }
        if (this.keys['a']) {
            this.ship.rotate(-1, deltaTime);
        }
        if (this.keys['d']) {
            this.ship.rotate(1, deltaTime);
        }
        
        if (this.keys[' '] && this.canShoot) {
            this.shoot();
            this.canShoot = false;
            this.shootCooldown = 0.25;
        }
        
        if (!this.keys[' ']) {
            this.canShoot = true;
        }
        
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
            if (this.shootCooldown <= 0) {
                this.canShoot = true;
            }
        }
    }
    
    shoot() {
        const bullet = new Bullet(
            this.ship.position.x,
            this.ship.position.y,
            this.ship.rotation
        );
        this.bullets.push(bullet);
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        this.handleInput(deltaTime);
        
        this.ship.update(deltaTime);
        
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.active;
        });
        
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime);
        });
        
        this.checkCollisions();
        
        if (this.asteroids.length === 0) {
            this.spawnAsteroids(Math.min(7, 5 + Math.floor(this.score / 1000)));
        }
    }
    
    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                
                if (bullet.checkCollision(asteroid)) {
                    this.bullets.splice(i, 1);
                    
                    const newAsteroids = asteroid.split();
                    this.asteroids.splice(j, 1);
                    this.asteroids.push(...newAsteroids);
                    
                    this.score += asteroid.size === 'large' ? 20 : 
                                  asteroid.size === 'medium' ? 50 : 100;
                    this.updateUI();
                    break;
                }
            }
        }
        
        if (!this.ship.invulnerable) {
            for (const asteroid of this.asteroids) {
                if (this.ship.checkCollision(asteroid)) {
                    this.lives--;
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.endGame();
                    } else {
                        this.ship.respawn(this.canvas.width / 2, this.canvas.height / 2);
                    }
                    break;
                }
            }
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
    }
    
    endGame() {
        this.gameOver = true;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ship.draw(this.ctx);
        
        this.bullets.forEach(bullet => {
            bullet.draw(this.ctx);
        });
        
        this.asteroids.forEach(asteroid => {
            asteroid.draw(this.ctx);
        });
    }
    
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (deltaTime < 0.1) {
            this.update(deltaTime);
            this.draw();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}

const canvas = document.getElementById('gameCanvas');
const game = new Game();
game.start();

// Expose game instance for testing
window.game = game;