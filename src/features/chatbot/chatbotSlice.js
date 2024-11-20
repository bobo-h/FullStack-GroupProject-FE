import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// getChatbot action
export const getChatbotList = createAsyncThunk(
  "chatbot/getChatbot",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatbot/me`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// getChatbotDetail action
export const getChatbotDetail = createAsyncThunk(
  "chatbot/getChatbotDetail",
  async ({ userId, chatbotId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatbot/${userId}/${chatbotId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// createChatbot action
export const createChatbot = createAsyncThunk(
  "chatbot/createChatbot",
  async ({ name, personality }, dispatch) => {
    try {
      const response = await api.post("/chatbot", { name, personality });
      dispatch({
        type: "CREATE_CHATBOT_SUCCESS",
        payload: response.data,
      });
      return Promise.resolve();
    } catch (error) {
      dispatch({
        type: "CREATE_CHATBOT_FAILURE",
        payload: error.response?.data || error.message,
      });
      return Promise.reject(error);
    }
  }
);

// updateChatbot action
export const updateChatbot = createAsyncThunk(
  "chatbot/updateChatbot",
  async (
    { chatbotId, name, position, zIndex, flip, visualization },
    dispatch
  ) => {
    try {
      const updateData = {};
      let endpoint = "";

      if (name) {
        endpoint = `/chatbot/${chatbotId}/name`;
        updateData.name = name;
      } else {
        endpoint = `/chatbot/${chatbotId}/position`;
        if (position) updateData.position = position;
        if (zIndex !== undefined) updateData.zIndex = zIndex;
        if (flip !== undefined) updateData.flip = flip;
        if (visualization !== undefined)
          updateData.visualization = visualization;
      }

      const response = await api.put(endpoint, updateData);

      dispatch({
        type: "UPDATE_CHATBOT_SUCCESS",
        payload: response.data,
      });

      return Promise.resolve();
    } catch (error) {
      dispatch({
        type: "UPDATE_CHATBOT_FAILURE",
        payload: error.response?.data || error.message,
      });

      return Promise.reject(error);
    }
  }
);

export const deleteChatbot = createAsyncThunk(
  "chatbot/deleteChatbot",
  async (chatbotId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/chatbot/${chatbotId}`);
      console.log("Chatbot deleted successfully");

      // dispatch(getChatbotList({ page: 1 }));

      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete chatbot:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============= 신진수 추가 ==================//
