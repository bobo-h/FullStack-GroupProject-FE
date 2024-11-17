import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createChatbot } from "../../features/chatbot/chatbotSlice";
import "./style/chatbot.style.css";
import Button from "../../common/components/Button";
import PersonalityMBTI from "./component/PersonalityMBTI/PersonalityMBTI";
import Spinner from "react-bootstrap/Spinner";
import Button2 from "../../common/components/Button2";
import Alert from "../../common/components/Alert";
//import PersonalityBox from './component/PersonalityBox/PersonalityBox';

// ChatbotCreation 컴포넌트
const ChatbotCreation = () => {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [isDirectInput, setIsDirectInput] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const dispatch = useDispatch();
  const { loading, registrationError, success } = useSelector(
    (state) => state.chatbot
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChatbot({ name, personality }))
      .then(() => {
        setAlertContent("입양에 성공했습니다!");
        setShowAlert(true);
      })
      .catch((error) => {
        console.log("입양 실패", error);
        setAlertContent("입양에 실패했습니다!");
        setShowAlert(true);
      });
  };

  const handlePersonalityChange = (selectedPersonality) => {
    setPersonality(selectedPersonality);
  };

  const handleInputTypeChange = (inputType) => {
    setIsDirectInput(inputType);
    setPersonality("");
  };

  return (
    <div className="chatbot-create-modal">
      {showAlert && (
        <Alert
          message={alertContent}
          onClose={() => setShowAlert(false)}
          redirectTo="/"
        />
      )}
      <Container
        className=" d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Row className="text-center chatbot-create-content">
          <h3 className="create-modal-title">입양 서류</h3>
          <Col lg={3} className="">
            {/* <img 
                        className='chatbot-image-size'
                        alt="Cute Cat" 
                    /> */}
            <div>
              이미지 들어올 자리 <br /> <br /> 유저의 챗봇이 없을 경우 기본
              고양이 <br />
              구매루트의 경우 구매한 고양이
            </div>
          </Col>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Row className="align-items-center">
                  {registrationError && (
                    <Alert variant="danger">{registrationError}</Alert>
                  )}
                  {success && (
                    <Alert variant="success">
                      챗봇이 성공적으로 생성되었습니다!
                    </Alert>
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
                  <Col className="btn-gap">
                    <Button2
                      variant={isDirectInput ? "outline-secondary" : "primary"}
                      onClick={() => handleInputTypeChange(true)}
                    >
                      직접 입력
                    </Button2>
                    <Button
                      variant={isDirectInput ? "primary" : "outline-secondary"}
                      onClick={() => handleInputTypeChange(false)}
                    >
                      성격 선택
                    </Button>
                  </Col>
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
                      {loading ? "생성 중..." : "입양하기"}
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
