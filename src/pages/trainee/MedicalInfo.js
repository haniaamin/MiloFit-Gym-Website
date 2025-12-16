import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MedicalInfo.css"; // Make sure this file exists

const MedicalInfo = () => {
    const [medicalConditions, setMedicalConditions] = useState("");
    const [medications, setMedications] = useState("");
    const [heartCondition, setHeartCondition] = useState("");
    const [injuries, setInjuries] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const email = localStorage.getItem("email"); // Retrieve email stored during registration

            if (!email) {
                navigate("/sign-in"); // If email isn't found, go to sign-in page
                return;
            }

            const response = await fetch("http://localhost:5000/api/trainee/medical-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email, // Store the user's email to associate medical info with them
                    medicalConditions,
                    medications,
                    heartCondition,
                    injuries,
                    emergencyContact,
                }),
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (response.ok) {
                localStorage.removeItem("email"); // Clear email after registration is complete
                navigate("/sign-in"); // Redirect to the sign-in page
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="medical-info-container">
             <div className="createaccbackground-overlay"></div>
            <div className="medical-info-box">
                <h2>Medical Information for Personalized Fitness Plans</h2>
                <p>It helps us tailor your fitness plan to ensure your safety and success.</p>

                {message && <p className="error-message">{message}</p>}
                <div className="medical">
                <input type="text" placeholder="Do you have any pre-existing medical conditions?" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
                </div>
                <div className="medical">
                <input type="text" placeholder="Are you currently taking any medications?" value={medications} onChange={(e) => setMedications(e.target.value)} />
                </div>
                <div className="medical">
                <input type="text" placeholder="Have you been diagnosed with a heart condition?" value={heartCondition} onChange={(e) => setHeartCondition(e.target.value)} />
                </div>
                <div className="medical">
                <input type="text" placeholder="Have you had recent injuries or surgeries?" value={injuries} onChange={(e) => setInjuries(e.target.value)} />
                </div>
                <div className="medical">
                <input type="text" placeholder="Emergency contact (name & phone)" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                </div>
                <button className="save-button" onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
};

export default MedicalInfo;
