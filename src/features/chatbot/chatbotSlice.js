import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// getChatbot action
export const getChatbotList = createAsyncThunk(
  'chatbot/getChatbot',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatbot/${userId}`);
      //console.log("rr",response); // 응답 데이터 확인
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// getChatbotDetail action
export const getChatbotDetail = createAsyncThunk(
  'chatbot/getChatbotDetail',
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
  'chatbot/createChatbot',
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
  'chatbot/updateChatbot',
  async ({ chatbotId, name, position, zIndex, flip, visualization }, dispatch) => {
    try {
      const updateData = {};
      let endpoint = '';

      if (name) {
        endpoint = `/chatbot/${chatbotId}/name`;
        updateData.name = name;
      } else {
        endpoint = `/chatbot/${chatbotId}/position`;
        if (position) updateData.position = position;
        if (zIndex !== undefined) updateData.zIndex = zIndex;
        if (flip !== undefined) updateData.flip = flip;
        if (visualization !== undefined) updateData.visualization = visualization;
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
      console.error("Failed to delete chatbot:", error.response?.data || error.message);
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// printLineChatbot action
export const printLineChatbot = createAsyncThunk(
  'chatbot/printLineChatbot',
  async ({ catPersonality }, dispatch) => {
    try {
      const messages = [
        "오늘 날씨 어때?",
        "오늘 기분 어때?",
        "뭐해?",
        "야옹!",
        "zzz"
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const finalMessage = (randomMessage === "야옹!" || randomMessage === "zzz") 
        ? randomMessage 
        : `${randomMessage} (Respond in 10 characters or less.)`; 

      const response = await api.post("/chatbot/printLine", { message: finalMessage, catPersonality });

      dispatch({
        type: "PRINTLINE_CHATBOT_SUCCESS",
        payload: response.data,
      });
      return Promise.resolve(response.data);  
    } catch (error) {
      dispatch({
        type: "PRINTLINE_CHATBOT_FAILURE",
        payload: error.response?.data || error.message,
      });
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
  },
  reducers: {
    clearErrors: (state) => {
      state.registrationError = null;
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

    builder
      .addCase(createChatbot.pending, handlePending)
      .addCase(createChatbot.fulfilled, handleFulfilled)
      .addCase(createChatbot.rejected, handleRejected)
      .addCase(getChatbotList.pending, handlePending)
      .addCase(getChatbotList.fulfilled, handleFulfilled)
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
      .addCase(printLineChatbot.rejected, handleRejected);
  },
});


export const { clearErrors } = chatbotSlice.actions;
export default chatbotSlice.reducer;
