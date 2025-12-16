import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Schedule.css';
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';
import axios from 'axios';

const Schedule = () => {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [newSession, setNewSession] = useState({
    trainee: '',
    hour: '',
    timezone: 'AM',
    day: '',
    month: '',
    year: new Date().getFullYear(),
  });
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [editSession, setEditSession] = useState({ hour: '', timezone: 'AM' });

  
  // Fetch trainees from backend API
  const fetchTrainees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trainees');
      setTrainees(res.data);
    } catch (error) {
      console.error('Failed to fetch trainees');
    }
  };

  // Fetch sessions from backend API
  const fetchSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions');
      setSessions(res.data);
      // Count upcoming sessions only (date in future or today)
      const today = new Date();
      const upcoming = res.data.filter((session) => {
        const sessionDate = new Date(
          session.year,
          session.month - 1,
          session.day,
          session.timezone === 'PM' && session.hour < 12 ? session.hour + 12 : session.hour
        );
        return sessionDate >= today;
      });
      setUpcomingCount(upcoming.length);
    } catch (error) {
      console.error('Failed to load sessions');
    }
  };

  useEffect(() => {
    fetchTrainees();
    fetchSessions();
  }, []);

  const handleSessionSave = async () => {
    if (!newSession.trainee || !newSession.hour || !newSession.day || !newSession.month || !newSession.year) {
      alert('Please fill all fields to add a session');
      return;
    }
    try {
      // Ensure numeric values for hour, day, month, year
      const payload = {
        ...newSession,
        hour: Number(newSession.hour),
        day: Number(newSession.day),
        month: Number(newSession.month),
        year: Number(newSession.year),
      };
      const res = await axios.post('http://localhost:5000/api/sessions', payload);
      alert(res.data.message || 'Session added successfully');
      setNewSession({
        trainee: '',
        hour: '',
        timezone: 'AM',
        day: '',
        month: '',
        year: new Date().getFullYear(),
      });
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving session');
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSessionId) {
      alert('Please select a session to cancel');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/sessions/${selectedSessionId}`);
      alert('Session cancelled successfully!');
      setSelectedSessionId('');
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel session.');
    }
  };

  const handleEditSession = async () => {
    if (!selectedSessionId) {
      alert('Please select a session to edit');
      return;
    }
    if (!editSession.hour) {
      alert('Please enter the new hour');
      return;
    }
    try {
      const payload = {
        hour: Number(editSession.hour),
        timezone: editSession.timezone,
      };
      await axios.put(`http://localhost:5000/api/sessions/${selectedSessionId}`, payload);
      alert('Session updated successfully!');
      setSelectedSessionId('');
      setEditSession({ hour: '', timezone: 'AM' });
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update session.');
    }
  };

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />

        <div className="trainerschedule-container">
          {/* Add New Session */}
          <div className="scheduleadd-session-box">
            <h3>Add New Session</h3>
            <div className="scheduletime-select">
              <select
                value={newSession.trainee}
                onChange={(e) => setNewSession({ ...newSession, trainee: e.target.value })}
              >
                <option value="">Select Trainee</option>
                {trainees.map((t) => (
                  <option key={t._id} value={`${t.firstName} ${t.lastName}`}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Hour"
                min="1"
                max="12"
                value={newSession.hour}
                onChange={(e) => setNewSession({ ...newSession, hour: e.target.value })}
              />
              <select
                value={newSession.timezone}
                onChange={(e) => setNewSession({ ...newSession, timezone: e.target.value })}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="scheduledate-selects">
              <select
                value={newSession.month}
                onChange={(e) => setNewSession({ ...newSession, month: e.target.value })}
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => {
                  const monthNumber = i + 1;
                  const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                  return (
                    <option key={monthNumber} value={monthNumber}>
                      {monthName}
                    </option>
                  );
                })}
              </select>

              <select
                value={newSession.day}
                onChange={(e) => setNewSession({ ...newSession, day: e.target.value })}
              >
                <option value="">Date</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={newSession.year}
                onChange={(e) => setNewSession({ ...newSession, year: Number(e.target.value) })}
              >
                <option value="">Year</option>
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className="save-btn" onClick={handleSessionSave}>
              Save Session
            </button>
          </div>

          {/* Real Calendar */}
          <div className="schedulecalendar-box">
            <Calendar value={date} onChange={setDate} />
          </div>

          {/* Upcoming Sessions */}
          <div className="scheduleupcoming-box">
            <h4>Upcoming Sessions: {upcomingCount}</h4>
            <ul>
              {sessions.length === 0 && <p>No sessions scheduled.</p>}
              {sessions
                .filter((session) => {
                  const sessionDate = new Date(
                    session.year,
                    session.month - 1,
                    session.day,
                    session.timezone === 'PM' && session.hour < 12 ? session.hour + 12 : session.hour
                  );
                  return sessionDate >= new Date();
                })
                .map((session) => (
                  <p key={session._id}>
                    {session.trainee} - {session.hour} {session.timezone} on {session.day}/{session.month}/{session.year}
                  </p>
                ))}
            </ul>
          </div>

          {/* Edit / Cancel Session */}
          <div className="scheduleedit-box">
            <h4>Edit / Cancel Session</h4>
            <div className="scheduleedit-inputselect">
              <div className="scheduleedit-selectsession">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                >
                  <option value="">Select session</option>
                  {sessions.map((session, index) => (
                    <option key={session._id} value={session._id}>
                      Session {index + 1} - {session.trainee} at {session.hour} {session.timezone} on {session.day}/{session.month}/{session.year}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                placeholder="New Hour"
                min="1"
                max="12"
                value={editSession.hour}
                onChange={(e) => setEditSession({ ...editSession, hour: e.target.value })}
              />
              <select
                value={editSession.timezone}
                onChange={(e) => setEditSession({ ...editSession, timezone: e.target.value })}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="schedulebtns">
              <button className="reschedule-btn" onClick={handleEditSession}>
                Reschedule
              </button>
              <button className="cancel-btn" onClick={handleCancelSession}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
