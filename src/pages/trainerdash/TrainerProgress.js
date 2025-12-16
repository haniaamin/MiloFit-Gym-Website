import React, { useState, useEffect } from 'react';
import '../../styles/TrainerProgress.css';
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const TrainerProgress = () => {
  const [newGoal, setNewGoal] = useState('');
  const [latestGoal, setLatestGoal] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({ clients: 0, sessions: 0 });
  const [monthlyChartData, setMonthlyChartData] = useState([]);

  const fetchGoal = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/trainer/goals`);
      const data = await res.json();
      if (data.length > 0) setLatestGoal(data[0]);
    } catch (err) {
      console.error('❌ Failed to fetch goal:', err);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const handleSaveGoal = async () => {
    if (newGoal.trim() === '' || isNaN(newGoal)) {
      return alert('❌ Please enter a valid numeric goal!');
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch('http://localhost:5000/api/trainer/save-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: parseInt(newGoal), email: user?.email })
      });

      const data = await res.json();
      if (res.ok) {
        setLatestGoal(data.goal || { goal: newGoal });
        setNewGoal('');
        alert('✅ Session goal saved successfully!');
      } else {
        alert('❌ Failed to save goal: ' + data.message);
      }
    } catch (err) {
      console.error('❌ Error saving goal:', err);
      alert('An error occurred while saving the goal.');
    }
  };

  const buildMonthlyChart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const trainerEmail = user?.email;
    if (!trainerEmail) return;

    try {
      const [clientsRes, sessionsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/trainee/list?trainerEmail=${trainerEmail}`),
        axios.get(`http://localhost:5000/api/sessions?trainerEmail=${trainerEmail}`)
      ]);

      const clients = clientsRes.data;
      const sessions = sessionsRes.data;
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const monthlyClients = clients.filter(c => {
        const d = new Date(c.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      const monthlySessions = sessions.filter(s =>
        s.month - 1 === currentMonth && s.year === currentYear
      ).length;

      setMonthlyTotals({ clients: monthlyClients, sessions: monthlySessions });

      // ✅ Check if session goal is reached
      if (latestGoal && latestGoal.goal && monthlySessions >= parseInt(latestGoal.goal)) {
        alert(`🎉 You've reached your session goal of ${latestGoal.goal}! Set a new one.`);
        setLatestGoal(null);

        // Optionally clear goal from backend here if you want
      }

      const monthMap = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        Sessions: 0
      }));

      sessions.forEach(session => {
        if (session.year === currentYear) {
          const sessionMonth = session.month - 1;
          if (sessionMonth >= 0 && sessionMonth < 12) {
            monthMap[sessionMonth].Sessions += 1;
          }
        }
      });

      setMonthlyChartData(monthMap);
    } catch (err) {
      console.error("❌ Error loading monthly data:", err);
    }
  };

  useEffect(() => {
    buildMonthlyChart();
  }, [latestGoal]); // re-check goal whenever it's updated

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />

        <div className="trainerprogress-container">
          <div className="trainergoal-progress">
            <div className="trainerchart-header">
              <h3>Monthly Session Progress</h3>
            </div>

            <div className="trainerchart-box">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyChartData}>
                  <XAxis dataKey="month" stroke="#000" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Sessions" fill="#888888" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="trainergoals-milestones">
            <div className="trainermilestones-section">
              <h4>Current Goal:</h4>
              <ul>
                {latestGoal && latestGoal.goal ? (
                  <li>{`Session Goal: ${latestGoal.goal}`}</li>
                ) : (
                  <li>No goal set yet.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="trainerset-goal">
            <input
              type="number"
              placeholder="Set session goal (e.g., 2)"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button onClick={handleSaveGoal}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProgress;
