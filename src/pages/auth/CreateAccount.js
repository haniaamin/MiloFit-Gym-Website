import React, { useState } from "react";
import "../../styles/CreateAccount.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CreateAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        nationalId: "",
        password: "",
        role: "trainee",
    });

    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            setPasswordStrength(evaluatePasswordStrength(value));
        }
    };

    const evaluatePasswordStrength = (password) => {
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const lengthValid = password.length >= 7;

        if (!lengthValid || (!hasLetters && !hasNumbers)) {
            return "weak";
        } else if (lengthValid && hasLetters && hasNumbers && password.length < 10) {
            return "good";
        } else if (lengthValid && hasLetters && hasNumbers && password.length >= 10) {
            return "verygood";
        } else {
            return "weak";
        }
    };

    const isValidEgyptianID = (id) => {
        if (!/^\d{14}$/.test(id)) return false;
        const century = id[0];
        if (century !== "2" && century !== "3") return false;

        const year = (century === "2" ? "19" : "20") + id.slice(1, 3);
        const month = id.slice(3, 5);
        const day = id.slice(5, 7);
        const birthDate = new Date(`${year}-${month}-${day}`);

        return (
            birthDate.getFullYear() === parseInt(year) &&
            birthDate.getMonth() + 1 === parseInt(month) &&
            birthDate.getDate() === parseInt(day)
        );
    };

    const isPasswordValid = (password) => {
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return password.length >= 7 && hasLetters && hasNumbers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEgyptianID(formData.nationalId)) {
            setMessage("Please enter a valid Egyptian National ID.");
            return;
        }

        if (!isPasswordValid(formData.password)) {
            setMessage("Password must be at least 7 characters long and contain both letters and numbers.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("email", formData.email);

                if (formData.role === "trainee") {
                    navigate("/complete-profile-trainee");
                } else {
                    navigate("/complete-profile-trainer");
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    const renderPasswordStrength = () => {
        if (!formData.password) return null;

        let color = "#ccc";
        let label = "Weak";

        if (passwordStrength === "weak") {
            color = "#e74c3c";
            label = "Weak";
        } else if (passwordStrength === "good") {
            color = "#f1c40f";
            label = "Good";
        } else if (passwordStrength === "verygood") {
            color = "#2ecc71";
            label = "Very Good";
        }

        return (
            <div className="password-strength-container">
                <div className="password-strength-line" style={{ backgroundColor: color }} />
                <span className="password-strength-label" style={{ color }}>{label}</span>
            </div>
        );
    };

    return (
        <div className="create-account-container">
            <div className="createaccbackground-overlay"></div>
            <div className="create-account-box">
                <h2>Create an account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-groups">
                        <input type="text" name="nationalId" placeholder="National ID" value={formData.nationalId} onChange={handleChange} required />
                    </div>

                    <div className="password-group" style={{ position: 'relative', width: '100%' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', paddingRight: '35px' }}
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer'
                            }}
                        >
                            {showPassword ? <VisibilityOff style={{ fontSize: '20px', color: '#666' }} /> : <Visibility style={{ fontSize: '20px', color: '#666' }} />}
                        </span>
                    </div>

                    {renderPasswordStrength()}

                    <div className="role-selection">
                        <span style={{ marginRight: '10px' }}>Are you:</span>
                        <label style={{ marginRight: '15px' }}>
                            <input type="radio" name="role" value="trainee" checked={formData.role === "trainee"} onChange={handleChange} /> Trainee
                        </label>
                        <label>
                            <input type="radio" name="role" value="trainer" checked={formData.role === "trainer"} onChange={handleChange} /> Trainer
                        </label>
                    </div>

                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>

                {message && <p className="message">{message}</p>}
                <p className="terms">
                    By continuing, you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
                <p className="login-link">
                    Already have an account? <a href="/sign-in">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default CreateAccount;
