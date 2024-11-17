// Button.js
import React from "react";
import "../../common/style/button.style.css";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`common-button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
