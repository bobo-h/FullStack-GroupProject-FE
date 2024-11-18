import React ,{useState} from 'react';
import "./style/adminMenu.style.css";
import { Row } from 'react-bootstrap';
// import sidebarLogo from '../../../../assets/sidebarForMyPageLogo.png';

const AdminMenu = ({ setSelectedComponent, selectedComponent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='admin-menubar'>
      <div className='titles'>
        {/* // <img src={sidebarLogo} alt="Sidebar Logo" className='project-logo' /> */}
      </div>
      <Row className="button-container">
        <button
          className={`admin-button ${selectedComponent === 'products' ? 'active' : ''}`}
          onClick={() => setSelectedComponent('products')}
        >
          Products
        </button>
        <button
          className={`admin-button ${selectedComponent === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedComponent('users')}
        >
          Users
        </button>
        <button
          className={`admin-button ${selectedComponent === 'payment' ? 'active' : ''}`}
          onClick={() => setSelectedComponent('payment')}
        >
          Payment
        </button>
        <button
          className={`admin-button ${selectedComponent === 'diary' ? 'active' : ''}`}
          onClick={() => setSelectedComponent('diary')}
        >
          Diary
        </button>
      </Row>
      <Row md={7} className='text-end button-container'>
        <button
          className={`admin-button ${selectedComponent === 'home' ? 'active' : ''}`}
          onClick={() => setSelectedComponent('home')}
        >
          Home
        </button>
      </Row>
    </div>
  );
};

export default AdminMenu;
