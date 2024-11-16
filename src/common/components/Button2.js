import React from "react";
import "../../common/style/button.style.css";

const Button2 = ({
  children,
  onClick,
  type = "button",
  className = "",
  id,
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={`common-button2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button2;
