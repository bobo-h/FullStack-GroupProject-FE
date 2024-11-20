import { set } from "@cloudinary/url-gen/actions/variable";
import React, { useEffect, useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../style/sidebarForMyPage.style.css";

const SidebarForMyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div>
        <Link to="/">
          <img
            width={150}
            src="logo1.png"
            alt="logo.png"
            className="logo-image"
          />
        </Link>
        <div className="sidebar-general-style">
          <div className="sidebar-item">My Page</div>
          <ul className="sidebar-area">
            <li
              className="sidebar-item"
              onClick={() => handleSelectMenu("/my-page")}
            >
              나의 챗봇리스트
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sidebar-toggle">{NavbarContent()}</div>

      <Navbar bg="light" expand={false} className="mobile-sidebar-toggle">
        <Container fluid>
          <img width={80} src="logo1.png" alt="logo1.png" />
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="start"
            className="sidebar"
            show={show}
          >
            <Offcanvas.Header
              closeButton
              onClick={() => setShow(false)}
            ></Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default SidebarForMyPage;
