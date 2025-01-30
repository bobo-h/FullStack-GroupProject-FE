import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import "../style/comment.style.css";

const CommentReply = ({ comment }) => {
  const [lastReplyId, setLastReplyId] = useState(null);

  const findLastReplyId = (replies) => {
    if (!replies || replies.length === 0) return null;

    let lastId = null;
    replies.forEach((reply) => {
      lastId = reply._id;
      if (reply.replies && reply.replies.length > 0) {
        const nestedLastId = findLastReplyId(reply.replies);
        if (nestedLastId) lastId = nestedLastId;
      }
    });

    return lastId;
  };

  useEffect(() => {
    if (comment.replies && comment.replies.length > 0) {
      const deepestLastReplyId = findLastReplyId(comment.replies);
      setLastReplyId(deepestLastReplyId);
    }
  }, [comment.replies]);

  const renderReplies = (replies) => {
    return replies && replies.length > 0 ? (
      <>
        {replies.map((nestedReply) => (
          <Row key={nestedReply._id} className="comment__reply-style">
            <Col>
              <div>
                <span className="comment__reply-name">
                  {nestedReply.userId?.name ||
                    nestedReply.chatbotId?.name ||
                    "Anonymous"}
                </span>
                {": "}
                {nestedReply.content || "No content provided"}
              </div>
              {renderReplies(nestedReply.replies)}
            </Col>
          </Row>
        ))}
      </>
    ) : null;
  };

  return (
    <div>
      <Container>
        {comment.replies && comment.replies.length > 0 ? (
          comment.replies.map((reply) => (
            <Row key={reply._id} className="comment__reply-style">
              <Col>
                <div>
                  <span className="comment__reply-name">
                    {reply.userId?.name || reply.chatbotId?.name || "Anonymous"}
                  </span>
                  {" : "}
                  <span>{reply.content || "No content provided"}</span>
                </div>
                {renderReplies(reply.replies)}
              </Col>
            </Row>
          ))
        ) : (
          <div> 답글을 작성 해 주세요!</div>
        )}
      </Container>
    </div>
  );
};

export default CommentReply;
