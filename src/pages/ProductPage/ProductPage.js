import React, { useEffect, useState } from "react";
import "./style/productPage.style.css";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductList,
  setSelectedProduct,
} from "../../features/product/productSlice.js";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../../common/components/LoadingSpinner";
import PaymentModal from "./component/PaymentModal/PaymentModal.js";
import PaymentInfoModal from "./component/PaymentInfoModal/PaymentInfoModal.js"; // Import PaymentInfoModal
import ProductCard from "./component/ProductCard/ProductCard.js"; // Import PaymentInfoModal
import Button2 from "../../common/components/Button2.js";

const ProductPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList || []);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Cat");
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Payment modal state
  const [showPaymentInfoModal, setShowPaymentInfoModal] = useState(false); // Payment info modal state

  const navigate = useNavigate();

  // Fetch product list
  useEffect(() => {
    setLoading(true);
    dispatch(getProductList()).then(() => {
      setLoading(false);
    });
  }, []);

  const filteredProducts = productList.filter((product) => {
    if (filter === "Cat") return product.category[0] === "Cat";
    else if (filter === "BG_IMG") return product.category[0] === "BG_IMG";
  });

  // Open the PaymentModal
  const handleOpenPaymentModal = (product) => {
    dispatch(setSelectedProduct(product)); // Set the selected product in Redux
    setShowPaymentModal(true);
  };

  // Close the PaymentModal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Open the PaymentInfoModal
  const handleProceedToPayment = () => {
    setShowPaymentModal(false); // Close PaymentModal
    setShowPaymentInfoModal(true); // Show PaymentInfoModal
  };

  // Close the PaymentInfoModal
  const handleClosePaymentInfoModal = () => {
    setShowPaymentInfoModal(false);
  };

  return (
    <Container fluid className="product-page">
      <Row className="product-category-btns">
        <Col>
          <Button2 className="me-2" onClick={() => setFilter("Cat")}>
            고양이
          </Button2>
          <Button2 onClick={() => setFilter("BG_IMG")}>배경</Button2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {loading ? (
          <div className="text-align-center">
            <LoadingSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </LoadingSpinner>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) =>
            item ? (
              <Col
                xs={6}
                sm={4}
                md={4}
                lg={2}
                key={item.id}
                className="d-flex justify-content-center mb-4"
              >
                <ProductCard
                  className="product-card"
                  item={item}
                  handleOpenPaymentModal={handleOpenPaymentModal}
                />
              </Col>
            ) : null
          )
        ) : (
          <div className="text-align-center empty-bag">
            <h2>등록된 상품이 없습니다!</h2>
          </div>
        )}
      </Row>

      {showPaymentModal && selectedProduct && (
        <PaymentModal
          selectedProduct={selectedProduct}
          onClose={handleClosePaymentModal}
          onProceedToPayment={handleProceedToPayment} // Pass handleProceedToPayment as prop
        />
      )}

      {showPaymentInfoModal && selectedProduct && (
        <PaymentInfoModal onClose={handleClosePaymentInfoModal} />
      )}
    </Container>
  );
};

export default ProductPage;
