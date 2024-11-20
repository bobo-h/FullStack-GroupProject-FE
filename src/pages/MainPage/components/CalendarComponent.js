import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDiaryList,
  clearDiaryList,
} from "../../../features/diary/diarySlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // 추가
import "../style/calendarcomponent.style.css";

const CalendarComponent = ({ onDateClick }) => {
  const dispatch = useDispatch();
  const { diaryList, loading } = useSelector((state) => state.diary);

  useEffect(() => {
    // 초기 데이터 로드
    dispatch(getDiaryList(1));

    return () => {
      // 컴포넌트 언마운트 시 상태 초기화
      dispatch(clearDiaryList());
    };
  }, [dispatch]);
  console.log(diaryList);

  const flattenDiaryList = (diaryList) => {
    return diaryList.flatMap((entry) => entry.diaries);
  };

  // 평탄화된 diary 데이터 생성
  const flattenedDiaries = flattenDiaryList(diaryList);

  // 날짜 셀 클릭 이벤트 핸들러
  const handleDateClick = (info) => {
    const dateStr = info.dateStr; // 클릭된 날짜 (YYYY-MM-DD 형식)

    // flattenedDiaries에서 클릭된 날짜에 해당하는 diary 찾기
    const diary = flattenedDiaries.find(
      (entry) =>
        new Date(entry.selectedDate).toISOString().split("T")[0] === dateStr
    );

    if (diary) {
      onDateClick(diary.id); // 다이어리 상세 페이지로 이동
    } else {
      console.log("No diary found for this date:", dateStr);
    }
  };

  const renderDayCellContent = (dayCell) => {
    // dayCell.date를 로컬 시간대의 "YYYY-MM-DD" 형식으로 변환
    const dateStr = new Date(dayCell.date).toLocaleDateString("en-CA");

    // diaryList의 selectedDate도 로컬 시간대로 변환
    const matchedDiary = flattenedDiaries.find((entry) => {
      const selectedDate = new Date(entry.selectedDate).toLocaleDateString(
        "en-CA"
      );
      return selectedDate === dateStr;
    });

    return (
      <div className="day-cell-content">
        <div className="date-text">{dayCell.dayNumberText}</div>
        {matchedDiary && (
          <img
            src={matchedDiary.mood.image}
            alt="mood icon"
            className="paw-mark"
          />
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick} // 날짜 클릭 이벤트 핸들러 연결
        dayCellContent={renderDayCellContent} // 날짜 셀 표시 방식 연결
      />
    </div>
  );
};

export default CalendarComponent;
