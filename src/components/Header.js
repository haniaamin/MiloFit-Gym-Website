import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <header className="header">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img src={logo} alt="MiloFit Gym Logo" className="logo" />
        <h4 className="gym-name">MiloFit Gym</h4>
      </div>
    </header>
  );
};

export default Header;
