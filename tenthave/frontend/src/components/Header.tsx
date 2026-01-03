import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { useAuth } from "../context/AuthContext";
import { NAVIGATION_ITEMS } from "../constants";
import "./Header.css";
import BurgerIcon from "../assets/burger.svg";
import CloseIcon from "../assets/closeButton.svg";
import HomeIcon from "../assets/home.svg";

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const { scrollDirection, isScrolled } = useScrollDirection(100);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuActive((active) => !active);

  const handleLogout = () => {
    logout();
    toggleMenu();
    navigate("/");
  };

  // Show header when:
  // 1. At the top of the page (not scrolled)
  // 2. Scrolling up
  // Hide header when scrolling down
  const shouldShowHeader = !isScrolled || scrollDirection === "up";

  return (
    <header className={`header${shouldShowHeader ? " header-visible" : ""}`}>
      <nav className="nav-container">
        <div className="leftSide">
          <Link to="/">
            <span className="churchIconName">10TH AVE BIBLE CHAPEL</span>
            <img className="churchIcon" src={HomeIcon} alt="Church Icon" />
          </Link>
        </div>
        <div>
          <button className="burger" onClick={toggleMenu}>
            <img src={BurgerIcon} alt="Menu" />
          </button>
          <ul className={`navLinks${menuActive ? " open" : ""}`}>
            {NAVIGATION_ITEMS.map(({ path, label }) => (
              <li key={path}>
                <Link to={path} onClick={toggleMenu}>
                  {label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/members" onClick={toggleMenu}>
                    {user?.role === "ADMIN" ? "Admin Dashboard" : "Members Area"}
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit" }}>
                    LOGOUT ({user?.name})
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={toggleMenu}>
                  LOGIN
                </Link>
              </li>
            )}
            <li className="closeButton" onClick={toggleMenu}>
              <img src={CloseIcon} alt="Close Menu" />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
