window.addEventListener('DOMContentLoaded', (event) => {
  const gameContainer = document.getElementById('game-container');
  const player = document.getElementById('player');

  let positionX = 0; // Initial player position
  const speed = 5; // Speed at which the player moves

  function movePlayer(direction) {
    if (direction === 'left') {
      positionX -= speed;
      player.style.left = positionX + 'px';
    } else if (direction === 'right') {
      positionX += speed;
      player.style.left = positionX + 'px';
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      movePlayer('left');
    } else if (event.key === 'ArrowRight') {
      movePlayer('right');
    }
  });
});