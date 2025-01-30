import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminProduct.style.css"; 

const ProductTable = () => {
  return (
    <div className='product-table-name '>
      <Container>
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center">
            <strong>#</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>이미지</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>이름</strong>
          </Col>
          <Col md={3} className="d-flex align-items-center">
            <strong>설명</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>가격</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>기본제공</strong>
          </Col>
          <Col md={3} className="d-flex align-items-center justify-content-center">
            <strong>상품관리</strong>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductTable;
