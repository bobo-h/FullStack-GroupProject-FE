import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../../../features/comment/commentSlice";
import Comment from "./components/Comment";
import CommentReply from "./components/CommentReply";
import CommentForm from "./components/CommentForm";

const CommentArea = ({diaryId}) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.diary);
 
  useEffect(() => {
    dispatch(getCommentList(diaryId));
  }, [dispatch, diaryId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

 
  return (
    <div>
      {comments && comments.length > 0 ? (
        <>
          {/* 첫 번째 댓글 */}
          <Comment comment={comments[0]} />

          {/* 나머지 댓글 */}
          {comments.slice(1).map((comment, index) => (
            <CommentReply key={comment.id || index} comment={comment} />
          ))}
          {/* 댓글 입력 */}
          <CommentForm diaryId = {diaryId}/>
        </>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default CommentArea;
