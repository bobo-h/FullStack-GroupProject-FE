import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminPayment.style.css";


const OrderCard = ({ order, index }) => {

    return (
      <div className='payment-table-content'>
        <Container>
            <Row className="mb-4">
                <Col md={1} className="d-flex align-items-center">
                    {index + 1}
                </Col>
                <Col md={2} className="d-flex align-items-center">
                    {order.orderNum}
                </Col>
                <Col md={2} className="d-flex align-items-center">
                    {order.createdAt}
                </Col>
                <Col md={1} className="d-flex align-items-center">
                    {order.name}
                </Col>
                <Col md={2} className="d-flex align-items-center justify-content-center">
                    {order.productName}
                </Col>
                <Col md={2} className="d-flex align-items-center justify-content-center">
                    {order.productCategory[0]}
                </Col>
                <Col md={2} className="d-flex align-items-center justify-content-center">
                {order.price}
                </Col>
            </Row>
        </Container>
      </div>
    );
  };
  
  export default OrderCard;
  