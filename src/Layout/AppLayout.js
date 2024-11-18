import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/components/NavBar";
import SideBar from "../common/components/SideBar";
import { loginWithToken } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import throttle from "lodash.throttle"; // 스크롤 상태 최적화
import LoadingSpinner from "../common/components/LoadingSpinner";
import "./style/applayout.style.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [isAlertVisible, setIsAlertVisible] = useState(false); //? 이건 이제 사용 안하는듯?
  // =========  사이드바 관련 ============== //
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

  const { user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // 토큰으로 로그인
  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    // 로딩이 끝났는데 user가 없으면 리디렉션
    if (!loading && user === null) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // 현재 경로와 일치하는 페이지 찾기
    let matchedPage;

    if (location.pathname === "/") {
      // 정확히 루트(/) 경로인 경우
      matchedPage = pageMapping.find(({ path }) => path === "/");
    } else {
      // 그 외의 경우에는 startsWith를 사용해서 더 정확한 매칭을 찾음
      matchedPage = pageMapping.find(
        ({ path }) => location.pathname.startsWith(path) && path !== "/"
      );
    }

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

  //================== 스크롤시 토글 숨기기 =======================
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const lastScrollTop = useRef(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current
        ? scrollContainerRef.current.scrollTop
        : window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop === 0) {
        // 페이지 상단에 있을 때
        setIsScrollingUp(true);
      } else if (scrollTop < lastScrollTop.current) {
        // 상단으로 스크롤 중
        setIsScrollingUp(true);
      } else {
        // 하단으로 스크롤 중
        setIsScrollingUp(false);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    const throttledHandleScroll = throttle(handleScroll, 200);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener(
        "scroll",
        throttledHandleScroll
      );
    } else {
      window.addEventListener("scroll", throttledHandleScroll);
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener(
          "scroll",
          throttledHandleScroll
        );
      } else {
        window.removeEventListener("scroll", throttledHandleScroll);
      }
    };
  }, []);
  //================== 스크롤시 토글 숨기기 끝 ====================

  const toggleAlert = () => {
    setIsAlertVisible(!isAlertVisible);
  };

  // 현재 경로가 /admin인지 확인
  const isAdminPage = location.pathname === "/admin";

  // 경로가 /admin일 때 display: flex를 제거하려면 no-flex 클래스 추가
  // const appLayoutClass = isAdminPage ? "no-flex" : "display-flex";

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
        isScrollingUp={isScrollingUp} // 추가
        scrollTop={scrollTop} // 스크롤 시작 전 조건때문
      />
      {/* 로딩 중이면 로딩 스피너 표시, 아니면 children 렌더링 */}
      <div ref={scrollContainerRef} className="children-container">
        {loading ? <LoadingSpinner /> : children}
      </div>
    </div>
  );
};

export default AppLayout;
