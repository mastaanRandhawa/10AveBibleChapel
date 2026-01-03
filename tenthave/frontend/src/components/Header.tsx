import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { useAuth } from "../context/AuthContext";
import { NAVIGATION_ITEMS } from "../constants";
import "./Header.css";
import BurgerIcon from "../assets/burger.svg";
import CloseIcon from "../assets/closeButton.svg";
import HomeIcon from "../assets/home.svg";

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { scrollDirection, isScrolled } = useScrollDirection(100);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuActive((active) => !active);
  const toggleUserMenu = () => setUserMenuOpen((open) => !open);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toggleMenu();
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Show header when:
  // 1. At the top of the page (not scrolled)
  // 2. Scrolling up
  // Hide header when scrolling down
  const shouldShowHeader = !isScrolled || scrollDirection === "up";

  return (
    <header className={`header${shouldShowHeader ? " header-visible" : ""}`}>
      <nav className="nav-container">
        {/* Left: Logo + Church Name */}
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <span className="church-name">10TH AVE BIBLE CHAPEL</span>
            <img className="church-icon-mobile" src={HomeIcon} alt="Church Icon" />
          </Link>
        </div>

        {/* Center: Main Navigation Links */}
        <div className="nav-center">
          <ul className="nav-main-links">
            {NAVIGATION_ITEMS.map(({ path, label }) => (
              <li key={path}>
                <Link 
                  to={path}
                  className={isActiveRoute(path) ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: User Menu / Login */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button 
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <span className="user-name">{user?.name}</span>
                <span className={`user-menu-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link 
                    to="/members" 
                    className="user-menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {user?.role === "ADMIN" ? "DASHBOARD" : "MEMBERS AREA"}
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="user-menu-item logout"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="login-button"
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile: Burger Menu */}
        <button 
          className="burger-menu" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuActive}
        >
          <img src={BurgerIcon} alt="" />
        </button>

        {/* Mobile: Slide-out Menu */}
        <div className={`mobile-menu${menuActive ? " open" : ""}`}>
          <button 
            className="mobile-menu-close" 
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <img src={CloseIcon} alt="" />
          </button>
          <ul className="mobile-menu-links">
            {NAVIGATION_ITEMS.map(({ path, label }) => (
              <li key={path}>
                <Link 
                  to={path} 
                  onClick={toggleMenu}
                  className={isActiveRoute(path) ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/members" 
                    onClick={toggleMenu}
                    className={isActiveRoute("/members") ? "active" : ""}
                  >
                    {user?.role === "ADMIN" ? "DASHBOARD" : "MEMBERS AREA"}
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="mobile-logout-btn"
                  >
                    LOGOUT ({user?.name})
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  onClick={toggleMenu}
                  className={`mobile-login-link ${isActiveRoute("/login") ? "active" : ""}`}
                >
                  LOGIN
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
