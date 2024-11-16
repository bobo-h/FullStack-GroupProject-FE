import React, { useEffect, useState } from "react";
import "./style/productPage.style.css";
import { Row, Col, Container, Spinner, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductList,
  setSelectedProduct,
} from "../../features/product/productSlice.js";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../PaymentPage/PaymentPage.js";

const ProductPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList || []);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // 결제 모달 표시 상태 추가

  const navigate = useNavigate(); // useNavigate로 페이지 이동

  //상품리스트 가져오기
  useEffect(() => {
    setLoading(true);
    dispatch(getProductList()).then(() => {
      setLoading(false);
    });
  }, []);

  // 결제 모달 열기
  const handleOpenPaymentModal = (product) => {
    dispatch(setSelectedProduct(product)); // Redux에 선택한 상품 저장
    setShowPaymentModal(true);
  };

  // 결제 모달 닫기
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedProduct(null);
  };

  // 결제 버튼 클릭 시 결제 페이지로 이동
  const handleProceedToPayment = () => {
    setShowPaymentModal(false);
    navigate("/payment");
  };

  return (
    <Container fluid className="product-page">
      <Row className="justify-content-center">
        {loading ? (
          // 로딩 상태일 때 스피너 표시
          <div className="text-align-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : // 상품 있으면 보여주고, 없으면 없다고 표시
        productList.length > 0 ? (
          productList.map((item) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={2}
              key={item.id}
              className="d-flex justify-content-center mb-4"
            >
              <div
                className="product-card"
                onClick={() => handleOpenPaymentModal(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="img-fluid"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            <h2>등록된 상품이 없습니다!</h2>
          </div>
        )}
      </Row>

      {/* 결제 모달 */}
      <Modal
        show={showPaymentModal}
        onHide={handleClosePaymentModal}
        size="sm"
        centered
        contentClassName="custom-modal"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> 입양하기(1000원) </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {selectedProduct && (
            <div className="text-center">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="img-fluid mb-3"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button
            variant="primary"
            onClick={handleProceedToPayment}
            className="payment-button"
          >
            결제하기
          </Button>
          <Button
            variant="secondary"
            onClick={handleClosePaymentModal}
            className="cancel-button"
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductPage;
