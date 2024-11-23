import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import "./style/paymentInfoModal.style.css";
import { cc_expires_format } from "../../../../utils/number";
import { createOrder } from "../../../../features/order/orderSlice";
import PaymentForm from "./PaymentForm";
import Button from "../../../../common/components/Button";
import Button2 from "../../../../common/components/Button2";
import ReactDOM from "react-dom";
import CustomModal from "../../../../common/components/CustomModal";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";
import { useMediaQuery } from "react-responsive";

const PaymentInfoModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const { orderUserId, loading } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.user);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const [orderPersonInfo, setOrderPersonInfo] = useState({
    name: user?.name,
    email: user?.email,
    phoneNumber: "",
  });

  const [phoneValidationMessage, setPhoneValidationMessage] = useState("");
  const [emailValidationMessage, setEmailValidationMessage] = useState("");

  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (phoneRegex.test(phone)) {
      setPhoneValidationMessage("적합한 전화번호입니다.");
      return true;
    } else {
      setPhoneValidationMessage("양식에 맞게 전화번호를 넣어주세요!");
      return false;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailValidationMessage("적합한 이메일 주소입니다.");
      return true;
    } else {
      setEmailValidationMessage("이메일 주소를 정확하게 넣어주세요!");
      return false;
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setOrderPersonInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "phoneNumber") {
      validatePhoneNumber(value);
    }

    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      createOrder({
        name: orderPersonInfo.name,
        email: orderPersonInfo.email,
        phone: orderPersonInfo.phoneNumber,
        productId: selectedProduct._id,
        price: selectedProduct.price,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        img: selectedProduct.image,
      })
    )
      .then(() => {
        setModalContent("결제 성공하였습니다!");
        setShowModal(true);
      })
      .catch((error) => {
        setModalContent("결제 실패!");
        setShowModal(true);
      });
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === "expiry") {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  const PaymentInfoContent = (
    <div className="modal-backdrop payment-info-mobile" onClick={handleBackdropClick}>
      {showModal && (
          <CustomModal
            message={modalContent}
            redirectTo="/chatbot"
            onClose={() => {
              setShowModal(false);  
              onClose();            
            }}
            showCancelButton={false} 
          />
        )}
      {loading ? (
        <div className="text-align-center">
          <LoadingSpinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </LoadingSpinner>
        </div>
      ) : null}
      <Container className="payment-modal-backdrop">
        <h3 className="modal-title">입양 절차</h3>
        <Row>
          <Col {...(!isMobile && { lg: 4 })}>
            <Row className="mb-4 no-h">
              <Col>
                <div className="no-h" style={{ height: "20px" }}></div>
              </Col>
            </Row>
            {selectedProduct ? (
              <div className="payment-modal-product-card-area">
                <div className="payment-modal-product-card">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="img-fluid product-image"
                  />
                  <Row className="mt-3 justify-content-center text-center ">
                    <Col>
                      <h5>결제 금액: {selectedProduct.price}₩ </h5>
                    </Col>
                  </Row>
                </div>
              </div>

            ) : (
              <p>상품 정보를 불러올 수 없습니다.</p>
            )}
          </Col>

          <Col lg={7}>
            <h4 className="payment-title no-h">구매자 정보</h4>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group controlId="buyer-name">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label className="no-h">이름</Form.Label>
                      <Form.Label className="yes-h"><i class="ri-user-line"></i></Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        className="input-box"
                        type="text"
                        name="name"
                        value={orderPersonInfo.name} 
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group controlId="email">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label className="no-h">이메일</Form.Label>
                      <Form.Label className="yes-h"><i class="ri-mail-line"></i></Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        className="input-box"
                        type="email"
                        name="email"
                        value={orderPersonInfo.email}
                        onChange={handleFormChange}
                        required
                        placeholder="example@example.com"
                      />
                      {emailValidationMessage && (
                        <small
                          style={{
                            color: emailValidationMessage.includes("적합")
                              ? "#A9B388"
                              : "red",
                            textAlign: "left", 
                            display: "block", 
                            marginTop: "0.5rem",
                          }}
                        >
                          {emailValidationMessage}
                        </small>
                      )}
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group controlId="phone">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label className="no-h">전화번호</Form.Label>
                      <Form.Label className="yes-h"><i class="ri-phone-line"></i></Form.Label>

                    </Col>
                    <Col>
                      <Form.Control
                        className="input-box"
                        type="tel"
                        name="phoneNumber"
                        value={orderPersonInfo.phoneNumber}
                        onChange={handleFormChange}
                        placeholder="010-XXXX-XXXX"
                        required
                      />
                      {phoneValidationMessage && (
                        <small
                          style={{
                            color: phoneValidationMessage.includes("적합")
                              ? "#A9B388"
                              : "red",
                            textAlign: "left", 
                            display: "block", 
                            marginTop: "0.5rem", 
                          }}
                        >
                          {phoneValidationMessage}
                        </small>
                      )}
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              <h4 className="payment-title no-h">카드 정보</h4>
              <PaymentForm
                cardValue={cardValue}
                handleInputFocus={handleInputFocus}
                handlePaymentInfoChange={handlePaymentInfoChange}
              />

              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  className="payment-button mx-2"
                  type="submit"
                >
                  결제하기
                </Button>
                <Button2
                  variant="secondary"
                  onClick={onClose}
                  className="cancel-button mx-2"
                >
                  취소
                </Button2>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );

  return ReactDOM.createPortal(
    PaymentInfoContent,
    document.getElementById("root")
  );
};

export default PaymentInfoModal;
