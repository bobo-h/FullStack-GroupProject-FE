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
import PaymentModal from "./component/PaymentMoadl/PaymentModal.js";
import PaymentInfoModal from "./component/PaymentInfoModal/PaymentInfoModal.js"; // Import PaymentInfoModal
import ProductCard from "./component/ProductCard/ProductCard.js"; // Import PaymentInfoModal
import Button2 from "../../common/components/Button2.js";

const ProductPage = () => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.product.productList || []);
    const selectedProduct = useSelector((state) => state.product.selectedProduct);
    const [loading, setLoading] = useState(true);
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
                <Col md={2}>
                    <Button2>고양이</Button2>
                </Col>
                <Col md={2}>
                    <Button2>배경</Button2>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <ProductCard/>
                {loading ? (
                    <div className="text-align-center">
                        <LoadingSpinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </LoadingSpinner>
                    </div>
                ) : productList.length > 0 ? (
                    productList.map((item) => (
                        <Col xs={12} sm={6} md={4} lg={2} key={item.id} className="d-flex justify-content-center mb-4">
                            <div className="product-card" onClick={() => handleOpenPaymentModal(item)}>
                                <img src={item.image} alt={item.name} className="img-fluid" style={{ cursor: "pointer" }} />
                            </div>
                        </Col>
                    ))
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
                <PaymentInfoModal
                    onClose={handleClosePaymentInfoModal}
                />
            )}
        </Container>
    );
};

export default ProductPage;
