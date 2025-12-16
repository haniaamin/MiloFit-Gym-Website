import React, { useState } from 'react';
import '../../styles/TraineeFeedback.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TraineeReviewForm = () => {
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({
    name: '',      // <-- added name
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/feedback/add-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReview.name,
          opinion: newReview.comment,
          rating: newReview.rating
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      alert('Thank you for your review!');
      navigate('/feedback-reviews');
    } catch (error) {
      alert('Error submitting review: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />

      <div className="main-content">
        <TopNav />

        <div className="traineereview-container">
          <div className="review-form-page">
            <h1 className="feedback-title">Write Your Review</h1>
            <div className="formname-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>
            <form onSubmit={handleSubmitReview} className="form-container">
              

              <div className="star-rating">
                <p>How would you rate your experience?</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= newReview.rating ? 'filled' : 'empty'}`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="feedcancel-btn"
                  onClick={() => navigate('/feedback-reviews')}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="feedsubmit-btn"
                  disabled={loading || !newReview.rating || !newReview.comment || !newReview.name}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineeReviewForm;
