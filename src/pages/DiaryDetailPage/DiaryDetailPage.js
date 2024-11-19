import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiaryDetail, clearError } from "../../features/diary/diarySlice";
import DiaryDetail from "./components/DiaryDetail";
import CommentArea from "./components/Comment/CommentArea";
import { Spinner, Container, Col, Row } from "react-bootstrap";

const DiaryDetailPage = () => {
  const { diaryId } = useParams();
  const dispatch = useDispatch();

  const { selectedDiary, loading, error } = useSelector((state) => state.diary);

  useEffect(() => {
    // Diary 상세 정보를 가져옴
    if (diaryId) {
      dispatch(getDiaryDetail(diaryId));
    }

    return () => {
      dispatch(clearError()); // 컴포넌트 언마운트 시 에러 초기화
    };
  }, [diaryId, dispatch]);

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!selectedDiary) {
    return <p>Diary entry not found.</p>;
  }

  return (
    <div>
      <Col>
      <DiaryDetail selectedDiary={selectedDiary} />
      </Col>
      <Col>
        <CommentArea diaryId = {diaryId}/>
      </Col>
    </div>
  );
};

export default DiaryDetailPage;
