import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../style/adminMood.style.css"; 

const MoodTable = () => {
  return (
    <div className='mood-table-name'>
      <Container>
        <Row className="mb-4">
          <Col md={1} className="d-flex align-items-center">
            <strong>#</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>이미지</strong>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <strong>이름</strong>
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <strong>설명</strong>
          </Col>
          <Col md={3} className="d-flex align-items-center justify-content-center">
            <strong>무드관리</strong>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MoodTable;
