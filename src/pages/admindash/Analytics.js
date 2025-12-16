import React, { useState, useEffect } from 'react';
import '../../styles/Analytics.css';
import axios from "axios";
import AdminSidebar from '../../components/AdminSidebar';
import AdminNav from '../../components/AdminNav';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { FaEllipsisV } from 'react-icons/fa';





const COLORS = ['#82ca9d', 'rgb(5, 156, 156)'];

const Analytics = () => {
  
  const [lineData, setLineData] = useState([
  { time: new Date().toLocaleTimeString(), revenue: 9000 }
]);

  const [admin, setAdmin] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const barData = [
  { name: 'Total Users', users: userCount }
];
  const [stats, setStats] = useState({
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    renewalDue: 0,
    newSignups: 0,
    classesBooked: 0,
    trainerUtilization: 0
  });
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('User Activity');
  const [selectedFilter, setSelectedFilter] = useState('User Role');
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'User Activity Sep-24',
      type: 'User Activity',
      dateRange: '2024-09-01 to 2024-09-30 (User Role)',
      data: { activeUsers: 150, newSignups: 25 }
    },
    {
      id: 2,
      name: 'Revenue Report Q3-24',
      type: 'Revenue',
      dateRange: '2024-07-01 to 2024-09-30 (Subscription Type)',
      data: { totalRevenue: 25000, subscriptions: 120 }
    }
  ]);

  // New state for pie chart data:
  const [rolePieData, setRolePieData] = useState([
    { name: 'Trainee', value: 0 },
    { name: 'Trainer', value: 0 }
  ]);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/dashboard-stats");
      setStats(response.data);

      // Dynamically append to the line chart with timestamp
     setLineData(prev => {
          const updated = [
            ...prev,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              revenue: response.data.monthlyRevenue,
            },
          ];
          // Keep only the last 10 entries
          return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
        });
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    // Call immediately and then set interval
    fetchStats(); // Optional: fetch once immediately
    const interval = setInterval(fetchStats, 60 * 1000); // every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/user-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchUserRoleCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/user-role-counts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { trainee, trainer } = response.data;
        setRolePieData([
          { name: 'Trainee', value: trainee },
          { name: 'Trainer', value: trainer }
        ]);
      } catch (error) {
        console.error("Error fetching user role counts:", error);
      }
    };

    fetchProfile();
    fetchUserCount();
    fetchUserRoleCounts();
  }, []);

  // The rest of your existing functions and handlers here...

  const handleViewReport = (id) => {
    const report = reports.find(r => r.id === id);
    alert(`Viewing Report: ${report.name}\nType: ${report.type}\nDate Range: ${report.dateRange}`);
    setMenuOpen(null);
  };

  const handleExportReport = (id) => {
    const report = reports.find(r => r.id === id);
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.name.replace(/\s+/g, '_')}.json`;
    link.click();
    setMenuOpen(null);
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(report => report.id !== id));
    }
    setMenuOpen(null);
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
      const today = new Date();
      const month = today.toLocaleString('default', { month: 'short' });
      const year = today.getFullYear().toString().slice(-2);

      const newReport = {
        id: newId,
        name: `${selectedReportType} ${month}-${year}`,
        type: selectedReportType,
        dateRange: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01 to ${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-30 (${selectedFilter})`,
        data: generateReportData(selectedReportType)
      };

      setReports([...reports, newReport]);
      setLoading(false);
    }, 800);
  };

  const generateReportData = (type) => {
    switch(type) {
      case 'User Activity':
        return { activeUsers: Math.floor(Math.random() * 200) + 50, newSignups: Math.floor(Math.random() * 50) };
      case 'Revenue':
        return { totalRevenue: Math.floor(Math.random() * 50000) + 10000, subscriptions: Math.floor(Math.random() * 200) };
      case 'Class Attendance':
        return { totalAttendance: Math.floor(Math.random() * 300) + 100, popularClass: ['Yoga', 'Boxing', 'Strength'][Math.floor(Math.random() * 3)] };
      default:
        return {};
    }
  };

  const filteredReports = reports.filter(report => 
    report.type.includes(selectedReportType) && 
    report.dateRange.includes(selectedFilter)
  );

  return (
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="analytics-container">
          <div className="analyticstop-metrics">
            <span>Total Users: <strong>{userCount}</strong></span>
            <span>Active Subscriptions: <strong>{stats.activeSubscriptions}</strong></span>
            <span>Monthly Revenue: <strong>{stats.monthlyRevenue} EGP</strong></span>
            <span>New Sign-Ups: <strong>{stats.newSignups}</strong></span>
            <span>Class Attendance: <strong>200</strong></span>
          </div>

          <div className="analyticscharts">
            <div className="analyticsline-chart">
              <LineChart width={300} height={250} data={lineData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
</LineChart>

              <p className="analyticschart-caption">Shows the monthly revenue growth</p>
            </div>

            <div className="analyticspie-chart">
              <PieChart width={200} height={200}>
                <Pie
                  data={rolePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                >
                  {rolePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(194, 3, 3, 0.53)"
                    />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => (
                    <span style={{ color: 'white', fontWeight: 500 }}>{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${((value / rolePieData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`,
                    name
                  ]}
                />
              </PieChart>
            </div>


            <div className="analyticsbar-chart">
             <BarChart width={300} height={300} data={barData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis allowDecimals={false} />
  <Tooltip />
  <Bar dataKey="users" fill="rgb(5, 156, 156)" barSize={40} radius={[10, 10, 0, 0]} />
</BarChart>

            </div>
          </div>

         <div className="analyticsfilters">
            <select 
              value={selectedReportType} 
              onChange={(e) => setSelectedReportType(e.target.value)}
              disabled={loading}
            >
              <option>User Activity</option>
              <option>Revenue</option>
              <option>Class Attendance</option>
              <option>Trainer Performance</option>
            </select>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              disabled={loading}
            >
              <option>User Role</option>
              <option>Subscription Type</option>
              <option>Class Type</option>
              <option>Date Range</option>
            </select>
            <button 
              className="analyticsgenerate-btn" 
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

       {loading && reports.length === 0 ? (
            <p className="analyticsloading-text">Loading reports...</p>
          ) : (
            <table className="analyticstemplates-table">
              <thead>
                <tr>
                  <th>REPORT NAME</th>
                  <th>REPORT TYPE</th>
                  <th>DATE RANGE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="analyticsno-reports">No matching reports found</td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.name}</td>
                      <td>{report.type}</td>
                      <td>{report.dateRange}</td>
                      <td>
                        <div className="analyticsaction-menu">
                          <FaEllipsisV
                            className="analyticsmenu-icon"
                            onClick={() => setMenuOpen(menuOpen === report.id ? null : report.id)}
                          />
                          {menuOpen === report.id && (
                            <div className="analyticsdropdown-menu">
                              <button 
                                onClick={() => handleViewReport(report.id)}
                                className="view"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleExportReport(report.id)}
                                className="export"
                              >
                                Export
                              </button>
                              <button 
                                onClick={() => handleDeleteReport(report.id)}
                                className="delete"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;