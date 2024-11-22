import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
    setModalMessage("Are you sure you want to delete this diary?");
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteDiary(diaryId))
      .unwrap()
      .then(() => {
        setModalMessage(
          "The diary has been deleted successfully. You can check deleted diaries in My Page."
        );
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error("Failed to delete diary:", error);
        setModalMessage("Failed to delete the diary. Please try again.");
        setShowConfirmModal(false);
      });
  };

  const handleClose = () => {
    setModalMessage(null);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
  };

  return (
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
  );
};

export default DiaryDetail;
