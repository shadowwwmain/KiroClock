// Kiro-Man Minigame - A Pacman-style game with Kiro theme

class KiroManGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.modal = document.getElementById('minigameModal');
        
        // Load Kiro logo image
        this.kiroImage = new Image();
        this.kiroImage.src = 'assets/kiro-logo.png';
        this.imageLoaded = false;
        
        this.kiroImage.onload = () => {
            this.imageLoaded = true;
            this.draw(); // Redraw when image loads
        };
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Game dimensions
        this.tileSize = 28;
        this.cols = this.canvas.width / this.tileSize;
        this.rows = this.canvas.height / this.tileSize;
        
        // Smooth movement
        this.lastTime = 0;
        this.moveSpeed = 120; // milliseconds per move
        
        // Player (Kiro) - with smooth movement
        this.player = {
            x: 1,
            y: 1,
            pixelX: 1 * this.tileSize,
            pixelY: 1 * this.tileSize,
            targetX: 1,
            targetY: 1,
            direction: 'right',
            nextDirection: null,
            animFrame: 0,
            moving: false,
            lastMoveTime: 0
        };
        
        // Enemies (Shadows) - with smooth movement
        this.enemies = [
            { x: 14, y: 9, pixelX: 14 * this.tileSize, pixelY: 9 * this.tileSize, targetX: 14, targetY: 9, direction: 'up', color: '#ff0080', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 15, y: 9, pixelX: 15 * this.tileSize, pixelY: 9 * this.tileSize, targetX: 15, targetY: 9, direction: 'down', color: '#00ff80', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 14, y: 10, pixelX: 14 * this.tileSize, pixelY: 10 * this.tileSize, targetX: 14, targetY: 10, direction: 'left', color: '#8000ff', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 15, y: 10, pixelX: 15 * this.tileSize, pixelY: 10 * this.tileSize, targetX: 15, targetY: 10, direction: 'right', color: '#ff8000', mode: 'chase', moving: false, lastMoveTime: 0 }
        ];
        
        // Game map (1 = wall, 0 = dot, 2 = empty, 3 = power pellet)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,3,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,3,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,0,1,1,1,1,1,2,0,1,1,0,2,1,1,1,1,1,0,1,1,1,1,1,1],
            [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
            [1,1,1,1,1,1,0,1,1,2,1,1,2,2,2,2,2,2,1,1,2,1,1,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,2,1,2,2,2,2,2,2,2,2,1,2,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,0,1,1,2,1,1,2,2,2,2,2,2,1,1,2,1,1,0,1,1,1,1,1,1],
            [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
            [1,1,1,1,1,1,0,1,1,1,1,1,2,0,1,1,0,2,1,1,1,1,1,0,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1],
            [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.originalMap = JSON.parse(JSON.stringify(this.map));
        this.totalDots = this.countDots();
        this.dotsEaten = 0;
        
        this.powerMode = false;
        this.powerModeTimer = 0;
        
        this.initializeEventListeners();
    }
    
    countDots() {
        let count = 0;
        for (let row of this.map) {
            for (let cell of row) {
                if (cell === 0 || cell === 3) count++;
            }
        }
        return count;
    }
    
    initializeEventListeners() {
        // Game controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.player.nextDirection = 'up';
                    break;
                case 's':
                case 'arrowdown':
                    this.player.nextDirection = 'down';
                    break;
                case 'a':
                case 'arrowleft':
                    this.player.nextDirection = 'left';
                    break;
                case 'd':
                case 'arrowright':
                    this.player.nextDirection = 'right';
                    break;
            }
        });
        
        // Button events
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGameBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('closeMinigame').addEventListener('click', () => this.closeGame());
        document.getElementById('minigameBtn').addEventListener('click', () => this.openGame());
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeGame();
            }
        });
    }
    
    openGame() {
        this.modal.style.display = 'flex';
        this.resetGame();
    }
    
    closeGame() {
        this.modal.style.display = 'none';
        this.gameRunning = false;
        this.gamePaused = false;
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.lastTime = 0;
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseGameBtn').textContent = this.gamePaused ? 'RESUME' : 'PAUSE';
        if (!this.gamePaused) {
            this.lastTime = 0;
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.dotsEaten = 0;
        this.powerMode = false;
        this.powerModeTimer = 0;
        
        // Reset player position
        this.player = {
            x: 1,
            y: 1,
            pixelX: 1 * this.tileSize,
            pixelY: 1 * this.tileSize,
            targetX: 1,
            targetY: 1,
            direction: 'right',
            nextDirection: null,
            animFrame: 0,
            moving: false,
            lastMoveTime: 0
        };
        
        // Reset enemies
        this.enemies = [
            { x: 14, y: 9, pixelX: 14 * this.tileSize, pixelY: 9 * this.tileSize, targetX: 14, targetY: 9, direction: 'up', color: '#ff0080', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 15, y: 9, pixelX: 15 * this.tileSize, pixelY: 9 * this.tileSize, targetX: 15, targetY: 9, direction: 'down', color: '#00ff80', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 14, y: 10, pixelX: 14 * this.tileSize, pixelY: 10 * this.tileSize, targetX: 14, targetY: 10, direction: 'left', color: '#8000ff', mode: 'chase', moving: false, lastMoveTime: 0 },
            { x: 15, y: 10, pixelX: 15 * this.tileSize, pixelY: 10 * this.tileSize, targetX: 15, targetY: 10, direction: 'right', color: '#ff8000', mode: 'chase', moving: false, lastMoveTime: 0 }
        ];
        
        // Reset map
        this.map = JSON.parse(JSON.stringify(this.originalMap));
        this.totalDots = this.countDots();
        
        this.updateUI();
        this.draw();
        
        document.getElementById('pauseGameBtn').textContent = 'PAUSE';
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.checkCollisions();
        this.updatePowerMode();
        this.checkWinCondition();
        this.updateUI();
    }
    
    updatePlayer(deltaTime) {
        const currentTime = performance.now();
        
        // If not moving, check if we can start a new move
        if (!this.player.moving) {
            // Try to change direction
            if (this.player.nextDirection) {
                if (this.canMove(this.player.x, this.player.y, this.player.nextDirection)) {
                    this.player.direction = this.player.nextDirection;
                    this.player.nextDirection = null;
                }
            }
            
            // Start moving if possible and enough time has passed
            if (currentTime - this.player.lastMoveTime >= this.moveSpeed) {
                if (this.canMove(this.player.x, this.player.y, this.player.direction)) {
                    const newPos = this.getNextPosition(this.player.x, this.player.y, this.player.direction);
                    
                    // Handle screen wrapping
                    if (newPos.x < 0) newPos.x = this.cols - 1;
                    if (newPos.x >= this.cols) newPos.x = 0;
                    
                    this.player.targetX = newPos.x;
                    this.player.targetY = newPos.y;
                    this.player.moving = true;
                    this.player.lastMoveTime = currentTime;
                }
            }
        }
        
        // Smooth movement animation
        if (this.player.moving) {
            const progress = Math.min(1, (currentTime - this.player.lastMoveTime) / this.moveSpeed);
            
            // Interpolate position
            this.player.pixelX = this.player.x * this.tileSize + (this.player.targetX - this.player.x) * this.tileSize * progress;
            this.player.pixelY = this.player.y * this.tileSize + (this.player.targetY - this.player.y) * this.tileSize * progress;
            
            // Complete the move
            if (progress >= 1) {
                this.player.x = this.player.targetX;
                this.player.y = this.player.targetY;
                this.player.pixelX = this.player.x * this.tileSize;
                this.player.pixelY = this.player.y * this.tileSize;
                this.player.moving = false;
                
                // Collect dots
                if (this.map[this.player.y] && this.map[this.player.y][this.player.x] === 0) {
                    this.map[this.player.y][this.player.x] = 2;
                    this.score += 10;
                    this.dotsEaten++;
                }
                
                // Collect power pellets
                if (this.map[this.player.y] && this.map[this.player.y][this.player.x] === 3) {
                    this.map[this.player.y][this.player.x] = 2;
                    this.score += 50;
                    this.dotsEaten++;
                    this.powerMode = true;
                    this.powerModeTimer = 300; // ~5 seconds at 60fps
                    
                    // Make enemies vulnerable
                    this.enemies.forEach(enemy => enemy.mode = 'flee');
                }
            }
        }
        
        this.player.animFrame = (this.player.animFrame + 1) % 60;
    }
    
    updateEnemies(deltaTime) {
        const currentTime = performance.now();
        const enemySpeed = this.moveSpeed * 1.2; // Slightly slower than player
        
        this.enemies.forEach(enemy => {
            // If not moving, check if we can start a new move
            if (!enemy.moving && currentTime - enemy.lastMoveTime >= enemySpeed) {
                // Simple AI: move towards player or away if in flee mode
                const directions = ['up', 'down', 'left', 'right'];
                let bestDirection = enemy.direction;
                let bestDistance = this.powerMode && enemy.mode === 'flee' ? -Infinity : Infinity;
                
                for (let dir of directions) {
                    if (this.canMove(enemy.x, enemy.y, dir)) {
                        const newPos = this.getNextPosition(enemy.x, enemy.y, dir);
                        const distance = Math.abs(newPos.x - this.player.x) + Math.abs(newPos.y - this.player.y);
                        
                        if (this.powerMode && enemy.mode === 'flee') {
                            if (distance > bestDistance) {
                                bestDistance = distance;
                                bestDirection = dir;
                            }
                        } else {
                            if (distance < bestDistance) {
                                bestDistance = distance;
                                bestDirection = dir;
                            }
                        }
                    }
                }
                
                enemy.direction = bestDirection;
                const newPos = this.getNextPosition(enemy.x, enemy.y, enemy.direction);
                
                // Handle screen wrapping
                if (newPos.x < 0) newPos.x = this.cols - 1;
                if (newPos.x >= this.cols) newPos.x = 0;
                
                enemy.targetX = newPos.x;
                enemy.targetY = newPos.y;
                enemy.moving = true;
                enemy.lastMoveTime = currentTime;
            }
            
            // Smooth movement animation
            if (enemy.moving) {
                const progress = Math.min(1, (currentTime - enemy.lastMoveTime) / enemySpeed);
                
                // Interpolate position
                enemy.pixelX = enemy.x * this.tileSize + (enemy.targetX - enemy.x) * this.tileSize * progress;
                enemy.pixelY = enemy.y * this.tileSize + (enemy.targetY - enemy.y) * this.tileSize * progress;
                
                // Complete the move
                if (progress >= 1) {
                    enemy.x = enemy.targetX;
                    enemy.y = enemy.targetY;
                    enemy.pixelX = enemy.x * this.tileSize;
                    enemy.pixelY = enemy.y * this.tileSize;
                    enemy.moving = false;
                }
            }
        });
    }
    
    updatePowerMode() {
        if (this.powerMode) {
            this.powerModeTimer--;
            if (this.powerModeTimer <= 0) {
                this.powerMode = false;
                this.enemies.forEach(enemy => enemy.mode = 'chase');
            }
        }
    }
    
    checkCollisions() {
        this.enemies.forEach((enemy, index) => {
            if (enemy.x === this.player.x && enemy.y === this.player.y) {
                if (this.powerMode && enemy.mode === 'flee') {
                    // Eat the enemy
                    this.score += 200;
                    enemy.x = 14 + (index % 2);
                    enemy.y = 9 + Math.floor(index / 2);
                    enemy.mode = 'chase';
                } else {
                    // Player dies
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        this.resetPositions();
                    }
                }
            }
        });
    }
    
    resetPositions() {
        this.player.x = 1;
        this.player.y = 1;
        this.player.pixelX = 1 * this.tileSize;
        this.player.pixelY = 1 * this.tileSize;
        this.player.targetX = 1;
        this.player.targetY = 1;
        this.player.direction = 'right';
        this.player.moving = false;
        
        this.enemies.forEach((enemy, index) => {
            enemy.x = 14 + (index % 2);
            enemy.y = 9 + Math.floor(index / 2);
            enemy.pixelX = enemy.x * this.tileSize;
            enemy.pixelY = enemy.y * this.tileSize;
            enemy.targetX = enemy.x;
            enemy.targetY = enemy.y;
            enemy.moving = false;
        });
    }
    
    checkWinCondition() {
        if (this.dotsEaten >= this.totalDots) {
            this.level++;
            this.resetGame();
            this.score += 1000; // Level bonus
            this.startGame();
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        alert(`Game Over! Final Score: ${this.score}`);
    }
    
    canMove(x, y, direction) {
        const newPos = this.getNextPosition(x, y, direction);
        
        // Handle screen wrapping
        if (newPos.x < 0 || newPos.x >= this.cols) return true;
        if (newPos.y < 0 || newPos.y >= this.rows) return false;
        
        return this.map[newPos.y] && this.map[newPos.y][newPos.x] !== 1;
    }
    
    getNextPosition(x, y, direction) {
        switch(direction) {
            case 'up': return { x, y: y - 1 };
            case 'down': return { x, y: y + 1 };
            case 'left': return { x: x - 1, y };
            case 'right': return { x: x + 1, y };
            default: return { x, y };
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.map[y] ? this.map[y][x] : 1;
                const pixelX = x * this.tileSize;
                const pixelY = y * this.tileSize;
                
                switch(cell) {
                    case 1: // Wall
                        this.ctx.fillStyle = '#00ffff';
                        this.ctx.fillRect(pixelX, pixelY, this.tileSize, this.tileSize);
                        break;
                    case 0: // Dot
                        this.ctx.fillStyle = '#ffff00';
                        this.ctx.beginPath();
                        this.ctx.arc(pixelX + this.tileSize/2, pixelY + this.tileSize/2, 2, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    case 3: // Power pellet
                        this.ctx.fillStyle = '#ffff00';
                        this.ctx.beginPath();
                        this.ctx.arc(pixelX + this.tileSize/2, pixelY + this.tileSize/2, 6, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                }
            }
        }
        
        // Draw player (Kiro logo)
        this.drawKiro(this.player.pixelX, this.player.pixelY);
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.drawEnemy(enemy.pixelX, enemy.pixelY, enemy.color, enemy.mode === 'flee');
        });
    }
    
    drawKiro(x, y) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        const size = this.tileSize - 2; // Made bigger by reducing the margin
        
        // Save context for rotation
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Rotate based on direction
        switch(this.player.direction) {
            case 'up':
                this.ctx.rotate(-Math.PI / 2);
                break;
            case 'down':
                this.ctx.rotate(Math.PI / 2);
                break;
            case 'left':
                this.ctx.rotate(Math.PI);
                break;
            // 'right' is default (no rotation)
        }
        
        if (this.imageLoaded) {
            // Draw the actual Kiro logo image
            this.ctx.drawImage(this.kiroImage, -size/2, -size/2, size, size);
            
            // Add power mode glow effect
            if (this.powerMode) {
                this.ctx.shadowColor = '#ff00ff';
                this.ctx.shadowBlur = 10;
                this.ctx.drawImage(this.kiroImage, -size/2, -size/2, size, size);
                this.ctx.shadowBlur = 0;
            }
        } else {
            // Fallback drawing while image loads
            const radius = size / 2;
            this.ctx.fillStyle = this.powerMode ? '#ff00ff' : '#8a2be2';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Kiro logo pattern
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillRect(-4, -6, 8, 3);
            this.ctx.fillRect(-4, 0, 8, 3);
            this.ctx.fillRect(-4, 6, 8, 3);
        }
        
        this.ctx.restore();
    }
    
    drawEnemy(x, y, color, fleeing) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        const radius = this.tileSize / 2 - 1; // Made bigger by reducing the margin
        
        // Add glow effect for fleeing enemies
        if (fleeing) {
            this.ctx.shadowColor = '#0080ff';
            this.ctx.shadowBlur = 8;
        }
        
        // Body with smoother curves
        this.ctx.fillStyle = fleeing ? '#0080ff' : color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI);
        
        // Smoother bottom with animated wave effect
        const waveOffset = Math.sin(Date.now() * 0.01) * 2;
        this.ctx.lineTo(x + 2, y + this.tileSize - 2 + waveOffset);
        this.ctx.lineTo(x + 5, y + this.tileSize - 6 - waveOffset);
        this.ctx.lineTo(x + 8, y + this.tileSize - 2 + waveOffset);
        this.ctx.lineTo(x + 11, y + this.tileSize - 6 - waveOffset);
        this.ctx.lineTo(x + 14, y + this.tileSize - 2 + waveOffset);
        this.ctx.lineTo(x + 17, y + this.tileSize - 6 - waveOffset);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Eyes with blinking animation
        const blinkFrame = Math.floor(Date.now() / 2000) % 60;
        const isBlinking = blinkFrame < 3;
        
        if (!isBlinking) {
            this.ctx.fillStyle = fleeing ? '#ff0000' : '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 4, centerY - 2, 2, 0, Math.PI * 2);
            this.ctx.arc(centerX + 4, centerY - 2, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupils
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 4, centerY - 2, 1, 0, Math.PI * 2);
            this.ctx.arc(centerX + 4, centerY - 2, 1, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Blinking - draw closed eyes
            this.ctx.strokeStyle = fleeing ? '#ff0000' : '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 6, centerY - 2);
            this.ctx.lineTo(centerX - 2, centerY - 2);
            this.ctx.moveTo(centerX + 2, centerY - 2);
            this.ctx.lineTo(centerX + 6, centerY - 2);
            this.ctx.stroke();
        }
    }
    
    updateUI() {
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLives').textContent = this.lives;
        document.getElementById('gameLevel').textContent = this.level;
    }
}

// Initialize the minigame when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.kiroManGame = new KiroManGame();
});