import React from 'react';
import '../../styles/TrainerPackages.css';
import { useParams , useNavigate } from 'react-router-dom';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import { FaArrowLeft } from 'react-icons/fa';

const Membership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="content-container">
          <button className="go-back-button" onClick={() => navigate(`/trainer/${id}`)}>
            <FaArrowLeft />
          </button>

          <div className="content">
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
              <button onClick={() => navigate(`/payment`, { state: { price: 1500, packageName: 'Bronze' } })}>
                Choose Package
              </button>
            </div>

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
              <button onClick={() => navigate(`/payment`, { state: { price: 3000, packageName: 'Silver' } })}>
                Choose Package
              </button>
            </div>

            <div className="package golds">
              <h3>Gold Package</h3>
              <p>EGP 4,500 / 6 Months</p>
              <ul>
                <p>Silver Package Facilities.</p>
                <p>Discounts on gym merchandise and supplements.</p>
                <p>A personalized nutrition plan tailored to your fitness goals.</p>
                <p>Monthly progress tracking with detailed reports.</p>
              </ul>
              <button onClick={() => navigate(`/payment`, { state: { price: 4500, packageName: 'Gold' } })}>
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
