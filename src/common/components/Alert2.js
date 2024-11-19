import React from "react";
import Button from "../../common/components/Button";
import Button2 from "../../common/components/Button2";
import { Row, Col } from "react-bootstrap";
import "../../common/style/alert.style.css";
import { useNavigate } from "react-router-dom";

const Alert2 = ({ message, onClose, redirectTo, onConfirm }) => {

  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    onConfirm();
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <div className="alert">
      <div className="alert-overlay">
        <div className="alert-container">
          <button className="alert-close-button" onClick={onClose}>
            ×
          </button>
          <h4 className="alert-title">프로젝트</h4>
          <div className="alert-content">{message}</div>
          <Row>
            <Col className="btn-gap">
              <Button onClick={handleConfirm} className="alert-button">
                수정
              </Button>
              <Button2 onClick={handleConfirm} className="alert-button">
                취소
              </Button2>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Alert2;
