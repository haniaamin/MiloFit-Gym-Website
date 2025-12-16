import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import "../../styles/NotificationsManagement.css";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";

const NotificationsManagement = () => {
  const [notification, setNotification] = useState({
    recipients: "All Users",
    type: "Reminder",
    message: ""
  });

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Subscription Renewal",
      type: "Reminder",
      content: "Your subscription is due for renewal on..."
    },
    {
      id: 2,
      name: "Class Booking Confirmation",
      type: "Announcement",
      content: "Your class booking for [Class Name] on [Date]..."
    },
    {
      id: 3,
      name: "New Promotion Alert",
      type: "Promotion",
      content: "Check out our latest promo [Promo Name]..."
    }
  ]);

  const [menuOpen, setMenuOpen] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendNotification = async () => {
    if (!notification.message) {
      alert("Please enter a message");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }

      await axios.post("http://localhost:5000/api/notifications", notification, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert(`Notification sent to ${notification.recipients}: ${notification.message}`);
      setNotification(prev => ({ ...prev, message: "" }));
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  const handleUseTemplate = (template) => {
    setNotification({
      recipients: "All Users",
      type: template.type,
      message: template.content
    });
  };

  const handleEditTemplate = (template) => {
    // Implement your edit logic here
    alert(`Editing template: ${template.name}`);
    setMenuOpen(null);
  };

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="notificationsmanage-container">

          <div className="notificationsmanage-form">
            <h3>Send Notification:</h3>

            <div className="notificationsmanageform-row">
              <div className="notificationsmanageform-field">
                <label>Recipients:</label>
                <select
                  name="recipients"
                  value={notification.recipients}
                  onChange={handleInputChange}
                >
                  <option>All Users</option>
                  <option>Trainers</option>
                  <option>Trainees</option>
                </select>
              </div>

              <div className="notificationsmanageform-field">
                <label>Notification Type:</label>
                <select
                  name="type"
                  value={notification.type}
                  onChange={handleInputChange}
                >
                  <option>Reminder</option>
                  <option>Promotion</option>
                  <option>Announcement</option>
                </select>

              <div className="notificationsmanageform-field">
                {/* Empty div to maintain 3-column layout */}
              </div>
            </div>

            <div className="notificationsmanagemessage-content">
              <label>Message Content:</label>
              <textarea
                name="message"
                value={notification.message}
                onChange={handleInputChange}
                placeholder="Enter your notification message..."
              />
            </div>
            </div>
            <button className="notificationsmanagesend-button" onClick={handleSendNotification}>
              Send
            </button>
          </div>

          <div className="notificationsmanagetemplates-section">
            <table className="notificationsmanagetemplates-table">
              <thead>
                <tr>
                  <th>TEMPLATE NAME</th>
                  <th>NOTIFICATION TYPE</th>
                  <th>MESSAGE CONTENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {templates.map(template => (
                  <tr key={template.id}>
                    <td>{template.name}</td>
                    <td>{template.type}</td>
                    <td>{template.content}</td>
                    <td>
                      <div className="notificationsmanageaction-menu">
                        <FaEllipsisV
                          className="notificationsmanagemenu-icon"
                          onClick={() => setMenuOpen(menuOpen === template.id ? null : template.id)}
                        />
                        {menuOpen === template.id && (
                          <div className="notificationsmanagedropdown-menu">
                            <button
                              onClick={() => handleUseTemplate(template)}
                              className="use"
                            >
                              Use
                            </button>
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="edit"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManagement;
