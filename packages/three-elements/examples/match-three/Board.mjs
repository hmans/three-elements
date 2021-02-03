export const colors = ["#2f2", "#ddd", "#66f", "#f66"]

export const makeBoard = () => {
  const makeRow = () => {
    const row = []
    for (let x = 0; x < 8; x++) row.push(pickRandomColor())
    return row
  }

  const rows = []
  for (let y = 0; y < 8; y++) rows.push(makeRow())
  return rows
}

export const makeBoardWithoutMatches = () => {
  let board
  do {
    board = makeBoard()
  } while (findMatches(board).length > 0)

  return board
}

export const pickRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getTile = (board, x, y) => board[y][x]

export const setTile = (board, x, y, color) => {
  board = [...board]
  board[y][x] = color
  return board
}

export const removeTile = (board, x, y) => setTile(board, x, y, null)

export const swapTiles = (board, x1, y1, x2, y2) => {
  const temp = getTile(board, x1, y1)
  board = setTile(board, x1, y1, getTile(board, x2, y2))
  board = setTile(board, x2, y2, temp)
  return board
}

export const findMatchAt = (board, x, y) => {
  const color = getTile(board, x, y)

  if (color) {
    {
      /* find horizontal match */
      let match = []
      for (let sx = x; sx < 8; sx++) {
        if (getTile(board, sx, y) == color) match.push([sx, y])
        else break
      }
      if (match.length >= 3) return match
    }

    {
      /* find vertical match */
      let match = []
      for (let sy = y; sy < 8; sy++) {
        if (getTile(board, x, sy) == color) match.push([x, sy])
        else break
      }
      if (match.length >= 3) return match
    }
  }
}

export const findMatches = (board) => {
  const matches = []

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const match = findMatchAt(board, x, y)
      if (match) matches.push(match)
    }
  }

  return matches
}

export const clearMatch = (board, match) => {
  for (const position of match) {
    board = removeTile(board, position[0], position[1])
  }

  return board
}

export const clearAllMatches = (board) => {
  const matches = findMatches(board)

  for (const match of matches) {
    board = clearMatch(board, match)
  }

  return [board, matches]
}

export const applyGravity = (board) => {
  const updatedTiles = []

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (getTile(board, x, y) === null) {
        if (y < 7 && getTile(board, x, y + 1) != null) {
          board = swapTiles(board, x, y, x, y + 1)
        } else {
          board = setTile(board, x, y, pickRandomColor())
        }

        updatedTiles.push([x, y])
      }
    }
  }

  return [board, updatedTiles]
}
