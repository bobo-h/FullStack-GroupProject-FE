import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

export const getChatbotDetail = createAsyncThunk(
  "chatbot/getChatbotDetail",
  async (_, { chatbotId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatbot/me/${chatbotId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createChatbot = createAsyncThunk(
  "chatbot/createChatbot",
  async ({ user_id, product_id, name, personality }, { rejectWithValue }) => {
    try {
      const response = await api.post("/chatbot", {
        user_id,
        product_id,
        name,
        personality,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

export const updateChatbotJins = createAsyncThunk(
  "chatbot/updateChatbotJins",
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      const response = await api.put(`/chatbot/${id}`, updateData);

      const state = getState();

      const clonedCats = JSON.parse(JSON.stringify(state.chatbot.cats));

      const updatedCats = clonedCats.map((cat) =>
        String(cat._id) === String(id) ? response.data.data : cat
      );

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
      const response = await api.put(`/chatbot`, updateData);

      if (response.status === 200) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

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

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      if (randomMessage === "야옹!" || randomMessage === "Zzz") {
        const response = randomMessage;

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        await delay(1000);
        return response;
      }

      const finalMessage = `${randomMessage} (Respond in 10 characters or less.)`;
      const response = await api.post("/chatbot/printLine", {
        message: finalMessage,
        catPersonality,
      });

      return response.data.reply;
    } catch (error) {
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
    cats: [],
    catsLength: 0,
    newItem: false,
    getFlag: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.registrationError = null;
    },
    getListLenght: (state) => {
      if (state.catsLength === 0) {
        console.log("지금이야", state.catsLength);
        state.getFlag = true;
      }
    },
    logoutChatBot: (state) => {
      state.cats = [];
      state.catsLength = 0;
      state.getFlag = false;
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
      .addCase(createChatbot.pending, (state, action) => {
        state.newItem = true;
        state.loading = true;
        state.success = true;
        state.registrationError = null;
      })
      .addCase(createChatbot.fulfilled, (state) => {
        state.newItem = false;
        state.loading = false;
        state.success = true;
        state.registrationError = null;
      })
      .addCase(createChatbot.rejected, handleRejected)
      .addCase(getChatbotList.pending, handlePending)
      .addCase(getChatbotList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload;
        state.catsLength = state.cats.length;
        state.getFlag = false;
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
      .addCase(printLineChatbot.fulfilled, handleFulfilled)
      .addCase(printLineChatbot.rejected, handleRejected)
      .addCase(updateChatbotJins.pending, handlePending)
      .addCase(updateChatbotJins.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload;
      })
      .addCase(updateChatbotJins.rejected, handleRejected)
      .addCase(updateChatbotMany.pending, handlePending)
      .addCase(updateChatbotMany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.cats = action.payload;
      })
      .addCase(updateChatbotMany.rejected, handleRejected);
  },
});

export const { clearErrors, getListLenght, logoutChatBot } =
  chatbotSlice.actions;
export default chatbotSlice.reducer;
