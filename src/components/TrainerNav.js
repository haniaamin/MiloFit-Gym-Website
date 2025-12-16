import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TrainerNav.css";
import { FaBell } from "react-icons/fa";

const TrainerNav = () => {
  const [trainer, setTrainer] = useState(null);
  const [clientCount, setClientCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setTrainer(res.data);
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const trainerEmail = user?.email;

        if (!trainerEmail) return;

        // Fetch clients for this trainer
        const clientsRes = await axios.get(`http://localhost:5000/api/trainee/list?trainerEmail=${trainerEmail}`);
        setClientCount(clientsRes.data.length);

        // Fetch sessions and filter only for this trainer by trainerEmail
        const sessionsRes = await axios.get(`http://localhost:5000/api/sessions?trainerEmail=${trainerEmail}`);
        const now = new Date();

        // Filter upcoming sessions (date > now)
        const upcoming = sessionsRes.data.filter(session => {
          const sessionDate = new Date(session.year, session.month - 1, session.day,
            session.timezone === 'PM' && session.hour < 12 ? session.hour + 12 : session.hour);
          return sessionDate > now;
        });
        setUpcomingCount(upcoming.length);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/notifications?role=Trainer", {
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

  const trainerName = trainer ? `${trainer.firstName}` : "Trainer";

  return (
    <div className="trainernav">
      <div className="sessions">
        <span className="number-clients">Number of Clients: <b>{clientCount}</b></span>
        <span className="upcoming-sessions">Upcoming Sessions: <b>{upcomingCount}</b></span>
      </div>

      <div className="trainernav-right">
        <div className="profile-dropdown">
          <button className="profile-trainer-btn">
            {`Welcome, ${trainerName}`}
          </button>
        </div>

        <div className="trainernotification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell size={24} />
          {notifications.length > 0 && <span className="trainernotification-badge">{notifications.length}</span>}
        </div>

        {showNotifications && (
          <div className="trainernotifications-panel">
            <h4>Notifications</h4>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notif, index) => (
                <div key={index} className="trainernotification-item">
                  <h5>{notif.type}</h5>
                  <p>{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="trainerno-notifications">No new notifications</p>
            )}
            <button
              className="trainerdelete-all-btn"
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

export default TrainerNav;
