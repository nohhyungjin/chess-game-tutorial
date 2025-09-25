import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveLog, setMoveLog] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  // 로컬스토리지에서 설명 불러오기
  useEffect(() => {
    const savedDescriptions = localStorage.getItem("chess-descriptions");
    if (savedDescriptions) {
      setDescriptions(JSON.parse(savedDescriptions));
    }
  }, []);

  // 설명이 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("chess-descriptions", JSON.stringify(descriptions));
  }, [descriptions]);

  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

        if (move) {
          const newGame = new Chess(game.fen());
          setGame(newGame);

          // 턴 단위로 moveLog 업데이트
          setMoveLog((prev) => {
            const newMoveLog = [...prev];

            if (move.color === "w") {
              // 백이 두면: 항상 새로운 턴 추가
              const currentTurn = newMoveLog.length + 1;
              newMoveLog.push({
                number: currentTurn,
                white: move.san,
                black: null,
              });
            } else {
              // 흑이 두면: 마지막 턴에 black 채워넣기
              if (newMoveLog.length === 0) {
                // 예외: 흑이 먼저 두는 경우
                newMoveLog.push({
                  number: 1,
                  white: null,
                  black: move.san,
                });
              } else {
                const lastTurn = newMoveLog[newMoveLog.length - 1];
                if (lastTurn.black === null) {
                  // 정상: 마지막 턴에 흑 추가
                  lastTurn.black = move.san;
                } else {
                  // ❗️문제: 이미 black이 있는데 또 흑 두면? → 새 턴 (비정상)
                  // 이걸 막기 위해 새 턴을 추가하지 않음!
                  console.warn("Unexpected black move; lastTurn already has black");
                }
              }
            }

            return newMoveLog;
          });

          // 현재 수에 대한 설명 저장 (FEN과 SAN을 키로 사용)
          const fenTag = `fen::${move.san}`;
          const moveDescription = {
            fen: newGame.fen(),
            san: move.san,
            color: move.color,
          };

          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game]
  );

  const resetGame = useCallback(() => {
    setGame(new Chess());
    setMoveLog([]);
  }, []);

  const getGameStatus = useCallback(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) return "Checkmate!";
      if (game.isDraw()) return "Draw!";
      if (game.isStalemate()) return "Stalemate!";
      return "Game Over!";
    }
    if (game.inCheck()) return "Check!";
    return `${game.turn() === "w" ? "White" : "Black"} to move`;
  }, [game]);

  const generatePGNString = useCallback(() => {
    return moveLog
      .map((turn) => {
        let pgn = `${turn.number}.`;

        // 백의 수
        if (turn.white) {
          pgn += ` ${turn.white}`;
        }

        // 흑의 수 (백의 수가 있으면 흑의 수는 같은 줄에 붙여서 출력)
        if (turn.black) {
          pgn += ` ${turn.black}`;
        }

        return pgn;
      })
      .filter((move) => move)
      .join(" ");
  }, [moveLog]);

  // 현재 수에 대한 설명 가져오기
  const getCurrentMoveDescription = useCallback(() => {
    if (moveLog.length === 0) {
      return null;
    }

    const lastTurn = moveLog[moveLog.length - 1];
    const lastMove = lastTurn.black || lastTurn.white;
    
    if (!lastMove) {
      return null;
    }

    const fenTag = `fen::${lastMove}`;
    return descriptions[fenTag] || null;
  }, [moveLog, descriptions]);

  return {
    game,
    moveLog,
    onDrop,
    resetGame,
    getGameStatus,
    generatePGNString,
    getCurrentMoveDescription,
  };
};
