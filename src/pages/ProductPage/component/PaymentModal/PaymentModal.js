import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import ReactDOM from "react-dom";
import "./style/paymentModal.style.css";
import Button from "../../../../common/components/Button";
import Button2 from "../../../../common/components/Button2";


const PaymentModal = ({ selectedProduct, onClose, onProceedToPayment }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleBackdropClick = (event) => {
        if (event.target.classList.contains("modal-backdrop")) {
            onClose();
        }
    };

    const ItemContent = (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <Container className="payment-modal-backdrop">
                <h3 className="modal-title">입양하시겠습니까?</h3>
                <div className="payment-card-area">
                    <Container className="product-card">
                        <Row className="align-items-center payment-modal-area">
                            {/* <div className="cat-id"> {selectedProduct.id} </div> */}
                            <Col className="image-container">
                                <div className="image">
                                    <img src={selectedProduct.image} className="image" />
                                </div>
                            </Col>
                            <Col className="text-left">
                                <div className="name">이름: {selectedProduct.name}</div>
                                <div className="description">설명: {selectedProduct.description}</div>
                                <div className="price">가격: {selectedProduct.price} 원 </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Row>
                    <Col className="btn-gap">
                        <Button variant="primary" onClick={onProceedToPayment} className="payment-button">
                            결제하기
                        </Button>
                        <Button2 variant="secondary" onClick={onClose} className="cancel-button">
                            취소
                        </Button2>
                    </Col>
                </Row>
            </Container>
        </div>
    )
    return ReactDOM.createPortal(ItemContent, document.getElementById("root"));
};

export default PaymentModal;
