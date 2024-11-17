import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // 추가
import "../style/calendarcomponent.style.css";

const CalendarComponent = ({ onDateClick }) => {
  //const entries = ["2024-11-15", "2024-11-18"];
  // entries를 상태로 관리
  const [entries, setEntries] = useState([
    { id: "entry1", date: "2024-11-15", mood: "happy.png" },
    { id: "entry2", date: "2024-11-18", mood: "angry.png" },
    { id: "entry3", date: "2024-11-19", mood: "calm.png" },
    { id: "entry4", date: "2024-11-20", mood: "excited.png" },
    { id: "entry5", date: "2024-11-21", mood: "sad.png" },
    { id: "entry6", date: "2024-11-22", mood: "happy.png" },
  ]);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(info) => handleDateClick(info, entries, onDateClick)} // 아무 날짜나 클릭 가능하게 하려면 onDateClick만 사용
        dayCellContent={(dayCell) => renderDayCellContent(dayCell, entries)}
      />
    </div>
  );
};

// 날짜 셀 표시 방식 커스터마이징 (고양이 도장 이미지와 날짜 표시)
const renderDayCellContent = (dayCell, entries) => {
  // yyyy-mm-dd 형식으로 변환
  const dateStr = dayCell.date.toLocaleDateString("en-CA");

  // 해당 날짜가 entries에 포함되어 있는지 확인
  if (entries.some((entry) => entry.date === dateStr)) {
    // 해당 날짜에 맞는 entry 찾기
    const matchedEntry = entries.find((entry) => entry.date === dateStr);

    return (
      <div className="day-cell-content">
        <div className="date-text">{dayCell.dayNumberText}</div>
        {matchedEntry && (
          <img src={matchedEntry.mood} alt="mood icon" className="paw-mark" />
        )}
      </div>
    );
  }

  // 조건에 해당하지 않으면 기본 날짜만 렌더링
  return (
    <div className="day-cell-content">
      <div className="date-text">{dayCell.dayNumberText}</div>
    </div>
  );
};

// 날짜 셀 클릭 이벤트 핸들러 (특정 날짜만 클릭 가능하게 설정) //일기 쓴 날짜만 클릭하게 할때 사용할것
const handleDateClick = (info, entries, onDateClick) => {
  const dateStr = info.dateStr;

  // entries에 해당하는 날짜만 동작
  if (entries.some((entry) => entry.date === dateStr)) {
    console.log("Date clicked:", dateStr);
    onDateClick(dateStr);
  } else {
    console.log("This date is not clickable:", dateStr);
  }
};

export default CalendarComponent;
