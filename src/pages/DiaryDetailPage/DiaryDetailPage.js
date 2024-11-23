import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDiaryDetail, clearError } from "../../features/diary/diarySlice";
import DiaryDetail from "./components/DiaryDetail";
import CommentArea from "./components/Comment/CommentArea";
import { Container, Col, Row } from "react-bootstrap";
import "./style/diaryDetialPage.style.css";

const DiaryDetailPage = () => {
  const { diaryId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (diaryId) {
      dispatch(getDiaryDetail(diaryId));
    }

    return () => {
      dispatch(clearError());
    };
  }, [diaryId, dispatch]);

  return (
    <Container className="px-0">
      <Row className="diary-detail-row">
        <Col className="diary-detail-page px-4">
          <DiaryDetail />
        </Col>
        <Col className="comment-area-content">
          <CommentArea diaryId={diaryId} />
        </Col>
      </Row>
    </Container>
  );
};

export default DiaryDetailPage;
