import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDiaryList,
  clearDiaryList,
} from "../../../features/diary/diarySlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../style/calendarcomponent.style.css";

const CalendarComponent = ({ onDateClick }) => {
  const dispatch = useDispatch();
  const { diaryList, loading } = useSelector((state) => state.diary);

  useEffect(() => {
    dispatch(getDiaryList(1));

    return () => {
      dispatch(clearDiaryList());
    };
  }, [dispatch]);
  console.log(diaryList);

  const flattenDiaryList = (diaryList) => {
    return diaryList.flatMap((entry) => entry.diaries);
  };

  const flattenedDiaries = flattenDiaryList(diaryList);

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;

    const diary = flattenedDiaries.find(
      (entry) =>
        new Date(entry.selectedDate).toISOString().split("T")[0] === dateStr
    );

    if (diary) {
      onDateClick(diary.id);
    } else {
      console.log("No diary found for this date:", dateStr);
    }
  };

  const renderDayCellContent = (dayCell) => {
    const dateStr = new Date(dayCell.date).toLocaleDateString("en-CA");

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
        dateClick={handleDateClick}
        dayCellContent={renderDayCellContent}
      />
    </div>
  );
};

export default CalendarComponent;
