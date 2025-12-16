import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TrainerApproval.css";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";

import defaultMale from "../../assets/approvecoach.png";
import defaultFemale from "../../assets/woman.png";

const TrainerApproval = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      const pendingTrainers = res.data.filter(
        (user) => user.role === "trainer" && user.status === "pending"
      );
      setTrainers(pendingTrainers);
    } catch (error) {
      console.error("Failed to fetch trainers:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleApproveReject = async (trainerId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${trainerId}/approve`, { status: action });
      setTrainers((prev) => prev.filter((trainer) => trainer._id !== trainerId));
    } catch (error) {
      console.error(`Failed to ${action} trainer:`, error.response?.data || error.message);
    }
  };

  if (loading) return <div>Loading trainers...</div>;

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="trainerapprove-container">
          <div className="user-profiles">
            {trainers.length === 0 ? (
<div className="no-trainers-message">
  <h2>No Trainers Pending Approval</h2>
  <p>All trainer applications have been reviewed.</p>
</div>
            ) : (
              trainers.map((trainer) => {
                const fullName = `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim();
                const gender = (trainer.gender || "").toLowerCase();
                const profilePic = gender === "female" ? defaultFemale : defaultMale;

                return (
                  <div className="profile-card" key={trainer._id}>
                    <div className="profile-header">
                      <img src={profilePic} alt={fullName || "Trainer"} className="profile-image" />
                      <div>
                        <h3>{fullName || trainer.name || "No Name"}</h3>
                        <p>{trainer.email || "No Email"}</p>
                      </div>
                    </div>
                    <div className="approval-buttons">
                      <button
                        className="approve-button"
                        onClick={() => handleApproveReject(trainer._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleApproveReject(trainer._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerApproval;
