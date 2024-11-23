import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import Button2 from "./Button2";
import "./../style/customModal.style.css";

const CustomModal = ({
  title = "MeowMemo",
  message,
  onClose,
  onConfirm, // 함수 값으로 보내주세요
  redirectTo,
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  showCancelButton = false,
  children,
}) => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    if (typeof onConfirm === "function") {
      onConfirm();
    } else if (redirectTo) {
      navigate(redirectTo);
    }
  };
  return ReactDOM.createPortal(
    <div className="CustomModal" style={{ fontFamily: "HakgyoansimBunpilR" }}>
      <div className="CustomModal__overlay" onClick={onClose}>
        <div className="CustomModal__container">
          <button className="CustomModal__close-btn" onClick={onClose}>
            ×
          </button>
          <h4 className="CustomModal__title">{title}</h4>
          <div className="CustomModal__content">{message || children}</div>
          <Row>
            <Col className="CustomModal__btn-group">
              <Button
                onClick={handleConfirm}
                className="CustomModal__btn-confirm"
              >
                {confirmButtonText}
              </Button>
              {showCancelButton && (
                <Button2 onClick={onClose} className="CustomModal__btn-cancel">
                  {cancelButtonText}
                </Button2>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default CustomModal;
