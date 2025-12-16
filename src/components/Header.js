import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="logo-container" onClick={() => navigate("/")}>
                <img 
                    src={logo} 
                    alt="MiloFit Gym Logo" 
                    className="logo" 
                />
                <h4 className="gym-name">MiloFit Gym</h4>
            </div>
        </div>
    );
};

export default Header;