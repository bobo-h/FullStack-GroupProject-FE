import React from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./style/paymentInfoModal.style.css"

const PaymentForm = ({
  handleInputFocus,
  cardValue,
  handlePaymentInfoChange,
}) => {
  return (
    <Container fluid>
      <Row className="align-items-start">
      <Col md={6} xs={12} className="credit-card-preview mb-3">
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus}
          name={cardValue.name}
          number={cardValue.number}
        />
      </Col>
      <Col md={6} xs={12} className="form-area">
          <Form.Control
            type="tel"
            name="number"
            placeholder="Card Number"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            maxLength={16}
            minLength={16}
            value={cardValue.number}
            className="mb-3"
          />

          <Form.Control
            type="text"
            name="name"
            placeholder="Name"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            value={cardValue.name}
            className="mb-3"
          />
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="expiry"
                placeholder="MM/DD"
                onChange={handlePaymentInfoChange}
                onFocus={handleInputFocus}
                required
                value={cardValue.expiry}
                maxLength={7}
                className="mb-3"
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="cvc"
                placeholder="CVC"
                onChange={handlePaymentInfoChange}
                onFocus={handleInputFocus}
                required
                maxLength={3}
                value={cardValue.cvc}
                className="mb-3"
              />
            </Col>
          </Row>
      </Col>
    </Row>
    </Container>
  );
};

export default PaymentForm;