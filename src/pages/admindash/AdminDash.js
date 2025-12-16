import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDash.css";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";

const AdminDash = () => {
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

  return (
    <div className="admin-dash">
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <AdminNav />

        {/* Container for Content */}
        <div className="admindash-container">
          <div className="stats-container">
            <div className="stat">
              <p>Monthly Revenue</p>
              <h3>${stats.monthlyRevenue}</h3>
            </div>
            <div className="stat">
              <p>Active Subscriptions</p>
              <h3>{stats.activeSubscriptions}</h3>
            </div>
            <div className="stat">
              <p>Renewal Due</p>
              <h3>{stats.renewalDue}</h3>
            </div>
            <div className="stat">
              <p>New Signups</p>
              <h3>{stats.newSignups}</h3>
            </div>
            <div className="stat">
              <p>Classes Booked</p>
              <h3>{stats.classesBooked}</h3>
            </div>
            <div className="stat">
              <p>Number of Users</p>
              <h3>{userCount}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;

