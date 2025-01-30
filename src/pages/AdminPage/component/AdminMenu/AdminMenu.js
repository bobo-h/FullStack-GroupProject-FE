import React from "react";
import "./style/adminMenu.style.css";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminMenu = ({
  setSelectedComponent,
  selectedComponent,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`admin-menubar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="admin-menu-header">
        <button
          className="menu-toggle-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i class="ri-menu-line"></i>
        </button>
        <img
          className="menu-title"
          src="logo2.png"
          alt="menu-title"
          onClick={() => navigate(`/`)}
        />
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
