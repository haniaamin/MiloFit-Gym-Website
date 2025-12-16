import React, { useState, useEffect } from 'react';
import '../../styles/UpcomingSessions.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import axios from 'axios';

const UpcomingSessions = () => {
  const userId = localStorage.getItem('userId')?.trim();

  const classOptions = ['Yoga', 'Zumba', 'Boxing'];
  const classTimeOptions = {
    Yoga: ['6 PM Monday', '7 AM Wednesday', '5 PM Friday'],
    Zumba: ['5 PM Tuesday', '6 AM Thursday', '6 PM Saturday'],
    Boxing: ['7 PM Monday', '6 PM Thursday', '5 PM Sunday'],
  };

  const [selectedClass, setSelectedClass] = useState('Yoga');
  const [classTime, setClassTime] = useState('');
  const [scheduledClasses, setScheduledClasses] = useState([]);

  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [personalSessions, setPersonalSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trainers');
        setTrainers(response.data);
        if (response.data.length > 0) {
          const fullName = `${response.data[0].firstName} ${response.data[0].lastName}`;
          setSelectedTrainer(fullName);
        }
      } catch (error) {
        console.error('Failed to fetch trainers', error);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (!selectedTrainer) return;
    const [firstName, lastName] = selectedTrainer.split(' ');

    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/sessions?trainerFirstName=${firstName}&trainerLastName=${lastName}`
        );
        setPersonalSessions(response.data);
        if (response.data.length > 0) {
          const first = response.data[0];
          setSelectedSessionId(first._id);
          const label = first.time || `${first.hour} ${first.timezone}`;
          setSelectedTime(label);
        }
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    };
    fetchSessions();
  }, [selectedTrainer]);

  useEffect(() => {
    const fetchScheduled = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/class-bookings`);
        setScheduledClasses(res.data);
      } catch (err) {
        console.error('Failed to load scheduled classes', err);
      }
    };
    fetchScheduled();
  }, []);

  const handleClassConfirm = async () => {
    if (!classTime) return alert('Please choose a time');

    const data = {
      className: selectedClass,
      time: classTime,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/class-bookings', data);
      setScheduledClasses([...scheduledClasses, res.data]);
      alert('Class scheduled!');
    } catch (err) {
      console.error('Schedule failed:', err.response?.data || err.message);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/class-bookings/${id}`);
      setScheduledClasses(scheduledClasses.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const handleReschedule = async (id, newTime) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/class-bookings/${id}`, { time: newTime });
      setScheduledClasses(scheduledClasses.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error('Reschedule failed', err);
    }
  };

  return (
    <div className="us-trainee-dash">
      <div className="us-background-overlay"></div>
      <TraineeSidebar />
      <div className="us-main-content">
        <TopNav />
        <div className="us-content-container">

          {/* Class Schedule */}
          <div className="us-section">
            <h3>Class Schedule</h3>
            <div className="us-schedule-inputs">
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select value={classTime} onChange={(e) => setClassTime(e.target.value)}>
                <option value="">Select Time</option>
                {classTimeOptions[selectedClass].map((time, idx) => (
                  <option key={idx} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <button className="us-button" onClick={handleClassConfirm}>Confirm</button>
          </div>

          {/* Personal Trainer Sessions */}
          <div className="us-section">
            <h3>Personal Trainer Sessions</h3>
            <div className="us-trainer-session-inputs">
              <select value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
                {trainers.map((trainer) => {
                  const fullName = `${trainer.firstName} ${trainer.lastName}`;
                  return <option key={trainer._id} value={fullName}>{fullName}</option>;
                })}
              </select>
              <select value={selectedSessionId} onChange={(e) => {
                const id = e.target.value;
                setSelectedSessionId(id);
                const session = personalSessions.find(s => s._id === id);
                setSelectedTime(session ? (session.time || `${session.hour} ${session.timezone}`) : '');
              }}>
                {personalSessions.length > 0 ? (
                  personalSessions.map((session) => {
                    const label = session.time || `${session.hour} ${session.timezone}`;
                    return (
                      <option key={session._id} value={session._id}>
                        {label} with {session.trainee || 'N/A'}
                      </option>
                    );
                  })
                ) : (
                  <option value="">No sessions available</option>
                )}
              </select>
            </div>
            <p>Selected Session: {selectedTrainer} - {selectedTime || 'No session selected'}</p>
            <button className="uspersonal-button">Confirm</button>
          </div>

          {/* Reminders */}
          <div className="us-section">
            <h3>Reminders</h3>
            {scheduledClasses.length === 0 ? (
              <p>You have no upcoming classes scheduled yet.</p>
            ) : (
              scheduledClasses.map((cls) => (
                <div key={cls._id}>
                  <p>Don't forget your {cls.className} class at {cls.time}!</p>
                  <p>Bring your water bottle and towel for your {cls.className} class.</p>
                  <hr />
                </div>
              ))
            )}
            {selectedTrainer && selectedTime && (
              <p>Your personal training session with {selectedTrainer} is at {selectedTime}.</p>
            )}
          </div>

          {/* Rescheduling */}
          <div className="us-section">
            <h3>Rescheduling and Cancellations</h3>
            {scheduledClasses.length === 0 ? (
              <p>No scheduled classes yet.</p>
            ) : (
              scheduledClasses.map((cls) => (
                <div key={cls._id} className="us-reschedule-item">
                  <p>{cls.className} - {cls.time}</p>
                  <div className="us-reschedule-controls">
                    <select onChange={(e) => handleReschedule(cls._id, e.target.value)}>
                      <option value="">Reschedule</option>
                      {classTimeOptions[cls.className].map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </select>
                   
                  </div>
                   <button className="us-cancel-button" onClick={() => handleCancel(cls._id)}>Cancel</button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;