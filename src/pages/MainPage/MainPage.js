import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CalendarIcon } from "../../assets/calendar.svg";
import { ReactComponent as AdminIcon } from "../../assets/admin_info.svg";
import CalendarComponent from "./components/CalendarComponent";
import MyCatsComponent from "./components/MyCatsComponent";
import "./style/mainpage.style.css";

const MainPage = () => {
  // 여기부터 캘린더 관련 기능
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  // 캘린더와 고양이 위젯, 버튼 이외의 공간 클릭 시 해당 위젯 닫기
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

    // 이벤트 리스너를 한 번만 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // 닫기 버튼 공통 컴포넌트
  const CloseButton = ({ onClick, opt }) => (
    <button className={`close-button ${opt}`} onClick={onClick}>
      ✖
    </button>
  );

  return (
    <div className="main-container">
      <img className="cats-room" src="backgroundimage.png" alt="cats room" />
      <MyCatsComponent />

      <AdminIcon
        className="main-opt navigate-admin-button"
        onClick={() => navigate(`/admin`)}
      />

      {!isCalendarOpen ? (
        <CalendarIcon
          className="main-opt calendar-button"
          onClick={toggleCalendar}
        />
      ) : (
        <div className="cat-calendar-container" ref={calendarRef}>
          <CalendarComponent
            onDateClick={(date) => navigate(`/diary/${date}`)}
          />{" "}
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
