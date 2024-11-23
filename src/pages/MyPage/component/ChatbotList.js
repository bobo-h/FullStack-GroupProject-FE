import React, { useState } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import "../style/chatbotList.style.css";
import Button2 from "../../../common/components/Button2";
import ChatbotCreation from "../../ChatbotPage/ChatbotPage";
import { useDispatch, useSelector } from "react-redux";
import { updateChatbotJins } from "../../../features/chatbot/chatbotSlice";
import CustomModal from "../../../common/components/CustomModal";

const ChatbotList = ({ chatbotItem, index }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleToggleVisualization = () => {
    const newVisualizationValue = !chatbotItem.visualization;
    dispatch(
      updateChatbotJins({
        id: chatbotItem?._id,
        updateData: { visualization: newVisualizationValue },
      })
    )
      .then(() => {
        setModalContent(
          `챗봇이 ${newVisualizationValue ? "활성화" : "비활성화"}되었습니다.`
        );
        setShowModal(true);
      })
      .catch((error) => {
        console.log("상태 변경 실패", error);
        setModalContent("상태 변경에 실패했습니다!");
        setShowModal(true);
      });
  };
  return (
    <>
      {showModal && (
        <CustomModal
          message={modalContent}
          onClose={handleModalClose}
          redirectTo={"/my-page"}
        />
      )}
      {isEditing ? (
        <ChatbotCreation
          chatbotItem={chatbotItem}
          onEditComplete={() => {
            setModalContent("수정이 완료되었습니다.");
            setShowModal(true);
          }}
        />
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
