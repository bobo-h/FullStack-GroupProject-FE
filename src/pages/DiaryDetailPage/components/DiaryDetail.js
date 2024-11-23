import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiary } from "../../../features/diary/diarySlice";
import CustomModal from "./../../../common/components/CustomModal";
import Button from "./../../../common/components/Button";
import Button2 from "./../../../common/components/Button2";
import "./../style/diaryDetail.style.css";

const DiaryDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diaryId } = useParams();
  const { loading, selectedDiary } = useSelector((state) => state.diary);
  const { selectedDate, title, content, image, mood, _id } =
    selectedDiary || {};

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Loading date...";

  const handleEditClick = () => {
    navigate(`/diaries/${_id}/edit`);
  };

  const handleDeleteClick = () => {
    setModalMessage("해당 다이어리를 삭제하시겠습니까?");
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteDiary(diaryId))
      .unwrap()
      .then(() => {
        setModalMessage(
          "다이어리가 삭제되었습니다. 삭제된 다이어리는 <마이페이지-휴지통>에서 확인하실 수 있습니다."
        );
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      })
      .catch((error) => {
        setModalMessage("잠시 후 다시 시도해주세요");
        setShowConfirmModal(false);
      });
  };

  const handleClose = () => {
    setModalMessage(null);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Container className="diary-detail">
          <div className="diary-detail__header">
            <p className="diary-detail__date">{formattedDate}</p>
            {mood && (
              <img
                src={mood.image}
                alt={mood.name}
                className="diary-detail__mood-icon"
              />
            )}
          </div>
          <div className="diary-detail__actions">
            <Button2 className="diary-detail__btn" onClick={handleEditClick}>
              Edit
            </Button2>
            <Button className="diary-detail__btn" onClick={handleDeleteClick}>
              Delete
            </Button>
          </div>
          {image && (
            <div className="diary-detail__image-wrapper">
              <img src={image} alt={title} className="diary-detail__image" />
            </div>
          )}
          <div className="diary-detail__title-box">
            <h2 className="diary-detail__title">{title}</h2>
          </div>
          <div className="diary-detail__content-box">
            <p className="diary-detail__text">{content}</p>
          </div>
          {showConfirmModal && (
            <CustomModal
              message={modalMessage}
              onClose={handleClose}
              onConfirm={handleConfirmDelete}
              showCancelButton={true}
            />
          )}
          {showSuccessModal && (
            <CustomModal
              message={modalMessage}
              onClose={handleClose}
              redirectTo={"/diaries"}
              showCancelButton={false}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default DiaryDetail;
