import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoReorderThreeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const { headerContent, headingLink } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest(".header") && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleTradeNameClick = () => {};

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-top-section">
        <div className="logo">
          <Link
            onClick={handleTradeNameClick}
            className="pointer text-white"
            to={headingLink}
          >
            <strong>CAREERCONNECT</strong>
            <p className="text-xs relative left-[70px]">
              Find your best Employee
            </p>
          </Link>
        </div>
        <ul className="header-top-list-container">
          {headerContent.map((item, index) =>
            item.title === "Logout" ? (
              <button
                className="btn btn-light"
                key={index}
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <li key={index} className="mt-3 mx-4">
                <Link to={item.link} className="text-white">
                  <strong>{item.title}</strong>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      <nav className={`nav bg-light ${sidebarOpen ? "nav--open" : ""}`}>
        <ul>
          {headerContent.map((item, index) =>
            item.title === "Logout" ? (
              <button
                className="btn btn-light"
                key={index}
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
              >
                Logout
              </button>
            ) : (
              <li key={index}>
                <Link
                  to={item.link}
                  className="text-dark"
                  onClick={closeSidebar}
                >
                  {item.title}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
      <div className="hamburger" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <RxCross2 className="nav-logo" />
        ) : (
          <IoReorderThreeSharp className="nav-logo" />
        )}
      </div>
    </header>
  );
};

export default Header;
