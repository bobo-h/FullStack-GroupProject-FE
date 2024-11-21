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
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFilteredDiaryList = createAsyncThunk(
  "diary/getFilteredDiaryList",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const query = [];
      if (year) query.push(`year=${year}`);
      if (month) query.push(`month=${month}`);
      const response = await api.get(`/diary/filter?${query.join("&")}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to filter diaries."
      );
    }
  }
);

export const getDiaryDetail = createAsyncThunk(
  "diary/getDiaryDetail",
  async (diaryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/diary/${diaryId}`);
      return response.data.diary;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDiary = createAsyncThunk(
  "diary/updateDiary",
  async ({ diaryId, payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/diary/${diaryId}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to update diary.");
    }
  }
);

export const deleteDiary = createAsyncThunk(
  "diary/deleteDiary",
  async (diaryId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/diary/${diaryId}`);
      console.log("API Response for delete:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error for delete:", error.response || error.message);
      return rejectWithValue(error.response.data || "Failed to delete diary.");
    }
  }
);

const diarySlice = createSlice({
  name: "diary",
  initialState: {
    loading: false,
    error: "",
    diaryList: [],
    filter: { year: "", month: "" },
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
      state.currentPage = 1;
      state.totalPages = 1;
    },
    // setFilter: (state, action) => {
    //   state.filter = action.payload;
    // }
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
      })
      .addCase(getDiaryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedDiary = null;
      })
      .addCase(getDiaryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDiary = action.payload;
      })
      .addCase(getDiaryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch diary detail.";
      })
      .addCase(updateDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDiary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.selectedDiary = action.payload;
      })
      .addCase(updateDiary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(deleteDiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.diaryList = state.diaryList.filter(
          (diary) => diary.id !== action.payload.diary.id
        );
        state.selectedDiary = null;
      })
      .addCase(deleteDiary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete diary.";
      });
  },
});

export const { setSelectedDiary, clearError, clearDiaryList } =
  diarySlice.actions;
export default diarySlice.reducer;
