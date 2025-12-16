// components/SubscriptionOverlay.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Overlay.css';

const SubscriptionOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <p>You need an active membership to access this page.</p>
        <button onClick={() => navigate('/membership-packages')}>Go to Membership</button>
      </div>
    </div>
  );
};

export default SubscriptionOverlay;
