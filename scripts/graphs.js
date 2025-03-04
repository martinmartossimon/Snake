/**Randomly place food*/
function newFoodPosition () {
  // console.log('newFoodPosition')
  if (boardSize > snakeBody.length) {
    while (true) {
      food.x = Math.floor(Math.random() * boardCols) * blockSize
      food.y = Math.floor(Math.random() * boardRows) * blockSize
      if (isPointInArray(snakeBody, food)) {
        // food on snake body
      } else {
        break
      }
    }
  }
}

/** Draws the food*/
function drawFood () {
  // console.log('        Drawing food')
  gameContext.fillStyle = 'red'
  gameContext.beginPath()
  gameContext.arc(
    food.x + blockSize / 2,
    food.y + blockSize / 2,
    blockSize / 2,
    0,
    2 * Math.PI
  )
  gameContext.fill()

  drawReflection(food.x + blockSize / 2, food.y + blockSize / 2, blockSize / 2)

  //leaf of the food
  gameContext.fillStyle = 'rgb(60 253 21)'
  gameContext.beginPath()
  gameContext.ellipse(
    food.x + blockSize / 2,
    food.y - blockSize / 6,
    blockSize / 6.5,
    blockSize / 18,
    Math.PI / 2,
    0,
    2 * Math.PI
  )
  gameContext.fill()
}

/**Draws light reflection on the surface*/
function drawReflection (centerX, centerY, radius) {
  gameContext.fillStyle = 'white'
  gameContext.beginPath()
  gameContext.arc(
    centerX - radius / 3.5,
    centerY - radius / 3.5,
    radius / 2.5,
    0,
    2 * Math.PI
  )
  gameContext.fill()
}

/** Color of body part */
function bodyColor (variation, i) {
  color = `rgb(${255 - variation * (i + 1)} ${255 - variation * (i + 1)} 255`
  return color
}

/** Color of the circle in body part */
function circColor (variation, i) {
  color = `rgb(${255 - variation * (i + 1)} ${variation * (i + 1)} ${
    255 - variation * (i + 1)
  }`
  return color
}

/**Draws the snake body and food in belly with its reflection */
function drawSnakeBody () {
  // console.log('        Dwawing snake body')
  let minSize = 0.6
  let minMargin = 0.2
  let size
  let variation = 255 / snakeBody.length

  for (let i = 0; i < snakeBody.length; i++) {
    let bodyPartColor = bodyColor(variation, i)
    size = 1 - i * 0.1
    if (i > 0) {
      //body part
      gameContext.fillStyle = bodyPartColor
      gameContext.fillRect(snakeBody[i].x, snakeBody[i].y, blockSize, blockSize)
      //body partcircle
      gameContext.fillStyle = circColor(variation, i)
      if (snakeBody.length - i <= 3) {
        // Tale
        minSize -= 0.1
        minMargin += 0.05
        gameContext.fillStyle = 'rgb(253 83 21)'
        gameContext.fillRect(
          snakeBody[i].x + blockSize * minMargin,
          snakeBody[i].y + blockSize * minMargin,
          blockSize * minSize,
          blockSize * minSize
        )
      } else {
        // body (not tale)
        if (food_eated.indexOf(i) >= 0) {
          //food in the belly
          size = 1
        }
        gameContext.beginPath()
        gameContext.arc(
          snakeBody[i].x + blockSize / 2,
          snakeBody[i].y + blockSize / 2,
          (blockSize * Math.max(size, minSize)) / 2,
          0,
          2 * Math.PI
        )
        gameContext.fill()

        if (size == 1) {
          //food in the belly
          drawReflection(
            snakeBody[i].x + blockSize / 2,
            snakeBody[i].y + blockSize / 2,
            blockSize / 2
          )
        }
      }
    } else {
      neckColor = bodyPartColor
    }
  }
  drawSnakeHead()
}

/** Draws the snake face, neck and eyes*/
function drawSnakeHead () {
  // console.log('        Drawing head')

  let pupilSize = 0.14
  let irisSize = 0.2
  let eyeSeparation = 0
  let neckX
  let neckY
  let neckWidth
  let neckHeight
  let eyeRX
  let eyeRY
  let eyeLX
  let eyeLY
  if (food_eated.length > 0 && food_eated[0] == -1) {
    //eating food
    pupilSize *= 1.7
    irisSize *= 1.5
    eyeSeparation = 0.075
  }
  switch (currDirection) {
    case directions.up:
      // coeyeLXnsole.log('            eyes up')
      eyeRX = 0.3 - eyeSeparation
      eyeRY = 0.3
      eyeLX = 0.7 + eyeSeparation
      eyeLY = 0.3
      neckX = snakeBody[0].x
      neckY = snakeBody[0].y + blockSize / 2
      neckWidth = blockSize
      neckHeight = blockSize / 2
      break
    case directions.down:
      // console.log('            eyes down')
      eyeRX = 0.7 + eyeSeparation
      eyeRY = 0.7
      eyeLX = 0.3 - eyeSeparation
      eyeLY = 0.7
      neckX = snakeBody[0].x
      neckY = snakeBody[0].y
      neckWidth = blockSize
      neckHeight = blockSize / 2
      break
    case directions.left:
      // console.log('            eyes left')
      eyeRX = 0.3
      eyeRY = 0.7 + eyeSeparation
      eyeLX = 0.3
      eyeLY = 0.3 - eyeSeparation
      neckX = snakeBody[0].x + blockSize / 2
      neckY = snakeBody[0].y
      neckWidth = blockSize / 2
      neckHeight = blockSize
      break
    case directions.right:
      // console.log('            eyes right')
      eyeRX = 0.7
      eyeRY = 0.3 - eyeSeparation
      eyeLX = 0.7
      eyeLY = 0.7 + eyeSeparation
      neckX = snakeBody[0].x
      neckY = snakeBody[0].y
      neckWidth = blockSize / 2
      neckHeight = blockSize
      break
    default:
      // console.log('            eyes default')
      eyeRX = 0.3 - eyeSeparation
      eyeRY = 0.3
      eyeLX = 0.7 + eyeSeparation
      eyeLY = 0.3
      neckX = snakeBody[0].x
      neckY = snakeBody[0].y + blockSize / 2
      neckWidth = blockSize
      neckHeight = blockSize / 2
      break
  }
  // Drawing neck
  gameContext.fillStyle = neckColor
  gameContext.fillRect(neckX, neckY, neckWidth, neckHeight)

  // face
  gameContext.fillStyle = 'rgb(253 83 21)'
  gameContext.beginPath()
  gameContext.arc(
    head.x + blockSize / 2,
    head.y + blockSize / 2,
    blockSize / 2,
    0,
    2 * Math.PI
  )
  gameContext.fill()

  drawEye(eyeRX, eyeRY, irisSize, pupilSize)
  drawEye(eyeLX, eyeLY, irisSize, pupilSize)
}

