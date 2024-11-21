import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  getDiaryList,
  clearDiaryList,
} from "../../../features/diary/diarySlice";
import "../style/diaryList.style.css";

const DiaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { diaryList, loading, currentPage, totalPages } = useSelector(
    (state) => state.diary
  );

  const observerRef = useRef();

  // 초기 데이터 로드
  useEffect(() => {
    dispatch(getDiaryList({ page: 1 }));
    return () => {
      dispatch(clearDiaryList()); // 컴포넌트 언마운트 시 상태 초기화
    };
  }, [dispatch]);

  // Intersection Observer 콜백
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (
        target.isIntersecting && // 화면에 보이는 경우
        currentPage < totalPages && // 현재 페이지가 전체 페이지보다 작은 경우
        !loading // 로딩 중이 아닌 경우
      ) {
        dispatch(getDiaryList({ page: currentPage + 1 }));
      }
    },
    [dispatch, currentPage, totalPages, loading]
  );

  // Observer 등록
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  // 빈 상태 처리
  if (!diaryList || diaryList.length === 0) {
    return <div>No diaries found for the selected filters.</div>;
  }

  return (
    <Container className="diary-list">
      {diaryList.map((group) => (
        <div key={group.yearMonth}>
          <h5 className="text-muted">{group.yearMonth}</h5>
          {group.diaries.map((diary) => (
            <Row
              key={diary.id}
              className="diary-list__item mx-0"
              onClick={() => navigate(`/diaries/${diary.id}`)}
            >
              <Col xs={2} className="diary-list__item-date rounded-4">
                <p className="diary-list__item-date-day text-muted mb-0">
                  {new Date(diary.selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <h3 className="diary-list__item-date-number font-weight-bold mb-0">
                  {new Date(diary.selectedDate).getDate()}
                </h3>
              </Col>
              <Col xs={7} className="diary-list__item-content ms-2">
                <div className="diary-list__item-content-header d-flex align-items-center">
                  <div className="diary-list__item-mood">
                    <img
                      src={diary.mood.image}
                      alt={diary.mood.name}
                      className="diary-list__item-mood-icon me-2"
                    />
                  </div>
                  <h5 className="diary-list__item-title mb-0 ms-2">
                    {diary.title}
                  </h5>
                </div>
                <p className="diary-list__item-description text-muted mb-0">
                  {diary.content}
                </p>
              </Col>
              <Col xs={3} className="diary-list__item-photo px-0">
                <img
                  src={diary.image}
                  alt={diary.title}
                  className="img-fluid rounded"
                />
              </Col>
            </Row>
          ))}
        </div>
      ))}
      <div ref={observerRef} className="text-center mt-4">
        {loading && <Spinner animation="border" />}
        {!loading && currentPage >= totalPages && (
          <p>No more diary entries to load.</p>
        )}
      </div>
    </Container>
  );
};

export default DiaryList;
