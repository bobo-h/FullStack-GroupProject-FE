import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminPayment.style.css"; 

const OrderTable = () => {
  return (
    <div>
      <Container>
        <Row className="mb-4 order-table-name">
          <Col md={1} className="d-flex align-items-center">
            <strong>#</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>주문번호</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>주문일</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>이름</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center">
            <strong>상품명</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center">
            <strong>상품카테고리</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center">
            <strong>가격</strong>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default OrderTable;
