import { useState, useEffect } from "react";
import { localStorageUtils } from "../utils/localStorage";

export const useMoveDescriptions = () => {
  const [descriptions, setDescriptions] = useState({});
  const [selectedMoveId, setSelectedMoveId] = useState("");
  const [inputDesc, setInputDesc] = useState("");

  // 로컬스토리지에서 설명 불러오기
  useEffect(() => {
    const savedDescriptions = localStorageUtils.loadDescriptions();
    setDescriptions(savedDescriptions);
  }, []);

  // 설명이 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorageUtils.saveDescriptions(descriptions);
  }, [descriptions]);

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

  // 설명 초기화
  const resetDescription = () => {
    setSelectedMoveId("");
    setInputDesc("");
  };

  // Enter 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveDescription();
    }
  };

  return {
    descriptions,
    selectedMoveId,
    inputDesc,
    setInputDesc,
    handleMoveClick,
    saveDescription,
    resetDescription,
    handleKeyPress,
  };
};
