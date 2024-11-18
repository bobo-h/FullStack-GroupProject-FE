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

const diarySlice = createSlice({
  name: "diary",
  initialState: {
    loading: false,
    error: "",
    diaryList: [],
    deletedDiaryList: [],
    selectedDiary: null,
    totalPageNum: 1,
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
      });
  },
});

export const { setSelectedDiary, clearError } = diarySlice.actions;
export default diarySlice.reducer;
