import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiary } from "../../../features/diary/diarySlice";
import CustomModal from "./../../../common/components/CustomModal";
import Button from "./../../../common/components/Button";
import "./../style/diaryDetail.style.css";

const DiaryDetail = ({ selectedDiary }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { diaryId } = useParams();
  const { loading } = useSelector((state) => state.diary);
  const { selectedDate, title, content, image, mood, _id } = selectedDiary;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [modalMessage, setModalMessage] = useState(null);

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      <Row className="justify-content-between align-items-center mb-4">
        <Col xs="auto">
          <p className="diary-detail__date text-muted mb-0">{formattedDate}</p>
        </Col>
        <Col xs="auto">
          {mood && (
            <div className="diary-detail__mood">
              <img
                src={mood.image}
                alt={mood.name}
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          )}
        </Col>
      </Row>
      {image && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} className="diary-detail__photo-container">
            <h2 className="diary-detail__photo-title">{title}</h2>
            <img
              src={image}
              alt={title}
              className="img-fluid rounded diary-detail__photo"
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <p className="diary-detail__text">{content}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className="diary-detail__back-btn"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </Button>
        </Col>
        <Col>
          <Button className="diary-detail__edit-btn" onClick={handleEditClick}>
            Edit
          </Button>
        </Col>
        <Col>
          <Button
            className="diary-detail__delete-btn"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Col>
      </Row>
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
