import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Opinions.css"; // Ensure this CSS is updated
import opinion1 from "../assets/opinion1.jpg";
import opinion2 from "../assets/opinion2.jpg";
import opinion3 from "../assets/opinion3.jpg";
import opinion4 from "../assets/opinion4.jpg";

const Opinions = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const [opinion, setOpinion] = useState("");
  const [rating, setRating] = useState(0);
  

  // Default Ratings & Reviews
  const defaultReviews = [
    {
      name: "Karim El Alem",
      rating: 5,
      review: "One of the best gyms in Alexandria especially for athletes.",
    },
    {
      name: "Yacoub Amr",
      rating: 4,
      review: "A place where champions are made.",
    },
  ];

  // Fetch feedbacks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/feedback/get-feedback")
      .then((response) => setFeedbacks(response.data))
      .catch((error) => console.error("Error fetching feedbacks:", error));
  }, []);

  // Handle feedback submission
  const submitFeedback = () => {
    if (!name || !opinion || rating === 0) {
      alert("Please enter all fields and select a rating!");
      return;
    }

    const newFeedback = { name, opinion, rating };
    axios
      .post("http://localhost:5000/api/feedback/add-feedback", newFeedback)
      .then(() => {
        alert("Feedback submitted!");
        setFeedbacks([newFeedback, ...feedbacks]);
        setShowInput(false);
        setName("");
        setOpinion("");
        setRating(0);
      })
      .catch((error) => console.error("Error submitting feedback:", error));
  };

  return (
    <div className="opinions-section">
      <div className="opinions-title">
      <p>Reviews 88% recommend</p>
        <h2>OPINIONS</h2>
        </div>
        <div> 
          <button className="add-feedback-btn" onClick={() => setShowInput(!showInput)}>
          + Your Opinions
        </button>
        </div>

       {/* Top section with photos and "+ Your Opinions" button */}
      <div className="opinions-images">
          <div className="opinions-top">
          <img src={opinion1} alt="Gym 1" className="GYM1"/>
          <img src={opinion2} alt="Gym 2" className="GYM1"/>
          </div>
          <div className="opinions-down">
          <img src={opinion3} alt="Gym 3" className="GYM2" />
          <img src={opinion4} alt="Gym 4" className="GYM2" />
          </div>
      </div>

       {/* Right Side - Modern Opinion Boxes */}
      <div className="opinions-right">
        {defaultReviews.map((review, index) => (
          <div key={index} className="opinion-box">
            <h4>{review.name}</h4>
            <div className="star-rating">{"⭐".repeat(review.rating)}</div>
            <p>{review.review}</p>
          </div>
        ))}
      </div>

      {/* Feedback Form */}
      
      {showInput && (
        <div className="feedback-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Write your opinion..."
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          ></textarea>

          {/* Star Rating System */}
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star selected" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <button onClick={submitFeedback} className="submit-feedback-btn">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Opinions;