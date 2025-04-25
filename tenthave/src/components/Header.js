import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Header.css";
import BurgerIcon from "../assets/burger.svg";
import CloseIcon from "../assets/closeButton.svg";
import HomeIcon from "../assets/home.svg";

function Header() {
    const [menuActive, setMenuActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = () => setMenuActive((active) => !active);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);  // threshold = 50px
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`header${scrolled ? " scrolled" : ""}`}>
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
                        {[
                            ["/", "HOME"],
                            ["/bulletin", "BULLETIN"],
                            ["/sermon", "SERMONS"],
                            ["/prayers", "MEMBERS"],
                            ["/contact", "CONTACT US"],
                            ["/about", "ABOUT US"],
                        ].map(([to, label]) => (
                            <li key={to}>
                                <Link to={to} onClick={toggleMenu}>{label}</Link>
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
}

export default Header;
