import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createChatbot } from "../../features/chatbot/chatbotSlice";
import "./style/chatbot.style.css";
import Button from "../../common/components/Button";
import PersonalityMBTI from "./component/PersonalityMBTI/PersonalityMBTI";
import Alert from "../../common/components/Alert";
import Alert4 from "../../common/components/Alert4";
import { getProductList } from "../../features/product/productSlice";
import { updateChatbotJins } from "../../features/chatbot/chatbotSlice";
import { useNavigate } from "react-router-dom";

// ChatbotCreation 컴포넌트

const ChatbotCreation = ({ chatbotItem, onEditComplete }) => {
const [name, setName] = useState(chatbotItem?.name || "");
const { orderUserId } = useSelector((state) => state.order);
const selectedProduct = useSelector((state) => state.product.selectedProduct);
const [personality, setPersonality] = useState(
 chatbotItem?.personality || ""
);

const [isDirectInput, setIsDirectInput] = useState(true);
const [showAlert4, setShowAlert4] = useState(false);
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState(null);
const [redirectTo, setRedirectTo] = useState("")

const [confilmAlert, setConfilmAlert] = useState(false);
const [alertContent, setAlertContent] = useState("");
const [alertStep, setAlertStep] = useState(1); 
const dispatch = useDispatch();
const navigate = useNavigate();

  

  const { loading, registrationError} = useSelector(
    (state) => state.chatbot
  );

  const product = useSelector((state) => state.product?.productList || []);


  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

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
      // 알림 띄우기
      // console.log("Showing Alert4...");
      // setAlertType("Alert4");
      // setAlertMessage("성격을 등록하면 수정할 수 없습니다. 계속 진행하시겠습니까?");
      // setShowAlert(true);
      
      // 일반 생성 로직
      dispatch(createChatbot({ user_id: orderUserId, product_id: selectedProduct._id, name, personality }))
        .then(() => {
          setAlertMessage("입양에 성공했습니다!");
          setAlertType("success");
          setRedirectTo("/");
          setShowAlert(true);
        })
        .catch((error) => {
          console.error("입양 실패", error);
          setAlertMessage("입양에 실패했습니다!");
          setAlertType("danger");
          setShowAlert(true);
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

    const handleAlertConfirm = () => {
      if (alertType === "Alert4") {
        dispatch(createChatbot({ user_id: orderUserId, product_id: selectedProduct._id, name, personality }))
          .then(() => {
            setAlertMessage("입양에 성공했습니다!");
            setAlertType("success");
            setRedirectTo("/");
            setShowAlert(true);
          })
          .catch((error) => {
            console.error("입양 실패", error);
            setAlertMessage("입양에 실패했습니다!");
            setAlertType("danger");
            setShowAlert(true);
          });
      }
      setShowAlert(false); // 알림을 닫기
    };

  // 취소 버튼 클릭 시 product_id와 user_id가 있는 페이지로 돌아가기
  const handleAlertCancel = () => {
    // navigate(`/product/${selectedProduct?.product_id}/user/${orderUserId}`); 
    setShowAlert(false);
  };

  useEffect(() => {
    console.log("showAlert:", showAlert);
    console.log("alertType:", alertType);
  }, [showAlert, alertType]);


  return (
    <div className="chatbot-create-modal">
      {showAlert && (
        <Alert
          message={alertContent}
          onClose={() => setShowAlert(false)}
          redirectTo="/chatbot"
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
                  {registrationError && (
                    <Alert4
                      message={registrationError}
                      type="danger"
                      onClose={() => setShowAlert4(false)}
                    />
                  )}
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
                      >
                        직접 입력
                      </Button>
                      <Button
                        variant={
                          isDirectInput ? "primary" : "outline-secondary"
                        }
                        onClick={() => handleInputTypeChange(false)}
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
                  <Col className="personality-area">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="w-auto"
                    >
                      {loading
                        ? "생성 중..."
                        : chatbotItem
                        ? "수정하기"
                        : "입양하기"}
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatbotCreation;
