import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//리스트를 들고와서 첫번째 챗봇 댓글 -> <Comment/> 나머지 댓글 -> <CommentReply/>
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

//챗봇 댓글 생성 - openAI - 다이어리 생성시(diarySlice) / 유저 댓글 생성시
//BE에서 해도 될듯해요
//router.post(
//  "/:id",
//   authController.authenticate,
//   diaryController.createUserComment,
//   openaiController.createChatbotMessage,
//   diaryController.createChatbotComment
//  );

//주석예정 시작
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
//주석예정 끝

//유저 댓글 생성 - diary
export const addUserComment = createAsyncThunk(
  "diary/createUserComment",

  async (
    { diaryId, userId, chatbotId, personality, parentCommentId, content },
    { rejectWithValue }
  ) => {
    try {
      //const response = await api.post(`/diary/${diaryId}`, formData);
      const response = await api.post("comment/create", {
        diaryId,
        userId,
        chatbotId,
        personality,
        parentCommentId,
        content,
      });
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//유저 댓글 수정 불가 - 이미 응답된 챗봇 댓글의 혼선 우려

//유저 댓글 삭제 - 이미 응답된 챗봇 댓글은 삭제되지 않음
//comment에 isChatbot 같은 유저와 챗봇을 구분하는것이 필요할듯해요
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
    comments: [], // 서버에서 가져온 댓글리스트를 저장
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
