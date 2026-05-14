import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/Opinions.css";

import opinion1 from "../assets/opinion1.jpg";
import opinion2 from "../assets/opinion2.jpg";
import opinion3 from "../assets/opinion3.jpg";
import opinion4 from "../assets/opinion4.jpg";

export default function Opinions() {

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [showInput, setShowInput] =
    useState(false);

  const [name, setName] = useState("");

  const [opinion, setOpinion] =
    useState("");

  const [rating, setRating] =
    useState(0);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  
  const defaultReviews = [
    {
      name: "Karim El Alem",
      rating: 4,
      opinion:
        "One of the best gyms in Alexandria especially for athletes.",
    },

    {
      name: "Yacoub Amr",
      rating: 4,
      opinion:
        "A place where champions are made.",
    },
  ];

  
  useEffect(() => {

    axios
      .get(
        "http://localhost:5000/api/feedback/get-feedback"
      )
      .then((res) => {

        setFeedbacks(res.data);

      })
      .catch((err) =>
        console.log(err)
      );

  }, []);

  
  const allReviews = [
    ...defaultReviews,
    ...feedbacks,
  ];

  
  const visibleReviews =
    allReviews.slice(
      currentSlide,
      currentSlide + 2
    );

  
  function nextSlide() {

    if (
      currentSlide <
      allReviews.length - 2
    ) {

      setCurrentSlide(
        currentSlide + 1
      );
    }
  }

  
  function prevSlide() {

    if (currentSlide > 0) {

      setCurrentSlide(
        currentSlide - 1
      );
    }
  }

  
  function submitFeedback() {

    if (
      !name ||
      !opinion ||
      rating === 0
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    const newFeedback = {
      name,
      opinion,
      rating,
    };

    axios
      .post(
        "http://localhost:5000/api/feedback/add-feedback",
        newFeedback
      )
      .then(() => {

        const updated = [
          ...feedbacks,
          newFeedback,
        ];

        setFeedbacks(updated);

        setShowInput(false);

        setName("");
        setOpinion("");
        setRating(0);

        
        if (
          updated.length +
            defaultReviews.length >
          2
        ) {

          setCurrentSlide(
            updated.length +
              defaultReviews.length -
              2
          );
        }

      })
      .catch((err) =>
        console.log(err)
      );
  }

  return (

    <section className="opinions-section">

      
      <div className="opinions-header">

        <div>

          <p className="subtitle">
            Reviews 88% recommend
          </p>

          <h2>
            YOUR OPINIONS
          </h2>

        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowInput(true)
          }
        >
          + Your Opinions
        </button>

      </div>

      
      <div className="opinions-layout">

        
        <div className="images-side">

          <img
            src={opinion1}
            alt=""
          />

          <img
            src={opinion2}
            alt=""
          />

          <img
            src={opinion3}
            alt=""
          />

          <img
            src={opinion4}
            alt=""
          />

        </div>

        
        <div className="reviews-side">

          <div className="reviews-row">

            {visibleReviews.map(
              (review, index) => (

                <div
                  key={index}
                  className="review-card"
                >

                  <h3>
                    {review.name}
                  </h3>

                  <div className="stars">
                    {"★".repeat(
                      review.rating
                    )}

                    {"☆".repeat(
                      5 -
                        review.rating
                    )}
                  </div>

                  <p>
                    {review.opinion}
                  </p>

                </div>

              )
            )}

          </div>

          
          {allReviews.length > 2 && (

            <div className="slider-buttons">

              <button
                onClick={prevSlide}
                disabled={
                  currentSlide === 0
                }
              >
                ❮
              </button>

              <button
                onClick={nextSlide}
                disabled={
                  currentSlide >=
                  allReviews.length -
                    2
                }
              >
                ❯
              </button>

            </div>

          )}

        </div>

      </div>

      
      {showInput && (

        <div className="popup-overlay">

          <div className="popup">

            <button
              className="close-btn"
              onClick={() =>
                setShowInput(false)
              }
            >
              ✕
            </button>

            <h3>
              Add Your Opinion
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <textarea
              placeholder="Write your opinion..."
              value={opinion}
              onChange={(e) =>
                setOpinion(
                  e.target.value
                )
              }
            />

            
            <div className="rating">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <span
                    key={star}
                    className={
                      star <= rating
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    ★
                  </span>

                )
              )}

            </div>

            <button
              className="submit-btn"
              onClick={
                submitFeedback
              }
            >
              Submit
            </button>

          </div>

        </div>

      )}

    </section>
  );
}