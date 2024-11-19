import React, { useState } from "react";
import "./style/adminMenu.style.css";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminMenu = ({ setSelectedComponent, selectedComponent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();


  return (
    <div className={`admin-menubar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="menu-header">
        <img
          className="project-title"
          src="logo2.png"
          alt="project-title"
          onClick={() => navigate(`/`)}
        />
        
      </div>
      {isSidebarOpen && (
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
      )}
    </div>
  );
};

export default AdminMenu;
