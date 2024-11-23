import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CustomModal from "../../../../../common/components/CustomModal";
import "../style/adminProduct.style.css";
import Button from "../../../../../common/components/Button";
import Button2 from "../../../../../common/components/Button2";
import { useDispatch } from "react-redux";
import {
  setSelectedProduct,
  deleteProduct,
  getProductList
} from "../../../../../features/product/productSlice";

const AdminProductCard = ({ product, setMode, setShowDialog }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleClickEditItem = () => {
    // Edit 모드로 설정하고 다이얼로그 열기
    setMode("edit");

    // 선택한 상품을 Redux 상태에 저장
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickDeleteItem = () => {
    dispatch(deleteProduct(product._id))
      .then(() => {
        setModalContent("상품 삭제 완료하였습니다!");
        setShowModal(true);
      })
      .catch((error) => {
        setModalContent("상품 삭제 실패!");
        setShowModal(true);
      });
  };

  return (
    <div className="product-table-content">
      {showModal && (
        <CustomModal
          message={modalContent}
          redirectTo="/admin"
          onClose={() => {
            setShowModal(false);
            setShowDialog(false);
            dispatch(getProductList({ page: 1 }));
          }}
          showCancelButton={false} // 취소 버튼 불필요
        />
      )}
      <Container className="product-card-content">
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center">
            {product.id}
          </Col>
          <Col md={2} className="d-flex align-items-center img-center-mobile">
            <img src={product.image} alt={product.name} className="img-fluid" />
          </Col>
          <Col md={1} className="d-flex align-items-center order-name">
            {product.name}
          </Col>
          <Col md={3} className="d-flex align-items-center order-description">
            {product.description}
          </Col>
          <Col md={1} className="d-flex align-items-center order-price">
            {product.price ? `${product.price.toLocaleString()}원` : "0"}
          </Col>
          <Col md={1} className="d-flex align-items-center mobile-none">
            {product.defaultProduct}
          </Col>
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center order-btn"
          >
            <Button className="btn-gap" onClick={handleClickEditItem}>수정</Button>
            <Button2 onClick={handleClickDeleteItem}>삭제</Button2>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProductCard;
