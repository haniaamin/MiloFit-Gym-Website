import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/EmailVerification.css"; // Import CSS
import { Email } from "@mui/icons-material";

const EmailVerification = () => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`Verifying OTP: ${otp} for email: ${email}`); // Debugging
            await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            navigate("/reset-password", { state: { email } });
        } catch (error) {
            console.error("OTP Verification Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Invalid or expired OTP.");
        }
    };

    return (
        <div className="email-verification-container">
            <div className="createaccbackground-overlay"></div>
            <div className="email-verification-box">
                <h2>Email Verification</h2>
                <p>Enter the 4-digit code sent to your email</p>
                 <Email className="icon" sx={{ fontSize: 80, color: "#E50914" }} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        maxLength="4"
                        className="otp-input"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit" className="verify-btn">Verify Account</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default EmailVerification;
