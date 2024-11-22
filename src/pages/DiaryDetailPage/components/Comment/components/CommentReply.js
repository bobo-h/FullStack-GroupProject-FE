import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import CommentForm from "./CommentForm";
import "../style/comment.style.css"

//대댓글
const CommentReply = ({ comment }) => {
  const [lastReplyId, setLastReplyId] = useState(null); // 가장 깊은 마지막 대댓글 ID 저장

  // 가장 깊은 계층에서 마지막 대댓글의 `_id`를 찾는 함수
  const findLastReplyId = (replies) => {
    if (!replies || replies.length === 0) return null;

    let lastId = null;
    replies.forEach((reply) => {
      // 현재 대댓글의 마지막 대댓글 `_id`를 추적
      lastId = reply._id;
      // 중첩된 대댓글이 있는 경우, 더 깊은 대댓글의 `_id`를 추적
      if (reply.replies && reply.replies.length > 0) {
        const nestedLastId = findLastReplyId(reply.replies);
        if (nestedLastId) lastId = nestedLastId; // 더 깊은 대댓글이 있으면 갱신
      }
    });

    return lastId;
  };

  // 댓글 데이터를 기반으로 가장 마지막 대댓글 ID 추적
  useEffect(() => {
    if (comment.replies && comment.replies.length > 0) {
      const deepestLastReplyId = findLastReplyId(comment.replies);
      setLastReplyId(deepestLastReplyId); // 가장 깊은 대댓글의 마지막 `_id` 업데이트
    }
  }, [comment.replies]);

  console.log("제일 마지막 댓글 ID : ", lastReplyId);

  {
    /* 또 다른 대댓글이 있을 경우 재귀적으로 다시 renderReplies 호출 */
  }
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
              {renderReplies(nestedReply.replies)} {/* 재귀적으로 호출 */}
            </Col>
          </Row>
        ))}
      </>
    ) : null;
  };

  return (
    <div  >
      <Container >
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
                {/* 재귀적으로 reply 안에 reply가 있다면 그 값을 가져오기 */}
                {renderReplies(reply.replies)} {/* 재귀적으로 호출 */}
              </Col>
            </Row>
          ))
        ) : (
          <div> 답글을 작성 해 주세요!</div>
        )}
        </Container>
        {/* 댓글 작성 폼 */}
        {/* <CommentForm comment={comment} lastReplyId={lastReplyId} /> */}

    </div>
  );
};

export default CommentReply;
