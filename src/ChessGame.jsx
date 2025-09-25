import { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveLog, setMoveLog] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [selectedMoveId, setSelectedMoveId] = useState("");
  const [inputDesc, setInputDesc] = useState("");

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
            const currentTurn = Math.ceil((newMoveLog.length + 1) / 2);

            if (move.color === "w") {
              // 백의 수
              if (
                newMoveLog.length === 0 ||
                newMoveLog[newMoveLog.length - 1].white
              ) {
                // 새로운 턴 시작
                newMoveLog.push({
                  number: currentTurn,
                  white: move.san,
                  black: null,
                });
              } else {
                // 현재 턴에 백의 수 추가
                newMoveLog[newMoveLog.length - 1].white = move.san;
              }
            } else {
              // 흑의 수
              if (
                newMoveLog.length === 0 ||
                newMoveLog[newMoveLog.length - 1].black
              ) {
                // 새로운 턴 시작
                newMoveLog.push({
                  number: currentTurn,
                  white: null,
                  black: move.san,
                });
              } else {
                // 현재 턴에 흑의 수 추가
                newMoveLog[newMoveLog.length - 1].black = move.san;
              }
            }

            return newMoveLog;
          });

          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game]
  );

  const resetGame = () => {
    setGame(new Chess());
    setMoveLog([]);
    setSelectedMoveId("");
    setInputDesc("");
  };

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) return "Checkmate!";
      if (game.isDraw()) return "Draw!";
      if (game.isStalemate()) return "Stalemate!";
      return "Game Over!";
    }
    if (game.inCheck()) return "Check!";
    return `${game.turn() === "w" ? "White" : "Black"} to move`;
  };

  // PGN 스타일 문자열 생성
  const generatePGNString = () => {
    return moveLog
      .map((turn) => {
        if (turn.white && turn.black) {
          return `${turn.number}. ${turn.white} ${turn.black}`;
        } else if (turn.white) {
          return `${turn.number}. ${turn.white}`;
        } else if (turn.black) {
          return `${turn.number}... ${turn.black}`;
        }
        return "";
      })
      .filter((move) => move)
      .join(" ");
  };

  // 수 클릭 핸들러
  const handleMoveClick = (turnNumber, color, san) => {
    const moveId = `${turnNumber}_${color}_${san}`;
    setSelectedMoveId(moveId);
    setInputDesc(descriptions[moveId] || "");
  };

  // 설명 저장
  const saveDescription = () => {
    if (selectedMoveId && inputDesc.trim()) {
      setDescriptions((prev) => ({
        ...prev,
        [selectedMoveId]: inputDesc.trim(),
      }));
      setInputDesc("");
    }
  };

  // Enter 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveDescription();
    }
  };

  // PGN 복사
  const copyPGN = () => {
    const pgnString = generatePGNString();
    navigator.clipboard.writeText(pgnString).then(() => {
      alert("PGN이 클립보드에 복사되었습니다!");
    });
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    gap: "20px",
    flexDirection: window.innerWidth < 768 ? "column" : "row",
  };

  const boardContainerStyle = {
    flex: 2,
    maxWidth: "600px",
  };

  const moveLogStyle = {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "15px",
  };

  const pgnStyle = {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#666",
    marginBottom: "15px",
    wordBreak: "break-all",
  };

  const moveListStyle = {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #eee",
    padding: "10px",
    marginBottom: "15px",
  };

  const moveItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  };

  const clickableMoveStyle = {
    color: "#2196f3",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const descriptionBoxStyle = {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginTop: "5px",
    fontSize: "12px",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "15px",
  };

  const smallButtonStyle = {
    padding: "4px 8px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "5px",
  };

  const statusStyle = {
    fontSize: "20px",
    marginBottom: "15px",
    textAlign: "center",
    color: game.inCheck() ? "#d32f2f" : "#333",
  };

  return (
    <div style={containerStyle}>
      <div style={boardContainerStyle}>
        <div style={statusStyle}>{getGameStatus()}</div>
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
          onClick={resetGame}
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1976d2")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2196f3")}
        >
          New Game
        </button>
      </div>

      <div style={moveLogStyle}>
        <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>Move History</h2>

        {/* PGN 스타일 문자열 표시 */}
        <div style={pgnStyle}>
          <strong>PGN:</strong> {generatePGNString() || "No moves yet"}
          {generatePGNString() && (
            <button onClick={copyPGN} style={smallButtonStyle}>
              복사
            </button>
          )}
        </div>

        {/* 턴 리스트 */}
        <div style={moveListStyle}>
          {moveLog.length > 0 ? (
            moveLog.map((turn, index) => (
              <div key={index} style={moveItemStyle}>
                <div>
                  <strong>{turn.number}.</strong>
                  {turn.white && (
                    <span
                      style={clickableMoveStyle}
                      onClick={() =>
                        handleMoveClick(turn.number, "white", turn.white)
                      }
                    >
                      {turn.white}
                    </span>
                  )}
                  {turn.black && (
                    <span>
                      {" "}
                      <span
                        style={clickableMoveStyle}
                        onClick={() =>
                          handleMoveClick(turn.number, "black", turn.black)
                        }
                      >
                        {turn.black}
                      </span>
                    </span>
                  )}
                </div>

                {/* 백의 수 설명 */}
                {turn.white &&
                  descriptions[`${turn.number}_white_${turn.white}`] && (
                    <div style={descriptionBoxStyle}>
                      <strong>백 {turn.white}:</strong>{" "}
                      {descriptions[`${turn.number}_white_${turn.white}`]}
                    </div>
                  )}

                {/* 흑의 수 설명 */}
                {turn.black &&
                  descriptions[`${turn.number}_black_${turn.black}`] && (
                    <div style={descriptionBoxStyle}>
                      <strong>흑 {turn.black}:</strong>{" "}
                      {descriptions[`${turn.number}_black_${turn.black}`]}
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No moves yet
            </div>
          )}
        </div>

        {/* 설명 입력 영역 */}
        <div>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
            수에 대한 설명
          </h3>
          <input
            type="text"
            value={inputDesc}
            onChange={(e) => setInputDesc(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedMoveId
                ? `${selectedMoveId}에 대한 설명을 입력하세요`
                : "수를 선택하세요"
            }
            disabled={!selectedMoveId}
            style={{
              ...inputStyle,
              backgroundColor: selectedMoveId ? "#fff" : "#f5f5f5",
              cursor: selectedMoveId ? "text" : "not-allowed",
            }}
          />
          <button
            onClick={saveDescription}
            disabled={!selectedMoveId || !inputDesc.trim()}
            style={{
              ...buttonStyle,
              backgroundColor:
                selectedMoveId && inputDesc.trim() ? "#4caf50" : "#ccc",
              cursor:
                selectedMoveId && inputDesc.trim() ? "pointer" : "not-allowed",
              marginTop: "0",
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
