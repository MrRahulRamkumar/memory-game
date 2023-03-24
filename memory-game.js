const directions = ['up', 'right', 'down', 'left'];

const tileSize = 100;
const pointerColor = '#5579C6';
const textColor = '#FFF';

let grid = [];
let changedPointerIndex;
let isHidden;
let isClickable;
let isCorrect;
let isWrong;
let timer;
let gridSize;
let correctCount = 0;
let incorrectCount = 0;

const correctCountElement = document.getElementById('correct-count');
const incorrectCountElement = document.getElementById('incorrect-count');

function shuffleGrid() {
  grid = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    const direction = directions[Math.floor(Math.random() * 4)];
    grid.push(direction);
  }
}

function setup() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  gridSize =
    params.gridSize && !isNaN(params.gridSize) && params.gridSize >= 2 && params.gridSize <= 5 ? params.gridSize : 2;
  createCanvas(gridSize * tileSize, gridSize * tileSize);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(18);

  shuffleGrid();
  isHidden = false;
  isClickable = false;

  setTimeout(() => {
    isHidden = true;
    changeRandomPointer();

    setTimeout(() => {
      isHidden = false;
      isClickable = true;
    }, 2000);
  }, 2000);
}

function draw() {
  background(34, 34, 34);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = j * tileSize;
      const y = i * tileSize;

      if (!isHidden && !isCorrect && !isWrong) {
        stroke(pointerColor);
        strokeWeight(1);
        noFill();
        rect(x, y, tileSize, tileSize);

        push();
        translate(x + tileSize / 2, y + tileSize / 2);
        rotate(directions.indexOf(grid[i * gridSize + j]) * 90);
        fill(pointerColor);
        noStroke();
        text('➤', 0, 0);
        pop();
      }
    }
  }

  if (isHidden) {
    fill(textColor);
    noStroke();
    text('Which cell changed?', width / 2, height / 2);
  } else if (isCorrect) {
    fill(textColor);
    noStroke();
    text('Correct!', width / 2, height / 2);
  } else if (isWrong) {
    fill(textColor);
    noStroke();
    text('Incorrect!', width / 2, height / 2);
  }
}

function changeRandomPointer() {
  changedPointerIndex = Math.floor(Math.random() * grid.length);
  const currentDirectionIndex = directions.indexOf(grid[changedPointerIndex]);
  const newDirectionIndex = (currentDirectionIndex + 1 + Math.floor(Math.random() * 3)) % 4;
  grid[changedPointerIndex] = directions[newDirectionIndex];
}

async function mousePressed() {
  if (!isClickable || isHidden || isCorrect || isWrong) {
    return;
  }

  const clickedIndex = floor(mouseY / tileSize) * gridSize + floor(mouseX / tileSize);
  if (clickedIndex === changedPointerIndex) {
    isCorrect = true;
    correctCount++;
    document.getElementById('correct-count').innerHTML = `Correct: ${correctCount}`;

    setTimeout(() => {
      isWrong = false;
      isCorrect = false;
      isHidden = false;
      isClickable = false;
      shuffleGrid();

      setTimeout(() => {
        isHidden = true;
        changeRandomPointer();

        setTimeout(() => {
          isClickable = true;
          isHidden = false;
        }, 2000);
      }, 2000);
    }, 2000);
  } else {
    console.log('Incorrect!');
    isWrong = true;
    incorrectCount++;
    document.getElementById('incorrect-count').innerHTML = `Incorrect: ${incorrectCount}`;

    setTimeout(() => {
      isWrong = false;
      isCorrect = false;
      isHidden = false;
      isClickable = false;
      shuffleGrid();

      setTimeout(() => {
        isHidden = true;
        changeRandomPointer();

        setTimeout(() => {
          isClickable = true;
          isHidden = false;
        }, 2000);
      }, 2000);
    }, 2000);
  }
}
