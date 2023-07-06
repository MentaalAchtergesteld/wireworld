const brushButtons = document.getElementById("brushButtons");
const backgroundButton = document.getElementById("background");
const headButton = document.getElementById("head");
const tailButton = document.getElementById("tail");
const copperButton = document.getElementById("copper");
const emptyButton = document.getElementById("empty");

const playPauseButton = document.getElementById("playPause");
const stepButton = document.getElementById("step");

const deleteButton = document.getElementById("deleteAll");

const canvas = new CanvasBuilder()
  .setSize(window.innerWidth, window.innerHeight)
  .build();

let mouseX;
let mouseY;
let mouseDown = false;

let grid = [];
let gridSquareSize = 16;

let gridXAmount = Math.floor(canvas.width / gridSquareSize);
let gridYAmount = Math.floor(canvas.height / gridSquareSize);

let gridXOffset = (canvas.width - gridXAmount * gridSquareSize) / 2;
let gridYOffset = (canvas.height - gridSquareSize * gridYAmount) / 2;

for (let i = 0; i < gridXAmount; i++) {
  grid.push([]);
  for (let j = 0; j < gridYAmount; j++) {
    grid[i].push(0);
  }
}

let backgroundColor = Color.HEX("#202020");
let headColor = Color.HEX("#3D348B");
let tailColor = Color.HEX("#B20D30");
let copperColor = Color.HEX("#F0803C");

const brushes = {
  background: 0,
  head: 1,
  tail: 2,
  copper: 3,
  empty: 4,
};
let selectedBrush;
let playing = false;

function switchBrush(brush) {
  backgroundButton.classList.remove("selected");
  headButton.classList.remove("selected");
  tailButton.classList.remove("selected");
  copperButton.classList.remove("selected");
  emptyButton.classList.remove("selected");

  switch (brush) {
    case brushes.background:
      backgroundButton.classList.add("selected");
      break;
    case brushes.head:
      headButton.classList.add("selected");
      break;
    case brushes.tail:
      tailButton.classList.add("selected");
      break;
    case brushes.copper:
      copperButton.classList.add("selected");
      break;
    case brushes.empty:
      emptyButton.classList.add("selected");
  }

  selectedBrush = brush;
}

switchBrush(brushes.background);

function drawBrush() {
  switch (selectedBrush) {
    case brushes.background:
      canvas.setFill(backgroundColor);
      break;
    case brushes.head:
      canvas.setFill(headColor);
      break;
    case brushes.tail:
      canvas.setFill(tailColor);
      break;
    case brushes.copper:
      canvas.setFill(copperColor);
      break;
  }

  canvas.setStroke(Color.HEX("#c0c0c0"));
  canvas.setStrokeWeight(4);

  let gridPosX =
    Math.floor(mouseX / gridSquareSize) * gridSquareSize +
    gridXOffset +
    gridSquareSize / 2;
  let gridPosY =
    Math.floor(mouseY / gridSquareSize) * gridSquareSize +
    gridYOffset +
    gridSquareSize / 2;
  canvas.ellipse(
    gridPosX + gridXOffset,
    gridPosY + gridXOffset,
    gridSquareSize / 2
  );
}

function sleep(timeInMillis) {
  return new Promise((resolve) => setTimeout(resolve, timeInMillis));
}

function checkNeighbours(grid, i, j, value) {
  let neighbours = 0;
  // neighbours.push(grid[i - 1][j - 1]);
  // neighbours.push(grid[i][j - 1]);
  // neighbours.push(grid[i + 1][j - 1]);
  // neighbours.push(grid[i - 1][j]);
  // neighbours.push(grid[i][j]);
  // neighbours.push(grid[i + 1][j]);
  // neighbours.push(grid[i - 1][j + 1]);
  // neighbours.push(grid[i][j + 1]);
  // neighbours.push(grid[i + 1][j + 1]);
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x == 0 && y == 0) continue;
      if (
        x + i < 0 ||
        x + i > grid.length ||
        y + j < 0 ||
        y + j > grid[i].length
      )
        continue;

      console.log(grid[x + i][y + j]);
      if (grid[x + i][y + j] == value) neighbours++;
    }
  }

  return neighbours;
}

function handleAlgorithm() {
  let altGrid = structuredClone(grid);
  for (let i = 0; i < altGrid.length; i++) {
    for (let j = 0; j < altGrid[i].length; j++) {
      switch (altGrid[i][j]) {
        case 1:
          grid[i][j] = 2;
          break;
        case 2:
          grid[i][j] = 3;
          break;
        case 3:
          let neighbours = checkNeighbours(altGrid, i, j, 1);
          if (neighbours == 1 || neighbours == 2) grid[i][j] = 1;
          break;
      }
    }
  }
}

function handleBrush() {
  if (selectedBrush != brushes.empty) drawBrush();
  if (mouseDown && selectedBrush != brushes.empty) {
    let gridPosX = Math.floor(mouseX / gridSquareSize);
    let gridPosY = Math.floor(mouseY / gridSquareSize);

    grid[gridPosX][gridPosY] = selectedBrush;
  }
}

function update() {
  canvas.setBackground(Color.GS(32));

  canvas.setFill(Color.GS(192));
  canvas.noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      switch (grid[i][j]) {
        case 0:
          canvas.setFill(backgroundColor);
          break;
        case 1:
          canvas.setFill(headColor);
          break;
        case 2:
          canvas.setFill(tailColor);
          break;
        case 3:
          canvas.setFill(copperColor);
          break;
      }

      let x = i * gridSquareSize + gridXOffset + gridSquareSize / 2;
      let y = j * gridSquareSize + gridYOffset + gridSquareSize / 2;
      canvas.ellipse(x, y, gridSquareSize / 2);
    }
  }

  if (playing) {
    handleAlgorithm();
  } else {
    handleBrush();
  }

  requestAnimationFrame(update);
}

update();

backgroundButton.addEventListener("click", () => {
  switchBrush(brushes.background);
});
headButton.addEventListener("click", () => {
  switchBrush(brushes.head);
});
tailButton.addEventListener("click", () => {
  switchBrush(brushes.tail);
});
copperButton.addEventListener("click", () => {
  switchBrush(brushes.copper);
});
emptyButton.addEventListener("click", () => {
  switchBrush(brushes.empty);
});

playPauseButton.addEventListener("click", () => {
  playing = !playing;
  if (playing) {
    playPauseButton.classList.add("playing");
    brushButtons.classList.add("invisible");
  } else {
    playPauseButton.classList.remove("playing");
    brushButtons.classList.remove("invisible");
  }
});

stepButton.addEventListener("click", () => {
  handleAlgorithm();
});

deleteButton.addEventListener("click", () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

canvas.getCanvas().addEventListener("mousedown", () => {
  mouseDown = true;
});

canvas.getCanvas().addEventListener("mouseup", () => {
  mouseDown = false;
});
