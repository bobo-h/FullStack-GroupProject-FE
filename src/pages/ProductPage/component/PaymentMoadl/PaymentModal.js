import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form} from "react-bootstrap";
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
                
                    {/* <Col>
                        <img 
                            src={selectedProduct.imageUrl} 
                            alt={selectedProduct.name} 
                            className="img-fluid" 
                            style={{ height: '50%', width: 'auto' }} 
                        />
                    </Col>
                    <Col>
                        <div>고양이 이름</div>
                        <div>고양이 설명</div>    
                    </Col> */}
                    <div className="payment-card-area">
                        <Container className="product-card">
                            <Row className="align-items-center">
                            <div className="cat-id">고양이 번호</div>
                            <Col className="image-container">
                                <div className="image">이미지</div>
                            </Col>
                            <Col>
                                <div className="name">이름</div>
                                <div className="description">설명</div>
                                <div className="price">가격</div>
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
