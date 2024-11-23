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
  const { diaryList, loading, currentPage, totalPages, error } = useSelector(
    (state) => state.diary
  );

  const observerRef = useRef();

  useEffect(() => {
    dispatch(getDiaryList({ page: 1 }));
    return () => {
      dispatch(clearDiaryList());
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

  return (
    <Container className="diary-list">
      {error && (
        <div className="diary-list__status diary-list__status--error">
          잠시 후 다시 시도해 주세요.
        </div>
      )}
      {!loading && !error && (!diaryList || diaryList.length === 0) && (
        <div className="diary-list__status diary-list__status--empty">
          일기 속에서 나만의 고양이와 이야기를 나누어 보아요!
        </div>
      )}
      {diaryList.map((group) => (
        <div key={group.yearMonth} className="diary-list__group-box">
          <h5 className="diary-list__header text-muted">
            &lt; {group.yearMonth} &gt;
          </h5>
          {group.diaries.map((diary) => (
            <Row
              key={diary.id}
              className="diary-list__item mx-0"
              onClick={() => navigate(`/diaries/${diary.id}`)}
            >
              <Col xs={2} className="diary-list__item-date">
                <p className="diary-list__item-date-day text-muted mb-0">
                  {new Date(diary.selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <h3 className="diary-list__item-date-number font-weight-bold mb-0">
                  {new Date(diary.selectedDate).getDate()}
                </h3>
              </Col>
              <Col xs={7} className="diary-list__item-content mt-0">
                <div className="diary-list__item-content-header d-flex align-items-center">
                  <div className="diary-list__item-mood">
                    <img
                      src={diary.mood.image}
                      alt={diary.mood.name}
                      className="diary-list__item-mood-icon"
                    />
                  </div>
                  <div className="diary-list__item-title-box">
                    <h5 className="diary-list__item-title mb-0 ms-2">
                      {diary.title}
                    </h5>
                    {diary.isEdited && (
                      <span className="diary-list__item-edited ms-2">
                        (수정됨)
                      </span>
                    )}
                  </div>
                </div>
                <p className="diary-list__item-description text-muted mb-0">
                  {diary.content}
                </p>
              </Col>
              {diary.image && (
                <Col xs={3} className="diary-list__item-photo px-0 m-0">
                  <img
                    src={diary.image}
                    alt={diary.title}
                    className="img-fluid rounded"
                  />
                </Col>
              )}
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
