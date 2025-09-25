import React from "react";
import { Chessboard } from "react-chessboard";

const ChessBoardContainer = ({ 
  game, 
  onDrop, 
  gameStatus, 
  onResetGame 
}) => {
  return (
    <div className="board-container">
      <div className={`game-status ${game.inCheck() ? "check" : ""}`}>
        {gameStatus}
      </div>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779952" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
      />
      <button
        onClick={onResetGame}
        className="reset-button"
      >
        New Game
      </button>
    </div>
  );
};

export default ChessBoardContainer;
