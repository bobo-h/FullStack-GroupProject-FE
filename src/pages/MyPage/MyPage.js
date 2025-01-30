import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getChatbotList } from "../../features/chatbot/chatbotSlice";
import ChatbotList from "./component/ChatbotList";
import Button2 from "../../common/components/Button2";
import { useNavigate } from "react-router-dom";
import MyPageLayout from "./MyPageLayout";
import UserInfo from "./component/UserInfo";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cats } = useSelector((state) => state.chatbot);

  useEffect(() => {
    dispatch(getChatbotList());
  }, []);

  const handleGoToShop = () => {
    navigate("/shop");
  };

  return (
    <MyPageLayout>
      <div className="chatbot-list-area">
        <Row className="chatbot-list__title">
          <h2>나의 정보 & 챗봇</h2>
        </Row>
        <Row className="chatbot-list__userinfo">
          <Col>
            <UserInfo />
          </Col>
        </Row>
        <Row className="chatbot-list__content">
          <Col>
            {cats.map((item, index) => (
              <ChatbotList chatbotItem={item} index={index} key={item._id} />
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
    </MyPageLayout>
  );
};

export default MyPage;
