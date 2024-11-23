import React, { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import {
  getChatbotList,
  updateChatbotJins,
  logoutChatBot,
} from "../../features/chatbot/chatbotSlice";
import "../style/sidebar.style.css";
import debounce from "lodash.debounce";
import { setSelectedProduct } from "../../features/product/productSlice";
import api from "../../utils/api";

const SideBar = ({
  currentPage,
  isSidebarActive,
  setIsSidebarActive,
  isScrollingUp,
  scrollTop,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isSidebarActive) {
      const sidebar = document.querySelector(".sidebar-container");
      sidebar.classList.add("closing");
      const overlay = document.querySelector(".overlay");
      overlay.classList.add("closing");

      setTimeout(() => {
        setIsSidebarActive(false);
        sidebar.classList.remove("closing");
        overlay.classList.remove("closing");
      }, 500);
    } else {
      setIsSidebarActive(true);
    }
  };

  const animationClass =
    currentPage === "home"
      ? "slide-in-right"
      : currentPage === "diaries"
      ? "slide-in-left"
      : "";

  const isDesktop = windowWidth >= 700;
  const isMobileActive = windowWidth < 700 && isSidebarActive;

  const sidebarClasses = [
    "sidebar-container",
    isDesktop ? "desktop-sidebar" : "",
    isMobileActive ? "active" : "",
    isSidebarActive && animationClass ? animationClass : "hidden",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isDesktop) {
      setIsSidebarActive(true);
    } else {
      setIsSidebarActive(false);
    }
  }, [isDesktop]);

  return (
    <>
      {user && (
        <SidebarContainer
          sidebarClasses={sidebarClasses}
          toggleSidebar={toggleSidebar}
          windowWidth={windowWidth}
          isSidebarActive={isSidebarActive}
          currentPage={currentPage}
          isScrollingUp={isScrollingUp}
          user={user}
        />
      )}
    </>
  );
};

const SidebarContainer = ({
  sidebarClasses,
  toggleSidebar,
  windowWidth,
  isSidebarActive,
  currentPage,
  isScrollingUp,
  scrollTop,
  user,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cats = useSelector((state) => state.chatbot.cats);
  const loading = useSelector((state) => state.chatbot.loading);
  const newItem = useSelector((state) => state.chatbot.newItem);
  const getFlag = useSelector((state) => state.chatbot.getFlag);
  const catsLength = useSelector((state) => state.chatbot.catsLength);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getChatbotList());
    };

    fetchData();
  }, [dispatch, newItem]);

  useEffect(() => {
    const fetchData = async () => {
      if (getFlag) {
        try {
          const response = await api.get(
            "/product?defaultProduct=Yes&category=Cat"
          );
          const defaultProduct = response.data.data;
          console.log("response???", response);

          if (defaultProduct) {
            dispatch(setSelectedProduct(defaultProduct[0]));
          }

          navigate("/chatbot");
        } catch (error) {
          console.error("Failed to fetch default product:", error);
        }
      }
    };

    fetchData();
  }, [getFlag]);

  const handleRightClick = useCallback(
    (e, catId) => {
      e.preventDefault();
      const selectedCat = cats.find((cat) => cat._id === catId);
      if (selectedCat) {
        const updatedVisualization = !selectedCat.visualization;
        dispatch(
          updateChatbotJins({
            id: catId,
            updateData: { visualization: updatedVisualization },
          })
        );
      }
    },
    [cats, dispatch]
  );

  return (
    <>
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

        {user.profileImage ? (
          <img src={user.profileImage} className="user-image" />
        ) : (
          <img src="/catbutler.webp" className="user-image" />
        )}
        <div className="user-info">
          <span className="user-name">집사 이름 : {user.name}</span>
          <LogoutButton />
        </div>
        {!loading ? (
          <div className="cat-list-container">
            {cats.map((cat) => (
              <CatItem
                key={cat._id}
                cat={cat}
                handleRightClick={handleRightClick}
              />
            ))}
          </div>
        ) : (
          <div className="cat-list-container">
            {[...Array(catsLength)].map((_, index) => (
              <CatItem
                key={index}
                cat={cats[index]}
                handleRightClick={handleRightClick}
              />
            ))}
          </div>
        )}
      </div>
      {windowWidth < 700 &&
      !isSidebarActive &&
      (currentPage === "home" || currentPage === "diaries") &&
      (isScrollingUp || scrollTop === 0) ? (
        <ToggleButton toggleSidebar={toggleSidebar} />
      ) : null}
    </>
  );
};

const CatItem = React.memo(({ cat, handleRightClick }) => {
  return (
    <div
      className="my-cats-info"
      key={cat._id}
      id={cat._id}
      onContextMenu={(e) => handleRightClick(e, cat._id)}
    >
      <div className={`cat-list-image-back ${cat.visualization ? "view" : ""}`}>
        <img
          className="cat-list-image-profile"
          src={cat.product_id.image}
          alt="cats profile"
        />
      </div>
      <span className="cat-list-title">{cat.name}</span>
      <span className="cat-list-discript">{cat.personality}</span>
      <div className="cat-info-toggle-wrapper">
        <input
          type="checkbox"
          id={`cat-info-toggle-switch-${cat._id}`}
          className="cat-info-toggle-checkbox"
          checked={cat.visualization}
          onChange={(e) => handleRightClick(e, cat._id)}
        />
        <label
          htmlFor={`cat-info-toggle-switch-${cat._id}`}
          className="cat-info-toggle-label"
        ></label>
      </div>
    </div>
  );
});

const ToggleButton = memo(({ toggleSidebar }) => {
  return (
    <div className="sidebar-toggle" onClick={toggleSidebar}>
      <img src="/logo4.png" className="sidebar-toggle-image" alt="logo4" />
    </div>
  );
});

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(logoutChatBot());

    navigate("/login");
  };

  return (
    <button className="sidebar-logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default SideBar;
