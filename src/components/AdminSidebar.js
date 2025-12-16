import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "../styles/AdminSidebar.css";
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

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current page location

  // Function to check if the button is active
  const isActive = (path) => {
    // For trainer-approval, check if path starts with '/trainer-approval'
    if (path === "/trainer-approval") {
      return location.pathname.startsWith("/trainer-approval");
    }
    return location.pathname === path;
  };

  return (
    <div className="adminsidebar">
      <button
        className={isActive("/admin-dashboard") ? "active" : ""}
        onClick={() => navigate("/admin-dashboard")}
        
      >
        <FaHome /> Dashboard
      </button>
      
      <button
        className={isActive("/user-manage") ? "active" : ""}
        onClick={() => navigate("/user-manage")}
      >
        <FaUser /> User Management
      </button>
      <button
        className={isActive("/trainer-approval") ? "active" : ""}
        onClick={() => navigate("/trainer-approval")}
      >
        <FaDumbbell /> Trainer Approval
      </button>
      <button
        className={isActive("/content-manage") ? "active" : ""}
        onClick={() => navigate("/content-manage")}
      >
        <FaCalendarAlt /> Content Management
      </button>
      <button
        className={isActive("/notification-manage") ? "active" : ""}
        onClick={() => navigate("/notification-manage")}
      >
        <FaComments /> Notifications Management
      </button>
      <button
        className={isActive("/analytics") ? "active" : ""}
        onClick={() => navigate("/analytics")}
      >
        <FaChartLine /> Reporting & Analytics
      </button>
      <button
        className={isActive("/billing-manage") ? "active" : ""}
        onClick={() => navigate("/billing-manage")}
      >
        <FaStar /> Billing Management
      </button>
      
      <button
        className={isActive("/admin-profile") ? "active" : ""}
        onClick={() => navigate("/admin-profile")}
      >
        <FaCog /> Settings & Profile
      </button>

    </div>
  );
};

export default AdminSidebar;
