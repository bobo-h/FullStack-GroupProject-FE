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
import Alert from "../../../../common/components/Alert";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";

const PaymentInfoModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const { orderUserId, loading } = useSelector((state) => state.order);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const [orderPersonInfo, setOrderPersonInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // 선택한 상품 정보를 사용하여 주문 생성
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
        // setAlertContent(`결제 성공하였습니다! <br /> 주문번호: ${orderNum}`);
        setAlertContent("결제 성공하였습니다!");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertContent("결제 실패!");
        setShowAlert(true);
      });
  };

  const handleFormChange = (event) => {
    // 이름, 이메일 주소 입력
    const { name, value } = event.target;
    setOrderPersonInfo({ ...orderPersonInfo, [name]: value }); // 입력 필드 업데이트
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
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

  const proceedToPayment = () => {
    //user_id도 넘겨주세용  --> 추가했어요
    console.log("orderUserId??", orderUserId)
    //navigate("/chatbot", { state: { productImage: selectedProduct._id, orderUserId: orderUserId } });
  };
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  const PaymentInfoContent = (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      {showAlert && (
        <Alert
          message={alertContent}
          onClose={() => {
            // proceedToPayment()
            setShowAlert(false)
          }}
          redirectTo="/chatbot"
        />
      )}
      {loading ? (
          <div className="text-align-center">
            <LoadingSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </LoadingSpinner>
          </div>
        ) : null }
      <Container className="payment-modal-backdrop">
        <h3 className="modal-title">입양 절차</h3>
        <Row>
          {/* 고양이 카드 */}
          <Col lg={4}>
            <Row className="mb-4">
              {/* 상단 공백 */}
              <Col>
                <div style={{ height: "20px" }}></div>
              </Col>
            </Row>
            {selectedProduct ? (
              <div className="payment-product-card">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="img-fluid product-image"
                />
                <Row className="mt-3 justify-content-center text-center">
                  {/* 결제 금액 표시 */}
                  <Col>
                    <h5>결제 금액: {selectedProduct.price}₩ </h5>
                  </Col>
                </Row>
              </div>
            ) : (
              <p>상품 정보를 불러올 수 없습니다.</p>
            )}
            {/* <Row className="mt-3 justify-content-center text-center">
            <Col>
              <h5>결제 금액: {selectedProduct.price}₩ </h5>
            </Col>
          </Row> */}
          </Col>

          {/* 구매자, 카드 정보 */}
          <Col lg={7}>
            <h4 className="payment-title">구매자 정보</h4>
            <Form onSubmit={handleSubmit}>
              {/* 구매자 이름 입력 */}
              <Row className="mb-3">
                <Form.Group controlId="buyer-name">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label>이름</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        onChange={handleFormChange}
                        required
                        name="name"
                      // value={orderInfo.name}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              {/* 구매자 이메일 입력 */}
              <Row className="mb-3">
                <Form.Group controlId="email">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label>이메일</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="email"
                        onChange={handleFormChange}
                        required
                        name="email"
                        // value={orderInfo.email}
                        placeholder="example@example.com"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              {/* 구매자 전화번호 입력 */}
              <Row className="mb-3">
                <Form.Group controlId="phone">
                  <Row>
                    <Col lg={2} xs="auto">
                      <Form.Label>전화번호</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="tel"
                        onChange={handleFormChange}
                        required
                        name="phoneNumber"
                        // value={orderInfo.phoneNumber}
                        placeholder="010-XXXX-XXXX"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Row>

              {/* 카드 정보 입력 폼 */}
              <h4 className="payment-title">카드 정보</h4>
              <PaymentForm
                cardValue={cardValue}
                handleInputFocus={handleInputFocus}
                handlePaymentInfoChange={handlePaymentInfoChange}
              />

              {/* 결제 버튼 */}
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
