const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// Variables
let player = 'X'
let isPauseGame = false
let isGameStart = false
let inputCells = Array(9).fill('')

// Win conditions
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6] // diagonals
]

// Event listeners
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handlePlayerMove(cell, index))
})

restartBtn.addEventListener('click', restartGame)

function handlePlayerMove(cell, index) {
  if (!isPauseGame && inputCells[index] === '') {
    isGameStart = true
    placeSymbol(cell, index, player)

    if (!checkWinner()) {
      switchPlayer()
      computerMove()
    }
  }
}

function placeSymbol(cell, index, symbol) {
  cell.textContent = symbol
  inputCells[index] = symbol

  // Neon glow per player
  if (symbol === 'X') {
    cell.style.color = '#00e6ff'
    cell.style.boxShadow = '0 0 12px #00e6ff, inset 0 0 8px #00e6ff55'
  } else {
    cell.style.color = '#ff37c7'
    cell.style.boxShadow = '0 0 12px #ff37c7, inset 0 0 8px #ff37c755'
  }
}

function switchPlayer() {
  player = (player === 'X') ? 'O' : 'X'
}

function computerMove() {
  isPauseGame = true
  setTimeout(() => {
    let emptyIndices = inputCells
      .map((val, idx) => val === '' ? idx : null)
      .filter(val => val !== null)

    if (emptyIndices.length === 0) return

    // Pick random empty spot
    let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
    placeSymbol(cells[randomIndex], randomIndex, player)

    if (!checkWinner()) {
      switchPlayer()
      isPauseGame = false
    }
  }, 700) // little delay for realism
}

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (
      inputCells[a] !== '' &&
      inputCells[a] === inputCells[b] &&
      inputCells[a] === inputCells[c]
    ) {
      highlightWinner([a, b, c])
      declareWinner(inputCells[a])
      return true
    }
  }

  // Draw check
  if (inputCells.every(cell => cell !== '')) {
    declareDraw()
    return true
  }
  return false
}

function highlightWinner(indices) {
  indices.forEach(i => {
    cells[i].style.animation = (inputCells[i] === 'X') 
      ? 'glowX 1s infinite alternate' 
      : 'glowO 1s infinite alternate'
  })
}

function declareWinner(winner) {
  titleHeader.textContent = `${winner} Wins!`
  titleHeader.style.textShadow = (winner === 'X')
    ? '0 0 15px #00e6ff88'
    : '0 0 15px #ff37c788'

  isPauseGame = true
  restartBtn.style.visibility = 'visible'
}

function declareDraw() {
  titleHeader.textContent = 'Draw!'
  titleHeader.style.textShadow = '0 0 12px #ffffff66'
  isPauseGame = true
  restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
  if (!isGameStart) {
    player = selectedPlayer
    if (player === 'X') {
      xPlayerDisplay.classList.add('player-active')
      oPlayerDisplay.classList.remove('player-active')
    } else {
      xPlayerDisplay.classList.remove('player-active')
      oPlayerDisplay.classList.add('player-active')
    }
  }
}

function restartGame() {
  inputCells.fill('')
  cells.forEach(cell => {
    cell.textContent = ''
    cell.style.boxShadow = ''
    cell.style.animation = ''
  })
  isPauseGame = false
  isGameStart = false
  player = 'X'
  titleHeader.textContent = 'Choose'
  titleHeader.style.textShadow = ''
  restartBtn.style.visibility = 'hidden'
}