/**Draws an eye*/
function drawEye (eyeX, eyeY, irisSize, pupilSize) {
  //iris
  gameContext.fillStyle = 'rgb(247 244 22)'
  gameContext.beginPath()
  gameContext.arc(
    head.x + blockSize * eyeX,
    head.y + blockSize * eyeY,
    blockSize * irisSize,
    0,
    2 * Math.PI
  )
  gameContext.fill()

  //Pupil
  gameContext.fillStyle = 'black'
  gameContext.beginPath()
  gameContext.arc(
    head.x + blockSize * eyeX,
    head.y + blockSize * eyeY,
    blockSize * pupilSize,
    0,
    2 * Math.PI
  )
  gameContext.fill()

  drawReflection(
    head.x + blockSize * eyeX,
    head.y + blockSize * eyeY,
    blockSize * irisSize
  )
}

/**Draws the control buttons*/
function drawControls () {
  let centerX = controls.width / 2
  let centerY = controls.height / 2
  let buttonSize = controls.width / 4

  drawButton(buttonDown, centerX, centerY, 'rgb(244 87 87)', 45, 135)
  drawButton(buttonLeft, centerX, centerY, 'rgb(88 152 243)', 135, 225)
  drawButton(buttonUp, centerX, centerY, 'rgb(82 243 98)', 225, 315)
  drawButton(buttonRight, centerX, centerY, 'rgb(243 208 82)', 315, 45)

  contextControls.lineWidth = buttonSize / 5

  drawArrow(
    arrowUp,
    centerX - buttonSize * 0.7,
    centerY - buttonSize,
    centerX,
    centerY - buttonSize * 1.7,
    centerX + buttonSize * 0.7,
    centerY - buttonSize
  )
  drawArrow(
    arrowDown,
    centerX + buttonSize * 0.7,
    centerY + buttonSize,
    centerX,
    centerY + buttonSize * 1.7,
    centerX - buttonSize * 0.7,
    centerY + buttonSize
  )
  drawArrow(
    arrowRight,
    centerX + buttonSize,
    centerY + buttonSize * 0.7,
    centerX + buttonSize * 1.7,
    centerY,
    centerX + buttonSize,
    centerY - buttonSize * 0.7
  )
  drawArrow(
    arrowLeft,
    centerX - buttonSize,
    centerY + buttonSize * 0.7,
    centerX - buttonSize * 1.7,
    centerY,
    centerX - buttonSize,
    centerY - buttonSize * 0.7
  )
}

/** Paint the control arrows in black */
function resetArrows () {
  console.log('resetArrows')
  contextControls.strokeStyle = 'black'
  contextControls.stroke(arrowUp)
  contextControls.stroke(arrowDown)
  contextControls.stroke(arrowLeft)
  contextControls.stroke(arrowRight)
}

/**Draw a button */
function drawButton (button, centerX, centerY, color, start, end) {
  button.moveTo(centerX, centerY)
  button.arc(
    centerX,
    centerY,
    controls.width * 0.5,
    toRadians(start),
    toRadians(end)
  )
  button.lineTo(centerX, centerY)
  button.closePath()
  contextControls.fillStyle = color
  contextControls.fill(button)
}

/**Draw a button arrow */
function drawArrow (arrow, startX, startY, centerX, centerY, endX, endY) {
  arrow.moveTo(startX, startY)
  arrow.lineTo(centerX, centerY)
  arrow.lineTo(endX, endY)
  contextControls.closePath()
  contextControls.strokeStyle = 'black'
  contextControls.stroke(arrow)
}

/**Convert degrees to radians*/
function toRadians (deg) {
  return (deg * Math.PI) / 180
}
/**Draws game messages texts in the board*/
function drawBoardMessage (text) {
  let fontSize
  let textColor
  let top
  if (text.length < 10) {
    fontSize = board.width / 6
    gameContext.lineWidth = blockSize / 8
    top = (board.height + fontSize / 2) / 2
    textColor = 'black'
  } else {
    fontSize = board.width / 15
    gameContext.lineWidth = 1
    top = fontSize * 2
    textColor = 'yellow'
  }
  gameContext.font = `${fontSize}px sans-serif`
  gameContext.textAlign = 'center'

  gameContext.strokeStyle = 'yellow'
  gameContext.strokeText(text, board.width / 2, top)

  gameContext.fillStyle = textColor
  gameContext.fillText(text, board.width / 2, top)
}
