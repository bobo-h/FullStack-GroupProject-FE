import React, { useState, useEffect } from "react";
import "./style/adminMenu.style.css";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const AdminMenu = ({ 
  setSelectedComponent, 
  selectedComponent,
  isSidebarOpen,
  setIsSidebarOpen
 }) => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1210);
  const navigate = useNavigate();
 
  const handleResize = () => {
    const isNowMobile = window.innerWidth <= 1210;
    if (isNowMobile) {
      setIsSidebarOpen(false);
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`admin-menubar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="menu-header">
        <img
          className="menu-title"
          src="logo2.png"
          alt="menu-title"
          onClick={() => navigate(`/`)}
        />
        <button
          className="menu-toggle-button"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <Row className="button-container">
        <button
          className={`admin-button ${
            selectedComponent === "products" ? "active" : ""
          }`}
          onClick={() => setSelectedComponent("products")}
        >
          Products
        </button>
        <button
          className={`admin-button ${
            selectedComponent === "users" ? "active" : ""
          }`}
          onClick={() => setSelectedComponent("users")}
        >
          Users
        </button>
        <button
          className={`admin-button ${
            selectedComponent === "payment" ? "active" : ""
          }`}
          onClick={() => setSelectedComponent("payment")}
        >
          Payment
        </button>
        <button
          className={`admin-button ${
            selectedComponent === "diary" ? "active" : ""
          }`}
          onClick={() => setSelectedComponent("diary")}
        >
          Diary
        </button>
      </Row>
    </div>
  );
};

export default AdminMenu;
