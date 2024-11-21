import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDiaryDetail, clearError } from "../../features/diary/diarySlice";
import DiaryDetail from "./components/DiaryDetail";
import CommentArea from "./components/Comment/CommentArea";
import { Col } from "react-bootstrap";

const DiaryDetailPage = () => {
  const { diaryId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Diary 상세 정보를 가져옴
    if (diaryId) {
      dispatch(getDiaryDetail(diaryId));
    }

    return () => {
      dispatch(clearError()); // 컴포넌트 언마운트 시 에러 초기화
    };
  }, [diaryId, dispatch]);

  return (
    <div>
      <Col>
        <DiaryDetail />
      </Col>
      <Col>
        <CommentArea diaryId={diaryId} />
      </Col>
    </div>
  );
};

export default DiaryDetailPage;
