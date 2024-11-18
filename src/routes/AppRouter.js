import React from "react";
import { Route, Routes } from "react-router";
import ChatbotPage from "../pages/ChatbotPage/ChatbotPage";
import MainPage from "../pages/MainPage/MainPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import MyPage from "../pages/MyPage/MyPage";
import ProductPage from "../pages/ProductPage/ProductPage";
// import PaymentPage from "../pages/PaymentPage/PaymentPage";
import DiariesPage from "./../pages/DiariesPage/DiariesPage";
import DiaryDetailPage from "./../pages/DiaryDetailPage/DiaryDetailPage";
import DiaryFormPage from "./../pages/DiaryFormPage/DiaryFormPage";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminPage />
          </PrivateRoute>
        }
      />
      <Route path="/my-page" element={<MyPage />} />
      <Route path="/shop" element={<ProductPage />} />
      {/* <Route path="/payment" element={<PaymentPage />} /> */}
      <Route path="/diaries" element={<DiariesPage />} />
      <Route path="/diaries/new" element={<DiaryFormPage />} />
      <Route path="/diaries/:diaryId/edit" element={<DiaryFormPage />} />
      <Route path="/diaries/:diaryId" element={<DiaryDetailPage />} />
    </Routes>
  );
};

export default AppRouter;
