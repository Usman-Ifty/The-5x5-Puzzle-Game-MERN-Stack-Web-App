// puzzleLogic.js

// Generate a solved 5x5 board (goal state)
export function generateGoalBoard() {
  let board = [];
  let val = 1;
  for (let i = 0; i < 5; i++) {
    board[i] = [];
    for (let j = 0; j < 5; j++) {
      board[i][j] = val % 25;
      val++;
    }
  }
  return board;
}

// Generate a random 5x5 board
export function generateRandomBoard() {
  let arr = Array.from({ length: 25 }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  let board = [];
  for (let i = 0; i < 5; i++) {
    board[i] = arr.slice(i * 5, i * 5 + 5);
  }
  return board;
}

// Check if two boards are equal (goal check)
export function isGoal(board, goal) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] !== goal[i][j]) return false;
    }
  }
  return true;
}

// Find the position of the empty tile (0)
export function findEmpty(board) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] === 0) return { row: i, col: j };
    }
  }
  return null;
}

// Move the empty tile in the given direction if possible
export function move(board, direction) {
  const { row, col } = findEmpty(board);
  let newBoard = board.map(row => row.slice());
  let targetRow = row, targetCol = col;
  if (direction === 'up' && row > 0) targetRow--;
  else if (direction === 'down' && row < 4) targetRow++;
  else if (direction === 'left' && col > 0) targetCol--;
  else if (direction === 'right' && col < 4) targetCol++;
  else return null; // Illegal move

  // Swap
  newBoard[row][col] = newBoard[targetRow][targetCol];
  newBoard[targetRow][targetCol] = 0;
  return newBoard;
}

// Manhattan distance between current and goal board
export function manhattanDistance(board, goal) {
  let dist = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let val = board[i][j];
      if (val === 0) continue;
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          if (goal[x][y] === val) {
            dist += Math.abs(i - x) + Math.abs(j - y);
          }
        }
      }
    }
  }
  return dist;
}

// Give a hint: find a tile not in place
export function getHint(board, goal) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] !== 0 && board[i][j] !== goal[i][j]) {
        return board[i][j];
      }
    }
  }
  return null;
}
