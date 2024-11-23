import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/components/NavBar";
import SideBar from "../common/components/SideBar";
import { loginWithToken } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import throttle from "lodash.throttle";
import LoadingSpinner from "../common/components/LoadingSpinner";
import "./style/applayout.style.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState("");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const pageMapping = [
    { path: "/", page: "home", sidebar: true },
    { path: "/diaries", page: "diaries", sidebar: true },
    { path: "/diaries/new", page: "diaries", sidebar: false },
    { path: "/shop", page: "shop", sidebar: false },
    { path: "/my-page", page: "my", sidebar: false },
    { path: "/admin", page: "admin", sidebar: false },
  ];

  const { user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  const publicPaths = ["/login", "/register", "/register-success"];

  useEffect(() => {
    if (!loading && user === null && !publicPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    let matchedPage;

    if (location.pathname === "/") {
      matchedPage = pageMapping.find(({ path }) => path === "/");
    } else {
      matchedPage = pageMapping.find(
        ({ path }) => location.pathname.startsWith(path) && path !== "/"
      );
    }

    if (matchedPage) {
      setCurrentPage(matchedPage.page);

      if (window.innerWidth < 700) {
        setIsSidebarActive(false);
      } else {
        setIsSidebarActive(matchedPage.sidebar);
      }
    } else {
      setCurrentPage("");
      setIsSidebarActive(false);
    }
  }, [location.pathname]);

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
        setIsScrollingUp(true);
      } else if (scrollTop < lastScrollTop.current) {
        setIsScrollingUp(true);
      } else {
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

  const toggleAlert = () => {
    setIsAlertVisible(!isAlertVisible);
  };

  const isAdminPage = location.pathname === "/admin";

  return (
    <div
      className={`app-layout ${
        isSidebarActive
          ? currentPage === "home"
            ? "sidebar-active-right"
            : currentPage === "diaries"
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
        isScrollingUp={isScrollingUp}
        scrollTop={scrollTop}
      />

      <div ref={scrollContainerRef} className="children-container">
        {loading ? <LoadingSpinner /> : children}
      </div>
    </div>
  );
};

export default AppLayout;
