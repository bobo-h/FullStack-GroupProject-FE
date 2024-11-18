import React, { useState } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../style/chatbotList.style.css";
import Button2 from "../../../common/components/Button2";
import ChatbotCreation from "../../ChatbotPage/ChatbotPage";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatbot } from "../../../features/chatbot/chatbotSlice";
import Alert from "../../../common/components/Alert";

const ChatbotList = ({ chatbotItem }) => {
  //   const dispatch = useDispatch();
  //   const [showAlert, setShowAlert] = useState(false);
  //   const [alertContent, setAlertContent] = useState("");

  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 관리
  // 수정 버튼 클릭 핸들러
  const handleModifyClick = () => {
    setIsEditing(true); // 수정 모드 활성화
  };

  // 삭제 버튼 클릭 핸들러
  //   const handleDeleteClick = () => {
  //     dispatch(deleteChatbot({ chatbotId: chatbotItem?._id }))
  //       .then(() => {
  //         setAlertContent("해당 챗봇이 삭제되었습니다.");
  //         setShowAlert(true);
  //       })
  //       .catch((error) => {
  //         console.log("삭제 실패", error);
  //         setAlertContent("삭제에 실패했습니다!");
  //         setShowAlert(true);
  //       });
  //   };
  return (
    <>
      {/* {showAlert && (
        <Alert message={alertContent} onClose={() => setShowAlert(false)} />
      )} */}
      {/* 수정 모드 여부에 따라 ChatbotCreation 컴포넌트 표시 */}
      {isEditing ? (
        <ChatbotCreation chatbotItem={chatbotItem} /> // 수정 화면 컴포넌트
      ) : (
        <div className="chatbot-list-card">
          <Row className="align-items-center">
            <Col xs={1} className="radio-check">
              <Form.Check aria-label="option 1" />
            </Col>
            <Col xs={3} md={3} className="chatbot-image-area">
              <img
                src={chatbotItem?.image}
                alt={chatbotItem?.productId?.name || "상품 이미지"}
                className="chatbot-image"
              />
            </Col>
            <Col xs={5} md={5} className="chatbot-info-area">
              <div className="chatbot-info__name">
                <strong>
                  챗봇명: {chatbotItem?.productId?.name || "챗봇 이름"}
                </strong>
              </div>
              <div className="chatbot-info__personality">
                <strong>
                  챗봇 성격: {chatbotItem?.productId?.name || "챗봇 성격"}
                </strong>
              </div>
            </Col>
            <Col xs={3} className="vertical-middle">
              <Button2
                className="chatbot-btn__modify"
                onClick={handleModifyClick}
              >
                수정
              </Button2>
              <Button2
                className="chatbot-btn__delete"
                // onClick={handleDeleteClick}
              >
                삭제
              </Button2>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default ChatbotList;
