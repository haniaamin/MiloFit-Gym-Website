import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CompleteProfileTrainer.css"; // Import shared CSS

const CompleteProfileTrainer = () => {
    const [formData, setFormData] = useState({
        gender: "",
        month: "",
        date: "",
        year: "",
        weight: "",
        height: "",
        expertise: "",
        experience: "",
        certifications: "",
        profilePicture: null
    });

    const [message, setMessage] = useState(""); // State for messages
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem("email");
            if (!email) {
                alert("Email not found. Please restart registration.");
                return;
            }
    
            // Step 1: Send profile details
            const profileResponse = await fetch("http://localhost:5000/api/trainer/complete-profile-trainer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...formData })
            });
    
            if (!profileResponse.ok) {
                setMessage("Failed to save profile. Try again.");
                return;
            }
    
            // Step 2: Upload profile picture
            if (formData.profilePicture) {
                const formDataUpload = new FormData();
                formDataUpload.append("profilePicture", formData.profilePicture);
                formDataUpload.append("email", email);
    
                const uploadResponse = await fetch("http://localhost:5000/api/trainer/profile-picture", {
                    method: "POST",
                    body: formDataUpload
                });
    
                if (!uploadResponse.ok) {
                    setMessage("Profile picture upload failed. Try again.");
                    return;
                }
            }
    
            // Step 3: Final submission
            const finalResponse = await fetch("http://localhost:5000/api/trainer/final-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
    
            if (finalResponse.ok) {
                navigate("/final-submit"); // Navigate to final submit page
            } else {
                setMessage("Final submission failed.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };
    
    

    return (
        <div className="complete-profile-container">
            <div className="createaccbackground-overlay"></div>
            <div className="complete-profile-box">
                <h2>Let's complete your profile</h2>
                <p>It will help us know more about you</p>
                {message && <p className="error-message">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Gender Dropdown */}
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
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
                    <div className="input">
                        <input type="number" name="weight" placeholder="Your Weight (KG)" value={formData.weight} onChange={handleChange} required />
                        <input type="number" name="height" placeholder="Your Height (CM)" value={formData.height} onChange={handleChange} required />
                    </div>
                    {/* Trainer-Specific Fields */}
                    <div className="input">
                        <input type="text" name="expertise" placeholder="Area of Expertise" value={formData.expertise} onChange={handleChange}  />
                        <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange}  />
                    </div>
                    <div className="cert">
                        <input type="text" name="certifications" placeholder="Certifications" value={formData.certifications} onChange={handleChange}  />
                    </div>
                    {/* Profile Picture Upload */}
                    <div className="image">
                        <label>Upload Profile Picture:</label>
                        <input type="file" accept="image/*" onChange={handleFileChange}  />
                    </div>
                    {/* Submit Button */}
                    <button type="submit" className="next-btn">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfileTrainer;


