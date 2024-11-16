import React from "react";
import SidebarForMyPage from "./component/SidebarForMyPage";
import UserInfo from "./component/UserInfo";
import { Col, Container, Row } from "react-bootstrap";
import "./style/sidebarForMyPage.style.css";

const MyPage = () => {
  return (
    <div className="my-page-toptop">
      <Container fluid className="mypage-style">
        <Row>
          {/* 사이드바: 화면 높이에 고정 */}
          <Col xs={12} md={3} className="sidebar mobile-sidebar position-fixed">
            <SidebarForMyPage />
          </Col>

          {/* 콘텐츠: 사이드바 옆으로 오프셋 적용 */}
          <Col
            xs={12}
            md={{ span: 9, offset: 3 }}
            className="userInfo-area fixed-offset"
          >
            {/* 유저 정보 섹션 */}
            <Row className="mt-4">
              <Col>
                <UserInfo />
              </Col>
            </Row>

            {/* 추가 콘텐츠 섹션 */}
            <Row className="mt-5">
              <Col>
                <div className="additional-content">
                  {/* 여기에 새로운 콘텐츠 컴포넌트를 추가할 수 있습니다 */}
                  <h2>추가 콘텐츠</h2>
                  <p>
                    이곳에 유저의 다른 정보를 표시하거나 다른 기능을 추가할 수
                    있습니다.
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPage;
