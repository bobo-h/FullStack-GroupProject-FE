import React, { useState, useEffect } from 'react';
import "./style/admin.style.css";
import AdminProduct from './component/AdminProduct/AdminProduct';
import AdminUser from './component/AdminUser/AdminUser';
import AdminMenu from './component/AdminMenu/AdminMenu';
import AdminPayment from './component/AdminPayment/AdminPayment';
import AdminDiary from './component/AdminDiary/AdminDiary';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsSidebarOpen(false); 
      } else {
        setIsSidebarOpen(true);  
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

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
      {isSidebarOpen && (
        <AdminMenu
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <div className="admin-content" style={{ marginLeft: isSidebarOpen ? '250px' : '0px' }}>
        <div className="content-component">
          <div className="admin-menu-btns">
            {!isSidebarOpen && (
              <button
                className="open-menu-button"
                onClick={toggleSidebar}
              >
                <i class="ri-menu-line"></i>
              </button>
            )}
            <button
              className="open-menu-button"
              onClick={goToMainPage}
            >
              <i class="ri-home-4-fill"></i>
            </button>
          </div>
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