// updateChatbot action
export const updateChatbotJins = createAsyncThunk(
  "chatbot/updateChatbotJins",
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      // API 요청
      const response = await api.put(`/chatbot/${id}`, updateData);

      // 상태 가져오기
      const state = getState();
      // console.log("뭐니 문제가 뭐니", state.chatbot.cats);
      const clonedCats = JSON.parse(JSON.stringify(state.chatbot.cats)); // Proxy 객체를 평범한 객체로 변환
      // console.log("뭐니 문제가 뭐니2", response);
      // 상태 업데이트
      const updatedCats = clonedCats.map((cat) =>
        String(cat._id) === String(id) ? response.data.data : cat
      );
      // console.log("변환 완료", updatedCats);
      // 토나올거 같애 살려줘
      // 으악!! 해결!!! ㅠㅠㅠㅠㅠ

      // 업데이트된 배열 반환
      return updatedCats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateChatbotMany = createAsyncThunk(
  "chatbot/updateChatbotMany",
  async (updateData, { rejectWithValue }) => {
    try {
      // API 요청
      const response = await api.put(`/chatbot`, updateData);

      // 성공 응답 처리
      if (response.status === 200) {
        return response.data.data; // 성공 데이터 반환
      } else {
        return rejectWithValue(response.data); // 에러 데이터 반환
      }
    } catch (error) {
      // 네트워크 또는 서버 에러 처리
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// printLineChatbot action
export const printLineChatbot = createAsyncThunk(
  "chatbot/printLineChatbot",
  async ({ catPersonality }, dispatch) => {
    try {
      const messages = [
        "야옹!",
        "Zzz",
        "지금 뭐 해?",
        "오늘 뭐 했어?",
        "오늘 날씨 어때?",
        "오늘 기분 어때?",
        "창밖에서 뭐 봤어?",
        "왜 그렇게 조용해?",
        "나를 위로 해줘",
        "고생한 나에게 아무 힘이 되는 말 해줘",
        "내가 행복해질 말을 해줘",
      ];
      // const randomMessage =
      //   messages[Math.floor(Math.random() * messages.length)];
      // const finalMessage =
      //   randomMessage === "야옹!" || randomMessage === "zzz"
      //     ? randomMessage
      //     : `${randomMessage} (Respond in 10 characters or less.)`;
      // const response = await api.post("/chatbot/printLine", {
      //   message: finalMessage,
      //   catPersonality,
      // });
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      // console.log("랜덤 메시지:", randomMessage);

      // "야옹!" 또는 "zzz"일 경우 API 요청 생략
      if (randomMessage === "야옹!" || randomMessage === "Zzz") {
        const response = randomMessage; // 그대로 반환
        return response;
      }

      // 다른 경우에만 API 요청
      const finalMessage = `${randomMessage} (Respond in 10 characters or less.)`;
      const response = await api.post("/chatbot/printLine", {
        message: finalMessage,
        catPersonality,
      });
      // console.log("ai답변", response);
      return response.data.reply;
      // dispatch({
      //   type: "PRINTLINE_CHATBOT_SUCCESS",
      //   payload: response.data,
      // });
      // // 리스폰이 오지 않음
      // console.log("API Response:", response.data); // API 응답 확인
      // return Promise.resolve(response.data);
    } catch (error) {
      // dispatch({
      //   type: "PRINTLINE_CHATBOT_FAILURE",
      //   payload: error.response?.data || error.message,
      // });
      return Promise.reject(error);
    }
  }
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    loading: false,
    registrationError: null,
    success: false,
    cats: [], // 서버에서 가져온 쳇봇리스트를 저장
    catsLength: 0,
  },
  reducers: {
    clearErrors: (state) => {
      state.registrationError = null;
    },
    getListLenght: (state) => {
      state.catsLength = state.cats.length;
    },
    logoutChatBot: (state) => {
      state.cats = [];
      state.catsLength = 0;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.success = false;
    };

    const handleFulfilled = (state) => {
      state.loading = false;
      state.success = true;
      state.registrationError = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.success = false;
      state.registrationError = action.payload;
    };

    builder // 와 ㅋㅋㅋㅋ아이디어 좋으신데요?!
      .addCase(createChatbot.pending, handlePending)
      .addCase(createChatbot.fulfilled, handleFulfilled)
      .addCase(createChatbot.rejected, handleRejected)
      .addCase(getChatbotList.pending, handlePending)
      .addCase(getChatbotList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload; // 서버 데이터로 상태 업데이트
        // console.log("궁금하오1", state.cats);
      })
      .addCase(getChatbotList.rejected, handleRejected)
      .addCase(getChatbotDetail.pending, handlePending)
      .addCase(getChatbotDetail.fulfilled, handleFulfilled)
      .addCase(getChatbotDetail.rejected, handleRejected)
      .addCase(updateChatbot.pending, handlePending)
      .addCase(updateChatbot.fulfilled, handleFulfilled)
      .addCase(updateChatbot.rejected, handleRejected)
      .addCase(deleteChatbot.pending, handlePending)
      .addCase(deleteChatbot.fulfilled, handleFulfilled)
      .addCase(deleteChatbot.rejected, handleRejected)
      .addCase(printLineChatbot.pending, handlePending)
      .addCase(printLineChatbot.fulfilled, handleFulfilled)
      .addCase(printLineChatbot.rejected, handleRejected)
      .addCase(updateChatbotJins.pending, handlePending)
      .addCase(updateChatbotJins.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload; // 업데이트된 배열을 상태에 반영
      })
      .addCase(updateChatbotJins.rejected, handleRejected)
      .addCase(updateChatbotMany.pending, handlePending)
      .addCase(updateChatbotMany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload; // 업데이트된 배열을 상태에 반영
      })
      .addCase(updateChatbotMany.rejected, handleRejected);
  },
});

export const { clearErrors, getListLenght, logoutChatBot } =
  chatbotSlice.actions;
export default chatbotSlice.reducer;
