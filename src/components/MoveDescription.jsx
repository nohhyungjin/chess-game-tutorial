import React from "react";

const MoveDescription = ({ currentDescription }) => {
  return (
    <div className="move-description">
      <h3 className="description-title">현재 수에 대한 설명</h3>
      <div className="description-content">
        {currentDescription ? (
          currentDescription
        ) : (
          "이 수에 대한 설명이 없습니다."
        )}
      </div>
    </div>
  );
};

export default MoveDescription;
