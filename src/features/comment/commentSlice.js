import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCommentList = createAsyncThunk(
  "comment/getCommentList",
  async (diaryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comment/${diaryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addChatbotComment = createAsyncThunk(
  "diary/createChatbotComment",

  async (formData, diaryId, { catPersonality }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/comment/${diaryId}`,
        formData,
        catPersonality
      );
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUserComment = createAsyncThunk(
  "diary/createUserComment",

  async (
    { diaryId, userId, chatbotId, personality, parentCommentId, content },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("comment/create", {
        diaryId,
        userId,
        chatbotId,
        personality,
        parentCommentId,
        content,
      });
      dispatch(getCommentList(diaryId));
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserComment = createAsyncThunk(
  "diary/deleteUserComment",
  async (diaryId, commentId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/comment/${diaryId}/${commentId}`);
      if (response.status !== 200) throw new Error(response.error);
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    loading: false,
    registrationError: null,
    success: false,
    comments: [],
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
      .addCase(getCommentList.pending, handlePending)
      .addCase(getCommentList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registrationError = null;
        state.comments = action.payload.data;
      })
      .addCase(getCommentList.rejected, handleRejected)
      .addCase(addUserComment.pending, handlePending)
      .addCase(addUserComment.fulfilled, handleFulfilled)
      .addCase(addUserComment.rejected, handleRejected)
      .addCase(deleteUserComment.pending, handlePending)
      .addCase(deleteUserComment.fulfilled, handleFulfilled)
      .addCase(deleteUserComment.rejected, handleRejected);
  },
});

export const { clearErrors } = commentSlice.actions;
export default commentSlice.reducer;
