const gameBoard = document.getElementById("game-board")
const gameScore = document.getElementById("game-info-score")
const newGameBtn = document.getElementById("new-game-btn")

class Game {
  constructor() {
    this.score = 0;
    this.board = [
      [0, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 2, 0],
    ];
  }

  _renderBoard() {
    for (let i = 0; i < this.board.length; i++) {
      const row = document.createElement("div")
      row.classList = "game-row"
      for (let y = 0; y < this.board[i].length; y++) {
        const el = document.createElement("div")
        el.textContent = this.board[i][y];
        el.classList = "game-number"
        row.appendChild(el)
      }
      gameBoard.appendChild(row)
    }
  }

  _renderScore() {
    gameScore.textContent = this.score;
  }

  renderGame() {
    this._renderBoard()
    this._renderScore()
  }
}


window.onload = () => {
  const game = new Game();

  game.renderGame()


  document.addEventListener("keydown", (event) => {
    game.move(event.key);
  })

  newGameBtn.addEventListener("click", (event) => {
    console.log("new game")
  })
}