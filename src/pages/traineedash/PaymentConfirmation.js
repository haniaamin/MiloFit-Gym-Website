import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/FinalSubmit.css';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { price = 0, method = 'Visa',email = 'Email', packageName = 'Package' } = location.state || {};
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUserId(res.data._id);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleConfirm = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/subscriptions/subscribe`,
        {
          userId,
          email,
          packageName,
          price,
          method,
          startDate: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/trainee-dashboard');
    } catch (error) {
      console.error('Failed to save subscription:', error);
      alert('Failed to confirm subscription. Please try again.');
    }
  };

  return (
    <div className="pass-changed-container">
      <div className="createaccbackground-overlay"></div>
      <div className="final-submit-card">
        <div className="icon">&#10004;</div>
        <p>Your payment of EGP {price} has been successfully processed via {method}.</p>
        <button onClick={handleConfirm}>Go to Dashboard</button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
