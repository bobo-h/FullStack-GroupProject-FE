import React from "react";
import DiaryList from "./components/DiaryList";
import "./style/diariesPage.style.css";
import DiaryListFilter from "./components/DiaryListFilter";

const DiariesPage = () => {
  return (
    <div className="diaries-page">
      <DiaryListFilter />
      <DiaryList />
    </div>
  );
};

export default DiariesPage;
