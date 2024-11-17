import React from "react";
import SidebarForMyPage from "./component/SidebarForMyPage";
import UserInfo from "./component/UserInfo";
import { Col, Container, Row } from "react-bootstrap";
import "./style/sidebarForMyPage.style.css";
import "./style/myPage.style.css";
import ChatbotList from "./component/ChatbotList";
import userDefaultLogo from "../../assets/userDefaultLogo.png";
import Button2 from "../../common/components/Button2";
const MyPage = () => {
  const chatbotList = [
    {
      productId: {
        id: "product123",
        name: "스타일리시 선글라스",
      },
      price: 19900,
      image: userDefaultLogo,
    },
    {
      productId: {
        id: "product456",
        name: "따뜻한 캐시미어 스웨터",
      },
      price: 129000,
      image: userDefaultLogo,
    },
    {
      productId: {
        id: "product456",
        name: "따뜻한 캐시미어 스웨터",
      },
      price: 129000,
      image: userDefaultLogo,
    },
  ];

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
            {/* ex) 주소가 /my-page일 경우에만 보이도록 지정 */}
            <div className="chatbot-list-area">
              <Row className="chatbot-list__title">
                <h2>나의 챗봇리스트</h2>
              </Row>
              <Row className="chatbot-list__content">
                <Col>
                  {chatbotList.map((item) => (
                    <ChatbotList chatbotItem={item} />
                  ))}
                </Col>
              </Row>
              <Row>
                <Col className="chatbot-list__btn-list">
                  <Button2 className="btn__selected-delete">
                    선택한 거 삭제하기
                  </Button2>
                  <Button2 className="btn__go-shop">상점가기</Button2>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPage;
