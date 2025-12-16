import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "../styles/TrainerSidebar.css";
import {
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaUser,
  FaDumbbell,
  FaComments,
  FaCog,
} from "react-icons/fa";

const TrainerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current page location

  // Function to check if the button is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="trainer-sidebar">
      <button
        className={isActive("/trainer-dashboard") ? "active" : ""}
        onClick={() => navigate("/trainer-dashboard")}
      >
        <FaHome /> Dashboard
      </button>
      <button
        className={isActive("/trainer-progress") ? "active" : ""}
        onClick={() => navigate("/trainer-progress")}
      >
        <FaChartLine /> Progress Tracking
      </button>
      <button
        className={isActive("/client-management") ? "active" : ""}
        onClick={() => navigate("/client-management")}
      >
        <FaUser /> Client Management
      </button>
      <button
        className={isActive("/schedule") ? "active" : ""}
        onClick={() => navigate("/schedule")}
      >
        <FaCalendarAlt /> Schedule
      </button>
      <button
        className={isActive("/packages") ? "active" : ""}
        onClick={() => navigate("/packages")}
      >
        <FaDumbbell /> Packages & Pricing
      </button>
      <button
        className={isActive("/trainer-chat") ? "active" : ""}
        onClick={() => navigate("/trainer-chat")}
      >
        <FaComments /> Chat
      </button>
      <button
        className={isActive("/trainer-settings") ? "active" : ""}
        onClick={() => navigate("/trainer-settings")}
      >
        <FaCog /> Settings & Profile
      </button>
      
      
    </div>
  );
};

export default TrainerSidebar;