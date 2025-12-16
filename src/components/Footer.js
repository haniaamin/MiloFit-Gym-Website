/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "../styles/Footer.css"; // Create this file for styling
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-banner">
        <div className="footer-phone">
        <h3>Call Us Now</h3>
        <p>+20 127 288 5923</p>
        </div>
        <div className="footer-address"> 
        <h2> Address:</h2>  
          <p>شارع سيدي جابر – سموحة علي الترآم - بجوار كيسة ادنشست </p> 
          <p>Sidi Gabir, Alexandria Governorate, Egypt</p>
          </div>
          <div className="social-icons">
          <a href="https://wa.me/+2001272885923" className="social-icon"><FaWhatsapp /></a>
          <a href="https://www.facebook.com/share/168wpNsmMG/?mibextid=wwXIfr" className="social-icon"><FaFacebookF /></a>
          <a href="https://www.instagram.com/milo_gym?igsh=cXN6N2x6N3Q2cnFm" className="social-icon"><FaInstagram /></a>
        </div>
        <nav className="footer-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#opinions">Opinions</a>
          <a href="#about">About Us</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
