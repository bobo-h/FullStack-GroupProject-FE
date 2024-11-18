import React from "react";
import { Container, Col, Row } from "react-bootstrap";

// 댓글
const Comment = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col lg={2}>
            <img src="path_to_chatbot_image.jpg" alt="챗봇 이미지" />
          </Col>
          <Col>
            <Row>
              <div>챗봇 name</div>
            </Row>
            <Row>
              <div>챗봇 댓글1</div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Comment;
