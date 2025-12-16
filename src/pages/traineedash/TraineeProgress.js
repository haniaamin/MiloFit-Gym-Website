import React, { useState, useEffect } from 'react';
import '../../styles/TraineeProgress.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const getCurrentMonth = () => {
  const now = new Date();
  return now.toISOString().slice(0, 7); // YYYY-MM
};

const TraineeProgress = () => {
  const [upcomingGoals, setUpcomingGoals] = useState([]);
  const [achievedMilestones, setAchievedMilestones] = useState([]);
  const [monthlyWeights, setMonthlyWeights] = useState({});
  const [newGoalInput, setNewGoalInput] = useState('');
  const [monthlyWeightInput, setMonthlyWeightInput] = useState('');
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    const fetchUserAndCheckSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const { firstName, lastName } = res.data;
        const key = `${firstName}_${lastName}`;
        setUserKey(key);

      

        // Load saved progress for this user
        const savedProgress = localStorage.getItem(`progressData_${key}`);
        if (savedProgress) {
          const { upcomingGoals = [], achievedMilestones = [], monthlyWeights = {} } = JSON.parse(savedProgress);
          setUpcomingGoals(upcomingGoals);
          setAchievedMilestones(achievedMilestones);
          setMonthlyWeights(monthlyWeights);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserAndCheckSubscription();
  }, []);

  const saveProgressLocal = (newState) => {
    if (!userKey) return;
    localStorage.setItem(`progressData_${userKey}`, JSON.stringify(newState));
  };

  const handleAddNewGoal = () => {
    const goalWeight = parseFloat(newGoalInput);
    if (isNaN(goalWeight) || goalWeight <= 0) return;

    if (upcomingGoals.includes(goalWeight) || achievedMilestones.includes(goalWeight)) {
      setNewGoalInput('');
      return;
    }

    const updatedGoals = [...upcomingGoals, goalWeight].sort((a, b) => a - b);
    setUpcomingGoals(updatedGoals);
    setNewGoalInput('');

    saveProgressLocal({
      upcomingGoals: updatedGoals,
      achievedMilestones,
      monthlyWeights,
    });
  };

  const handleSaveMonthlyWeight = () => {
    const weight = parseFloat(monthlyWeightInput);
    if (isNaN(weight) || weight <= 0) return;

    const month = getCurrentMonth();
    const updatedWeights = { ...monthlyWeights, [month]: weight };

    const achievedNow = upcomingGoals.filter((goal) => weight <= goal);
    const updatedAchieved = Array.from(new Set([...achievedMilestones, ...achievedNow])).sort((a, b) => a - b);
    const updatedGoals = upcomingGoals.filter((goal) => !achievedNow.includes(goal));

    setMonthlyWeights(updatedWeights);
    setAchievedMilestones(updatedAchieved);
    setUpcomingGoals(updatedGoals);
    setMonthlyWeightInput('');

    saveProgressLocal({
      upcomingGoals: updatedGoals,
      achievedMilestones: updatedAchieved,
      monthlyWeights: updatedWeights,
    });
  };

  const handleClearData = () => {
    setUpcomingGoals([]);
    setAchievedMilestones([]);
    setMonthlyWeights({});
    setNewGoalInput('');
    setMonthlyWeightInput('');
    if (userKey) localStorage.removeItem(`progressData_${userKey}`);
  };

  const chartData = Object.entries(monthlyWeights)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, weight]) => {
      const date = new Date(month + '-01');
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      return { month: label, weight };
    });

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="progress-container">
          <div className="goal-progress">
            <h3>Monthly Weight Progress</h3>
            <div className="chart-box" style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#000" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#888888" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="goals-milestones" style={{ marginTop: 40 }}>
            <div className="goals-section">
              <h4>Upcoming Goals:</h4>
              <ul>
                {upcomingGoals.length > 0 ? (
                  upcomingGoals.map((goal, i) => <li key={i}>{goal} kg</li>)
                ) : (
                  <li>No upcoming goals set.</li>
                )}
              </ul>
            </div>
            <div className="milestones-section">
              <h4>Achieved Milestones:</h4>
              <ul>
                {achievedMilestones.length > 0 ? (
                  achievedMilestones.map((m, i) => <li key={i}>{m} kg</li>)
                ) : (
                  <li>No milestones achieved yet.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="set-goal" style={{ marginTop: 30 }}>
            <h4>Set New Goal (target weight):</h4>
            <input
              type="number"
              placeholder="Enter target weight"
              value={newGoalInput}
              onChange={(e) => setNewGoalInput(e.target.value)}
              min="0"
              step="1"
            />
            <button onClick={handleAddNewGoal}>Save Goal</button>
          </div>

          <div className="record-goal" style={{ marginTop: 20 }}>
            <h4>Record Weight for {getCurrentMonth()}:</h4>
            <input
              type="number"
              placeholder="Enter your current weight"
              value={monthlyWeightInput}
              onChange={(e) => setMonthlyWeightInput(e.target.value)}
              min="0"
              step="1"
            />
            <button onClick={handleSaveMonthlyWeight}>Save Weight</button>
          </div>

          <div className="delete-goal">
            <button onClick={handleClearData}>Clear All Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineeProgress;
