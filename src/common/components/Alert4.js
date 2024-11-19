import React from "react";
import Button from "../../common/components/Button";
import "../../common/style/alert.style.css";
import { useNavigate } from "react-router-dom";

const Alert4 = ({ message, onClose, redirectTo, children }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (onClose) {
      onClose();
    }
    if (redirectTo) {
      navigate(redirectTo, {
        state: children && typeof children === "object" ? {
          orderUserId: children?.orderUserId,
          productImage: children?.productImage,
        } : undefined,
      });
    }
  };

  return (
    <div className="alert">
      <div className="alert-overlay">
        <div className="alert-container">
          <button className="alert-close-button" onClick={handleConfirm}>
            X
          </button>
          <h4 className="alert-title">MeowMemo</h4>
          <div className="alert-content">
            {message || (typeof children === "string" || React.isValidElement(children) ? children : "알림 내용이 없습니다.")}
          </div>
          <Button onClick={handleConfirm} className="alert-button">
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Alert4;
