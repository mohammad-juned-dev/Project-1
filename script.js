const board = document.querySelector(".board");
const StartButton = document.querySelector(".btn-start");
const Modal = document.querySelector(".modal");
const StartgameModal = document.querySelector(".start-game");
const RestartgameModal = document.querySelector(".restart-game");
const Restartbtn = document.querySelector(".btn-restart");

let Score = document.querySelector("#score");
let score = 0;
let HighScore = document.querySelector("#high-score");
let highscore = localStorage.getItem("HighScore") || 0;
let Time = document.querySelector("#time");
let time = "00-00";

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
const blocks = [];
let snake = [{ x: 1, y: 3 }];
let intervalID = null;
let timerIntervalID = null;
let direction = "right";
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Game Over")

    if (score > highscore) {
      highscore = score;
      HighScore.innerHTML = highscore;
      localStorage.setItem("HighScore", highscore.toString());
    }
    score = 0;
    Score.innerHTML = score;
    clearInterval(intervalID);
    clearInterval(timerIntervalID);
    Modal.style.display = "flex";
    StartgameModal.style.display = "none";
    RestartgameModal.style.display = "flex";
    return;
  }

  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);
    score = score + 1;
    Score.innerHTML = score;
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

StartButton.addEventListener("click", () => {
  Modal.style.display = "none";
  intervalID = setInterval(() => {
    render();
  }, 300);

  timerIntervalID = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    Time.innerHTML = time;
  }, 1000);
});

Restartbtn.addEventListener("click", () => {
  restartGame();
});

function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  direction = "down";
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  Modal.style.display = "none";
  snake = [{ x: 1, y: 0 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalID = setInterval(() => {
    render();
  }, 300);
  let timerIntervalID = null;
  timerIntervalID = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    Time.innerHTML = time;
  }, 1000);
}

addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  }
});
