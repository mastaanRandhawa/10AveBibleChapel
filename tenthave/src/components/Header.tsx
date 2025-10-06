import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { NAVIGATION_ITEMS } from "../constants";
import "./Header.css";
import BurgerIcon from "../assets/burger.svg";
import CloseIcon from "../assets/closeButton.svg";
import HomeIcon from "../assets/home.svg";

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const scrolled = useScrollPosition(100);

  const toggleMenu = () => setMenuActive((active) => !active);

  return (
    <header className={`header${!scrolled ? " header-visible" : ""}`}>
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
