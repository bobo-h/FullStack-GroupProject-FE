import React, { useEffect, useRef, useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeletedDiaryList,
  restoreDiary,
  clearDeletedDiaryList,
} from "../../features/diary/diarySlice";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import Button from "../../common/components/Button";
import CustomModal from "../../common/components/CustomModal";
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

  const observerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);

  useEffect(() => {
    dispatch(getDeletedDiaryList({ page: deletedCurrentPage }));
    return () => {
      dispatch(clearDeletedDiaryList());
    };
  }, [dispatch]);

  const openModal = (diaryId) => {
    setSelectedDiaryId(diaryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDiaryId(null);
    setIsModalOpen(false);
  };

  const handleRestoreConfirm = () => {
    if (selectedDiaryId) {
      dispatch(restoreDiary(selectedDiaryId))
        .unwrap()
        .then(() => {
          alert("다이어리가 복구되었습니다!");
        })
        .catch((err) => {
          alert("복구에 실패했습니다: " + err);
        })
        .finally(() => {
          closeModal();
        });
    }
  };

  const fetchMoreDiaries = useCallback(() => {
    if (deletedCurrentPage < deletedTotalPages && !loading) {
      dispatch(getDeletedDiaryList({ page: deletedCurrentPage + 1 }));
    }
  }, [deletedCurrentPage, deletedTotalPages, loading, dispatch]);

  const lastDiaryRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreDiaries();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, fetchMoreDiaries]
  );

  return (
    <MyPageLayout>
      <div className="diary-bin">
        <Container>
          <Row>
            <Col md={12}>
              <h2 className="diary-bin__title">휴지통</h2>
            </Col>
          </Row>
          {loading && deletedCurrentPage === 1 ? (
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
                  <Row
                    key={diary._id}
                    className="diary-bin__row"
                    ref={
                      index === deletedDiaryList.length - 1
                        ? lastDiaryRef
                        : null
                    }
                  >
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
                    <Col md={2}>
                      {new Date(diary.selectedDate).toISOString().split("T")[0]}
                    </Col>
                    <Col md={1}>
                      <Button
                        className="diary-bin__restore-button"
                        onClick={() => openModal(diary._id)}
                      >
                        복구
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Container>
              {loading && (
                <div className="diary-bin__spinner">
                  <LoadingSpinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </LoadingSpinner>
                </div>
              )}
            </div>
          )}
        </Container>

        {isModalOpen && (
          <CustomModal
            message="해당 다이어리를 복구하시겠습니까?"
            onClose={closeModal}
            onConfirm={handleRestoreConfirm}
            confirmButtonText="복구"
            cancelButtonText="취소"
            showCancelButton={true}
          />
        )}
      </div>
    </MyPageLayout>
  );
};

export default DiaryBinPage;
