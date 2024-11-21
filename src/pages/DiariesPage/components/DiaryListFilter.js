import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getFilteredDiaryList,
  clearDiaryList,
} from "../../../features/diary/diarySlice";
import { ReactComponent as Up } from "../../../assets/up.svg";
import { ReactComponent as Down } from "../../../assets/down.svg";
import "../style/diaryListFilter.style.css";

const DiaryListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.diary);

  const [filters, setFilters] = useState({
    year: searchParams.get("year") || "",
    month: searchParams.get("month") || "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    year: false,
    month: false,
  });

  useEffect(() => {
    const year = filters.year;
    const month = filters.month;
    // 리스트 초기화 후 필터 적용
    dispatch(clearDiaryList());
    dispatch(getFilteredDiaryList({ year, month }));
  }, [dispatch, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    const updatedParams = new URLSearchParams(searchParams);
    if (value) {
      updatedParams.set(name, value);
    } else {
      updatedParams.delete(name);
    }
    setSearchParams(updatedParams);
  };

  const toggleDropdown = (type) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <Form className="diary-list-filter">
      <Row className="diary-list-filter__row">
        {/* Year Dropdown */}
        <Col className="diary-list-filter__col">
          <Form.Group
            controlId="year"
            className="diary-list-filter__group year"
          >
            <div
              className="diary-list-filter__dropdown"
              onClick={() => toggleDropdown("year")}
            >
              <Form.Control
                as="select"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="diary-list-filter__select"
                disabled={loading}
              >
                <option value="">Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </Form.Control>
              {isDropdownOpen.year ? (
                <Up className="diary-list-filter__icon" />
              ) : (
                <Down className="diary-list-filter__icon" />
              )}
            </div>
          </Form.Group>
        </Col>

        {/* Month Dropdown */}
        <Col className="diary-list-filter__col">
          <Form.Group
            controlId="month"
            className="diary-list-filter__group month"
          >
            <div
              className="diary-list-filter__dropdown"
              onClick={() => toggleDropdown("month")}
            >
              <Form.Control
                as="select"
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="diary-list-filter__select"
                disabled={loading}
              >
                <option value="">Month</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </Form.Control>
              {isDropdownOpen.month ? (
                <Up className="diary-list-filter__icon" />
              ) : (
                <Down className="diary-list-filter__icon" />
              )}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default DiaryListFilter;
