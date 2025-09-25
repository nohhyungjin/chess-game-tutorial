const STORAGE_KEYS = {
  DESCRIPTIONS: "chess-descriptions",
};

export const localStorageUtils = {
  // 설명 데이터 저장
  saveDescriptions: (descriptions) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESCRIPTIONS, JSON.stringify(descriptions));
    } catch (error) {
      console.error("설명 저장 중 오류 발생:", error);
    }
  },

  // 설명 데이터 불러오기
  loadDescriptions: () => {
    try {
      const savedDescriptions = localStorage.getItem(STORAGE_KEYS.DESCRIPTIONS);
      return savedDescriptions ? JSON.parse(savedDescriptions) : {};
    } catch (error) {
      console.error("설명 불러오기 중 오류 발생:", error);
      return {};
    }
  },

  // 설명 데이터 삭제
  clearDescriptions: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.DESCRIPTIONS);
    } catch (error) {
      console.error("설명 삭제 중 오류 발생:", error);
    }
  },
};
