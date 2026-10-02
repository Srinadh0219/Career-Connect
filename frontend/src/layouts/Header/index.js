import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoReorderThreeSharp } from "react-icons/io5";
import { HiBriefcase } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Header = (props) => {
  const { headerContent, headingLink } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest(".custom-header") && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/");
  };

  return (
    <header className="custom-header sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link
          className="flex items-center gap-3 group text-decoration-none"
          to={headingLink}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
            <HiBriefcase className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              CAREER<span className="text-blue-400">CONNECT</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
              Bridge to Your Future
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          {headerContent.map((item, index) =>
            item.title === "Logout" ? (
              <button
                key={index}
                className="ml-3 px-4 py-2 text-sm font-semibold rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all duration-200 shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                key={index}
                to={item.link}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-decoration-none ${
                  location.pathname === item.link
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {item.title}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? (
              <RxCross2 className="w-7 h-7" />
            ) : (
              <IoReorderThreeSharp className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <HiBriefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">CareerConnect</span>
          </div>
          <button
            onClick={closeSidebar}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        </div>

        <ul className="p-4 space-y-2 list-unstyled">
          {headerContent.map((item, index) =>
            item.title === "Logout" ? (
              <li key={index} className="pt-4 border-t border-slate-800">
                <button
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-colors"
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-decoration-none ${
                    location.pathname === item.link
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={closeSidebar}
                >
                  {item.title}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}
    </header>
  );
};

export default Header;
