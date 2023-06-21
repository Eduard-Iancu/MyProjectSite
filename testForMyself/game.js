window.addEventListener('DOMContentLoaded', (event) => {
  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 500;
  const PLAYER_WIDTH = 10;
  const PLAYER_HEIGHT = 15;
  const PROJECTILE_WIDTH = 10;
  const PROJECTILE_HEIGHT = 25;
  const COIN_WIDTH = 20;
  const COIN_HEIGHT = 20;
  const PROJECTILE_SPEED = 2;
  const SPAWN_INTERVAL = 1000;

  // Game state
  let playerX = (GAME_WIDTH - PLAYER_WIDTH) / 2;
  let playerY = (GAME_HEIGHT - PLAYER_HEIGHT) / 2;
  let projectiles = [];
  let sidewaysProjectileCounter = 0; // Counter for sideways projectiles
  let coins = [];
  let spawningEnabled = false; // Flag to track if spawning is enabled or not
  let coinCounter = 0; // Counter for spawned coins

  // DOM elements
  const gameContainer = document.getElementById('game-container');
  const player = document.getElementById('player');
  const startButton = document.getElementById('startButton');
  const coinCounterElement = document.getElementById('coinCounter');

  // Update player position
  function updatePlayerPosition(x, y) {
    player.style.left = x + 'px';
    player.style.top = y + 'px';
  }

// Move projectiles and check for collisions
function updateProjectiles() {
  projectiles.forEach((projectile, index) => {
    const projectileTop = parseInt(projectile.style.top);
    const projectileLeft = parseInt(projectile.style.left);
    const isSideways = projectile.getAttribute('data-sideways') === 'true';

    // Check for collision with player
    if (
      projectileTop < playerY + PLAYER_HEIGHT &&
      projectileTop + PROJECTILE_HEIGHT > playerY &&
      projectileLeft < playerX + PLAYER_WIDTH &&
      projectileLeft + PROJECTILE_WIDTH > playerX
    ) {
      alert('Verloren! Nochmal?');
      resetGame();
      return;
    }

    if (isSideways) {
      // Move sideways projectile horizontally
      projectile.style.left = projectileLeft + PROJECTILE_SPEED + 'px';

      // Respawn sideways projectile if it goes off-screen
      if (projectileLeft > GAME_WIDTH) {
        projectile.style.left = '-10px';
        projectile.style.top = Math.random() * (GAME_HEIGHT - PROJECTILE_HEIGHT) + 'px';
      }
    } else {
      // Move top projectile vertically
      projectile.style.top = projectileTop + PROJECTILE_SPEED + 'px';

      // Respawn top projectile if it goes off-screen
      if (projectileTop > GAME_HEIGHT) {
        projectile.style.left = Math.random() * (GAME_WIDTH - PROJECTILE_WIDTH) + 'px';
        projectile.style.top = '-10px';
      }
    }
  });
}


  // Move coins and check for collisions
  function updateCoins() {
    coins.forEach((coin, index) => {
      const coinTop = parseInt(coin.style.top);
      const coinLeft = parseInt(coin.style.left);

      // Check for collision with player
      if (
        coinTop < playerY + PLAYER_HEIGHT &&
        coinTop + COIN_HEIGHT > playerY &&
        coinLeft < playerX + PLAYER_WIDTH &&
        coinLeft + COIN_WIDTH > playerX
      ) {
        coins.splice(index, 1);
        gameContainer.removeChild(coin);
        // Increase score or perform other actions
        coinCounter++;
        coinCounterElement.innerText = coinCounter.toString();
      }

      // Move coin
      const newCoinTop = coinTop + PROJECTILE_SPEED; // Adjust the speed as desired
      coin.style.top = newCoinTop + 'px';

      // Remove coin if it goes off-screen
      if (newCoinTop > GAME_HEIGHT) {
        coins.splice(index, 1);
        gameContainer.removeChild(coin);
      }
    });
  }

  // Spawn new projectile
  function spawnProjectile() {
    if (sidewaysProjectileCounter >= 3) {
      return;
    }

    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    projectile.style.left = Math.random() * (GAME_WIDTH - PROJECTILE_WIDTH) + 'px';
    projectile.style.top = '-10px';

    if (Math.random() < 0.5) {
      projectile.setAttribute('data-sideways', 'true');
      sidewaysProjectileCounter++;
    } else {
      projectile.setAttribute('data-sideways', 'false');
    }

    projectiles.push(projectile);
    gameContainer.appendChild(projectile);
  }

  // Spawn new coin
  function spawnCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = Math.random() * (GAME_WIDTH - COIN_WIDTH) + 'px';
    coin.style.top = '-10px';

    coins.push(coin);
    gameContainer.appendChild(coin);
  }

  // Reset the game
  function resetGame() {
    projectiles.forEach(projectile => gameContainer.removeChild(projectile));
    projectiles = [];
    coins.forEach(coin => gameContainer.removeChild(coin));
    coins = [];
    updatePlayerPosition((GAME_WIDTH - PLAYER_WIDTH) / 2, (GAME_HEIGHT - PLAYER_HEIGHT) / 2);

    coinCounter = 0;
    coinCounterElement.innerText = coinCounter.toString();
  }

  // Add event listener to the button click
  startButton.addEventListener('click', function () {
    spawningEnabled = true; // Enable spawning when the button is clicked
  });

  // Keyboard controls
  const keysPressed = new Set();
  let dx = 0; // Horizontal movement
  let dy = 0; // Vertical movement

  document.addEventListener('keydown', (event) => {
    keysPressed.add(event.key);
    handleMovement();
  });

  document.addEventListener('keyup', (event) => {
    keysPressed.delete(event.key);
    handleMovement();
  });

  function handleMovement() {
    const step = 10;

    dx = 0;
    dy = 0;

    if ((keysPressed.has('ArrowUp') || keysPressed.has('w')) && !keysPressed.has('ArrowDown') && !keysPressed.has('s')) {
      dy -= step;
    }
    if ((keysPressed.has('ArrowDown') || keysPressed.has('s')) && !keysPressed.has('ArrowUp') && !keysPressed.has('w')) {
      dy += step;
    }
    if ((keysPressed.has('ArrowLeft') || keysPressed.has('a')) && !keysPressed.has('ArrowRight') && !keysPressed.has('d')) {
      dx -= step;
    }
    if ((keysPressed.has('ArrowRight') || keysPressed.has('d')) && !keysPressed.has('ArrowLeft') && !keysPressed.has('a')) {
      dx += step;
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const diagonalFactor = 0.7071; // Approximately 1 / sqrt(2)
      dx *= diagonalFactor;
      dy *= diagonalFactor;
    }
  }
  // Clear movement flags when the window loses focus
  window.addEventListener('blur', () => {
    for (const key in keysPressed) {
      if (keysPressed.hasOwnProperty(key)) {
        keysPressed[key] = false;
      }
    }
  });

  // Game loop
  function gameLoop() {
    playerX = Math.max(Math.min(playerX + dx, GAME_WIDTH - PLAYER_WIDTH), 0);
    playerY = Math.max(Math.min(playerY + dy, GAME_HEIGHT - PLAYER_HEIGHT), 0);
    updatePlayerPosition(playerX, playerY);
    updateProjectiles();
    updateCoins();

    requestAnimationFrame(gameLoop);
  }

  // Projectile spawning loop
  setInterval(() => {
    if (spawningEnabled) {
      spawnProjectile();
    }
  }, SPAWN_INTERVAL);

  // Coin spawning loop
  setInterval(() => {
    if (spawningEnabled) {
      spawnCoin();
    }
  }, SPAWN_INTERVAL);

  // Start the game loop
  gameLoop();
});
