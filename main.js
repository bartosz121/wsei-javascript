const gameBoard = document.getElementById("game-board")
const endGameDiv = document.getElementById("end-game")
const endGameScore = document.getElementById("end-game-score")
const gameScore = document.getElementById("game-info-score")
const newGameBtn = document.getElementById("new-game-btn")

class Game {
  constructor() {
    const localStorageGameState = this.loadStateFromLocalStorage()
    if (localStorageGameState) {
      this.score = localStorageGameState.score
      this.playable = localStorageGameState.playable
      this.board = localStorageGameState.board
    } else {
      this.newGame()
    }
  }

  newGame() {
    this.playable = true;
    this.score = 0;
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    // on new game spawn two blocks
    this.spawnRandomBlock()
    this.spawnRandomBlock()

    this.renderGame()
    this.hideEndGame()

  }

  showEndGame() {
    gameBoard.classList.add("opacity-50")
    endGameDiv.classList.remove("invisible")
    endGameScore.innerText = this.score
  }

  hideEndGame() {
    gameBoard.classList.remove("opacity-50")
    endGameDiv.classList.add("invisible")
  }

  saveStateToLocalStorage() {
    localStorage.setItem("gameState", JSON.stringify({ board: this.board, playable: this.playable, score: this.score }))
  }

  loadStateFromLocalStorage() {
    let gameState = localStorage.getItem("gameState")
    if (gameState !== null) {
      return JSON.parse(gameState)
    }
    return gameState
  }


  removeGameBoardChildNodes() {
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild)
    }
  }

  renderBoard() {
    for (let i = 0; i < this.board.length; i++) {
      const row = document.createElement("div")
      row.classList = "game-row"
      for (let y = 0; y < this.board[i].length; y++) {
        const el = document.createElement("div")
        el.textContent = this.board[i][y];
        el.classList = `game-number block-${this.board[i][y] <= 2048 ? this.board[i][y] : "000"}`
        row.appendChild(el)
      }
      gameBoard.appendChild(row)
    }
  }

  renderScore() {
    gameScore.textContent = this.score;
  }

  renderGame() {
    this.removeGameBoardChildNodes()
    this.renderBoard()
    this.renderScore()

    if (!this.isMovePossible()) {
      this.playable = false
      this.showEndGame()
    }
  }

  handleKeydown(eventKey) {
    this.move(eventKey)
    this.spawnRandomBlock()
    this.saveStateToLocalStorage()
    this.renderGame()
  }

  isMovePossible() {
    if (this.board.flat().includes(0)) {
      return true
    }

    for (let y = 0; y < this.board.length; y++) {
      if (this.isMergeAvailable(this.board[y])) {
        return true;
      }

      let column = []
      for (let x = 0; x < this.board.length; x++) {
        column.push(this.board[x][y])
      }

      if (this.isMergeAvailable(column)) {
        return true;
      }
    }
  }

  getClearPositions() {
    let arr = []
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === 0) {
          arr.push([y, x])
        }
      }
    }
    return arr
  }

  spawnRandomBlock() {
    const positions = this.getClearPositions()
    if (positions.length) {
      let [y, x] = positions[Math.floor((Math.random() * positions.length))]
      this.board[y][x] = 2;
    }
  }

  addZeroes(arr, len, direction) {
    while (arr.length < len) {
      if (direction === "right" || direction == "down") {
        arr.unshift(0)
      } else {
        arr.push(0)
      }
    }
    return arr
  }

  move(key) {
    if (key == "ArrowLeft") {
      this.moveBoard("row", "left")
    } else if (key == "ArrowUp") {
      this.moveBoard("column", "up")
    } else if (key == "ArrowRight") {
      this.moveBoard("row", "right")
    } else if (key == "ArrowDown") {
      this.moveBoard("column", "down")
    }
  }

  moveBoard(type, direction) {
    for (let y = 0; y < this.board.length; y++) {
      let arr = [];

      if (type === "row") {
        arr = this.board[y]
        this.board[y] = this.combineBlocksArray(arr, direction)
      } else {
        for (let x = 0; x < this.board.length; x++) {
          arr.push(this.board[x][y])
        }
        this.combineBlocksArray(arr, direction).forEach((n, i) => {
          this.board[i][y] = n
        });
      }
    }
  }

  /**
   * @param {string} direction - 'up'/'down'/'left'/'right'
   * First removes zeroes from array, goes over the numbers left
   * from left/right using reduce until any merges are not available
   * and then adds missing zeroes
   */
  combineBlocksArray(arr, direction) {
    let rowsWithoutZeros = arr.filter(n => n !== 0)

    if (direction === "right" || direction === "down") {
      rowsWithoutZeros.reverse()
    }


    while (this.isMergeAvailable(rowsWithoutZeros)) {
      let calculatedRow = []
      let last = rowsWithoutZeros.reduce((p, c) => {
        if (c === p) {
          this.score += c + p
          return c + p
        }
        calculatedRow.push(p)
        return c
      })
      calculatedRow.push(last)

      rowsWithoutZeros = calculatedRow
    }
    if (direction === "right" || direction === "down") {
      rowsWithoutZeros.reverse()
    }
    return this.addZeroes(rowsWithoutZeros, arr.length, direction)
  }

  isMergeAvailable(arr) {
    if (!arr.length || arr.length === 1) {
      return false;
    }

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        return true;
      }
    }

    return false;
  }

}


window.onload = () => {
  const game = new Game();

  game.renderGame()


  document.addEventListener("keydown", (event) => {
    game.handleKeydown(event.key);
  })

  newGameBtn.addEventListener("click", (event) => {
    game.newGame()
  })
}