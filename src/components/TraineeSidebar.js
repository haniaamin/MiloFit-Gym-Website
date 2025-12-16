import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "../styles/TraineeSidebar.css";
import {
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaUser,
  FaDumbbell,
  FaComments,
  FaCog,
  FaStar,
} from "react-icons/fa";

const TraineeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current page location

  // Function to check if the button is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <button
className={`sidebar-button ${
  location.pathname === "/trainee-dashboard" ||
  location.pathname.includes("/ai-plan") || location.pathname.includes("/plan-display")
    ? "active"
    : ""
}`}        onClick={() => navigate("/trainee-dashboard")}
      >
        <FaHome /> Dashboard
      </button>
      <button
        className={`sidebar-button ${isActive("/progress-tracking") ? "active" : ""}`}
        onClick={() => navigate("/progress-tracking")}
      >
        <FaChartLine /> Progress Tracking
      </button>
      <button
        className={`sidebar-button ${isActive("/upcoming-sessions") ? "active" : ""}`}
        onClick={() => navigate("/upcoming-sessions")}
      >
        <FaCalendarAlt /> Upcoming Sessions
      </button>
      <button
        className={`sidebar-button ${isActive("/trainer") ? "active" : ""}`}
        onClick={() => navigate("/trainer-profiles")}
      >
        <FaUser /> Trainer Profiles
      </button>
       <button
        className={`sidebar-button ${
          location.pathname.startsWith("/membership-packages") ||
          location.pathname.startsWith("/payment")
            ? "active"
            : ""
        }`}
        onClick={() => navigate("/membership-packages")}
      >
     
        <FaDumbbell /> Membership & Packages
      </button>
      <button
        className={`sidebar-button ${isActive("/chat") ? "active" : ""}`}
        onClick={() => navigate("/chat")}
      >
        <FaComments /> Chat
      </button>
      <button
        className={`sidebar-button ${isActive("/settings-profile") ? "active" : ""}`}
        onClick={() => navigate("/settings-profile")}
      >
        <FaCog /> Settings & Profile
      </button>
      <button
        className={`sidebar-button ${
          location.pathname.startsWith("/feedback-reviews") ||
          location.pathname.startsWith("/write-review")
            ? "active"
            : ""
        }`}
        onClick={() => navigate("/feedback-reviews")}
      >
        <FaStar /> Feedback & Reviews
      </button>
    </div>
  );
};

export default TraineeSidebar;