import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../../../features/comment/commentSlice";
import Comment from "./components/Comment";
import CommentReply from "./components/CommentReply";
import CommentForm from "./components/CommentForm";

const CommentArea = ({ diaryId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);

  //댓글 들어오나 확인
  console.log("댓글들", comments);

  useEffect(() => {
    dispatch(getCommentList(diaryId));
  }, [dispatch, diaryId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
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
