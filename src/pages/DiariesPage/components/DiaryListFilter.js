import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { ReactComponent as Up } from "../../../assets/up.svg";
import { ReactComponent as Down } from "../../../assets/down.svg";
import "../style/diaryListFilter.style.css";

const DiaryListFilter = ({ onFilterChange }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    onFilterChange({ year: selectedYear, month });
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    onFilterChange({ year, month: selectedMonth });
  };

  return (
    <Form>
      <Row className="diary-list-filter__row">
        {/* Year Dropdown */}
        <Col className="diary-list-filter__col">
          <Form.Group
            controlId="year"
            className="diary-list-filter__group year"
          >
            <div
              className="diary-list-filter__dropdown"
              onClick={() => setIsYearOpen(!isYearOpen)}
            >
              <Form.Control
                as="select"
                value={year}
                onChange={handleYearChange}
                onBlur={() => setIsYearOpen(false)}
                onFocus={() => setIsYearOpen(true)}
                className="diary-list-filter__select"
              >
                <option value="">Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </Form.Control>
              {isYearOpen ? (
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
              onClick={() => setIsMonthOpen(!isMonthOpen)}
            >
              <Form.Control
                as="select"
                value={month}
                onChange={handleMonthChange}
                onBlur={() => setIsMonthOpen(false)}
                onFocus={() => setIsMonthOpen(true)}
                className="diary-list-filter__select"
              >
                <option value="">Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Control>
              {isMonthOpen ? (
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
