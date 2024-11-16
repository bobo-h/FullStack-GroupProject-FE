import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/components/NavBar";
import SideBar from "../common/components/SideBar";
import LoadingSpinner from "../common/components/LoadingSpinner";
import "./style/applayout.style.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const pageMapping = [
    //사이드 바 때문에
    { path: "/", page: "home", sidebar: true },
    { path: "/diaries", page: "diary", sidebar: true },
    { path: "/add-diary", page: "add-diary", sidebar: false },
    { path: "/shop", page: "shop", sidebar: false },
    { path: "/my-page", page: "my", sidebar: false },
    { path: "/admin", page: "admin", sidebar: false },
  ];

  useEffect(() => {
    // 현재 경로와 일치하는 페이지 찾기
    const matchedPage = pageMapping.find(
      ({ path }) => path === location.pathname
    );

    // 페이지가 매칭될 경우 상태 업데이트
    if (matchedPage) {
      setCurrentPage(matchedPage.page);

      // 화면 크기에 따라 사이드바 상태 설정
      if (window.innerWidth < 700) {
        setIsSidebarActive(false);
      } else {
        setIsSidebarActive(matchedPage.sidebar);
      }
    } else {
      // 매칭되는 페이지가 없는 경우 기본값 설정
      setCurrentPage("");
      setIsSidebarActive(false);
    }
  }, [location.pathname]);

  const toggleAlert = () => {
    setIsAlertVisible(!isAlertVisible);
  };

  // 현재 경로가 /admin인지 확인
  const isAdminPage = location.pathname === "/admin";

  // 경로가 /admin일 때 display: flex를 제거하려면 no-flex 클래스 추가
  // const appLayoutClass = isAdminPage ? "no-flex" : "display-flex";

  const loading = false;

  return (
    // <div className={`app-layout ${appLayoutClass}`}>
    //   {!isAdminPage && <NavBar toggleAlert={toggleAlert} />}
    //   {children}
    <div
      className={`app-layout ${
        isSidebarActive
          ? currentPage === "home"
            ? "sidebar-active-right"
            : currentPage === "diary"
            ? "sidebar-active-left"
            : "sidebar-active"
          : ""
      } ${isAdminPage ? "no-flex" : ""}`}
    >
      <NavBar isAdminPage={isAdminPage} />
      <SideBar
        currentPage={currentPage}
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
      {/* {loading ? <LoadingSpinner /> : children} */}
      {children}
    </div>
  );
};

export default AppLayout;
