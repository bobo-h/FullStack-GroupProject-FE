import React from "react";
import DiaryListFilter from "./DiaryListFilter";
import "../style/diaryListControls.style.css";

const DiaryListControls = ({ onFilterChange }) => {
  return (
    <div className="diary-list-controls">
      <div>검색 기능</div>
      <DiaryListFilter onFilterChange={onFilterChange} />
    </div>
  );
};

export default DiaryListControls;
