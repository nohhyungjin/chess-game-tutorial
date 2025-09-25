import React from "react";
import { useChessGame } from "./hooks/useChessGame";
import { useMoveDescriptions } from "./hooks/useMoveDescriptions";
import ChessBoardContainer from "./components/ChessBoardContainer";
import MoveLog from "./components/MoveLog";
import MoveDescription from "./components/MoveDescription";

import "./styles/ChessGame.css";

const ChessGame = () => {
  const {
    game,
    moveLog,
    onDrop,
    resetGame,
    getGameStatus,
    generatePGNString,
    getCurrentMoveDescription,
  } = useChessGame();

  const {
    descriptions,
    selectedMoveId,
    inputDesc,
    setInputDesc,
    handleMoveClick,
    saveDescription,
    resetDescription,
    handleKeyPress,
  } = useMoveDescriptions();

  // 게임 리셋 시 설명도 초기화
  const handleResetGame = () => {
    resetGame();
    resetDescription();
  };

  // PGN 복사
  const copyPGN = () => {
    const pgnString = generatePGNString();
    navigator.clipboard.writeText(pgnString).then(() => {
      alert("PGN이 클립보드에 복사되었습니다!");
    });
  };

  // 현재 수에 대한 설명 가져오기
  const currentDescription = getCurrentMoveDescription();

  return (
    <div className="chess-game-container">
      <ChessBoardContainer
        game={game}
        onDrop={onDrop}
        gameStatus={getGameStatus()}
        onResetGame={handleResetGame}
      />

      <div className="move-log">
        <MoveLog
          moveLog={moveLog}
          descriptions={descriptions}
          onMoveClick={handleMoveClick}
          generatePGNString={generatePGNString}
          onCopyPGN={copyPGN}
        />

        <MoveDescription currentDescription={currentDescription} />
      </div>
    </div>
  );
};

export default ChessGame;
