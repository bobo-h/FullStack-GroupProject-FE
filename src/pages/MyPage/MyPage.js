import React, { useEffect } from "react";
import SidebarForMyPage from "./component/SidebarForMyPage";
import UserInfo from "./component/UserInfo";
import { Col, Container, Row } from "react-bootstrap";
import "./style/sidebarForMyPage.style.css";
import "./style/myPage.style.css";
import ChatbotList from "./component/ChatbotList";
import userDefaultLogo from "../../assets/userDefaultLogo.png";
import Button2 from "../../common/components/Button2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatbotList } from "../../features/chatbot/chatbotSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //챗봇리스트 가지고 오기 (useSelector 사용)
  const { cats } = useSelector((state) => state.chatbot);

  console.log("cats", cats);
  //챗봇리스트를 받아오기
  useEffect(() => {
    dispatch(getChatbotList());
  }, []);

  const handleGoToShop = () => {
    navigate("/shop");
  };

  return (
    <div className="my-page-toptop">
      <Container fluid className="mypage-style">
        <Row>
          {/* 사이드바: 화면 높이에 고정 */}
          <Col xs={12} md={3} className="sidebar mobile-sidebar position-fixed">
            <SidebarForMyPage />
          </Col>

          {/* 콘텐츠: 사이드바 옆으로 오프셋 적용 */}
          <Col xs={12} className="mypage-area">
            {/* 유저 정보 섹션 */}
            <div className="userInfo-area">
              <Row>
                <Col>
                  <UserInfo />
                </Col>
              </Row>
            </div>
            {/* 추가 콘텐츠 섹션 */}
            {/* ex) 주소가 /my-page일 경우에만 보이도록 지정 */}
            <div className="chatbot-list-area">
              <Row className="chatbot-list__title">
                <h2>나의 챗봇리스트</h2>
              </Row>
              <Row className="chatbot-list__content">
                <Col>
                  {cats.map((item, index) => (
                    <ChatbotList chatbotItem={item} index={index} />
                  ))}
                </Col>
              </Row>
              <Row>
                <Col className="chatbot-list__btn-list">
                  <Button2 className="btn__go-shop" onClick={handleGoToShop}>
                    상점가기
                  </Button2>
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
