import "../style/lodingspinner.style.css";

const LoadingSpinner = () => {
  return (
    <div className="loging-container ">
      <div className="piano">
        <div className="piano-keyboard"></div>
        <div className="piano-keyboard"></div>
        <div className="piano-keyboard"></div>
        <div className="piano-keyboard"></div>
        <div className="piano-keyboard"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
