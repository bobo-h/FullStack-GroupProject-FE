// Alert은 화면 상단 짧은 경고메세지를 위해 쓰임
// Modal은 확인, 취소 등 다양한 동작 요청을 포함하는 경우 쓰임
import ReactDOM from "react-dom";
import Button from "../../common/components/Button";
import Button2 from "../../common/components/Button2"; // 취소 버튼(?)
import "../../common/style/modal.style.css";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./../style/modal.style.css";

const Modal = ({
  title = "MeowMemo",
  message,
  children,
  onClose,
  onConfirm,
  redirectTo,
  additionalState = {},
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  showCancelButton = false,
}) => {
  const navigate = useNavigate();

  // 확인 버튼 동작 처리
  const handleConfirm = () => {
    if (onConfirm) onConfirm(); // 확인 동작 실행
    if (redirectTo) {
      navigate(redirectTo, { state: additionalState });
    }
    if (onClose) onClose(); // 닫기 동작 실행
  };

  // 닫기 버튼 동작 처리
  const handleClose = () => {
    if (onClose) onClose(); // 닫기 동작 실행
  };

  const modalContent = (
    <div className="modal">
      <div className="modal__overlay" onClick={handleClose}>
        <div className="modal__container">
          <button className="modal__close-btn" onClick={handleClose}>
            ×
          </button>
          <h4 className="modal__title">{title}</h4>
          <div className="modal__content">
            {message ||
              (children &&
              (typeof children === "string" || React.isValidElement(children))
                ? children
                : "알림 내용이 없습니다.")}
          </div>
          <Row>
            <Col className="modal__btn-group">
              <Button onClick={handleConfirm} className="modal__btn">
                {confirmButtonText}
              </Button>
              {showCancelButton && (
                <Button2
                  onClick={handleClose}
                  className="modal__button modal__button--cancel"
                >
                  {cancelButtonText}
                </Button2>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
