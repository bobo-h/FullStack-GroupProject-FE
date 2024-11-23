import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { name, email, password, birthday, profileImage },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", {
        name,
        email,
        password,
        birthday,
        profileImage,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUserInfo = createAsyncThunk(
  "user/editUserInfo",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${id}`, formData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserInfo = createAsyncThunk(
  "user/deleteUserInfo",
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/${id}`);
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    sessionStorage.removeItem("token");
    dispatch(userSlice.actions.logout());
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    registrationSuccess: null,
    editError: null,
    editSuccess: false,
    deleteError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
      state.editError = null;
      state.deleteError = null;
      state.editSuccess = false;
    },
    ClearSuccess: (state) => {
      state.registrationSuccess = null;
    },
    logout: (state) => {
      state.user = null;
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
        state.registrationSuccess = "회원가입에 성공하셨습니다!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.loginError = null;
        state.user = action.payload.user;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.loginError = null;
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(editUserInfo.pending, (state) => {
        state.loading = true;
        state.editSuccess = false;
      })
      .addCase(editUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.editSuccess = true;
      })
      .addCase(editUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.editError = action.payload;
        state.editSuccess = false;
      })
      .addCase(deleteUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserInfo.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(deleteUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.deleteError = action.payload;
      });
  },
});
export const { clearErrors, ClearSuccess } = userSlice.actions;
export default userSlice.reducer;
