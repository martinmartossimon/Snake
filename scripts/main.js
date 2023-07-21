// presionar una tecla marca las flechitas del pad

let blockSize = 100
let gameSpeed = 1000 / 5

// Set the total number of rows and columns
var boardRows = 8 //total row number
var boardCols = 8 //total column number
var boardSize = boardRows * boardCols
var boardColor = 'rgb(26 24 26)'
/** @type {HTMLCanvasElement} */
var board
/** @type {CanvasRenderingContext2D} */
var context
// /**  @type {box} */
let switchOnOff
let score = 0
let scoreBoard

/** @type {CanvasRenderingContext2D} */
var contextControls
/** @type {HTMLCanvasElement} */
var controls
let headColor = ''
let head = { x: 0, y: 0 }
let food = { x: 0, y: 0 }
let food_eated = []
let directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

let carrousel = [
  directions.right,
  directions.down,
  directions.left,
  directions.up
]

let currDirection = { x: 0, y: 0 }

function Point (x, y) {
  this.x = x
  this.y = y
}

var snakeBody = []
var gameOver = false
let modelUrl = './models/model.onnx'
let session = null

let buttonLeft = new Path2D()
let buttonDown = new Path2D()
let buttonUp = new Path2D()
let buttonRight = new Path2D()

let arrowLeft = new Path2D()
let arrowDown = new Path2D()
let arrowUp = new Path2D()
let arrowRight = new Path2D()

let slider
let speedValue
let myInterval

window.onload = function () {
  // Set board height and width
  board = document.getElementById('board')
  blockSize = Math.floor(
    (Math.min(window.innerHeight, window.innerWidth) / boardRows) * 0.98
  )
  console.log(1, blockSize)
  blockSize -= blockSize % boardRows
  console.log(2, blockSize)
  board.height = blockSize * boardRows // boardRows * blockSize
  board.width = blockSize * boardRows
  console.log('board.height', board.height)
  context = board.getContext('2d')
  controls = document.getElementById('controls')
  controls.height = 4 * blockSize
  controls.width = 4 * blockSize
  contextControls = controls.getContext('2d')
  // controls.addEventListener('mousedown', ButtonMousedown)
  controls.addEventListener('pointerdown', ButtonMousedown)
  controls.addEventListener('mouseup', resetArrows)
  controls.addEventListener('pointerleave', resetArrows)

  document.addEventListener('keydown', changeDirection) //for movements
  document.addEventListener('keyup', resetArrows)

  switchOnOff = document.getElementById('cboxSwitch')
  scoreBoard = document.getElementById('score')

  slider = document.getElementById('speed')
  slider.addEventListener('input', changeSpeed)
  speedValue = document.getElementById('speedValue')
 

  /** Creates the session and load the model to inference */
  async function createSession () {
    try {
      // create a new session and load the specific model.
      session = await ort.InferenceSession.create(modelUrl)
    } catch (e) {
      document.write(`failed to createSession ONNX: ${e}.`)
    }
  }
  drawControls()
  createSession()
  myInterval = setInterval(update, gameSpeed)
  reset()
}

/** Resets the game to de initial conditions */
function reset () {
  console.log('Reseting')
  currDirection = { x: 0, y: 0 } //auto restart
  // currDirection = directions.up
  head = { x: blockSize * 2, y: blockSize * 2 }
  snakeBody = [
    [head.x, head.y],
    [head.x, head.y + blockSize * 1],
    [head.x, head.y + blockSize * 2],
    [head.x, head.y + blockSize * 3]
  ]
  context.fillStyle = boardColor
  context.fillRect(0, 0, board.width, board.height)
  newFoodPosition()
  drawFood()
  drawSnakeBody()
  gameOver = false
  score = 0
  scoreBoard.innerHTML = 'Score: ' + score
  gameSpeed = 1000 / slider.value
  speedValue.innerHTML = 'Speed: ' + slider.value
}

