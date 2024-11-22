import React, { useState } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import "../style/comment.style.css";
import { Link } from "react-router-dom";
import CommentReply from "./CommentReply";
import CommentForm from "./CommentForm";

// 댓글
const Comment = ({ comments }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [lastReplyId, setLastReplyId] = useState(null);

  // "더보기" 또는 "숨기기" 클릭 핸들러
  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // 현재 상태의 반대값으로 변경
    }));
  };

  return (
    <div className="comment">
      <Container>
        {comments.map((comment) => (
          <Row className="comment__general-style">
            <Col className="comment__chatbot-image-area">
              <img
                src={comment?.chatbotId?.product_id?.image}
                alt="챗봇 이미지"
                width={80}
                className="chatbot-image"
              />
            </Col>
            <Col className="comment__area">
              <Row>
                <div className="chatbot-name">{comment?.chatbotId?.name}</div>
              </Row>
              <Row>
                <div>{comment.content}</div>
              </Row>
              <Row >
                <Link
                  to="#"
                  onClick={() => toggleReplies(comment._id)}
                  className="comment__toggle-link"
                >
                  {expandedComments[comment._id] 
                  ? "--- 숨기기 ------------" : "--- 댓글 더보기 -------"}
                </Link>
              </Row>

              {/* 대댓글 표시 영역 */}
              {expandedComments[comment._id] && (
                <div className="comment__replies-area">
                  <CommentReply comment={comment} />
                </div>
              )}
            </Col>
            {expandedComments[comment._id] 
              ? <CommentForm  comment={comment} lastReplyId={lastReplyId}/> 
              : "" 
            }
          </Row>
        ))}
              
      </Container>
    </div>
  );
};

export default Comment;
