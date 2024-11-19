import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Alert from "../../../../../common/components/Alert";
import "../style/adminMood.style.css";
import Button2 from '../../../../../common/components/Button2';
import { useDispatch } from 'react-redux';
import { setSelectedMood, deleteMood, getMoodList } from "../../../../../features/mood/moodSlice";

const AdminMoodCard = ({ mood, setMode, setShowDialog }) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const handleClickEditItem = () => {
    // Edit 모드로 설정하고 다이얼로그 열기
    setMode("edit");

    // 선택한 상품을 Redux 상태에 저장
    dispatch(setSelectedMood(mood));
    setShowDialog(true);

  };

  const handleClickDeleteItem = () => {

    dispatch(deleteMood(mood._id))
      .then(() => {
        setAlertContent("무드 삭제 완료하였습니다!");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertContent("무드 삭제 실패!");
        setShowAlert(true);
      });

  };

  return (
    <div className='mood-table-content'>
      {showAlert && (
        <Alert
          message={alertContent}
          onClose={() => {
            setShowAlert(false);
            setShowDialog(false);
            dispatch(getMoodList({ page: 1 }));
          }}
          redirectTo="/admin"
        />
      )}
      <Container>
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center">
            {mood.id}
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <img src={mood.image} alt={mood.name} className="img-fluid" />
          </Col>
          <Col md={2} className="d-flex align-items-center">
            {mood.name}
          </Col>
          <Col md={3} className="d-flex align-items-center">
            {mood.description}
          </Col>
          <Col md={1} className="d-flex align-items-center">
            {/* 추가 하려면 이곳에 */}
          </Col>

          <Col md={3} className="d-flex align-items-center justify-content-center">
            <Button2 className="btn-gap" onClick={handleClickEditItem}>수정</Button2>
            <Button2 onClick={handleClickDeleteItem}>삭제</Button2>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminMoodCard;
