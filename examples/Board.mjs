export class Board {
  constructor() {
    const makeRow = () => {
      const row = []
      for (let x = 0; x < 8; x++) row.push(this.pickRandomColor())
      return row
    }

    const makeBoard = () => {
      const rows = []
      for (let y = 0; y < 8; y++) rows.push(makeRow())
      return rows
    }

    this.colors = ["#2f2", "white", "#22f", "#f22"]

    do {
      this.board = makeBoard()
    } while (this.findMatches().length > 0)
  }

  pickRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)]
  }

  getTile(x, y) {
    return this.board[y][x]
  }

  setTile(x, y, color) {
    this.board[y][x] = color
  }

  removeTile(x, y) {
    this.setTile(x, y, null)
  }

  swapTiles(x1, y1, x2, y2) {
    const temp = this.getTile(x1, y1)
    this.setTile(x1, y1, this.getTile(x2, y2))
    this.setTile(x2, y2, temp)
  }

  findMatchAt(x, y) {
    const color = this.getTile(x, y)

    if (color) {
      {
        /* find horizontal match */
        let match = []
        for (let sx = x; sx < 8; sx++) {
          if (this.getTile(sx, y) == color) match.push([sx, y])
          else break
        }
        if (match.length >= 3) return match
      }

      {
        /* find vertical match */
        let match = []
        for (let sy = y; sy < 8; sy++) {
          if (this.getTile(x, sy) == color) match.push([x, sy])
          else break
        }
        if (match.length >= 3) return match
      }
    }
  }

  findMatches() {
    const matches = []

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const match = this.findMatchAt(x, y)
        if (match) matches.push(match)
      }
    }

    return matches
  }

  clearMatch(match) {
    for (const position of match) {
      this.removeTile(position[0], position[1])
    }
  }

  clearAllMatches() {
    let matches
    do {
      matches = this.findMatches()
      for (const match of matches) {
        this.clearMatch(match)
      }
      this.applyGravity()
    } while (matches.length > 0)
  }

  applyGravity() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        while (this.getTile(x, y) === null) {
          /* Shift everything else down */
          for (let sy = y; sy < 7; sy++) {
            this.swapTiles(x, sy, x, sy + 1)
          }

          /* Create a new tile at the top */
          this.setTile(x, 7, this.pickRandomColor())
        }
      }
    }
  }
}
