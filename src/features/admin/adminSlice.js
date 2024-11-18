import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// 현재 회원 불러오기 (TODO : paginate)
export const getAllUserList = createAsyncThunk(
  "admin/getAllUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/allUser");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 탈퇴 회원 but 탈퇴일로부터 90일이내  (TODO : paginate)
export const getIneligibleUserList = createAsyncThunk(
  "admin/getIneligibleUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/ineligibleUser");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 탈퇴 회원 but 탈퇴일로부터 90일 지난 회원  (TODO : paginate)
export const getEligibleUserList = createAsyncThunk(
  "admin/getEligibleUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/eligibleUser");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    allUser: [],
    ineligibleUser: [], //탈퇴로부터 90일이내의 회원리스트
    eligibleUser: [], //탈퇴로부터 90일이상의 회원리스트
    loading: false,
    error: "",
  },
  reducers: {
    clearErrors: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.allUser = action.payload.allUsers;
      })
      .addCase(getAllUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getIneligibleUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIneligibleUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.ineligibleUser = action.payload.ineligibleUsers;
      })
      .addCase(getIneligibleUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEligibleUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEligibleUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.eligibleUser = action.payload.eligibleUsers;
      })
      .addCase(getEligibleUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
