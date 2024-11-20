import React from "react";
import Button from "../../common/components/Button";
import Button2 from "../../common/components/Button2";
import "../../common/style/alert.style.css";


const Alert4 = ({ message, onClose, onCancel , onConfirm  }) => {
  if (!message) {
    return null; // Don't render if message is null
  }
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
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
            {message || "알림 내용이 없습니다."}
          </div>
          <div className="alert-buttons">
            <Button onClick={handleConfirm} className="alert-button">
              확인
            </Button>
            <Button2 onClick={handleCancel} className="alert-button">
              취소
            </Button2>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Alert4;
