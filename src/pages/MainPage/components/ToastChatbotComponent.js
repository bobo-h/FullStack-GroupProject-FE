import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { printLineChatbot } from "../../../features/chatbot/chatbotSlice";

const ToastChatbotComponent = ({ catPersonality }) => {
  const dispatch = useDispatch();
  const [chatResponse, setChatResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatResponse = async () => {
      setLoading(true);
      try {
        const response = await dispatch(
          printLineChatbot({ catPersonality })
        ).unwrap();
        setChatResponse(response);
      } catch (error) {
        console.error("Error:", error);
        setChatResponse("오류가 발생했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatResponse();
  }, [dispatch, catPersonality]);

  return <>{loading ? <>Loading...</> : <>{chatResponse}</>}</>;
};

export default ToastChatbotComponent;
