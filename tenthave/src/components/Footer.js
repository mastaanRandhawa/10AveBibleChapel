import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
// import Button from "./Button"

function Footer() {
    const [email, setEmail] = useState("");

    // Add email subscription logic here
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            console.log(`Subscribed with email: ${email}`);
            setEmail(""); // Clear input after submission
        }
    };

    return (
        <footer className="footer">
            {/* Left Section: Church Info */}
            <div className="footer-left">
                <h4 className="footer-title">10TH AVE BIBLE CHAPEL</h4>
                <p>© COPYRIGHT 10TH AVE 2025</p>
                <p>(604) 524 - 5445</p>
                <p>7103 - 10TH AVE., BURNABY, BC V3N 2R5</p>
                <p>INFO@TENTHAVCHAPEL.COM</p>
            </div>

            {/* Middle Section: Quick Links */}
            <div className="footer-links">
                <h4>Quicklinks</h4>
                <ul>
                    <li>
                        <Link to="/about" closeButton>About Us</Link>
                    </li>
                    <li>
                        <Link to="/sermon" closeButton>Sermons</Link>
                    </li>
                    <li>
                        <Link to="/prayers" closeButton>Prayers</Link>
                    </li>
                    <li>
                        <Link to="/contact" closeButton>Contact Us</Link> </li>
                </ul>
            </div>

            {/* Right Section: Subscription Form */}
            <div className="footer-subscribe">
                <h1>SUBSCRIBE TO GET LATEST UPDATES AND NEWS</h1>
                <form onSubmit={handleSubmit} className="subscribe-form">
                    <input
                        type="email"
                        placeholder="Yourmail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">SUBSCRIBE</button>
                </form>
            </div>
        </footer>
    );
}

export default Footer;
