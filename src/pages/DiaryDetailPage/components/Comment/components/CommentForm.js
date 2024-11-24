import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUserComment } from "../../../../../features/comment/commentSlice";
import userDefaultLogo from "../../../../../assets/userDefaultLogo.png";

const CommentForm = ({ comment, lastReplyId }) => {
  const [reply, setReply] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  console.log("user", user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (reply.trim()) {
      const parentCommentId = lastReplyId || comment._id;

      dispatch(
        addUserComment({
          diaryId: comment.diaryId,
          userId: comment.userId,
          chatbotId: comment.chatbotId,
          personality: comment.chatbotId.personality,
          parentCommentId,
          content: reply,
        })
      );
      setReply("");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col xs="auto">
            <img
              alt="User"
              src={user?.profileImage ? user.profileImage : userDefaultLogo}
              width={50}
              className="comment-user-img"
            />
          </Col>
          <Col xs>
            <Form.Group controlId="commentInput" className="mb-0 comment-input">
              <Form.Control
                className="comment-user-input"
                type="text"
                placeholder="댓글 추가..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="text-end">
            <button
              variant="primary"
              type="submit"
              className="send-icon d-flex align-items-center justify-content-center"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CommentForm;
