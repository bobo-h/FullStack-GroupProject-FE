import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

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

export const getAllAdminList = createAsyncThunk(
  "admin/getAllAdminList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/allAdmin");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editLevel = createAsyncThunk(
  "admin/editLevel",
  async ({ id, level }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/${id}`, { level });
      dispatch(getAllUserList());
      dispatch(getAllAdminList());
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllEligibleUsers = createAsyncThunk(
  "admin/deleteAllEligibleUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete("/admin");
      dispatch(getEligibleUserList());
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  "admin/searchUsers",
  async ({ searchTerm, userType }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/users?search=${searchTerm}&type=${userType}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    allUser: [],
    ineligibleUser: [],
    eligibleUser: [],
    allAdmin: [],
    searchResults: [],
    selectedUser: null,
    totalUserNum: null,
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearStates: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
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
        state.totalUserNum = action.payload.totalUserNum;
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
      })
      .addCase(getAllAdminList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAdminList.fulfilled, (state, action) => {
        state.loading = false;
        state.allAdmin = action.payload.allAdmins;
      })
      .addCase(getAllAdminList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editLevel.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(editLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.success = true;
      })
      .addCase(editLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteAllEligibleUsers.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteAllEligibleUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.success = true;
      })
      .addCase(deleteAllEligibleUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearStates, setSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
