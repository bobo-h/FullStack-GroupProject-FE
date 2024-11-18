import React from "react";
import { useDispatch } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import Button2 from "../../../../../common/components/Button2";
import { deleteUserComment } from "../../../../../features/comment/commentSlice";

//대댓글
const CommentReply = ({ comment, diaryId }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
      if (!comment.isBot) { // 챗봇 댓글은 삭제 불가
        dispatch(deleteUserComment({ diaryId, commentId: comment.id }));
      } else {
        alert("챗봇 댓글은 삭제할 수 없습니다.");
      }
    };
    
  return (
    <div>
      <Container>
        <Col lg={2}>
            <img>챗봇 or 유저 이미지</img>
        </Col>
        <Col>
            <Row>
                <div>{comment.name || "Anonymous"}</div>
            </Row>
            <Row>
            <div>{comment.content || "No content provided"}</div>
            </Row>
        </Col>
        {!comment.isBot && (
          <Button2 onClick={handleDelete}>삭제</Button2>
        )}
      </Container>
    </div>
  );
};

export default CommentReply;
