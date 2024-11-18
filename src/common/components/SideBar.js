import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import {
  getChatbotList,
  updateChatbotJins,
} from "../../features/chatbot/chatbotSlice";
import "../style/sidebar.style.css";
import debounce from "lodash.debounce";

// 하위 컴포넌트로 분리하여 코드 가독성 및 재사용성을 높이자.
const SideBar = ({
  currentPage,
  isSidebarActive,
  setIsSidebarActive,
  isScrollingUp,
  scrollTop,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { cats, status, error } = useSelector((state) => state.chatbot);

  // 토큰으로 로그인
  useEffect(() => {
    dispatch(getChatbotList());
  }, []);

  // 임시 고양이 보이기 안보이기 로직
  const handleRightClick = (e, catId) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    // cats 배열에서 해당 catId를 가진 고양이 찾기
    const selectedCat = cats.find((cat) => cat._id === catId);

    if (selectedCat) {
      // visualization 값을 토글하여 새로운 상태 만들기
      const updatedVisualization = !selectedCat.visualization;

      // updateChatbotJins action 호출
      dispatch(
        updateChatbotJins({
          id: catId,
          updateData: { visualization: updatedVisualization },
        })
      );
    }
  };

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300); // 300ms debounce 적용

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 토글 함수 및 사이드바 닫을때
  const toggleSidebar = () => {
    if (isSidebarActive) {
      // 닫히는 애니메이션 적용
      const sidebar = document.querySelector(".sidebar-container");
      sidebar.classList.add("closing");
      const overlay = document.querySelector(".overlay");
      overlay.classList.add("closing");

      // 애니메이션이 완료된 후 상태 업데이트
      setTimeout(() => {
        setIsSidebarActive(false);
        sidebar.classList.remove("closing");
        overlay.classList.remove("closing");
      }, 500); // 애니메이션 시간(0.5초)와 같게
    } else {
      setIsSidebarActive(true);
    }
  };

  // 다이어리와 홈에서 나오는 에니메이션이 다름
  const animationClass =
    currentPage === "home"
      ? "slide-in-right"
      : currentPage === "diary"
      ? "slide-in-left"
      : "";

  const isDesktop = windowWidth >= 700;
  const isMobileActive = windowWidth < 700 && isSidebarActive;

  // 모든 조건을 배열로 관리하여 클래스 이름 설정
  const sidebarClasses = [
    "sidebar-container", // 기본 클래스
    isDesktop ? "desktop-sidebar" : "", // 데스크탑 모드에서 항상 보이도록 설정
    isMobileActive ? "active" : "", // 모바일 모드에서 활성 상태일 때 추가
    isSidebarActive && animationClass ? animationClass : "hidden", // 애니메이션 클래스 또는 숨김 상태
  ]
    .filter(Boolean) // 빈 문자열 또는 false 값 제거
    .join(" "); // 배열을 공백으로 구분된 문자열로 변환

  return (
    <>
      {user && (
        <SidebarContainer
          sidebarClasses={sidebarClasses}
          toggleSidebar={toggleSidebar}
          windowWidth={windowWidth}
          isSidebarActive={isSidebarActive}
          currentPage={currentPage}
          cats={cats}
          handleRightClick={handleRightClick}
          isScrollingUp={isScrollingUp}
          user={user}
        />
      )}
    </>
  );
};

// SidebarContainer 하위 컴포넌트
const SidebarContainer = ({
  sidebarClasses,
  toggleSidebar,
  windowWidth,
  isSidebarActive,
  currentPage,
  cats,
  handleRightClick,
  isScrollingUp,
  scrollTop,
  user,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* 사이드바가 활성화된 경우에만 오버레이 표시 */}
      {isSidebarActive && windowWidth < 700 && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
      <div className={sidebarClasses}>
        <img
          className="project-title"
          src="logo1.png"
          alt="project-title"
          onClick={() => navigate(`/`)}
        />
        <div className="user-image" />
        <div className="user-info">
          <span className="user-name">집사 이름 : {user.name}</span>
          <LogoutButton />
        </div>
        <div className="cat-list-container">
          {cats.map((cat) => (
            <div
              className="my-cats-info"
              key={cat._id}
              id={cat._id}
              onContextMenu={
                (e) => {
                  handleRightClick(e, cat._id);
                } // 우클릭 이벤트 핸들러 추가
              }
            >
              <div
                className={`cat-list-image-back ${
                  cat.visualization ? "view" : ""
                }`}
              >
                <img
                  className="cat-list-image-profile"
                  src={cat.product_id.image}
                  alt="cats profile"
                />
              </div>
              <span className="cat-list-title">{cat.name}</span>
              <span className="cat-list-discript">{cat.personality}</span>
            </div>
          ))}
        </div>
      </div>

      {windowWidth < 700 &&
      !isSidebarActive &&
      (currentPage === "home" || currentPage === "diary") &&
      (isScrollingUp || scrollTop === 0) ? (
        <ToggleButton toggleSidebar={toggleSidebar} />
      ) : null}
    </>
  );
};

// ToggleButton 컴포넌트
const ToggleButton = ({ toggleSidebar }) => {
  return (
    <div className="sidebar-toggle" onClick={toggleSidebar}>
      <img src="logo4.png" className="sidebar-toggle-image" />
    </div>
  );
};

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redux 상태 초기화
    dispatch(logout());

    // 로그인 페이지로 리디렉션
    navigate("/login");
  };

  return (
    <button className="sidebar-logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default SideBar;
