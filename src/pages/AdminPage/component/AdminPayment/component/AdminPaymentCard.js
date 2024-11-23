import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/adminPayment.style.css";

const AdminPaymentCard = ({ payment, setMode, setShowDialog }) => {

    return (
        <div className="payment-table-content">
            <Container>
                <Row className="mb-4">
                    <Col md={2} className="d-flex align-items-center">
                        {payment.orderNum}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.createdAt.slice(0, 10)}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.email}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.productName}
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        <img src={payment.productId.image} alt={payment.productId.name} className="img-fluid" />
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        {payment.productCategory[0]}
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        {payment.price}
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default AdminPaymentCard;
