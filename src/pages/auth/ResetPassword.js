import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/ResetPassword.css"; // Import CSS
import { Key } from "@mui/icons-material";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("Weak");

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const getPasswordStrength = (password) => {
        if (password.length < 7) return "Weak";
        const hasLetters = /[A-Za-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (hasLetters && hasNumbers && hasSymbols) return "Very Good";
        if (hasLetters && hasNumbers) return "Good";
        return "Weak";
    };

    const isValidPassword = (password) => {
        return password.length >= 7 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    };

    const handleNewPasswordChange = (e) => {
        const val = e.target.value;
        setNewPassword(val);
        setPasswordStrength(getPasswordStrength(val));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        if (!isValidPassword(newPassword)) {
            setMessage("Password must be at least 7 characters and include both letters and numbers.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/auth/reset-password", {
                email,
                newPassword,
            });
            navigate("/pass-changed");
        } catch (error) {
            setMessage("Error resetting password.");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="createaccbackground-overlay"></div>
            <div className="reset-password-box">
                <h2>Reset Password</h2>
                <p>Enter your new password below</p>
                <Key className="icon" sx={{ fontSize: 80, color: "#E50914" }} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="password-input"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                    />
                    <div className="password-strength">
                        <div className={`strength-bar ${passwordStrength.toLowerCase().replace(" ", "-")}`} />
                        <span>{passwordStrength}</span>
                    </div>

                    <input
                        type="password"
                        className="password-input"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="reset-btn">Reset Password</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
