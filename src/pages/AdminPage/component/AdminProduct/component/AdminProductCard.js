import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminProduct.style.css";
import Button2 from '../../../../../common/components/Button2';
import { useDispatch } from 'react-redux';
import { setSelectedProduct, deleteProduct } from "../../../../../features/product/productSlice";

const AdminProductCard = ({ product, setMode, setShowDialog }) => {
  const dispatch = useDispatch();

  const handleClickEditItem = () => {
    // Edit 모드로 설정하고 다이얼로그 열기
    setMode("edit");

    // 선택한 상품을 Redux 상태에 저장
    dispatch(setSelectedProduct(product));
    setShowDialog(true);

  };

  const handleClickDeleteItem = () => {
    
    dispatch(deleteProduct(product._id));

  };

  return (
    <div className='product-table-content'>
      <Container>
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center">
            {product.id}
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <img src={product.image} alt={product.name} className="img-fluid" />
          </Col>
          <Col md={1} className="d-flex align-items-center">
            {product.name}
          </Col>
          <Col md={3} className="d-flex align-items-center">
            {product.description}
          </Col>
          <Col md={1} className="d-flex align-items-center">
            {product.price ? `${product.price.toLocaleString()}원` : "0"}
          </Col>
          <Col md={1} className="d-flex align-items-center">
            {product.defaultProduct}
          </Col>
          <Col md={3} className="d-flex align-items-center justify-content-center">
            <Button2 onClick={handleClickEditItem}>수정</Button2>
            <Button2 onClick={handleClickDeleteItem}>삭제</Button2>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProductCard;
