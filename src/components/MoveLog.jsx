import React from "react";

const MoveLog = ({ 
  moveLog, 
  descriptions, 
  onMoveClick, 
  generatePGNString, 
  onCopyPGN 
}) => {
  return (
    <div className="move-log">
      <h2 className="move-log-title">Move History</h2>

      {/* PGN 스타일 문자열 표시 */}
      <div className="pgn-display">
        <strong>PGN:</strong> {generatePGNString() || "No moves yet"}
        {generatePGNString() && (
          <button onClick={onCopyPGN} className="copy-button">
            복사
          </button>
        )}
      </div>

      {/* 턴 리스트 */}
      <div className="move-list">
        {moveLog.length > 0 ? (
          moveLog.map((turn, index) => (
            <div key={index} className="move-item">
              <div>
                <strong>{turn.number}.</strong>
                {turn.white && (
                  <span
                    className="clickable-move"
                    onClick={() =>
                      onMoveClick(turn.number, "white", turn.white)
                    }
                  >
                    {turn.white}
                  </span>
                )}
                {turn.black && (
                  <span>
                    {" "}
                    <span
                      className="clickable-move"
                      onClick={() =>
                        onMoveClick(turn.number, "black", turn.black)
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
                  <div className="description-box">
                    <strong>백 {turn.white}:</strong>{" "}
                    {descriptions[`${turn.number}_white_${turn.white}`]}
                  </div>
                )}

              {/* 흑의 수 설명 */}
              {turn.black &&
                descriptions[`${turn.number}_black_${turn.black}`] && (
                  <div className="description-box">
                    <strong>흑 {turn.black}:</strong>{" "}
                    {descriptions[`${turn.number}_black_${turn.black}`]}
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="no-moves">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveLog;
