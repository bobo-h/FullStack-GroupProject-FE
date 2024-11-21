import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getDiaryList,
  clearDiaryList,
  getFilterOptions,
} from "../../../features/diary/diarySlice";

const DiaryListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { filterOptions, loading } = useSelector((state) => state.diary);

  const [filters, setFilters] = useState({
    year: searchParams.get("year") || "",
    month: searchParams.get("month") || "",
  });

  useEffect(() => {
    // 필터 옵션 데이터 로드
    dispatch(getFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    // 필터 변경 시 상태 초기화 및 데이터 로드
    const { year, month } = filters;
    dispatch(clearDiaryList());
    dispatch(getDiaryList({ page: 1, year, month }));
  }, [dispatch, filters]); // 필터 값이 변경될 때마다 실행

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    // 필터 값 업데이트
    setFilters((prev) => ({ ...prev, [name]: value }));

    // URL 업데이트
    const updatedParams = new URLSearchParams(searchParams);
    if (value) {
      updatedParams.set(name, value);
    } else {
      updatedParams.delete(name);
    }
    setSearchParams(updatedParams);
  };

  return (
    <Form>
      <Row>
        <Col>
          <Form.Group>
            <Form.Control
              as="select"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              disabled={loading} // 로딩 중일 때 비활성화
            >
              <option value="">Select Year</option>
              {filterOptions.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Control
              as="select"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              disabled={loading} // 로딩 중일 때 비활성화
            >
              <option value="">Select Month</option>
              {filterOptions.months.map((month) => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default DiaryListFilter;
