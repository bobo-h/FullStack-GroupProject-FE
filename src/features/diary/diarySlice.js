import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createDiary = createAsyncThunk(
  "diary/createDiary",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/diary", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getDiaryList = createAsyncThunk(
  "diary/getDiaryList",
  async (page, { rejectWithValue }) => {
    try {
      const response = await api.get(`/diary?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const diarySlice = createSlice({
  name: "diary",
  initialState: {
    loading: false,
    error: "",
    diaryList: [],
    deletedDiaryList: [],
    selectedDiary: null,
    currentPage: 1,
    totalPages: 1,
    deletedTotalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedDiary: (state, action) => {
      state.selectedDiary = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
    clearDiaryList: (state) => {
      state.diaryList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiary.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiary.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(createDiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getDiaryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiaryList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.diaryList = [...state.diaryList, ...action.payload.data];
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getDiaryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch diaries.";
      });
  },
});

export const { setSelectedDiary, clearError, clearDiaryList } =
  diarySlice.actions;
export default diarySlice.reducer;
