import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createChatbot } from "../../features/chatbot/chatbotSlice";
import "./style/chatbot.style.css";
import Button from "../../common/components/Button";
import Button2 from "../../common/components/Button2";
import PersonalityMBTI from "./component/PersonalityMBTI/PersonalityMBTI";
import Alert from "../../common/components/Alert";
import CustomModal from "../../common/components/CustomModal";
import { getProductList } from "../../features/product/productSlice";
import { updateChatbotJins } from "../../features/chatbot/chatbotSlice";
import { useNavigate } from "react-router-dom";

// ChatbotCreation 컴포넌트

const ChatbotCreation = ({ chatbotItem, onEditComplete }) => {
  const [name, setName] = useState(chatbotItem?.name || "");
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const [personality, setPersonality] = useState(
    chatbotItem?.personality || ""
  );

  const [isDirectInput, setIsDirectInput] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [redirectTo, setRedirectTo] = useState("")
  const [alertContent, setAlertContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalType, setModalType] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitEvent, setSubmitEvent] = useState(null); // 이벤트 객체를 저장

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.chatbot
  );

  const product = useSelector((state) => state.product?.productList || []);

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  const handleOpenConfirmModal = (e) => {
    e.preventDefault(); // `Form`의 기본 동작을 막음

    // chatbotItem이 없으면 ConfirmModal 표시
    if (!chatbotItem) {
      setSubmitEvent(e);
      setShowConfirmModal(true); // 모달 열기
    } else {
      handleSubmit(e); // 바로 수정 진행
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false); // 모달 닫기
    if (submitEvent) {
      handleSubmit(submitEvent); // 저장된 이벤트 객체를 handleSubmit에 전달
      setSubmitEvent(null); // 이벤트 객체 초기화
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (chatbotItem) {
      // 수정 로직
      dispatch(
        updateChatbotJins({
          id: chatbotItem._id, // ID를 전달
          updateData: { name },
        })
      )
        .then(() => {
          if (onEditComplete) onEditComplete(); // 수정 완료 콜백 호출
        })
        .catch((error) => {
          console.error("수정 실패", error);
        });
    } else if (selectedProduct) {
      // 일반 생성 로직
      dispatch(
        createChatbot(
          {
            product_id: selectedProduct._id,
            name,
            personality,
          }))
        .then(() => {
          setAlertContent("입양에 성공했습니다!");
          setAlertType("success");
          setRedirectTo("/");
          setShowAlert(true);
          setModalContent("입양에 성공했습니다!");
          setModalType("success");
          setRedirectTo("/");
          setShowModal(true);
        })
        .catch((error) => {
          console.error("입양 실패", error);
          setAlertContent("입양에 실패했습니다!");
          setAlertType("danger");
          setShowAlert(true);
          setModalContent("입양에 실패했습니다!");
          setModalType("danger");
          setShowModal(true);
        });
    }
  };

  const handlePersonalityChange = (selectedPersonality) => {
    setPersonality(selectedPersonality);
  };

  const handleInputTypeChange = (inputType) => {
    setIsDirectInput(inputType);
    setPersonality("");
  };

  const defaultProduct = Array.isArray(product)
    ? product.find((product) => product.defaultProduct === "Yes")
    : null;


  const handleCancel = () => {
    navigate("/");
  };

    
  useEffect(() => {
    console.log("showAlert:", showAlert);
    console.log("alertType:", alertType);
  }, [showAlert, alertType]);

  return (
    <div className="chatbot-create-modal">
      {/* {showAlert && (
        <Alert
          message={alertContent}
          onClose={() => setShowAlert(false)}
          redirectTo={redirectTo}
        />
      )} */}
      {showModal && (
        <CustomModal
          message={modalContent}
          redirectTo={redirectTo}
          onClose={() => setShowModal(false)}  // CustomeModal 닫기
          showCancelButton={false} // 취소 버튼 불필요
        />
      )}
      <Container
        className=" d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Row className="text-center chatbot-create-content">
          <h3 className="create-modal-title">입양 서류</h3>
          <Col style={{ flex: "0 0 35%" }} className="">
            {chatbotItem?.product_id?.image ? (
              <img
                src={chatbotItem.product_id.image}
                alt="Selected Product"
                className="chatbot-image-size"
              />
            ) : selectedProduct?.image ? (
              <img
                src={selectedProduct.image}
                alt="Selected Product"
                className="chatbot-image-size"
              />
            ) : defaultProduct?.image ? (
              <img
                src={defaultProduct.image}
                alt="Default Product"
                className="chatbot-image-size"
              />
            ) : (
              <div className="no-image-message">이미지 없음</div>
            )}
          </Col>
          <Col style={{ flex: "0 0 65%" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Label>챗봇 이름</Form.Label>
                  </Col>
                  <Col lg={6}>
                    <Form.Control
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPersonality">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Label>챗봇 성격</Form.Label>
                  </Col>
                  {chatbotItem ? (
                    ""
                  ) : (
                    <Col className="btn-gap">
                      <Button
                        variant={
                          isDirectInput ? "outline-secondary" : "primary"
                        }
                        onClick={() => handleInputTypeChange(true)}
                        className="hide-button"
                      >
                        직접 입력
                      </Button>
                      <Button
                        variant={
                          isDirectInput ? "primary" : "outline-secondary"
                        }
                        onClick={() => handleInputTypeChange(false)}
                        className="hide-button"
                      >
                        성격 선택
                      </Button>
                    </Col>
                  )}

                  <Row className="personality-area">
                    {!isDirectInput && (
                      <Form.Control
                        placeholder="성격을 선택해주세요"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        required
                        disabled
                      />
                    )}
                    {isDirectInput && (
                      <Form.Control
                        as="textarea"
                        placeholder="성격을 직접 입력하세요"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        required
                        disabled={Boolean(chatbotItem)}
                      />
                    )}
                  </Row>
                  <Row className="align-items-center text-center">
                    {!isDirectInput && (
                      <PersonalityMBTI
                        onPersonalitySelect={handlePersonalityChange}
                      />
                      //<PersonalityBox onPersonalitySelect={handlePersonalityChange}/>
                    )}
                  </Row>
                  <Col className="personality-area btn-gap">
                    <Button
                      variant="primary"
                      onClick={handleOpenConfirmModal} // onClick으로 수정
                      disabled={loading}
                      className="w-auto"
                    >
                      {loading
                        ? "생성 중..."
                        : chatbotItem
                          ? "수정하기"
                          : "입양하기"}
                    </Button>
                    <Button2
                      onClick={handleCancel}
                    >
                      취소
                    </Button2>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
      {showConfirmModal && (
        <CustomModal
          message="입양 후 고양이의 성격은 바꿀 수 없습니다. 입양 하시겠습니까?"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          showCancelButton={true}
        />
      )}
    </div>
  );
};

export default ChatbotCreation;
