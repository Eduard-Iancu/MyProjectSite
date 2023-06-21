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

      // Move projectile
      projectile.style.top = projectileTop + PROJECTILE_SPEED + 'px';

      // Remove projectile if it goes off-screen
      if (projectileTop > GAME_HEIGHT) {
        projectiles.splice(index, 1);
        gameContainer.removeChild(projectile);
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
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    projectile.style.left = Math.random() * (GAME_WIDTH - PROJECTILE_WIDTH) + 'px';
    projectile.style.top = '-10px';

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
  document.addEventListener('keydown', (event) => {
    const step = 10;
    switch (event.key) {
      case 'ArrowUp':
        playerY = Math.max(playerY - step, 0);
        updatePlayerPosition(playerX, playerY);
        break;
      case 'ArrowDown':
        playerY = Math.min(playerY + step, GAME_HEIGHT - PLAYER_HEIGHT);
        updatePlayerPosition(playerX, playerY);
        break;
      case 'ArrowLeft':
        playerX = Math.max(playerX - step, 0);
        updatePlayerPosition(playerX, playerY);
        break;
      case 'ArrowRight':
        playerX = Math.min(playerX + step, GAME_WIDTH - PLAYER_WIDTH);
        updatePlayerPosition(playerX, playerY);
        break;
    }
  });

  // Game loop
  setInterval(() => {
    if (spawningEnabled) {
      updateProjectiles();
      updateCoins();
    }
  }, 10);

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
});
