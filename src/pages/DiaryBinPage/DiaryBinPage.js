import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeletedDiaryList,
  restoreDiary,
  clearDeletedDiaryList,
} from "../../features/diary/diarySlice";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import Button from "../../common/components/Button";
import MyPageLayout from "./../MyPage/MyPageLayout";
import "./styles/diaryBinPage.style.css";

const DiaryBinPage = () => {
  const dispatch = useDispatch();
  const {
    deletedDiaryList,
    deletedCurrentPage,
    deletedTotalPages,
    loading,
    error,
  } = useSelector((state) => state.diary);

  useEffect(() => {
    dispatch(getDeletedDiaryList({ page: deletedCurrentPage }));
    return () => {
      dispatch(clearDeletedDiaryList());
    };
  }, [dispatch, deletedCurrentPage]);

  const handleRestore = (diaryId) => {
    if (window.confirm("Are you sure you want to restore this diary?")) {
      dispatch(restoreDiary(diaryId))
        .unwrap()
        .then(() => {
          alert("다이어리가 복구되었습니다!");
        })
        .catch((err) => {
          alert("복구에 실패했습니다: " + err);
        });
    }
  };

  const handlePageChange = (page) => {
    dispatch(getDeletedDiaryList({ page }));
  };

  return (
    <MyPageLayout>
      <div className="diary-bin">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="diary-bin__title">휴지통</h2>
            </Col>
          </Row>
          {loading ? (
            <div className="diary-bin__spinner">
              <LoadingSpinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </LoadingSpinner>
            </div>
          ) : error ? (
            <div className="diary-bin__error">
              <p className="diary-bin__error-message">{error}</p>
            </div>
          ) : (
            <div className="diary-bin__table">
              <Container>
                <Row className="diary-bin__header">
                  <Col md={1}>#</Col>
                  <Col md={2}>이미지</Col>
                  <Col md={2}>제목</Col>
                  <Col md={4}>내용</Col>
                  <Col md={2}>날짜</Col>
                  <Col md={1}>복구</Col>
                </Row>
                {deletedDiaryList.map((diary, index) => (
                  <Row key={diary._id} className="diary-bin__row">
                    <Col md={1}>{index + 1}</Col>
                    <Col md={2}>
                      {diary.image ? (
                        <img
                          src={diary.image}
                          alt={diary.title}
                          className="diary-bin__image"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </Col>
                    <Col md={2}>{diary.title}</Col>
                    <Col md={4}>{diary.content}</Col>
                    <Col md={2}>{diary.selectedDate}</Col>
                    <Col md={1}>
                      <Button onClick={() => handleRestore(diary._id)}>
                        복구
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Container>
              <div className="diary-bin__pagination">
                {deletedCurrentPage > 1 && (
                  <Button
                    onClick={() => handlePageChange(deletedCurrentPage - 1)}
                  >
                    Previous
                  </Button>
                )}
                {deletedCurrentPage < deletedTotalPages && (
                  <Button
                    onClick={() => handlePageChange(deletedCurrentPage + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>
    </MyPageLayout>
  );
};

export default DiaryBinPage;
