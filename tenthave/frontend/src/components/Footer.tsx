import React from "react";
import "./Footer.css";
import location from "../assets/location.svg";
import phone from "../assets/phone.svg";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Column 1: Church Info */}
      <div className="footer-column footer-info">
        <h2 className="footer-title">10TH AVE BIBLE CHAPEL</h2>
        <p>© COPYRIGHT 10TH AVE 2025</p>
      </div>
      <div className="footerInside">
        {/* Column 3: Quick Links */}
        <div className="footer-column footer-links">
          <hr className="lineBreak"></hr>
          <h3>MATTHEW 18:20</h3>
          <p>
            "For where two or three are gathered together in My name, I am there
            in the midst of them."
          </p>
        </div>

        {/* Column 2: Find */}
        <div className="footer-column">
          <div className="footer-contact-item">
            <img src={location} alt="location" className="social-icon" />
            <h3>FIND US</h3>
            <a
              href="https://maps.app.goo.gl/zK9QdwjhFSga1mCs9"
              target="_blank"
              rel="noreferrer"
            >
              7103 – 10TH AVE., BURNABY, BC V3N 2R5
            </a>
          </div>
        </div>

        {/* Column 2: Contact */}
        <div className="footer-column">
          <div className="footer-contact-item">
            <img src={phone} alt="phone" className="social-icon" />
            <h3>CONTACT US</h3>
            <a href="tel:6045245445">(604) 524-5445</a>
            <a href="mailto:info@tenthavchapel.com">info@tenthavchapel.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
