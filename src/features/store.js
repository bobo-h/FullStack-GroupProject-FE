import { configureStore } from "@reduxjs/toolkit";
import chatbotSlice from "./chatbot/chatbotSlice";
import userSlice from "./user/userSlice";
import productReducer from "./product/productSlice";
import orderRecuder from "./order/orderSlice";
import diarySlice from "./diary/diarySlice";
import moodSlice from "./mood/moodSlice";
import adminSlice from "./admin/adminSlice";
import commentSlice from "./comment/commentSlice";

const store = configureStore({
  reducer: {
    chatbot: chatbotSlice,
    user: userSlice,
    product: productReducer,
    order: orderRecuder,
    diary: diarySlice,
    mood: moodSlice,
    admin: adminSlice,
    comment: commentSlice,
  },
});

export default store;
