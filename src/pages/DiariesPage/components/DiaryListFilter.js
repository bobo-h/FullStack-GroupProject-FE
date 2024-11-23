import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getDiaryList,
  clearDiaryList,
  getFilterOptions,
} from "../../../features/diary/diarySlice";
import { Pencil } from "../../../assets";
import { ReactComponent as Up } from "../../../assets/up.svg";
import { ReactComponent as Down } from "../../../assets/down.svg";
import "../style/diaryListFilter.style.css";

const DiaryListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { filterOptions, loading } = useSelector((state) => state.diary);

  const [filters, setFilters] = useState({
    year: searchParams.get("year") || "",
    month: searchParams.get("month") || "",
  });

  const [dropdowns, setDropdowns] = useState({
    year: false,
    month: false,
  });

  const toggleDropdown = (name) => {
    setDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    const updatedParams = new URLSearchParams(searchParams);
    if (value) {
      updatedParams.set(name, value);
    } else {
      updatedParams.delete(name);
    }
    setSearchParams(updatedParams);
    setDropdowns((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  useEffect(() => {
    dispatch(getFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    const { year, month } = filters;
    dispatch(clearDiaryList());
    dispatch(getDiaryList({ page: 1, year, month }));
  }, [dispatch, filters]);

  return (
    <div className="diary-filter-container">
      <div
        className="diary-filter__new-entry"
        onClick={() => navigate("/diaries/new")}
      >
        <img src={Pencil} alt="New Entry" className="diary-filter__new-icon" />
      </div>
      <div className="diary-filter">
        <div
          className={`diary-filter__label ${
            loading ? "diary-filter__label--disabled" : ""
          }`}
          onClick={() => !loading && toggleDropdown("year")}
        >
          <span>{filters.year || "Year"}</span>
          {dropdowns.year ? (
            <Up className="diary-filter__icon" />
          ) : (
            <Down className="diary-filter__icon" />
          )}
        </div>
        {dropdowns.year && (
          <div className="diary-filter__list">
            <div
              className="diary-filter__item"
              onClick={() => handleFilterChange("year", "")}
            >
              Year
            </div>
            {filterOptions.years.map((year) => (
              <div
                key={year}
                className="diary-filter__item"
                onClick={() => handleFilterChange("year", year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="diary-filter">
        <div
          className={`diary-filter__label ${
            loading ? "diary-filter__label--disabled" : ""
          }`}
          onClick={() => !loading && toggleDropdown("month")}
        >
          <span>{filters.month || "Month"}</span>
          {dropdowns.month ? (
            <Up className="diary-filter__icon" />
          ) : (
            <Down className="diary-filter__icon" />
          )}
        </div>
        {dropdowns.month && (
          <div className="diary-filter__list">
            <div
              className="diary-filter__item"
              onClick={() => handleFilterChange("month", "")}
            >
              Month
            </div>
            {filterOptions.months.map((month) => (
              <div
                key={month}
                className="diary-filter__item"
                onClick={() => handleFilterChange("month", month)}
              >
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryListFilter;
