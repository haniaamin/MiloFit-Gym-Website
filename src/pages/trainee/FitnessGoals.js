/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FitnessGoals.css";

const FitnessGoals = () => {
    const [selectedGoal, setSelectedGoal] = useState("");
    const navigate = useNavigate();

    const handleGoalSelection = (goal) => {
        setSelectedGoal(goal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGoal) {
            alert("Please select a fitness goal.");
            return;
        }

        try {
            const email = localStorage.getItem("email");
            if (!email) {
                alert("Email not found. Please restart registration.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/trainee/fitness-goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, fitnessGoal: selectedGoal })
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/activity-level");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="fitness-goals-container">
            <div className="background-overlay"></div>
            <div className="fitness-goals-box">
                <div className="header-section">
                    <h2>What is your Fitness Goal?</h2>
                </div>

                <div className="goal-options">
                    <div 
                        className={`goal-item ${selectedGoal === "Lose Weight" ? "selected" : ""}`} 
                        onClick={() => handleGoalSelection("Lose Weight")}
                    >
                        <span className="goal-icon">🏃‍♂️</span>
                        <div className="goal-text">
                            <h3>Lose Weight</h3>
                            <p>Lose weight and improve my fitness</p>
                        </div>
                    </div>

                    <div 
                        className={`goal-item ${selectedGoal === "Build Muscle" ? "selected" : ""}`} 
                        onClick={() => handleGoalSelection("Build Muscle")}
                    >
                        <span className="goal-icon">💪</span>
                        <div className="goal-text">
                            <h3>Build Muscle</h3>
                            <p>Increase muscle mass</p>
                        </div>
                    </div>

                    <div 
                        className={`goal-item ${selectedGoal === "Healthy Lifestyle" ? "selected" : ""}`} 
                        onClick={() => handleGoalSelection("Healthy Lifestyle")}
                    >
                        <span className="goal-icon">🍏</span>
                        <div className="goal-text">
                            <h3>Healthy Lifestyle</h3>
                            <p>Maintain a balanced and healthy lifestyle</p>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="next-btn" 
                    onClick={handleSubmit}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default FitnessGoals;