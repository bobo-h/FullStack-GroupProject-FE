import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Button from "./../../../common/components/Button";
import "../style/diaryListFilter.style.css";

const DiaryListFilter = ({ onFilterChange }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ year, month });
  };

  return (
    <Form>
      <Row className="diary-list-filter__row">
        <Col className="diary-list-filter__col">
          <Form.Group
            controlId="year"
            className="diary-list-filter__group year"
          >
            <Form.Control
              as="select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="diary-list-filter__select"
            >
              <option value="">Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              {/* 추가 연도 옵션 */}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col className="diary-list-filter__col">
          <Form.Group
            controlId="month"
            className="diary-list-filter__group month"
          >
            <Form.Control
              as="select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
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
          </Form.Group>
        </Col>

        <Col>
          <Button
            onClick={handleFilterChange}
            className="diary-list-filter__button"
          >
            Apply
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DiaryListFilter;
