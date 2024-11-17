import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "../style/chatbotList.style.css";
import Button from "../../../common/components/Button";
import Button2 from "../../../common/components/Button2";

const ChatbotList = ({ wishlistItem }) => {
  return (
    <>
      <div className="chatbot-list-card">
        <Row className="align-items-center">
          <Col xs={1} className="radio-check">
            <Form.Check aria-label="option 1" />
          </Col>
          <Col xs={3} md={3} className="chatbot-image-area">
            <img
              src={wishlistItem?.image}
              alt={wishlistItem?.productId?.name || "상품 이미지"}
              className="chatbot-image"
            />
          </Col>
          <Col xs={5} md={5} className="chatbot-info-area">
            <div className="chatbot-info__name">
              <strong>
                챗봇명: {wishlistItem?.productId?.name || "챗봇 이름"}
              </strong>
            </div>
            <div className="chatbot-info__personality">
              <strong>
                챗봇 성격: {wishlistItem?.productId?.name || "챗봇 성격"}
              </strong>
            </div>
          </Col>
          <Col xs={3} className="vertical-middle">
            <Button2 className="chatbot-btn__modify">수정</Button2>
            <Button2 className="chatbot-btn__delete">삭제</Button2>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatbotList;
