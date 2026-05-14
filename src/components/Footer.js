/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "../styles/Footer.css";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-section">
          <h3>Call Us Now</h3>

          <p className="footer-phone-number">
            +20 127 288 5923
          </p>

          <div className="social-icons">

            <a
              href="https://wa.me/+2001272885923"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>

            <a
              href="https://www.facebook.com/share/168wpNsmMG/?mibextid=wwXIfr"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/milo_gym?igsh=cXN6N2x6N3Q2cnFm"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

          </div>
        </div>

        {/* CENTER */}
        <div className="footer-section footer-center">

          <h3>Address</h3>

          <p>
            شارع سيدي جابر – سموحة علي الترآم
            <br />
            بجوار كيسة ادنشست
          </p>

          <p>
            Sidi Gabir, Alexandria Governorate,
            Egypt
          </p>

        </div>

        {/* RIGHT */}
        <div className="footer-section">

          <h3>Quick Links</h3>

          <nav className="footer-links">

            <a href="#home">Home</a>

            <a href="#services">
              Services
            </a>

            <a href="#opinions">
              Opinions
            </a>

            <a href="#about">
              About Us
            </a>

          </nav>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2026 MiloFit Gym. All Rights
          Reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;