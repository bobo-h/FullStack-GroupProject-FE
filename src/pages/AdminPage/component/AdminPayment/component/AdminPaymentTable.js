import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminPayment.style.css"; 

const AdminPaymentTable = () => {
  return (
    <div className='product-table-name '>
      <Container>
        <Row className="mb-4">
          <Col md={2} className="d-flex align-items-center">
            <strong>Order#</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>Order Date</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>User Email</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>Order Item</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>Item Image</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>Category</strong>
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <strong>price</strong>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPaymentTable;
