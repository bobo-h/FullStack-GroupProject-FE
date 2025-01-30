import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  orderList: [],
  orderNum: "",
  orderUserId: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
  recentAddress: null,
  previousAddresses: [],
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.error || error.message || "주문 실패 했습니다!";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/order/me?page=${page}`);
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/order", {
        params: { ...query },
      });
      console.log("query??", query);
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload.orderNum;
        state.orderUserId = action.payload.orderUserId;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum || 1;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum || 1;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
