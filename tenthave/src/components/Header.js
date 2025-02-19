import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../components/Header.css"; // Ensure correct path to CSS file
import BurgerIcon from "../assets/burger.svg"; // Import your vector burger icon

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="leftSide">
                    <Link to="/">
                        <span>10TH AVE BIBLE CHAPEL</span>
                    </Link>
                </div>

                <div className="rightSide">
                    <div className="burger" onClick={toggleMenu}>
                        <img src={BurgerIcon} alt="Menu" />
                    </div>
                    <ul className={`navLinks ${isOpen ? "open" : ""}`}>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/about">ABOUT US</Link></li>
                        <li><Link to="/sermon">SERMON</Link></li>
                        <li><Link to="/prayers">PRAYERS</Link></li>
                        <li><Link to="/contact">CONTACT US</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;
