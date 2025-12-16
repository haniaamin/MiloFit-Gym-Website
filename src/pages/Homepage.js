/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"; // Import social icons
import Opinions from "../components/Opinions.js"; // Import the Opinions component
import Footer from "../components/Footer.js"; // Import the Footer component
import "../styles/Homepage.css";
import why1 from "../assets/1.jpg";
import why2 from "../assets/2.jpg";
import why3 from "../assets/3.jpg";
import trainer1 from "../assets/trainer1.jpg";
import trainer2 from "../assets/trainer2.jpg";
import Miloo from "../assets/Miloo.jpg";

  const Homepage = () => {
    const navigate = useNavigate(); // ✅ Initialize navigate function
const [scrolled, setScrolled] = useState(false);
const [scrollDirection, setScrollDirection] = useState("up");
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    setScrolled(currentScrollY > 50);
    setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

  return (
    <div className="homepage">
     {/* Navigation */}
<nav className={`navbar ${scrolled ? 'scrolled' : ''} ${scrollDirection === 'down' ? 'hide' : 'show'}`}>
  <div className="nav-container">
    <ScrollLink to="home" smooth={true} duration={500} className="nav-link">Home</ScrollLink>
    <ScrollLink to="about" smooth={true} duration={500} className="nav-link">About Us</ScrollLink>
    <ScrollLink to="services" smooth={true} duration={500} className="nav-link">Services</ScrollLink>
    <ScrollLink to="footer" smooth={true} duration={500} className="nav-link">Contact Us</ScrollLink>
  </div>
  <div className="join">
    <Link to="/sign-in" className="join-now">Join Now</Link>
  </div>
</nav>



      {/* Home Section */}
      <section className="home" id="home">
        <div className="overlay">
          <h1>Your Path to</h1>
          <h1>Fitness</h1>
          <h1>Excellence</h1>
        </div>
        <div className="socials">
          <a href="https://wa.me/+2001272885923" className="social"><FaWhatsapp /></a>
          <a href="https://www.facebook.com/share/168wpNsmMG/?mibextid=wwXIfr" className="social"><FaFacebookF /></a>
          <a href="https://www.instagram.com/milo_gym?igsh=cXN6N2x6N3Q2cnFm" className="social"><FaInstagram /></a>
        </div>
        <div className="join"><Link to="/sign-in" className="join-now">Join Now</Link></div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-box">
          <h2>5+</h2>
          <p>Years of Service</p>
        </div>
        <div className="stat-box">
          <h2>10+</h2>
          <p>Certified Trainers</p>
        </div>
        <div className="stat-box">
          <h2>786+</h2>
          <p>Happy Members</p>
        </div>
        <div className="stat-box">
          <h2>95%</h2>
          <p>Customer Satisfaction</p>
        </div>
      </section>

      {/* Why Choose Us Section */}
<section className="why-choose-us" id="why">
   <div className="section-title">
  <h2>Why Choose Us?</h2>
    </div>
  <div className="why-content">
    {/* Left Side - 4 Paragraphs (2x2 Grid) */}
    <div className="reasons">
      <div className="reason-box">
        <h2>Personalized Training Plans</h2>
        <p>Get customized workout programs tailored to your fitness goals</p>
      </div>
      <div className="reason-box">
      <h2>State-Of-The-Art Equipment</h2>
      <p>Access cutting-edge fitness machines and tools</p>
      </div>
      <div className="reason-box">
        <h2>Flexible Membership Options</h2>
        <p>Choose plans that fit your schedule and lifestyle</p>
      </div>
      <div className="reason-box">
      <h2>Supportive Community</h2>
      <p>Join a gym where members motivate and inspire each other</p>
      </div>
    </div>

   {/* Right Side - 3 Images Layout */}
   <div className="right-images">
      <div className="image-column">
        <img src={why1} alt="Quality Training" className="img-small" />
        <img src={why2} alt="Modern Equipment" className="img-small" />
      </div>
      <img src={why3} alt="Personal Coaching" className="img-large" />
    </div>
  </div>
</section>


     {/* Meet Our Trainers Section */}
<section className="meettrainers" id="meettrainers">
   {/* Trainer Images */}
   <div className="meettrainers-list">
    <div className="meettrainers-card">
      <img src={trainer1} alt="Trainer 1" />
    </div>
    <div className="meettrainers-card">
      <img src={trainer2} alt="Trainer 2" />
    </div>
  </div>

  <div className="meettrainers-content">
    <h4>Are you looking for a Mentor?</h4>
    <h2>Meet Our Trainers</h2>
    <p>
    Discover a diverse team of experienced trainers dedicated to helping you achieve your fitness goals. Each trainer brings unique expertise and a passion for fitness, ensuring you find the perfect match for your journey. Whether you're just starting out or looking to elevate your routine, our trainers are here to support and inspire you every step of the way.
    </p>
    <button className="explore-button" onClick={() => navigate("/trainers")}>
      Explore More
    </button>
  </div>

 
</section>


     {/* About Us */}
<section className="about-us" id="about">
  <div className="about-container">
    <div className="about-text">
      <h2>About Us</h2>
      <p>Who is Milo?</p>
      <p>Long ago about 2500 years ago there was a man with incredible strength roaming the hills of southern Italy His name was Milo, Milo was the greatest wrestler of his time They said that Milo built his incredible strength simply ,but it was a pro-founded strategy.</p>
      <p>One day, a newborn calf was born near Milo's home. The wrestler decided to lift this small calf up and carry it on his shoulders, the next day, he returned and did the same thing Milo continued this strategy for the next four years, carrying the calf on his shoulders each day until he was no longer lifting a calf, so The core principles of strength training and how to build muscle are encapsulated in this legendary tale of Milo and the bull.
      </p>
    </div>
    <div className="about-image">
      <img src={Miloo} alt="Gym Interior" />
    </div>
  </div>
</section>

      
{/* 🔹 Services Section */}
<section id="services" className="services-section">
  <h2>Services</h2>
  <div className="services-grid">
    <div className="service-box red">
      <i className="fas fa-dumbbell"></i>
      <h3>Personal Training</h3>
      <p>
        Achieve your fitness goals with personalized training plans tailored to your needs.
      </p>
    </div>
    <div className="service-box dark">
      <i className="fas fa-weight-hanging"></i>
      <h3>Power Lifting</h3>
      <p>
        Build strength with expert powerlifting guidance to improve muscle control and endurance.
      </p>
    </div>
    <div className="service-box red">
      <i className="fas fa-heartbeat"></i>
      <h3>Gym & Fitness Training</h3>
      <p>
        Adaptable fitness solutions for all levels in a hygienic and motivating gym environment.
      </p>
    </div>
    <div className="service-box dark">
      <i className="fas fa-running"></i>
      <h3>Cardio Strength</h3>
      <p>
        Boost endurance and burn calories with high-intensity cardio training programs.
      </p>
    </div>
    <div className="service-box red">
      <i className="fas fa-mountain"></i>
      <h3>Weight Lifting</h3>
      <p>
        Convenient weightlifting schedules with state-of-the-art equipment.
      </p>
    </div>
    <div className="service-box dark">
      <i className="fas fa-hand-rock"></i>
      <h3>Boxing</h3>
      <p>
        Unleash your inner fighter with expert boxing training, improving agility and confidence.
      </p>
    </div>
    <div className="service-box red">
      <i className="fas fa-spa"></i>
      <h3>Beginner Pilates</h3>
      <p>
        Improve flexibility, posture, and strength through guided Pilates classes.
      </p>
    </div>
    <div className="service-box dark">
      <i className="fas fa-praying-hands"></i>
      <h3>Basic Yoga</h3>
      <p>
        Find balance and relaxation with expert yoga sessions for all skill levels.
      </p>
    </div>
    <div className="service-box red">
      <i className="fas fa-bolt"></i>
      <h3>Muscle Building</h3>
      <p>
        Track progress and build muscle with advanced gym technology and professional guidance.
      </p>
    </div>
  </div>
</section>

     {/* 🔹 Opinions (Feedback) */}
<section id="opinions" className="opinions-section">
  <Opinions/>
</section>

{/* 🔹 Footer */}
<footer className="footer" id="footer">
  <Footer/>
</footer>

    </div>
  );
};

export default Homepage;

