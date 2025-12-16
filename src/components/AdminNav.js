import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminNav.css";

const AdminNav = () => {
  const [admin, setAdmin] = useState(null);
  const [userCount, setUserCount] = useState(0); // New state for user count
    const [stats, setStats] = useState({
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        renewalDue: 0,
        newSignups: 0,
        classesBooked: 0,
        trainerUtilization: 0
      });

 useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dashboard-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/user-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchProfile();
    fetchUserCount();
  }, []);

  const adminName = admin ? `${admin?.firstName}` : "Admin";

  return (
    <div className="adminnav">
      <div className="sub">
        <span className="active-subscribe">Active Subscriptions: <b>{stats.activeSubscriptions}</b></span>
        <span className="number-of-users">Number of Users: <b>{userCount}</b></span>
      </div>

      <div className="adminnav-right">
        <div className="profile-dropdown">
          <button className="profile-btn">
            {`Welcome, ${adminName}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
