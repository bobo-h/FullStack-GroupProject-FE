import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SidebarForMyPage from "./component/SidebarForMyPage";
import "./style/myPage.style.css";

const MyPageLayout = ({ children }) => {
  return (
    <div className="my-page-toptop">
      <Container fluid className="mypage-style">
        <Row>
          <Col xs={12} md={3} className="sidebar mobile-sidebar position-fixed">
            <SidebarForMyPage />
          </Col>

          <Col xs={12} md={9} className="mypage-area">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPageLayout;
