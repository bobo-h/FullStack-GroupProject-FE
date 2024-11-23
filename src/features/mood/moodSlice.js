import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// 비동기 액션 생성
export const getMoodList = createAsyncThunk(
  "moods/getMoodList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/mood", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const fetchAllMoods = createAsyncThunk(
  "moods/fetchAllMoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/mood/all");
      if (response.status !== 200) throw new Error(response.error);
      const moods = response.data.data.map((mood) => ({
        id: mood._id,
        name: mood.name,
      }));
      return { moods };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMood = createAsyncThunk(
  "moods/createMood",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/mood", formData);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getMoodList({ page: 1 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const editMood = createAsyncThunk(
  "moods/editMood",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/mood/${id}`, formData);
      if (response.status !== 200) throw new Error(response.error);

      dispatch(getMoodList({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteMood = createAsyncThunk(
  "moods/deleteMood",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/mood/${id}`);
      if (response.status !== 200) throw new Error(response.error);

    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 슬라이스 생성
const moodSlice = createSlice({
  name: "moods",
  initialState: {
    moodList: [],
    selectedMood: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedMood: (state, action) => {
      state.selectedMood = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredMood = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createMood.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createMood.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      //state.success = true; // 신규 Alert 적용으로 주석 처리
    });
    builder.addCase(createMood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    builder.addCase(getMoodList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMoodList.fulfilled, (state, action) => {
      state.loading = false;
      state.moodList = action.payload.data;
      state.error = "";
      state.totalPageNum = action.payload.totalPageNum;
    });
    builder.addCase(getMoodList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(editMood.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editMood.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      //state.success = true; // 신규 Alert 적용으로 주석 처리
    });
    builder.addCase(editMood.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    builder.addCase(fetchAllMoods.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllMoods.fulfilled, (state, action) => {
      state.loading = false;
      state.moodList = action.payload.moods;
      state.error = "";
    });
    builder.addCase(fetchAllMoods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch moods";
    });
  },
});

export const { setSelectedMood, setFilteredList, clearError } =
  moodSlice.actions;
export default moodSlice.reducer;
