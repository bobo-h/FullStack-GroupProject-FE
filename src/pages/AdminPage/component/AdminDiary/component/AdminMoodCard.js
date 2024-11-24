import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CustomModal from "../../../../../common/components/CustomModal";
import "../style/adminMood.style.css";
import Button2 from "../../../../../common/components/Button2";
import { useDispatch } from "react-redux";
import {
  setSelectedMood,
  deleteMood,
  getMoodList,
} from "../../../../../features/mood/moodSlice";

const AdminMoodCard = ({ mood, setMode, setShowDialog }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleClickEditItem = () => {
    setMode("edit");
    dispatch(setSelectedMood(mood));
    setShowDialog(true);
  };

  const handleClickDeleteItem = () => {
    dispatch(deleteMood(mood._id))
      .then(() => {
        setModalContent("무드 삭제 완료하였습니다!");
        setShowModal(true);
      })
      .catch(() => {
        setModalContent("무드 삭제 실패!");
        setShowModal(true);
      });
  };

  return (
    <div className="mood-table-content">
      {showModal && (
        <CustomModal
          message={modalContent}
          redirectTo="/admin"
          onClose={() => {
            setShowModal(false);
            setShowDialog(false);
            dispatch(getMoodList({ page: 1 }));
          }}
          showCancelButton={false}
        />
      )}
      <Container className="mood-card-content">
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center mood-id">
            {mood.id}
          </Col>
          <Col md={2} className="d-flex align-items-center mood-img">
            <img
              src={mood.image}
              alt={mood.name}
              className="img-fluid mood-admin-img"
            />
          </Col>
          <Col md={2} className="d-flex align-items-center mood-name ">
            {mood.name}
          </Col>
          <Col md={3} className="d-flex align-items-center mood-description">
            {mood.description}
          </Col>
          <Col md={1} className="d-flex align-items-cente mood-btn"></Col>

          <Col
            md={3}
            className="d-flex align-items-center justify-content-center"
          >
            <Button2 className="btn-gap" onClick={handleClickEditItem}>
              수정
            </Button2>
            <Button2 onClick={handleClickDeleteItem}>삭제</Button2>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminMoodCard;
