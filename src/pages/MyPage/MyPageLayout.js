import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SidebarForMyPage from "./component/SidebarForMyPage";
import "./style/myPage.style.css";

const MyPageLayout = ({ children }) => {
  return (
    <div className="my-page-toptop">
      <Container fluid className="mypage-style">
        <Row>
          {/* 사이드바 */}
          <Col xs={12} md={3} className="sidebar mobile-sidebar position-fixed">
            <SidebarForMyPage />
          </Col>

          {/* 메인 콘텐츠 영역 */}
          <Col xs={12} md={9} className="mypage-area offset-md-3">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPageLayout;
