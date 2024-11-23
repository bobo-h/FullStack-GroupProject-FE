import React, { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import "../style/navbar.style.css";
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as DiaryIcon } from "../../assets/diary.svg";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as ShopIcon } from "../../assets/shop.svg";
import { ReactComponent as InfoIcon } from "../../assets/my_info.svg";

const NavBar = memo(({ isAdminPage }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const items = [
    { icon: <HomeIcon className="app-icon" />, text: "Home", path: "/" },
    {
      icon: <DiaryIcon className="app-icon" />,
      text: "Diary",
      path: "/diaries",
    },
    {
      icon: <AddIcon className="app-icon" />,
      text: "Write",
      path: "/diaries/new",
    },
    { icon: <ShopIcon className="app-icon" />, text: "Shop", path: "/shop" },
    { icon: <InfoIcon className="app-icon" />, text: "My", path: "/my-page" },
  ];

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = useCallback(
    (index) => {
      if (hoveredIndex !== index) {
        setHoveredIndex(index);
      }
    },
    [hoveredIndex]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoveredIndex !== null) {
      setHoveredIndex(null);
    }
  }, [hoveredIndex]);

  const handleClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      {isAdminPage ? (
        <></>
      ) : (
        <div className="app-navbar">
          <div className="app-options">
            {items.map((item, index) => (
              <div
                key={index}
                className={`app-option-items`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(item.path)}
              >
                {windowWidth >= 700 && hoveredIndex === index ? (
                  <span className="app-item-text">{item.text}</span>
                ) : (
                  item.icon
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});

export default NavBar;
