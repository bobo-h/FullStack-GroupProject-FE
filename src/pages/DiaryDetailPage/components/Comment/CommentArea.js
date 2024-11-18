import React from "react";
import { Row} from 'react-bootstrap';
import Comment from "./components/Comment";
import CommentReply from "./components/CommentReply";
import CommentForm from "./components/CommentForm";

const CommentArea = ({diaryId}) => {
  return (
    <div>
      <Row>
        <Comment diaryId = {diaryId}/>
        <CommentReply diaryId = {diaryId}/>
        <CommentForm diaryId = {diaryId}/>
      </Row>
    </div>
  );
};

export default CommentArea;
