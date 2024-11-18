import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
// 회원가입
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { name, email, password, birthday, profileImage, navigate },
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
      // 성공 -> 로그인 페이지로 이동
      navigate("/login");
      return response.data.data;
    } catch (error) {
      // 실패
      return rejectWithValue(error.message);
    }
  }
);

// 이메일로 로그인
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

//구글로 로그인
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

// 토큰으로 로그인
export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data; //response 뒤에 .data 수정됨
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 마이페이지 회원정보 수정
export const editUserInfo = createAsyncThunk(
  "user/editUserInfo",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${id}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//회원탈퇴
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

// 로그아웃
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    sessionStorage.removeItem("token");
    dispatch(userSlice.actions.logout()); // 유저 정보 초기화
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    editError: null,
    deleteError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
      state.editError = null;
      state.deleteError = null;
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
        state.user = action.payload.user; // action.payload.data.user 에서 수정
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        // state.error = action.payload || "로그인 실패"; //쓸데 없는 알림 노출되는 것 같아 지웠습니다.
      })
      .addCase(editUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.editError = action.payload;
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
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
