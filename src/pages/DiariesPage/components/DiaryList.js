import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { getDiaryList } from "../../../features/diary/diarySlice";
import "../style/diaryList.style.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DiaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { diaryList, loading, currentPage, totalPages, error } = useSelector(
    (state) => state.diary
  );

  // Fetch diaries when the component mounts
  useEffect(() => {
    if (currentPage === 1) {
      dispatch(getDiaryList(1));
    }
  }, [dispatch]);

  // Fetch the next page when the user scrolls into view
  useEffect(() => {
    if (inView && currentPage < totalPages) {
      dispatch(getDiaryList(currentPage + 1));
    }
  }, [inView, currentPage, totalPages, dispatch]);

  if (loading && currentPage === 1) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  return (
    <Container className="diary-list">
      {diaryList.map((entry) => {
        const dateObj = new Date(entry.seletedDate);
        const dayOfWeek = DAYS[dateObj.getDay()];
        return (
          <Row
            key={entry.id}
            className="diary-list__item mx-0"
            onClick={() => navigate(`/diaries/${entry.id}`)}
          >
            <Col xs={2} className="diary-list__item-date rounded-4">
              <p className="diary-list__item-date-day text-muted mb-0">
                {dayOfWeek}
              </p>
              <h3 className="diary-list__item-date-number font-weight-bold">
                {dateObj.getDate()}
              </h3>
            </Col>
            <Col xs={7} className="diary-list__item-content ms-2">
              <div className="diary-list__item-content-header d-flex align-items-center">
                <Badge bg="info" className="diary-list__item-mood">
                  {entry.mood}
                </Badge>
                <h5 className="diary-list__item-title mb-0 ms-2">
                  {entry.title}
                </h5>
              </div>
              <p className="diary-list__item-description text-muted mb-0">
                {entry.content}
              </p>
            </Col>
            <Col xs={3} className="diary-list__item-photo px-0">
              {entry.photo && <img src={entry.photo} alt={entry.title} />}
            </Col>
          </Row>
        );
      })}
      <div ref={ref} className="text-center mt-4">
        {loading && currentPage > 1 && <Spinner animation="border" />}
        {currentPage >= totalPages && <p>No more diary entries to load.</p>}
      </div>
    </Container>
  );
};

export default DiaryList;
