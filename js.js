const gameboard = document.getElementById("gameboard");
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
function setup() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const newNode = document.createElement("div");
      newNode.active = false;
      const inner = document.createElement("p");
      newNode.appendChild(inner);
      newNode.id = [i, j];
      gameboard.appendChild(newNode);
    }
  }

  createPiece(0, 3, 2);

  // setup listeners
  document.addEventListener("keyup", movePieces);
  document.addEventListener("touchstart", (event) => {
    console.log("touched", event);
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  });
  document.addEventListener("touchend", (event) => {
    console.log("touch released", event);
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;

    if (touchEndX < touchStartX) {
      movePieces({ key: "ArrowLeft" });
    }
    if (touchEndX > touchStartX) {
      movePieces({ key: "ArrowRight" });
    }
    if (touchEndY < touchStartY) {
      movePieces({ key: "ArrowUp" });
    }
    if (touchEndY > touchStartY) {
      movePieces({ key: "ArrowDown" });
    }
  });
}

colors = [
  "#dd7878",
  "#dc8a78",
  "#179299",
  "#04a5e5",
  "#209fb5",
  "#7287fd",
  "#8c8fa1",
  "#df8e1d",
  "#acb0be",
  "#bcc0cc",
  "#ccd0da",
  "#eff1f5",
  "#e6e9ef",
];

function updateColor(piece, num) {
  let size = Math.log2(num);
  piece.style.backgroundColor = colors[size];
}

function createPiece(y, x, number) {
  const piece = document.getElementById(`${y},${x}`);
  piece.number = number;
  piece.active = true;
  piece.firstElementChild.style.opacity = 1;
  piece.firstElementChild.textContent = piece.number;
  updateColor(piece, piece.number);
  pieces.push(piece);
}
let pieces = [];

function moveLeft() {
  for (let y = 0; y <= 3; y++) {
    for (let x = 0; x <= 3; x++) {
      if (pieces.find((p) => p.id == `${y},${x}`) && x > 0) {
        let xx = x;
        while (xx != 0) {
          let currPiece = pieces.find((p) => p.id == `${y},${xx}`);
          let nextPiece = pieces.find((p) => p.id == `${y},${xx - 1}`);
          if (nextPiece) {
            // handle collision
            handleCollision(currPiece, nextPiece);
          } else {
            movePiece(currPiece, y, xx - 1);
          }
          xx--;
        }
      }
    }
  }
}

function moveRight() {
  for (let y = 0; y <= 3; y++) {
    for (let x = 3; x >= 0; x--) {
      if (pieces.find((p) => p.id == `${y},${x}`) && x < 3) {
        let xx = x;
        while (xx != 3) {
          let currPiece = pieces.find((p) => p.id == `${y},${xx}`);
          let nextPiece = pieces.find((p) => p.id == `${y},${xx + 1}`);
          if (nextPiece) {
            // handle collision
            handleCollision(currPiece, nextPiece);
          } else {
            movePiece(currPiece, y, xx + 1);
          }
          xx++;
        }
      }
    }
  }
}

function moveUp() {
  for (let y = 0; y <= 3; y++) {
    for (let x = 0; x <= 3; x++) {
      if (pieces.find((p) => p.id == `${y},${x}`) && y > 0) {
        let yy = y;
        while (yy != 0) {
          let currPiece = pieces.find((p) => p.id == `${yy},${x}`);
          let nextPiece = pieces.find((p) => p.id == `${yy - 1},${x}`);
          if (nextPiece) {
            // handle collision
            handleCollision(currPiece, nextPiece);
          } else {
            movePiece(currPiece, yy - 1, x);
          }
          yy--;
        }
      }
    }
  }
}

function moveDown() {
  for (let y = 3; y >= 0; y--) {
    for (let x = 0; x <= 3; x++) {
      if (pieces.find((p) => p.id == `${y},${x}`) && y < 3) {
        let yy = y;
        while (yy != 3) {
          let currPiece = pieces.find((p) => p.id == `${yy},${x}`);
          let nextPiece = pieces.find((p) => p.id == `${yy + 1},${x}`);
          if (nextPiece) {
            // handle collision
            handleCollision(currPiece, nextPiece);
          } else {
            movePiece(currPiece, yy + 1, x);
          }
          yy++;
        }
      }
    }
  }
}

function handleCollision(currPiece, nextPiece) {
  console.log(moveable);
  if (currPiece.number == nextPiece.number) {
    let currNum = currPiece.number;
    nextPiece.number += currNum;
    nextPiece.firstElementChild.textContent = nextPiece.number;
    updateColor(nextPiece, nextPiece.number);
    nextPiece.firstElementChild.style.opacity = 1;
    currPiece.active = false;
    currPiece.number = 0;
    currPiece.firstElementChild.style.opacity = 0;
    currPiece.style.backgroundColor = "white";
    pieces = pieces.filter((p) => p.active);
    console.log(pieces);
    moveable |= true;
    moved = true;
  }
  moveable |= false;
}

function movePiece(piece, y, x) {
  console.log(y, x);
  let num = piece.number;
  piece.active = false;
  piece.number = 0;
  piece.style.backgroundColor = "white";
  piece.firstElementChild.style.opacity = 0;
  pieces = pieces.filter((p) => p.active);
  createPiece(y, x, num);
  moved = true;
}

function spawnPiece() {
  let options = [];
  for (let y = 0; y <= 3; y++) {
    for (let x = 0; x <= 3; x++) {
      if (!pieces.find((p) => p.id == `${y},${x}`)) {
        options.push([y, x]);
      }
    }
  }
  let choice = options[Math.floor(Math.random() * options.length)];
  createPiece(choice[0], choice[1], 2);
}

let moved = false;

function movePieces(key) {
  if (!moveable) {
    console.log("game ended");
  }
  moved = false;
  switch (key.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    default:
      console.log("Wrong key");
  }
  setTimeout(null, 10000);
  if (moved) {
    spawnPiece();
  }
}

let moveable = true;

setup();
