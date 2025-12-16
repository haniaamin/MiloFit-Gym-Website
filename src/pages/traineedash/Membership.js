import React, { useEffect, useState } from 'react';
import '../../styles/Membership.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';

const Membership = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChoosePackage = (price, packageName) => {
    navigate('/payment', { state: { price, packageName } });
  };

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Step 1: Get logged-in user's ID
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUserId = res.data._id;
        setUserId(fetchedUserId);

        // Step 2: Get user's subscription
        const subRes = await axios.get(`http://localhost:5000/api/subscriptions/${fetchedUserId}`);
        setMembership(subRes.data);
      } catch (err) {
        console.error('Error fetching user or subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, []);

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />

        <div className="membership-container">
          <div className="current-membership">
            {loading ? (
              <p>Loading...</p>
            ) : membership ? (
              <div className="membership-info">
                <h4>Current Membership:</h4>
                <h5>"{membership.packageName}"</h5>
                <p>Valid until: {new Date(membership.validUntil).toLocaleDateString()}</p>
                <button onClick={() => handleChoosePackage(membership.price, membership.packageName)}>
                  Renew your membership now
                </button>
              </div>
            ) : (
              <p>You don't have an active membership.</p>
            )}
          </div>

          <div className="content">
            {/* Bronze */}
            <div className="package bronzes">
              <h3>Bronze Package</h3>
              <p>EGP 1,500 / Month</p>
              <ul>
                <p>Unlimited access to gym equipment and facilities during operating hours.</p>
                <p>Access to 2 group classes per week.</p>
                <p>Monthly progress check-ins.</p>
                <p>Use of locker rooms and showers.</p>
                <p>Free Wi-Fi access in the gym.</p>
              </ul>
              <button onClick={() => handleChoosePackage(1500, 'Bronze')}>
                Choose Package
              </button>
            </div>

            {/* Silver */}
            <div className="package silvers">
              <h3>Silver Package</h3>
              <p>EGP 3,000 / 3 Months</p>
              <ul>
                <p>24/7 access to gym facilities.</p>
                <p>Weekly progress tracking with detailed reports.</p>
                <p>Unlimited access to all group classes.</p>
                <p>One free nutrition consultation per month.</p>
                <p>Use of locker rooms and showers.</p>
                <p>Free Wi-Fi access in the gym.</p>
              </ul>
              <button onClick={() => handleChoosePackage(3000, 'Silver')}>
                Choose Package
              </button>
            </div>

            {/* Gold */}
            <div className="package golds">
              <h3>Gold Package</h3>
              <p>EGP 4,500 / 6 Months</p>
              <ul>
                <p>Silver Package Facilities.</p>
                <p>Discounts on gym merchandise and supplements.</p>
                <p>A personalized nutrition plan tailored to your fitness goals.</p>
                <p>Monthly progress tracking with detailed reports.</p>
              </ul>
              <button onClick={() => handleChoosePackage(4500, 'Gold')}>
                Choose Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
