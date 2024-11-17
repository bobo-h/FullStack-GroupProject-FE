import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/sidebar.style.css";
import debounce from "lodash.debounce";
import testCatfImage1 from "./../../assets/test_cats/cat_1_pf.png";
import testCatfImage2 from "./../../assets/test_cats/cat_2_pf.png";
import testCatfImage3 from "./../../assets/test_cats/cat_3_pf.png";
import testCatfImage4 from "./../../assets/test_cats/cat_4_pf.png";
import testCatfImage5 from "./../../assets/test_cats/cat_5_pf.png";
import testCatfImage6 from "./../../assets/test_cats/cat_6_pf.png";
import testCatfImage7 from "./../../assets/test_cats/cat_7_pf.png";
import testCatfImage8 from "./../../assets/test_cats/cat_8_pf.png";
import testCatfImage9 from "./../../assets/test_cats/cat_9_pf.png";
import testCatfImage10 from "./../../assets/test_cats/cat_10_pf.png";

// 하위 컴포넌트로 분리하여 코드 가독성 및 재사용성을 높이자.
const SideBar = ({
  currentPage,
  isSidebarActive,
  setIsSidebarActive,
  isScrollingUp,
  scrollTop,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cats, setCats] = useState([
    {
      id: "cat1",
      name: "미유",
      personality: "활발하고 장난기가 많음",
      visualization: false,
      image: testCatfImage1,
    },
    {
      id: "cat2",
      name: "루나",
      personality: "조용하고 신비로운 성격",
      visualization: false,
      image: testCatfImage2,
    },
    {
      id: "cat3",
      name: "모카",
      personality: "다정하고 사람을 좋아함",
      visualization: false,
      image: testCatfImage3,
    },
    {
      id: "cat4",
      name: "초코",
      personality: "탐험을 좋아하는 호기심 많은 성격",
      visualization: false,
      image: testCatfImage4,
    },
    {
      id: "cat5",
      name: "나비",
      personality: "온순하고 애교가 많음",
      visualization: false,
      image: testCatfImage5,
    },
    {
      id: "cat6",
      name: "소이",
      personality: "까칠하지만 속은 따뜻함",
      visualization: false,
      image: testCatfImage6,
    },
    {
      id: "cat7",
      name: "구름",
      personality: "느긋하고 차분한 성격",
      visualization: false,
      image: testCatfImage7,
    },
    {
      id: "cat8",
      name: "별이",
      personality: "활달하고 빛나는 에너지를 가짐",
      visualization: false,
      image: testCatfImage8,
    },
    {
      id: "cat9",
      name: "보리",
      personality: "먹을 것을 좋아하는 푸근한 성격",
      visualization: false,
      image: testCatfImage9,
    },
    {
      id: "cat10",
      name: "쥬니",
      personality: "영리하고 호기심이 넘침",
      visualization: false,
      image: testCatfImage10,
    },
  ]);
  // 임시 보이기 안보이기 로직
  const handleRightClick = (e, catId) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지

    setCats((prevCatList) =>
      prevCatList.map((cat) =>
        cat.id === catId
          ? { ...cat, visualization: !cat.visualization } // visualization 값 토글
          : cat
      )
    );
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
      <SidebarContainer
        sidebarClasses={sidebarClasses}
        toggleSidebar={toggleSidebar}
        windowWidth={windowWidth}
        isSidebarActive={isSidebarActive}
        currentPage={currentPage}
        cats={cats}
        handleRightClick={handleRightClick}
        isScrollingUp={isScrollingUp}
      />
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
        <div className="user-info">개인정보</div>
        <div className="cat-list-container">
          {cats.map((cat) => (
            <div
              className="my-cats-info"
              key={cat.id}
              id={cat.id}
              onContextMenu={(e) => handleRightClick(e, cat.id)} // 우클릭 이벤트 핸들러 추가
            >
              <div
                className={`cat-list-image-back ${
                  cat.visualization ? "view" : ""
                }`}
              >
                <img
                  className="cat-list-image-profile"
                  src={cat.image}
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

export default SideBar;
