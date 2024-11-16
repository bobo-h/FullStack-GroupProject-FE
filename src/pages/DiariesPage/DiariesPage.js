import React, { useState } from "react";
import DiaryListControls from "./components/DiaryListControls";
import DiaryList from "./components/DiaryList";
import "./style/diariesPage.style.css";

const DiariesPage = () => {
  const [filter, setFilter] = useState({ year: "", month: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const fetchData = () => {
    const queryParams = new URLSearchParams();
    if (filter.year) queryParams.append("year", filter.year);
    if (filter.month) queryParams.append("month", filter.month);
    if (searchTerm) queryParams.append("searchTerm", searchTerm);
  };

  return (
    <div className="diaries-page">
      <DiaryListControls onFilterChange={handleFilterChange} />
      <DiaryList fetchData={fetchData} />
    </div>
  );
};

export default DiariesPage;
