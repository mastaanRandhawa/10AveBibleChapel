import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Header.css";
import BurgerIcon from "../assets/burger.svg"; // Import your vector burger icon
import CloseIcon from "../assets/closeButton.svg"
import HomeIcon from "../assets/home.svg"

function Header() {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="leftSide">
                    <Link to="/">
                        <span className="churchIconName">10TH AVE BIBLE CHAPEL</span>
                        <img className="churchIcon" alt="Church Icon" src={HomeIcon}></img>
                    </Link>
                </div>

                <div className="rightSide">
                    <button className="burger" onClick={toggleMenu}>
                        <img src={BurgerIcon} alt="Menu" />
                    </button>
                    {/* Combine the original styling with the new "navLinks" class for mobile */}
                    <ul className={`navLinks ${menuActive ? "open" : ""}`}>
                        <li>
                            <Link to="/" onClick={toggleMenu}>HOME</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={toggleMenu}>ABOUT US</Link>
                        </li>
                        <li>
                            <Link to="/sermon" onClick={toggleMenu}>SERMON</Link>
                        </li>
                        <li>
                            <Link to="/prayers" onClick={toggleMenu}>PRAYERS</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={toggleMenu}>CONTACT US</Link>
                        </li>
                        <li className="closeButton" onClick={toggleMenu}>
                            <img src={CloseIcon} alt="Menu" />
                        </li>
                    </ul>


                </div>
            </nav>
        </header>
    );
}

export default Header;
