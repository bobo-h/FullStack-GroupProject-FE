import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { printLineChatbot } from "../../../features/chatbot/chatbotSlice";

const ToastChatbotComponent = ({ catPersonality }) => {
  const dispatch = useDispatch();
  const [chatResponse, setChatResponse] = useState(null); // 상태 추가
  // const { loading } = useSelector((state) => state.chatbot); 이거 사용하면 전체적으로 로딩되어버림
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchChatResponse = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await dispatch(
          printLineChatbot({ catPersonality })
        ).unwrap(); // Redux Toolkit의 unwrap 사용
        setChatResponse(response);
      } catch (error) {
        console.error("Error:", error);
        setChatResponse("오류가 발생했어요."); // 에러 처리
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchChatResponse();
  }, [dispatch, catPersonality]);

  return (
    <>
      {loading ? (
        <>Loading...</> // 로딩 중 표시
      ) : (
        <>{chatResponse}</> // 리턴 받은 값 표시
      )}
    </>
  );
};

export default ToastChatbotComponent;
