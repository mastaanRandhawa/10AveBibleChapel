import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>10TH AVE BIBLE CHAPEL</h2>
          <p>© COPYRIGHT 10TH AVE 2025</p>
        </div>

        <div className="footer-section">
          <h2>FIND US</h2>
          <p>
            <a
              href="https://maps.app.goo.gl/zK9QdwjhFSga1mCs9"
              target="_blank"
              rel="noreferrer"
            >
              7103 – 10TH AVE., BURNABY, BC V3N 2R5
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h2>CONTACT US</h2>
          <p>
            <a href="tel:6045245445">(604) 524-5445</a>
          </p>
          <p>
            <a href="mailto:info@tenthavebiblechapel.com">
              info@tenthavebiblechapel.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
