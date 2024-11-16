import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import "./style/productCard.style.css";

const ProductCard = ({ item, handleOpenPaymentModal }) => {
  return (
    <div className="product-card-area">
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

  );
};

export default ProductCard;
