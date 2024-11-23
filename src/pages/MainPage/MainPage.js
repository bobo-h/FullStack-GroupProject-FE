import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as CalendarIcon } from "../../assets/calendar.svg";
import { ReactComponent as AdminIcon } from "../../assets/admin_info.svg";
import CalendarComponent from "./components/CalendarComponent";
import MyCatsComponent from "./components/MyCatsComponent";
import "./style/mainpage.style.css";

const MainPage = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const CloseButton = ({ onClick, opt }) => (
    <button className={`close-button ${opt}`} onClick={onClick}>
      ✖
    </button>
  );

  return (
    <div className="main-container">
      <img className="cats-room" src="/backgroundimage.png" alt="cats room" />
      <MyCatsComponent />

      {user && user.level === "admin" && (
        <AdminIcon
          className="main-opt navigate-admin-button"
          onClick={() => navigate("/admin")}
        />
      )}

      {!isCalendarOpen ? (
        <CalendarIcon
          className="main-opt calendar-button"
          onClick={toggleCalendar}
        />
      ) : (
        <div className="cat-calendar-container" ref={calendarRef}>
          <CalendarComponent
            onDateClick={(date) => navigate(`/diaries/${date}`)}
          />
          <CloseButton
            opt={"calendar-close"}
            onClick={() => setIsCalendarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MainPage;
