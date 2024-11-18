import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// 현재 회원 불러오기 (TODO : paginate)
export const getUserList = createAsyncThunk(
  "admin/getUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/AllUser");
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
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.allUser = action.payload.data;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
