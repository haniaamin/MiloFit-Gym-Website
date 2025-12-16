import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CompleteProfile.css"; // Import CSS

const CompleteProfile = () => {
    const [formData, setFormData] = useState({
        gender: "",
        month: "",
        date: "",
        year: "",
        weight: "",
        height: "",
    });

    const [message, setMessage] = useState(""); // State for messages
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem("email"); // Get email from registration
            if (!email) {
                alert("Email not found. Please restart registration.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/trainee/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...formData }) // Send email + profile data
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/fitness-goals"); // Move to the next step
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="complete-profiles-container">
            <div className="createaccbackground-overlay"></div>
            <div className="complete-profiles-box">
                <h2>Let's complete your profile</h2>
                <p>It will help us know more about you</p>
                {message && <p className="error-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Gender Dropdown */}
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    {/* Date of Birth */}
                    <div className="dob-group">
                        <select name="month" value={formData.month} onChange={handleChange} required>
                            <option value="">Month</option>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                        <select name="date" value={formData.date} onChange={handleChange} required>
                            <option value="">Date</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select name="year" value={formData.year} onChange={handleChange} required>
                            <option value="">Year</option>
                            {[...Array(100)].map((_, i) => (
                                <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                            ))}
                        </select>
                    </div>

                    {/* Weight and Height */}
                    <div className="input-group">
                        <input type="number" name="weight" placeholder="Your Weight (KG)" value={formData.weight} onChange={handleChange} required />
                        <input type="number" name="height" placeholder="Your Height (CM)" value={formData.height} onChange={handleChange} required />
                    </div>                 
                    {/* Next Button */}
                    <button type="submit" className="next-btn">Next →</button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
