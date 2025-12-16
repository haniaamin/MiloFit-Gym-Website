import React, { useEffect, useState } from "react";
import "../../styles/UserManagement.css";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNav from "../../components/AdminNav";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaEllipsisV } from "react-icons/fa"; // Three-dot icon

const API_URL = "http://localhost:5000/api/admin"; // Backend API

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [menuOpen, setMenuOpen] = useState(null); // Tracks menu state
  const navigate = useNavigate();

  // Fetch users (including automatically approved trainers)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Users:", response.data); // ✅ Debugging
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user list every 5 seconds to reflect status updates
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // Auto-refresh users every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle activation/deactivation
  const handleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/status`, { isActive: !currentStatus });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return; // Confirm before deleting
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is included
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  // View Profile (Navigate based on role)
  const handleViewProfile = (role) => {
    if (role === "trainee") {
      navigate("/settings-profile");
    } else if (role === "trainer") {
      navigate("/trainer-settings");
    } else if (role === "admin") {
      navigate("/admin-profile");
    } else {
      console.error("Invalid role:", role); // Debugging in case of errors
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users dynamically
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.firstName.localeCompare(b.firstName);
    if (sortBy === "role") return a.role.localeCompare(b.role);
    if (sortBy === "status") return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
    return 0;
  });

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="usermanage-container">
          {/* Top Bar with Search and Filter */}
          <div className="top-bar">
            <input
              type="text"
              placeholder="Search User"
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="filter-dropdown">
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">A-Z</option>
                <option value="role">Role</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="usermanageaction-menu">
                        <FaEllipsisV
                          className="menu-icon"
                          onClick={() => setMenuOpen(menuOpen === user._id ? null : user._id)}
                        />
                        {menuOpen === user._id && (
                          <div className="usermanagedropdown-menu">
                            <button onClick={() => handleViewProfile(user.role)} className="view">
                              View Profile
                            </button>
                           {user.isActive && (
  <button
    onClick={() => handleUserStatus(user._id, user.isActive)}
    className="active"
  >
    Deactivate User
  </button>
)}

                            <button
                              onClick={() => handleDeleteUser(user._id, user.role)}
                              className="delete"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
