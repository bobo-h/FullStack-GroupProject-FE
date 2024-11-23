import api from "../../utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createDiary = createAsyncThunk(
  "diary/createDiary",
  async (payload, { rejectWithValue }) => {
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
  async ({ page = 1, year = "", month = "" } = {}, { rejectWithValue }) => {
    try {
      const query = [`page=${encodeURIComponent(page)}`];
      if (year) query.push(`year=${encodeURIComponent(year)}`);
      if (month) query.push(`month=${encodeURIComponent(month)}`);
      console.log("Generated URL:", `/diary?${query.join("&")}`);
      const response = await api.get(`/diary?${query.join("&")}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch diaries."
      );
    }
  }
);

export const getDiaryDetail = createAsyncThunk(
  "diary/getDiaryDetail",
  async (diaryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/diary/${diaryId}`);
      console.log("Diary Detail Response:", response.data);
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

export const getFilterOptions = createAsyncThunk(
  "diary/getFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/diary/filters");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch filter options."
      );
    }
  }
);

export const getDeletedDiaryList = createAsyncThunk(
  "diary/getDeletedDiaryList",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const query = [
        `page=${encodeURIComponent(page)}`,
        `limit=${encodeURIComponent(limit)}`,
      ];
      const response = await api.get(`/diary/deleted?${query.join("&")}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch deleted diaries."
      );
    }
  }
);

export const restoreDiary = createAsyncThunk(
  "diary/restoreDiary",
  async (diaryId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/diary/restore/${diaryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to restore the diary."
      );
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
    selectedDiary: null,
    currentPage: 1,
    totalPages: 1,
    deletedDiaryList: [],
    deletedCurrentPage: 1,
    deletedTotalPages: 1,
    success: false,
    filterOptions: { years: [], months: [] },
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
    clearDeletedDiaryList: (state) => {
      state.deletedDiaryList = [];
      state.deletedCurrentPage = 1;
      state.deletedTotalPages = 1;
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
        const { data = [], currentPage = 1, totalPages = 1 } = action.payload;
        const newDiaries = data.filter(
          (group) =>
            !state.diaryList.some(
              (existingGroup) => existingGroup.yearMonth === group.yearMonth
            )
        );
        state.diaryList = [...state.diaryList, ...newDiaries];
        state.currentPage = currentPage;
        state.totalPages = totalPages;
      })
      .addCase(getDiaryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch diaries.";
        state.diaryList = [];
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
      })
      .addCase(getFilterOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.filterOptions = action.payload;
      })
      .addCase(getFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch filter options.";
        state.filterOptions = { years: [], months: [] };
      })
      .addCase(getDeletedDiaryList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getDeletedDiaryList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { data = [], currentPage = 1, totalPages = 1 } = action.payload;
        state.deletedDiaryList = [...state.deletedDiaryList, ...data];
        state.deletedCurrentPage = currentPage;
        state.deletedTotalPages = totalPages;
      })
      .addCase(getDeletedDiaryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch deleted diaries.";
        state.deletedDiaryList = [];
      })
      .addCase(restoreDiary.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(restoreDiary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedDiaryList = state.deletedDiaryList.filter(
          (diary) => diary._id !== action.payload.diary._id
        );
      })
      .addCase(restoreDiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to restore the diary.";
      });
  },
});

export const {
  setSelectedDiary,
  clearError,
  clearDiaryList,
  clearDeletedDiaryList,
} = diarySlice.actions;
export default diarySlice.reducer;
