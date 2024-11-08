import React, { useState } from "react";
import "./Nav.css";
import Container from "../Container";
import Flex from "../Flex";
import Image from "../Image";
import myLogo from "../../assets/myLogoLikeLinkdin.svg";
import { RiLogoutBoxFill } from "react-icons/ri";
import List from "../List";
import ListItem from "../ListItem";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Paragraph from "../Paragraph";
import { setLogedIn } from "../../features/logdin/whoLogedin";

const Nav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logedinData = useSelector((state) => state.logedin.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logOutHandler = () => {
    localStorage.removeItem("user");
    dispatch(setLogedIn(null));
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <nav id="nav">
      <Container>
        <Flex className="navContent">
          <div className="navLogoDiv">
            <Image className="navLogo" imageUrl={myLogo} />
          </div>
          <button
            className="hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className={isSidebarOpen ? "line line1" : "line"}></span>
            <span className={isSidebarOpen ? "line line2" : "line"}></span>
            <span className={isSidebarOpen ? "line line3" : "line"}></span>
          </button>
          <List className="navItems">
            <ListItem
              className={location.pathname === "/home" ? "active" : "navItem"}
            >
              <Link to="/home">Home</Link>
            </ListItem>
            <ListItem
              className={location.pathname === "/me" ? "active" : "navItem"}
            >
              <Link to="/me">Profile</Link>
            </ListItem>
            <ListItem
              className={
                location.pathname === "/messages" ? "active" : "navItem"
              }
            >
              <Link to="/messages">Messages</Link>
            </ListItem>
            <ListItem
              className={
                location.pathname === "/notification" ? "active" : "navItem"
              }
            >
              <Link to="/notification">Notifications</Link>
            </ListItem>
          </List>
          <Flex className="navProfile">
            <div className="navProfileImageDiv">
              <Image
                className="navProfileImage"
                imageUrl={logedinData.photoURL}
              />
            </div>
            <Link to="/me">{logedinData.displayName}</Link>
            <div onClick={logOutHandler} className="logoutBtn">
              <RiLogoutBoxFill />
              <Paragraph title="Log out" />
            </div>
          </Flex>
        </Flex>
      </Container>
      {/* Sidebar for mobile */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <List className="sidebarItems">
          <ListItem className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home" onClick={toggleSidebar}>
              Home
            </Link>
          </ListItem>
          <ListItem className={location.pathname === "/me" ? "active" : ""}>
            <Link to="/me" onClick={toggleSidebar}>
              Profile
            </Link>
          </ListItem>
          <ListItem
            className={location.pathname === "/messages" ? "active" : ""}
          >
            <Link to="/messages" onClick={toggleSidebar}>
              Messages
            </Link>
          </ListItem>
          <ListItem
            className={location.pathname === "/notification" ? "active" : ""}
          >
            <Link to="/notification" onClick={toggleSidebar}>
              Notifications
            </Link>
          </ListItem>
          <div onClick={logOutHandler} className="sidebarLogoutBtn">
            <RiLogoutBoxFill />
            <Paragraph title="Log out" />
          </div>
        </List>
      </div>
      <div
        className={`overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={toggleSidebar}
      ></div>
    </nav>
  );
};

export default Nav;
