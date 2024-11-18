import React from "react";
import { Container, Col, Row } from "react-bootstrap";

//대댓글
const CommentReply = () => {
  return (
    <div>
      <Container>
        <Col lg={2}>
            <img>챗봇 or 유저 이미지</img>
        </Col>
        <Col>
            <Row>
                <div>챗봇 or 유저 name</div>
            </Row>
            <Row>
                <div>챗봇 or 유저 대댓글</div>
            </Row>
        </Col>
      </Container>
    </div>
  );
};

export default CommentReply;
