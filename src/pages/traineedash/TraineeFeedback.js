// src/pages/TraineeFeedback.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TraineeFeedback.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import { FaStar, FaPen } from 'react-icons/fa';
import profile1 from '../../assets/r1.png';
import profile2 from '../../assets/r2.png';
import profile3 from '../../assets/r3.png';
import SubscriptionOverlay from '../../components/SubscriptionOverlay';


const TraineeFeedback = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      rating: 4,
      name: 'Muhammad Abdel Atty',
      comment: 'A clean place, full of professional equipment and professional coaches. Very good light, very good air. I recommend it if you\'re looking for a place that helps you to be a champion.',
      date: '4 years ago',
      ratingsCount: 32,
      profilePic: profile1
    },
    {
      id: 2,
      rating: 5,
      name: 'Ziad Abdelkarim Elsayed',
      comment: 'Perfectly equipped, and has the best coaches.',
      date: '3 years ago',
      ratingsCount: 32,
      profilePic: profile2
    },
    {
      id: 3,
      rating: 5,
      name: 'Mohamed Salah El.Sayad',
      comment: 'The Gym with the best coach ever Dr. Islam Shalaby.',
      date: '2 years ago',
      ratingsCount: 32,
      profilePic: profile3
    }
  ]);

  // Function to add a new review
  const addNewReview = (newReview) => {
    const review = {
      id: reviews.length + 1,
      rating: newReview.rating,
      name: 'You',
      comment: newReview.comment,
      date: 'Just now',
      ratingsCount: 1,
      profilePic: profile1
    };
    setReviews([review, ...reviews]);
  };

  return (
    <div className="trainee-dash">      
    {/* Background Image with Overlay */}
    <div className="background-overlay"></div>

    {/* Sidebar */}
    <TraineeSidebar />

    {/* Main Content */}
    <div className="main-content">
      {/* Top Navigation */}
      <TopNav />
      
        <div className="traineefeedback-container">          
          <div className="header-section">
            <div className="rating-display">
              <div className="overall-rating">
                <h1 className="rating-value">4.8</h1>
                <div className="stars-overall">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? 'filled' : 'empty'} />
                  ))}
                </div>
                <span className="rating-count">32 ratings</span>
              </div>
              
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="star-row">
                    <div className="star-bars">
                      <div className="star-bar">
                        {[...Array(stars)].map((_, i) => (
                          <FaStar key={i} className="filled" />
                        ))}
                      </div>
                    </div>
                    <span className="star-count">{stars === 5 ? 18 : stars === 4 ? 8 : stars === 3 ? 5 : stars === 2 ? 1 : 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card-container">
                <div className="review-card">
                  <div className="reviewer-info">
                    <h3 className="reviewer-name">{review.name}</h3>
                    <div className="review-rating">
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < review.rating ? 'filled' : 'empty'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-date">{review.date}</p>
                </div>
                <img 
                  src={review.profilePic} 
                  alt={review.name}
                  className="reviewer-avatar"
                />
              </div>
            ))}
          </div>
          
          <button 
            className="write-review-btn"
            onClick={() => navigate('/write-review')}
          >
            <FaPen /> Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraineeFeedback;