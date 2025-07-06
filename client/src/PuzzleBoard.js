import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  generateGoalBoard,
  generateRandomBoard,
  isGoal,
  move,
  manhattanDistance,
  getHint,
} from "./puzzleLogic";

const BOARD_SIZE = 5;

function deepCopy(board) {
  return board.map(row => row.slice());
}

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/Usman-Ifty" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/usman-awan-a85877359/" },
  { name: "Instagram", url: "https://instagram.com/ifty.reels" },
];

const TECHNOLOGIES = ["MongoDB", "Express.js", "React.js", "Node.js"];

const PuzzleBoard = () => {
  const [goalBoard, setGoalBoard] = useState(generateGoalBoard());
  const [board, setBoard] = useState(generateRandomBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [paused, setPaused] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const timerRef = useRef();

  // Splash screen animation
  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!paused && !gameWon) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [startTime, paused, gameWon]);

  useEffect(() => {
    if (isGoal(board, goalBoard)) {
      setGameWon(true);
      clearInterval(timerRef.current);
      showNotification("🎉 Congratulations! You solved the puzzle!", "success");
    }
  }, [board, goalBoard]);

  // Notification helper
  const showNotification = (msg, type = "info") => {
    setNotification(msg);
    setNotificationType(type);
    setTimeout(() => {
      setNotification("");
      setNotificationType("");
    }, 2500);
  };

  // Handle keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon || paused) return;
      let dir = null;
      if (e.key === "ArrowUp") dir = "up";
      if (e.key === "ArrowDown") dir = "down";
      if (e.key === "ArrowLeft") dir = "left";
      if (e.key === "ArrowRight") dir = "right";
      if (dir) {
        const newBoard = move(board, dir);
        if (newBoard) {
          setBoard(newBoard);
          setMoveCount(m => m + 1);
          showNotification(`Moved ${dir.toUpperCase()}`);
        } else {
          showNotification("Illegal move!", "error");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameWon, paused]);

  // Start a new random game
  const handleNewGame = () => {
    setGoalBoard(generateGoalBoard());
    setBoard(generateRandomBoard());
    setMoveCount(0);
    setStartTime(Date.now());
    setElapsed(0);
    setGameWon(false);
    setPaused(false);
    showNotification("Started a new random game!", "success");
  };

  // Start an easy game (1 move away)
  const handleEasyGame = () => {
    const goal = generateGoalBoard();
    let easy = deepCopy(goal);
    [easy[4][3], easy[4][4]] = [easy[4][4], easy[4][3]];
    setGoalBoard(goal);
    setBoard(easy);
    setMoveCount(0);
    setStartTime(Date.now());
    setElapsed(0);
    setGameWon(false);
    setPaused(false);
    showNotification("Started an easy game!", "success");
  };

  // Pause/resume
  const handlePause = () => {
    setPaused(true);
    showNotification("Game paused.", "info");
  };
  const handleResume = () => {
    setPaused(false);
    setStartTime(Date.now() - elapsed * 1000);
    showNotification("Game resumed!", "success");
  };

  // Save game to backend
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/save", {
        board,
        goalBoard,
        moveCount,
        elapsed
      });
      showNotification("Game saved!", "success");
    } catch (err) {
      showNotification("Failed to save game.", "error");
    }
  };

  // Load game from backend
  const handleLoad = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/load");
      if (res.data.success) {
        setBoard(res.data.game.board);
        setGoalBoard(res.data.game.goalBoard);
        setMoveCount(res.data.game.moveCount);
        setElapsed(res.data.game.elapsed);
        setStartTime(Date.now() - res.data.game.elapsed * 1000);
        setGameWon(isGoal(res.data.game.board, res.data.game.goalBoard));
        setPaused(false);
        showNotification("Game loaded!", "success");
      } else {
        showNotification("No saved game found.", "error");
      }
    } catch (err) {
      showNotification("Failed to load game.", "error");
    }
  };

  // Handle tile click
  const handleTileClick = (i, j) => {
    if (gameWon || paused) return;
    const { row, col } = board.reduce(
      (acc, rowArr, rowIdx) => {
        const colIdx = rowArr.indexOf(0);
        if (colIdx !== -1) return { row: rowIdx, col: colIdx };
        return acc;
      },
      { row: -1, col: -1 }
    );
    if (
      (Math.abs(i - row) === 1 && j === col) ||
      (Math.abs(j - col) === 1 && i === row)
    ) {
      let newBoard = deepCopy(board);
      newBoard[row][col] = newBoard[i][j];
      newBoard[i][j] = 0;
      setBoard(newBoard);
      setMoveCount(m => m + 1);
      showNotification(`Moved tile ${newBoard[row][col]}`);
    } else {
      showNotification("Illegal move!", "error");
    }
  };

  // Notification bar
  const notificationColors = {
    success: "#d4edda",
    error: "#f8d7da",
    info: "#cce5ff"
  };

  // Splash screen styles/animation
  const splashStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #22223b 60%, #ffe066 100%)',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: 2,
    opacity: showSplash ? 1 : 0,
    pointerEvents: showSplash ? 'auto' : 'none',
    transition: 'opacity 0.7s',
  };

  return (
    <div style={{ textAlign: "center", marginTop: 30, fontFamily: 'Segoe UI, sans-serif', background: '#f6f8fa', minHeight: '100vh' }}>
      {/* Splash Screen */}
      {showSplash && (
        <div style={splashStyle}>
          <div style={{ fontSize: 54, marginBottom: 18, color: '#ffe066', textShadow: '2px 2px 8px #222' }}>
            The 5x5 Puzzle Game
          </div>
          <div style={{ fontSize: 28, marginBottom: 30, color: '#fff', fontWeight: 400 }}>
            Powered by
            <span style={{ color: '#ffe066', marginLeft: 10 }}>
              {TECHNOLOGIES.join("  |  ")}
            </span>
          </div>
          <div style={{ fontSize: 20, color: '#fff', marginTop: 20 }}>
            Loading...
          </div>
        </div>
      )}

      {/* Header with game name and socials */}
      <div style={{ background: '#22223b', color: '#fff', padding: '24px 0 10px 0', marginBottom: 30, boxShadow: '0 2px 8px #888' }}>
        <h1 style={{ margin: 0, fontSize: 38, letterSpacing: 2 }}>The 5x5 Puzzle Game</h1>
        <div style={{ marginTop: 8 }}>
          {SOCIALS.map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffe066',
                margin: '0 18px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: 18
              }}
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>

      {/* Notification bar */}
      {notification && (
        <div
          style={{
            background: notificationColors[notificationType] || '#cce5ff',
            color: '#222',
            padding: '12px 30px',
            borderRadius: 8,
            margin: '0 auto 18px auto',
            width: 340,
            fontWeight: 500,
            fontSize: 18,
            boxShadow: '0 2px 8px #bbb',
            border: '1px solid #bbb',
            transition: 'all 0.3s',
            zIndex: 10
          }}
        >
          {notification}
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={handleNewGame} style={buttonStyle}>New Random Game</button>
        <button onClick={handleEasyGame} style={{ ...buttonStyle, marginLeft: 10 }}>Easy Game (1 move away)</button>
        <button onClick={handleSave} style={{ ...buttonStyle, marginLeft: 10 }}>💾 Save Game</button>
        <button onClick={handleLoad} style={{ ...buttonStyle, marginLeft: 10 }}>🔄 Load Game</button>
        {!paused ? (
          <button onClick={handlePause} style={{ ...buttonStyle, marginLeft: 10, background: '#ffe066', color: '#22223b' }}>⏸ Pause</button>
        ) : (
          <button onClick={handleResume} style={{ ...buttonStyle, marginLeft: 10, background: '#38b000', color: '#fff' }}>▶ Resume</button>
        )}
      </div>
      <div style={{ fontSize: 20, marginBottom: 18 }}>
        <b>Moves:</b> {moveCount} &nbsp; | &nbsp;
        <b>Time:</b> {elapsed}s &nbsp; | &nbsp;
        <b>Manhattan Distance:</b> {manhattanDistance(board, goalBoard)}
        {paused && <span style={{ color: '#e85d04', marginLeft: 18, fontWeight: 600 }}>[Paused]</span>}
      </div>
      {/* Side-by-side boards */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 48, margin: '0 auto', marginBottom: 24 }}>
        {/* Main Board */}
        <div style={{ borderRadius: 16, boxShadow: '0 4px 24px #bbb', background: '#fff', padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, color: '#22223b' }}>Current Board</div>
          <table
            style={{
              borderCollapse: "collapse",
              background: "#222",
              boxShadow: "0 0 10px #888",
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <tbody>
              {board.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      onClick={() => handleTileClick(i, j)}
                      style={{
                        width: 64,
                        height: 64,
                        border: "2px solid #fff",
                        background: val === 0 ? "#adb5bd" : "#ffe066",
                        color: val === 0 ? "#adb5bd" : "#22223b",
                        fontSize: 28,
                        fontWeight: "bold",
                        cursor:
                          !paused && val !== 0 &&
                          ((Math.abs(i - board.findIndex(r => r.includes(0))) === 1 &&
                            j === board[board.findIndex(r => r.includes(0))].indexOf(0)) ||
                            (Math.abs(j - board[board.findIndex(r => r.includes(0))].indexOf(0)) === 1 &&
                              i === board.findIndex(r => r.includes(0))))
                            ? "pointer"
                            : "default",
                        transition: "background 0.2s, color 0.2s",
                        borderRadius: 10,
                        boxShadow: val !== 0 ? '0 2px 8px #ffe06655' : 'none',
                        userSelect: 'none',
                        opacity: paused ? 0.5 : 1,
                      }}
                    >
                      {val !== 0 ? val : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Goal Board */}
        <div style={{ borderRadius: 16, boxShadow: '0 4px 24px #bbb', background: '#fff', padding: 18, minWidth: 240 }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, color: '#22223b' }}>Goal Board</div>
          <table
            style={{
              borderCollapse: "collapse",
              background: "#222",
              boxShadow: "0 0 10px #888",
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <tbody>
              {goalBoard.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      style={{
                        width: 64,
                        height: 64,
                        border: "2px solid #fff",
                        background: val === 0 ? "#adb5bd" : "#b2f2ff",
                        color: val === 0 ? "#adb5bd" : "#22223b",
                        fontSize: 28,
                        textAlign: "center",
                        borderRadius: 10,
                        userSelect: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      {val !== 0 ? val : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 18 }}>
        <b>Hint:</b>{" "}
        {gameWon
          ? "You won! 🎉"
          : getHint(board, goalBoard)
          ? `Try moving tile ${getHint(board, goalBoard)}`
          : "You're almost there!"}
      </div>
      {gameWon && (
        <div style={{ marginTop: 36, color: "#38b000", fontSize: 26, fontWeight: 700 }}>
          🎉 Congratulations! You solved the puzzle in {moveCount} moves and {elapsed} seconds!
        </div>
      )}
      <div style={{ marginTop: 60, color: '#adb5bd', fontSize: 15 }}>
        &copy; {new Date().getFullYear()} The 5x5 Puzzle Game | Created by Muhammad Usman Awan
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#22223b',
  color: '#ffe066',
  border: 'none',
  borderRadius: 8,
  padding: '12px 22px',
  fontSize: 17,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #bbb',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
};

export default PuzzleBoard;
