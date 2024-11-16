import React, { useState } from 'react';
import "./style/admin.style.css";
import AdminProduct from './component/AdminProduct/AdminProduct';
import AdminUser from './component/AdminUser/AdminUser';
import AdminMenu from './component/AdminMenu/AdminMenu';
import AdminPayment from './component/AdminPayment/AdminPayment'
import Button2 from '../../common/components/Button2';


const AdminPage = () => {
  const [selectedComponent, setSelectedComponent] = useState('products');

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'products':
        return <AdminProduct />;
      case 'users':
        return <AdminUser />;
      case 'payment':
        return <AdminPayment />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-menu">
        <AdminMenu
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
        />
      </div>
      <div className="admin-content">
        <div className="home-btn">
          <Button2>메인으로</Button2>
        </div>
        <div className="content-component">
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
