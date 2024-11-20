import React, { useState } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../style/chatbotList.style.css";
import Button2 from "../../../common/components/Button2";
import ChatbotCreation from "../../ChatbotPage/ChatbotPage";
import { useDispatch, useSelector } from "react-redux";
import { updateChatbotJins } from "../../../features/chatbot/chatbotSlice";
import Alert from "../../../common/components/Alert";

const ChatbotList = ({ chatbotItem, index }) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 관리
  // 수정 버튼 클릭 핸들러
  const handleModifyClick = () => {
    setIsEditing(true); // 수정 모드 활성화
  };
  // Alert 닫힘 핸들러
  const handleAlertClose = () => {
    setShowAlert(false); // Alert 창 닫기
    setIsEditing(false); // 수정 모드 비활성화
  };

  // 비활성화 클릭 핸들러
  const handleToggleVisualization = () => {
    const newVisualizationValue = !chatbotItem.visualization; // 현재 값의 반대
    dispatch(
      updateChatbotJins({
        id: chatbotItem?._id,
        updateData: { visualization: newVisualizationValue },
      })
    )
      .then(() => {
        setAlertContent(
          `챗봇이 ${newVisualizationValue ? "활성화" : "비활성화"}되었습니다.`
        );
        setShowAlert(true);
      })
      .catch((error) => {
        console.log("상태 변경 실패", error);
        setAlertContent("상태 변경에 실패했습니다!");
        setShowAlert(true);
      });
  };
  return (
    <>
      {/* Alert 컴포넌트 */}
      {showAlert && (
        <Alert
          message={alertContent}
          onClose={handleAlertClose} // Alert 닫힘 시 호출
          redirectTo={"/my-page"}
        />
      )}
      {/* 수정 모드 여부에 따라 ChatbotCreation 컴포넌트 표시 */}
      {isEditing ? (
        <ChatbotCreation
          chatbotItem={chatbotItem}
          onEditComplete={() => {
            setAlertContent("수정이 완료되었습니다."); // Alert 메시지 설정
            setShowAlert(true); // Alert 표시
          }}
        /> // 수정 화면 컴포넌트
      ) : (
        <div
          className={`chatbot-list-card ${
            chatbotItem.visualization ? "" : "disabled-card"
          }`}
        >
          <Row className="general-chatbot-area">
            <Col xs={1} className="chatbot-num-area">
              {index + 1}
            </Col>
            <Col xs={3} md={3} className="chatbot-image-area">
              <img
                src={chatbotItem?.product_id?.image}
                alt={chatbotItem?.productId?.name || "상품 이미지"}
                className="chatbot-image"
              />
            </Col>
            <Col xs={6} md={6} className="chatbot-info-area">
              <div className="chatbot-info__name">
                <strong>챗봇명: {chatbotItem?.name || "챗봇 이름"}</strong>
              </div>
              <div className="chatbot-info__personality">
                <strong>
                  챗봇 성격: {chatbotItem?.personality || "챗봇 성격"}
                </strong>
              </div>
            </Col>
            <Col xs={2} className="chatbot-btn-list">
              <Button2
                className="chatbot-btn__modify"
                onClick={handleModifyClick}
                disabled={!chatbotItem.visualization}
              >
                수정
              </Button2>
              <Button2
                className="chatbot-btn__toggle-visualization"
                onClick={handleToggleVisualization}
              >
                {chatbotItem.visualization ? "비활성화" : "활성화"}
              </Button2>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default ChatbotList;
