import { Lock } from "@mui/icons-material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ForgotPassword.css"; // Import CSS

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            navigate("/email-verification", { state: { email } });
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending OTP");
        }
    };

    return (
        
        <div className="forgot-password-container">
            <div className="forgotpassbackground-overlay"></div>
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                <p>Enter the email associated with your account</p>
                <Lock className="icon" sx={{ fontSize: 80, color: "#E50914" }} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="signup-btn">Reset Password</button>
                </form>
                {message && <p className="message">{String(message)}</p>}
                {message && <p className="error-message">{message}</p>}
                <button className="back-to-login" onClick={() => navigate("/sign-in")}>Back to Sign In</button>
            </div>
        </div>
    );
};

export default ForgotPassword;
