import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TopNav.css";
import { FaBell } from "react-icons/fa";

const TopNav = () => {
  const [currentWeight, setCurrentWeight] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trainee, setTrainee] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProfileAndSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const fetchedUser = res.data;
      setUser(fetchedUser);
      setTrainee(fetchedUser);

      // Load current weight from localStorage (like in TraineeProgress)
      const key = `${fetchedUser.firstName}_${fetchedUser.lastName}`;
      const progressDataRaw = localStorage.getItem(`progressData_${key}`);
      if (progressDataRaw) {
        const progressData = JSON.parse(progressDataRaw);
        const monthlyWeights = progressData.monthlyWeights || {};

        // Get latest month key sorted descending
        const months = Object.keys(monthlyWeights).sort((a, b) => b.localeCompare(a));
        if (months.length > 0) {
          setCurrentWeight(monthlyWeights[months[0]]);
        }
      }

      // Fetch subscription from backend
      const subRes = await axios.get(`http://localhost:5000/api/admin/subscriptions/${fetchedUser._id}`);
      const subscription = subRes.data;

      if (subscription?.startDate) {
        const startDate = new Date(subscription.startDate);
        const today = new Date();
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 30 - diffDays);

        setIsSubscribed(remaining > 0);
        setDaysRemaining(remaining);
      } else {
        setIsSubscribed(false);
        setDaysRemaining(0);
      }

    } catch (error) {
      console.error("Error fetching trainee or subscription:", error);
      setIsSubscribed(false);
      setDaysRemaining(0);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileAndSubscription();
}, []);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/notifications?role=Trainee", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const traineeName = trainee ? `${trainee.firstName}` : "Trainee";

  return (
    <div className="topnav">
      
      <div className="workout-days">
       <span className="current-weight">
  Current Weight: <b>{currentWeight !== null ? currentWeight + " kg" : "N/A"}</b>
</span>

        <span className="days-remaining">Days Remaining: <b>{daysRemaining}</b></span>
      </div>

      <div className="topnav-right">
        <div className="profile-dropdown">
          <button className="topnavprofile-btn" onClick={() => {}}>
            {`Welcome, ${traineeName}`}
          </button>
        </div>

         <div className="traineenotification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell size={24} />
          {notifications.length > 0 && <span className="traineenotification-badge">{notifications.length}</span>}
        </div>

       {showNotifications && (
  <div className="traineenotifications-panel">
    <h4>Notifications</h4>
    {notifications.length > 0 ? (
      notifications.slice(0, 5).map((notif, index) => (
        <div key={index} className="traineenotification-item">
          <h5>{notif.type}</h5>
          <p>{notif.message}</p>
        </div>
      ))
    ) : (
      <p className="traineeno-notifications">No new notifications</p>
    )}
    <button
  className="traineedelete-all-btn"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/notifications/deletenotifications", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  }}
>
  Delete All
</button>

  </div>
)}

      </div>
    </div>
  );
};

export default TopNav;