function update () {
  if (currDirection.x != 0 || currDirection.y != 0) {
    console.log('    Updating')

    if (gameOver) {
      // alert('Game Over')
      reset()
      return
    }

    // Background of a Game
    context.fillStyle = boardColor
    context.fillRect(0, 0, board.width, board.height)

    // update eated food
    for (let n = 0; n < food_eated.length; n++) {
      food_eated[n] += 2
      if (food_eated[n] > snakeBody.length - 2) {
        food_eated.pop()
      }
    }

    head.x += currDirection.x * blockSize //updating Snake position in X coordinate.
    head.y += currDirection.y * blockSize //updating Snake position in Y coordinate.

    snakeBody.unshift([head.x, head.y]) //moves the head to the next position
    if (head.x == food.x && head.y == food.y) {
      //It´s eating food
      score += 1
      scoreBoard.innerHTML = 'Score: ' + score
      if (boardSize > snakeBody.length) {
        food_eated.unshift(-1)
        newFoodPosition()
        drawFood()
      } else {
        alert('WIIIN')
        reset()
        return
      }
    } else {
      snakeBody.pop() //moves the tale
    }

    drawSnakeBody()
    drawFood()
    // Check if head is Out of bound conditionv
    if (
      head.x < 0 ||
      head.x >= boardCols * blockSize ||
      head.y < 0 ||
      head.y >= boardRows * blockSize
    ) {
      console.log('Game Over board')
      gameOver = true
      return
    }
    // Check if head is Snake eats own body
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x == snakeBody[i][0] && head.y == snakeBody[i][1]) {
        // drawEyes()
        console.log('Game Over body')
        gameOver = true
        drawSnakeHead()
        return
      }
    }

    if (switchOnOff.checked) {
      // Computes next move
      // alert("SI IA")
      agent()
    } else {
      // alert("NO IA")
    }
  }
}

/**Manual Movement of the Snake whit addEventListener*/
function changeDirection (e) {
  console.log('Changing Direction')
  if (e.code == 'ArrowUp' && snakeBody[1][1] != head.y - blockSize) {
    // If up arrow key pressed with this condition...
    // snake will not move in the opposite direction
    // console.log('changeDirection UP')
    pressArrows(arrowUp)
    currDirection = directions.up
  } else if (e.code == 'ArrowDown' && snakeBody[1][1] != head.y + blockSize) {
    //If down arrow key pressed
    // console.log('changeDirection DOWN')
    pressArrows(arrowDown)
    currDirection = directions.down
  } else if (e.code == 'ArrowLeft' && snakeBody[1][0] != head.x - blockSize) {
    //If left arrow key pressed
    // console.log('changeDirection LEFT')
    pressArrows(arrowLeft)
    currDirection = directions.left
  } else if (e.code == 'ArrowRight' && snakeBody[1][0] != head.x + blockSize) {
    //If Right arrow key pressed
    // console.log('changeDirection RIGHT')
    pressArrows(arrowRight)
    currDirection = directions.right
  }
}

function ButtonMousedown (e) {
  /** @type {CanvasRenderingContext2D} */
  var context = e.target.getContext('2d')
  console.log(
    'padding',
    parseInt(
      window.getComputedStyle(controls, null).getPropertyValue('padding-left')
    )
  )
  var coordX =
    e.offsetX -
    parseInt(
      window.getComputedStyle(controls, null).getPropertyValue('padding-left')
    )
  var coordY =
    e.offsetY -
    parseInt(
      window.getComputedStyle(controls, null).getPropertyValue('padding-left')
    )

  var keyCode={}

  if (
    context.isPointInPath(buttonDown, coordX, coordY) ||
    context.isPointInPath(arrowDown, coordX, coordY)
  ) {
    pressArrows(arrowDown)
    keyCode.code = 'ArrowDown'
    changeDirection(keyCode)
    return
  }
  if (
    context.isPointInPath(buttonLeft, coordX, coordY) ||
    context.isPointInPath(arrowLeft, coordX, coordY)
  ) {
    pressArrows(arrowLeft)
    keyCode.code = 'ArrowLeft'
    changeDirection(keyCode)
    return
  }
  if (
    context.isPointInPath(buttonUp, coordX, coordY) ||
    context.isPointInPath(arrowUp, coordX, coordY)
  ) {
    pressArrows(arrowUp)
    keyCode.code = 'ArrowUp'
    changeDirection(keyCode)
    return
  }
  if (
    context.isPointInPath(buttonRight, coordX, coordY) ||
    context.isPointInPath(arrowRight, coordX, coordY)
  ) {
    pressArrows(arrowRight)
    keyCode.code = 'ArrowRight'
    changeDirection(keyCode)
    return
  }
}

function changeSpeed (e) {
  gameSpeed = 1000 / e.target.value
  console.log('speed', this.value)
  clearInterval(myInterval)
  // liberar nuestro inervalId de la variable
  // myInterval = null;
  myInterval = setInterval(update, gameSpeed)
  speedValue.innerHTML = 'Speed: ' + this.value
}
function pressArrows (arrow) {
  contextControls.strokeStyle = 'white'
  contextControls.stroke(arrow)
}
