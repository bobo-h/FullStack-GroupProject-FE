import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/adminUser.style.css";

const UserTable = () => {
  return (
    <div className="user-table-name">
      <Container>
        <Row>
          <Col xs={1} sm={1} md={1}>
            <strong>#</strong>
          </Col>
          <Col xs={3} sm={3} md={3}>
            <strong>이름</strong>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <strong>이메일</strong>
          </Col>
          <Col xs={3} sm={3} md={2}>
            <strong>역할</strong>
          </Col>
          <Col xs={1} sm={1} md={2}>
            <strong></strong>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserTable;
