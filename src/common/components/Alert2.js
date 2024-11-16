import React from "react";
import Button from "../../common/components/Button";
import Button2 from "../../common/components/Button2";
import { Row, Col } from "react-bootstrap";
import "../../common/style/alert.style.css";

const Alert2 = ({ children, onClose }) => {
  return (
    <div className="alert">
      <div className="alert-overlay">
        <div className="alert-container">
          <button className="alert-close-button" onClick={onClose}>
            ×
          </button>
          <h4 className="alert-title">프로젝트</h4>
          <div className="alert-content">{children}</div>
          <Row>
            <Col className="btn-gap">
              <Button onClick={onClose} className="alert-button">
                수정
              </Button>
              <Button2 onClick={onClose} className="alert-button">
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
