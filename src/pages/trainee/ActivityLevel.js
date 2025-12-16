import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ActivityLevel.css"; // Create this CSS file

const ActivityLevel = () => {
    const [activityLevel, setActivityLevel] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const activityLevels = [
        "Extremely Active",
        "Very Active",
        "Moderate Active",
        "Lightly Active",
        "Inactive"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activityLevel) {
            setMessage("Please select your activity level.");
            return;
        }

        try {
            const email = localStorage.getItem("email"); // Get email from registration
            if (!email) {
                alert("Email not found. Please restart registration.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/trainee/activity-level", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, activityLevel }) // Send email + activity level
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/medical-info"); // Move to the next step
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="activity-level-container">
             <div className="createaccbackground-overlay"></div>
            <div className="activity-level-box">
                <h2>What is your Activity Level?</h2>
                {message && <p className="error-message">{message}</p>}
                <div className="activity-slider">
                    {activityLevels.map((level, index) => (
                        <div
                            key={index}
                            className={`activity-option ${activityLevel === level ? "selected" : ""}`}
                            onClick={() => setActivityLevel(level)}
                        >
                            {level}
                        </div>
                    ))}
                </div>
                <button className="next-btn" onClick={handleSubmit}>Next →</button>
            </div>
        </div>
    );
};

export default ActivityLevel;
