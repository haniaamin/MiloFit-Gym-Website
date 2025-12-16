import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PassChanged.css";

const FinalSubmit = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/sign-in"); // Redirect to sign-in page
    };

    return (
        <div className="pass-changed-container">
            <div className="createaccbackground-overlay"></div>
            <div className="pass-changed-card">
                <div className="icon">&#10004;</div>
                <h2>Password has been changed successfully</h2>
                <p>Try to keep it safe</p>
                <button className="btsi-button" onClick={handleBackToHome}>Back to SignIn</button>
            </div>
        </div>
    );
};

export default FinalSubmit;