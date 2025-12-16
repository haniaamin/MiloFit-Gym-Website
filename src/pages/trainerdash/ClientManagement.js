import React, { useState, useEffect } from 'react';
import '../../styles/ClientManagement.css';
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';
import { FaEllipsisV } from 'react-icons/fa';

const ClientManagement = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [clients, setClients] = useState([]); // ✅ Removed hardcoded clients
  const [newTrainee, setNewTrainee] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedClient, setEditedClient] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerEmail = user?.email || "trainer@gmail.com";

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/trainee/list?trainerEmail=${trainerEmail}`);
        const data = await res.json();
        setClients(data); // ✅ Load only from backend
      } catch (err) {
        console.error("❌ Failed to fetch trainees:", err);
      }
    };
    fetchClients();
  }, []);

  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const handleAddNew = () => {
    setNewTrainee({
      name: '',
      email: '',
      phone: '',
      package: '',
      startDate: '',
      endDate: '',
      status: 'Active',
    });
    setActionMenuIndex(null);
  };

  const handleSaveNew = async () => {
    if (!isValidPhone(newTrainee.phone)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    const traineeToSave = { ...newTrainee, trainerEmail }; // ✅ Include trainer email
    try {
      const res = await fetch("http://localhost:5000/api/trainee/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(traineeToSave)
      });
      if (res.ok) {
        const saved = await res.json();
        setClients(prev => [...prev, saved]);
        setNewTrainee(null);
        alert("Trainee added successfully.");
      } else {
        alert("Failed to add trainee.");
      }
    } catch (err) {
      alert("An error occurred while saving trainee.");
    }
  };

  const handleCancelNew = () => {
    setNewTrainee(null);
  };

  const handleDelete = async (index) => {
    const trainee = clients[index];
    if (trainee._id) {
      try {
        await fetch(`http://localhost:5000/api/trainee/remove/${trainee._id}`, {
          method: "DELETE"
        });
        setClients(prev => prev.filter((_, i) => i !== index));
      } catch (err) {
        console.error("❌ Failed to delete trainee from backend:", err);
      }
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedClient({ ...clients[index] });
    setActionMenuIndex(null);
  };

  const handleSaveEdit = async () => {
    const trainee = editedClient;

    if (!isValidPhone(trainee.phone)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/trainee/update/${trainee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainee)
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedClients = [...clients];
        updatedClients[editIndex] = updated;
        setClients(updatedClients);
        setEditIndex(null);
        alert("Trainee updated successfully.");
      } else {
        alert("Failed to update trainee.");
      }
    } catch (err) {
      alert("Error while updating trainee.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedClient({});
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || client.status === filter)
  );

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />
        <div className="trainerclientmanagement-container">
          <div className="client-management-header">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="clientsearch-bar"
            />
            <select
              className="clientfilter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="clienttable-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Package</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={index}>
                    {editIndex === index ? (
                      <>
                        <td><input value={editedClient.name} onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })} /></td>
                        <td><input value={editedClient.email} onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })} /></td>
                        <td><input value={editedClient.phone} onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })} /></td>
                         <td>
                          <select value={editedClient.package} onChange={(e) => setEditedClient({ ...editedClient, package: e.target.value })}>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Bronze">Bronze</option>
                          </select>
                        </td>
                        <td><input type="date" value={editedClient.startDate} onChange={(e) => setEditedClient({ ...editedClient, startDate: e.target.value })} /></td>
                        <td><input type="date" value={editedClient.endDate} onChange={(e) => setEditedClient({ ...editedClient, endDate: e.target.value })} /></td>
                        <td>
                          <select value={editedClient.status} onChange={(e) => setEditedClient({ ...editedClient, status: e.target.value })}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={handleSaveEdit}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.package}</td>
                        <td>{client.startDate}</td>
                        <td>{client.endDate}</td>
                        <td><span className={`clientstatus ${client.status.toLowerCase()}`}>{client.status}</span></td>
                        <td className="clientaction-cell">
                          <div className="clientdots-wrapper">
                            <FaEllipsisV
                              className="clientdots-icon"
                              onClick={() => setActionMenuIndex(index === actionMenuIndex ? null : index)}
                            />
                            {actionMenuIndex === index && (
                              <div className="clientdropdown-menu">
                                <div className="clientdropdown-item" onClick={() => handleEdit(index)}>Edit</div>
                                <div className="clientdropdown-item" onClick={() => handleDelete(index)}>Delete</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {newTrainee && (
                  <tr>
                    <td><input value={newTrainee.name} onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })} /></td>
                    <td><input value={newTrainee.email} onChange={(e) => setNewTrainee({ ...newTrainee, email: e.target.value })} /></td>
                    <td><input value={newTrainee.phone} onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,11}$/.test(val)) {
                        setNewTrainee({ ...newTrainee, phone: val });
                      }
                    }} /></td>
                       <td>
                          <select value={newTrainee.package} onChange={(e) => setNewTrainee({ ...newTrainee, package: e.target.value })}>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Bronze">Bronze</option>
                          </select>
                        </td>
                    <td><input type="date" value={newTrainee.startDate} onChange={(e) => setNewTrainee({ ...newTrainee, startDate: e.target.value })} /></td>
                    <td><input type="date" value={newTrainee.endDate} onChange={(e) => setNewTrainee({ ...newTrainee, endDate: e.target.value })} /></td>
                    <td>
                      <select value={newTrainee.status} onChange={(e) => setNewTrainee({ ...newTrainee, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={handleSaveNew}>Save</button>
                      <button onClick={handleCancelNew}>Cancel</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!newTrainee && (
            <div className="add-client-btn-wrapper">
              <button className="add-client-btn" onClick={handleAddNew}>+ Add New Trainee</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
