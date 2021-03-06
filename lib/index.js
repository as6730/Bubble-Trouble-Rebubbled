import BubbleFive from './bubbles/bubbleFive.js';
import BubbleFour from './bubbles/bubbleFour.js';
import BubbleThree from './bubbles/bubbleThree.js';
import BubbleTwo from './bubbles/bubbleTwo.js';
import BubbleOne from './bubbles/bubbleOne.js';
import getAllLevels from './levels.js';
import Laser from './laser.js';
import spaceship from './spaceship.js';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// characters
let initialBubbleHeight = 100;
let laser = null;
let character = new spaceship(canvas);
let score = 0;
let lives = 3;
let isGamePaused = true;
let inBetweenCountdown = 0;
let alreadyDraw = true;

// user controllers
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
      rightPressed = true;
  }
  else if (e.keyCode == 37) {
      leftPressed = true;
  }
  else if (e.keyCode == 32) {
    if (isGamePaused === true) {
      character = new spaceship(canvas);
      isGamePaused = false;
      bubbles = getAllLevels()[level]
      document.getElementById("instructions").style.display = "none";
    } else if (laser === null) {
      laser = new Laser(character.currX + (character.width / 2), canvas.height);
    }
    document.getElementById("instructions").style.display = "none";
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// score
function drawScore(ctx) {
  ctx.font = '20px courier';
  ctx.fillStyle= '#17ffd3';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#17ffd3';
  ctx.strokeStyle= '#17ffd3';
  ctx.lineWidth = 1;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// lives
function drawLives(ctx) {
  ctx.font = '20px courier';
  ctx.fillStyle= '#17ffd3';
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#17ffd3';
  ctx.strokeStyle= '#17ffd3';
  ctx.lineWidth = 1;
  ctx.fillText(`Lives: ${lives}`, 8, 40);
}

// game over
function drawGameOver(ctx) {
  ctx.font = '20px courier';
  ctx.fillStyle = '#FFFAFA';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#FFFAFA';
  ctx.lineWidth = 1;
  ctx.fillText(`Game over. Your final score was: ${score}`, canvas.width / 2 - 200, canvas.height / 2);
}

// level fail
function drawLevelFail(ctx) {
  ctx.font = '35px courier';
  ctx.fillStyle = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#FFD700';
  ctx.lineWidth = 1;
  ctx.fillText(`Retry`, canvas.width / 2 - 45, canvas.height / 2);
}

// next level
function drawLevel(ctx) {
  ctx.font = '20px courier';
  ctx.fillStyle = '#17ffd3';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#17ffd3';
  ctx.lineWidth = 1;
  ctx.fillText(`Level ${level + 1}`, canvas.width - 90, 20);
}

// get ready for next level
function drawGetReady(ctx, secondsRemaining) {
  ctx.font = '35px courier';
  ctx.fillStyle = '#FFD700';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#FFD700';
  ctx.lineWidth = 1;
  ctx.fillText(`Get Ready ${secondsRemaining}!`, canvas.width / 2 - 100, canvas.height / 2);
}

// countdown between levels
function countdownLevel(ctx) {
  for (var i = 6; i > 1; i--) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGetReady(ctx, i)
  }
}

let level = 0;
let bubbles = getAllLevels()[level];
let timer;
// load next level
function loadNextLevelIfFinished(ctx) {
  if (bubbles.length === 0) {
    level += 1;
    bubbles = getAllLevels()[level];
    character = new spaceship(canvas);

    // pause game in between levels
    inBetweenCountdown = 5;
    alreadyDraw = false;
    timer = setInterval(function () {
      inBetweenCountdown--;
      alreadyDraw = false;
    }, 1000)
  }
}

function draw() {
  // check if character is between levels
  if (inBetweenCountdown > 0) {
    if (!alreadyDraw) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGetReady(ctx, inBetweenCountdown);
      alreadyDraw = true;
    }
    return;
  } else {
    window.clearInterval(timer);
  }

  // event listeners
  if (!isGamePaused) {
    if (rightPressed && character.currX < canvas.width - character.width) {
      character.moveToNextPos(ctx, 1.25);
    }
    else if (leftPressed && character.currX > 0) {
      character.moveToNextPos(ctx, -1.25);
    }

    // check bubble collision with character
    let gameOver = false;
    if (bubbles.length > 0) {
      bubbles.forEach(bubble => {
        if (character.checkCollisionWithBubble(bubble)) {
          gameOver = true;
        }
      });
    }

    if (gameOver) {
      isGamePaused = true;
      if (lives === 0) {
        drawGameOver(ctx);
        level = 0;
        lives = 3;
        setTimeout(function(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          document.getElementById("instructions").style.display = "flex"
        }, 3000);
      } else {
        document.getElementById("instructions").style.display = "none";
        drawLevelFail(ctx);
        lives--;
      }

      laser = null;
      bubbles = [];
      return;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      loadNextLevelIfFinished(ctx);
    }

    // check bubble collision with laser
    if (laser !== null) {
      // newBubbles are the bubbles that did not experience a collision
      let newBubbles = bubbles.filter(bubble => !bubble.checkCollision(laser.currX, laser.currY));
      // Check for a collision
      if (newBubbles.length < bubbles.length) {
        // find the collision bubble
        let collidedBubble = bubbles.filter(bubble => bubble.checkCollision(laser.currX, laser.currY))[0];
        bubbles = newBubbles;
        if (collidedBubble instanceof BubbleOne) {
          score += 2;
        }
        else if (collidedBubble instanceof BubbleTwo) {
          bubbles.push(new BubbleOne(collidedBubble.currX, collidedBubble.currY, 0.8, -1.5));
          bubbles.push(new BubbleOne(collidedBubble.currX, collidedBubble.currY, -0.8, -1.5));
          score += 5;
        }
        else if (collidedBubble instanceof BubbleThree) {
          bubbles.push(new BubbleTwo(collidedBubble.currX, collidedBubble.currY, 0.35, -1.5));
          bubbles.push(new BubbleTwo(collidedBubble.currX, collidedBubble.currY, -0.35, -1.5));
          score += 7;
        }
        else if (collidedBubble instanceof BubbleFour) {
          bubbles.push(new BubbleThree(collidedBubble.currX, collidedBubble.currY, 0.35, -1.5));
          bubbles.push(new BubbleThree(collidedBubble.currX, collidedBubble.currY, -0.35, -1.5));
          score += 7;
        }
        else if (collidedBubble instanceof BubbleFive) {
          bubbles.push(new BubbleFour(collidedBubble.currX, collidedBubble.currY, 0.35, -1.5));
          bubbles.push(new BubbleFour(collidedBubble.currX, collidedBubble.currY, -0.35, -1.5));
          score += 9;
        }
        // remove the laser
        laser = null;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.map(bubble => bubble.moveToNextPos(ctx, canvas));
    if (laser !== null) {
      if (laser.isInBounds()) {
        laser.moveToNextPos(ctx, canvas);
      }
      else {
        laser = null;
      }
    }

    character.drawSpaceship(ctx);
    drawScore(ctx);
    drawLives(ctx);
    drawLevel(ctx);
    // requestAnimationFrame(draw);
  }
}

// window.requestAnimationFrame(draw);
setInterval(draw, 5);
