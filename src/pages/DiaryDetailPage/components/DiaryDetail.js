import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./../style/diaryDetail.style.css";
import Button from "./../../../common/components/Button";

const DiaryDetail = ({ diaryEntry }) => {
  const navigate = useNavigate();
  const { date, title, content, photo, mood } = diaryEntry;

  return (
    <Container className="diary-detail">
      <Row className="justify-content-between align-items-center mb-4">
        <Col xs="auto">
          <p className="diary-detail__date text-muted mb-0">
            {date.dayOfWeek}, {date.year}-{String(date.month).padStart(2, "0")}-
            {String(date.day).padStart(2, "0")}
          </p>
        </Col>
        <Col xs="auto">
          <Badge bg="info" className="diary-detail__mood">
            {mood}
          </Badge>
        </Col>
      </Row>
      {photo && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} className="diary-detail__photo-container">
            <h2 className="diary-detail__photo-title">{title}</h2>
            <img
              src={photo}
              alt={title}
              className="img-fluid rounded diary-detail__photo"
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <p className="diary-detail__text">{content}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className="diary-detail__back-btn"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </Button>
        </Col>
        <Col>
          <Button className="diary-detail__edit-btn">Edit</Button>
        </Col>
        <Col>
          <Button className="diary-detail__delete-btn">Delete</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DiaryDetail;
