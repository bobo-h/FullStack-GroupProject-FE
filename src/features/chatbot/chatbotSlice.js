import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createChatbot = createAsyncThunk(
    'chatbot/createChatbot',
    async({ name, personality }, dispatch) => {
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
        builder
            .addCase(createChatbot.pending, (state) => {
                state.loading = true;
            })
            .addCase(createChatbot.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.registrationError = null;
            })
            .addCase(createChatbot.rejected, (state, action) => {
                state.loading = false;
                state.registrationError = action.payload;
            });
    },
});

export const { clearErrors } = chatbotSlice.actions;
export default chatbotSlice.reducer;