import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { photo } from "../../../assets";
import "../style/diaryList.style.css";

const DiaryList = () => {
  const groupedDiaryEntries = {
    "2024-11": [
      {
        id: 1,
        date: { year: 2024, month: 11, day: 13, dayOfWeek: "Wed" },
        title: "Lovely Autumn Walk",
        content:
          "Took a long walk in the park. The leaves are beautiful shades of orange and red!",
        photo: photo,
        mood: "Calm",
      },
      {
        id: 2,
        date: { year: 2024, month: 11, day: 10, dayOfWeek: "Sun" },
        title: "Sunday Brunch",
        content: "Had brunch with some friends. Tried a new cafe and loved it!",
        photo: photo,
        mood: "Happy",
      },
    ],
    "2024-10": [
      {
        id: 3,
        date: { year: 2024, month: 10, day: 31, dayOfWeek: "Thu" },
        title: "Halloween Fun",
        content: "Went to a Halloween party and dressed as a witch!",
        photo: photo,
        mood: "Excited",
      },
      {
        id: 4,
        date: { year: 2024, month: 10, day: 22, dayOfWeek: "Tue" },
        title: "Rainy Day",
        content:
          "Spent the day indoors reading a good book. It was cozy and relaxing.",
        photo: photo,
        mood: "Calm",
      },
      {
        id: 5,
        date: { year: 2024, month: 10, day: 20, dayOfWeek: "Sun" },
        title: "Family Gathering",
        content:
          "Had a wonderful family gathering. Everyone was so happy to see each other.",
        photo: photo,
        mood: "Happy",
      },
    ],
    "2024-09": [
      {
        id: 6,
        date: { year: 2024, month: 9, day: 2, dayOfWeek: "Mon" },
        title: "Beach Day",
        content: "Went to the beach and relaxed. The waves were calming.",
        photo: photo,
        mood: "Calm",
      },
    ],
  };

  const navigate = useNavigate();

  if (!groupedDiaryEntries || Object.keys(groupedDiaryEntries).length === 0) {
    return <p>No diary entries available.</p>;
  }

  return (
    <Container className="diary-list">
      {Object.keys(groupedDiaryEntries).map((monthYear) => (
        <div key={monthYear} className="diary-list__group">
          <h2 className="diary-list__group-title">{monthYear}</h2>
          {groupedDiaryEntries[monthYear].map((entry) => (
            <Row
              key={entry.id}
              className="diary-list__item mx-0"
              onClick={() => navigate(`/diaries/${entry.id}`)}
            >
              <Col xs={2} className="diary-list__item-date rounded-4">
                <p className="diary-list__item-date-day text-muted mb-0">
                  {entry.date.dayOfWeek}
                </p>
                <h3 className="diary-list__item-date-number font-weight-bold">
                  {entry.date.day}
                </h3>
              </Col>
              <Col xs={7} className="diary-list__item-content ms-2">
                <div className="diary-list__item-content-header d-flex align-items-center">
                  <Badge variant="info" className="diary-list__item-mood">
                    {entry.mood}
                  </Badge>
                  <h5 className="diary-list__item-title mb-0 ms-2">
                    {entry.title}
                  </h5>
                </div>
                <p className="diary-list__item-description text-muted mb-0">
                  {entry.content}
                </p>
              </Col>
              <Col xs={3} className="diary-list__item-photo px-0">
                {entry.photo && <img src={entry.photo} alt={entry.title} />}
              </Col>
            </Row>
          ))}
        </div>
      ))}
    </Container>
  );
};

export default DiaryList;
