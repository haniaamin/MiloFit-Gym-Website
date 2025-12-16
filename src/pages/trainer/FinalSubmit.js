import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FinalSubmit.css";

const FinalSubmit = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/sign-in"); // Redirect to sign-in page
    };

    return (
        <div className="final-submit-container">
            <div className="createaccbackground-overlay"></div>
            <div className="final-submit-card">
                <div className="icon">&#10004;</div>
                <h2>Congratulations!</h2>
                <p>You have successfully submitted your application.</p>
                <p>Our team will review your application and notify you within 48 hours via email.</p>
                <button onClick={handleBackToHome}>Back to SignIn</button>
            </div>
        </div>
    );
};

export default FinalSubmit;


