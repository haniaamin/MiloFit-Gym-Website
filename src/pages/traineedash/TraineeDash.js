import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../../styles/TraineeDash.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import SubscriptionOverlay from '../../components/SubscriptionOverlay';
import axios from 'axios';

const tips = [
  "Stay hydrated and drink at least 8 glasses of water daily.",
  "Stretch before and after workouts to prevent injuries.",
  "Eat protein-rich foods to help with muscle recovery.",
  "Get at least 7-8 hours of sleep for better muscle growth.",
  "Track your progress to stay motivated.",
  "Consistency is key—stick to your workout plan!",
  "Eat a balanced diet with vegetables, protein, and healthy fats.",
  "Avoid processed sugar for better energy levels.",
  "Take rest days to allow muscle recovery.",
  "Warm up before exercising to avoid injury."
];

const getTipOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return tips[dayOfYear % tips.length];
};

const TraineeDash = () => {
  const [progress, setProgress] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const fetchedUser = res.data;
        setUser(fetchedUser);

        // Fetch subscription from backend
        const subRes = await axios.get(`http://localhost:5000/api/admin/subscriptions/${fetchedUser._id}`);
        const subscription = subRes.data;

        if (subscription?.startDate) {
          const startDate = new Date(subscription.startDate);
          const today = new Date();
          const diffTime = today - startDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const remaining = Math.max(0, 30 - diffDays);

          setIsSubscribed(remaining > 0);
          setDaysRemaining(remaining);
        }

        // Progress tracking
        const userKey = `${fetchedUser.firstName}_${fetchedUser.lastName}`;
        const progressKey = `progressData_${userKey}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          const { upcomingGoals = [], monthlyWeights = {} } = JSON.parse(savedProgress);
          const months = Object.keys(monthlyWeights);
          if (months.length > 0) {
            months.sort();
            const latestMonth = months[months.length - 1];
            const currentWeight = monthlyWeights[latestMonth];
            const targetGoal = upcomingGoals.length > 0 ? upcomingGoals[0] : currentWeight;

            let calculatedProgress = 0;
            if (targetGoal > 0) {
              calculatedProgress = Math.min(100, Math.round((currentWeight / targetGoal) * 100));
            }

            setProgress(calculatedProgress);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsSubscribed(false);
        setDaysRemaining(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSubscription();
  }, []);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="trainee-dash">
      {!loading && !isSubscribed && <SubscriptionOverlay />}
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="trainee-container">
          <div className="subscription-banner">
            <p>{daysRemaining} days left in your current subscription</p>
          </div>

          <div className="tip-of-the-day">
            <h2>Tip of the Day</h2>
            <p>{getTipOfTheDay()}</p>
          </div>

          <div className="ai-plan">
            <h2>AI Personalized Plan</h2>
            <Link to="/ai-plan">Click here</Link>
          </div>

          <div className="progress-tracker">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} stroke="black" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="white"
                strokeWidth="10"
                fill="black"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fontSize="18" fill="white">
                {progress}%
              </text>
            </svg>
            <p>You're {progress}% closer to your goal!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineeDash;
