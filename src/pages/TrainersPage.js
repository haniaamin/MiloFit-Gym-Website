import React from "react";
import "../styles/TrainersPage.css";
import trainer1 from "../assets/coach1.png";
import trainer2 from "../assets/coach2.png";
import trainer3 from "../assets/coach3.png";
import trainer4 from "../assets/coach.png";


const TrainersPage = () => {
  return (
    <div className="trpg-container">
      <div className="trpgbackground-overlay"></div>
      <section className="trainers-page">
        <h2>Our Trainers</h2>
        <div className="trainerss-grid">
          <div className="trainer-profiless">
            <img src={trainer1} alt="Trainer 1" />
            <h3>Ali Amr</h3>
            <p>BodyBuilding Trainer</p>
          </div>
          <div className="trainer-profiless">
            <img src={trainer2} alt="Trainer 2" />
            <h3>Islam Shalaby</h3>
            <p>Personal Trainer</p>
          </div>
          <div className="trainer-profiless">
            <img src={trainer3} alt="Trainer 3" />
            <h3>Ahmed Hamasa</h3>
            <p>Boxing Trainer</p>
          </div>
          <div className="trainer-profiless">
            <img src={trainer4} alt="Trainer 4" />
            <h3>Sarah Ali</h3>
            <p>Yoga Trainer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainersPage;
