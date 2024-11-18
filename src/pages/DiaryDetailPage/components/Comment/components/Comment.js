import React from "react";
import { Container, Col, Row } from "react-bootstrap";

// 댓글
const Comment = ({comment}) => {
  return (
    <div>
      <Container>
        <Row>
          <Col lg={2}>
            챗봇 이미지
            {/* <img src="path_to_chatbot_image.jpg" alt="챗봇 이미지" /> */}
          </Col>
          <Col>
            <Row>
              <div>{comment.name}</div>
            </Row>
            <Row>
              <div>{comment.content}</div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Comment;
