import React, { useEffect, useState } from 'react';
import '../../styles/TrainerDash.css';
import { useNavigate } from "react-router-dom";
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios'; // 🔑 Needed to fetch profile

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TrainerDash = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [trainer, setTrainer] = useState(null); // 👈 Add trainer state

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setTrainer(res.data); // 👈 Set trainer profile in state
      } catch (error) {
        console.error('❌ Error fetching trainer profile:', error);
      }
    };

    fetchTrainerProfile();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const trainerEmail = trainer?.email;
        if (!trainerEmail) return;

        const res = await fetch(`http://localhost:5000/api/trainee/list?trainerEmail=${trainerEmail}`);
        const data = await res.json();
        setClients(data);
        updatePieChart(data);
      } catch (err) {
        console.error("❌ Failed to fetch trainees:", err);
      }
    };

    if (trainer) fetchClients(); // 👈 Wait for trainer profile first
  }, [trainer]); // 👈 Run when trainer is set

  const updatePieChart = (clients) => {
    const counts = { Gold: 0, Silver: 0, Bronze: 0 };
    clients.forEach(client => {
      const pkg = client.package;
      if (counts[pkg] !== undefined) counts[pkg]++;
    });

    const filteredLabels = [];
    const filteredData = [];
    const filteredColors = [];
    const colors = {
      Gold: '#4e4a4a',
      Silver: '#462727',
      Bronze: '#570303'
    };

    Object.entries(counts).forEach(([key, value]) => {
      if (value > 0) {
        filteredLabels.push(`${key} ${((value / clients.length) * 100).toFixed(0)}%`);
        filteredData.push(value);
        filteredColors.push(colors[key]);
      }
    });

    if (filteredData.length === 0) return;

    setPieData({
      labels: filteredLabels,
      datasets: [{
        data: filteredData,
        backgroundColor: filteredColors,
        borderColor: 'white',
        borderWidth: 2
      }]
    });
  };

  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: 'white',
        font: { size: 12, weight: 'bolder' },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
  };

  const handleGoToClientManagement = () => navigate("/client-management");
  const handleGoToSchedule = () => navigate("/schedule");

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />
        <div className="trainerdash-container">
        

          <div className="trainerbox">
            <h3 className="trainerbox-title">Total Earnings :</h3>
            <p className="trainerbox-value">25,500 EGP</p>
            <p className="trainerbox-sub">Last Month</p>
          </div>

          <div className="trainerboxprofilerating">
            <h3 className="trainerbox-title">Profile Rating :</h3>
            <p className="trainerbox-value">4.3</p>
          </div>

          <div className="trainerpiechart-box">
            {pieData && (
              <Pie data={pieData} options={pieOptions} plugins={[ChartDataLabels]} />
            )}
          </div>

          <div className="trainerclientlist">
            <h3 className="trainerclient-list-title">Client List:</h3>
            <p>• View Your Clients List</p>
            <button className="trainerview-btn" onClick={handleGoToClientManagement}>View all list</button>
          </div>

          <div className="trainerupcomingsessions">
            <h3 className="trainersessions-title">Upcoming Sessions :</h3>
            <p>• View Your Upcoming Sessions</p>
            <button className="trainerview-btn" onClick={handleGoToSchedule}>View all sessions</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDash;
