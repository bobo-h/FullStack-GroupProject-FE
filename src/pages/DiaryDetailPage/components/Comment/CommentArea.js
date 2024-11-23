import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../../../features/comment/commentSlice";
import Comment from "./components/Comment";
import "./style/comment.style.css"


const CommentArea = ({ diaryId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);

  useEffect(() => {
    dispatch(getCommentList(diaryId));
  }, [dispatch, diaryId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="comment-area-list">
      <h3 className="comment-count"><i class="ri-message-3-line"></i> 댓글 {comments?.length || 0} 개</h3>
      {comments && comments.length > 0 ? (
        <>
          <Comment comments={comments} />
        </>
      ) : (
        <p>No comments yet.</p>
      )}

    </div>
  );
};

export default CommentArea;
