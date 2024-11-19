import React, { useState } from 'react';
import "./style/admin.style.css";
import AdminProduct from './component/AdminProduct/AdminProduct';
import AdminUser from './component/AdminUser/AdminUser';
import AdminMenu from './component/AdminMenu/AdminMenu';
import AdminPayment from './component/AdminPayment/AdminPayment'
import AdminDiary from './component/AdminDiary/AdminDiary'
import Button2 from '../../common/components/Button2';
import { useNavigate } from 'react-router-dom';


const AdminPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'products':
        return <AdminProduct />;
      case 'users':
        return <AdminUser />;
      case 'payment':
        return <AdminPayment />;
      case 'diary':
        return <AdminDiary />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  const goToMainPage = () => {
    navigate("/")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-page">
      <div className="sidebar-toggle">
        {/* <img
          src="logo4.png"
          className="sidebar-toggle-image"
          alt="Toggle Sidebar"
          onClick={toggleSidebar}
        /> */}
      </div>
      <div className={`admin-menu ${isSidebarOpen ? "" : "closed"}`}>
        <AdminMenu
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
        />
      </div>
      <div className="admin-content">
        <div className="home-btn">
          <Button2 onClick={goToMainPage}>메인으로</Button2>
        </div>
        <div className="content-component">
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
