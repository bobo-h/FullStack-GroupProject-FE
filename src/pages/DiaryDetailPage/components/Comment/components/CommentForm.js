import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../../common/components/Button";
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
      const parentCommentId = lastReplyId || comment._id; // lastReplyId가 null일 경우 comment._id 사용

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
      <Row>
        <Col lg={2}>
          {/* 유저이미지 */}
          <img
            alt="User"
            src={user?.profileImage ? user.profileImage : userDefaultLogo}
            width={50}
          />
        </Col>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentInput">
              <Form.Control
                type="text"
                placeholder="댓글 추가..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              등록
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CommentForm;
