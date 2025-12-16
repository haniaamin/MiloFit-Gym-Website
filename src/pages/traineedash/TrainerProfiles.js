import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrainerProfiles.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import coach1 from '../../assets/coach1.png';
import coach2 from '../../assets/coach2.png';
import coach3 from '../../assets/coach3.png';
import coach4 from '../../assets/coach.png';

const TrainerProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const trainers = [
    { id: '1', name: 'Ali Amr', expertise: 'Bodybuilding Trainer', rating: 4, image: coach1 },
    { id: '2', name: 'Islam Shalaby', expertise: 'Personal Trainer', rating: 5, image: coach2 },
    { id: '3', name: 'Ahmed Hamasa', expertise: 'Boxing Trainer', rating: 4, image: coach3 },
    { id: '4', name: 'Sarah', expertise: 'Yoga Trainer', rating: 4, image: coach4 },
  ];

  const handleSearch = () => {
    const results = trainers.filter(trainer => {
      return (
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === 'All' || trainer.expertise === category)
      );
    });
    setFilteredTrainers(results);
  };

  const displayTrainers = filteredTrainers.length > 0 ? filteredTrainers : trainers;

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="trainerspro-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Trainer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All categories</option>
              <option value="Bodybuilding Trainer">Bodybuilding</option>
              <option value="Personal Trainer">Personal Training</option>
              <option value="Boxing Trainer">Boxing</option>
              <option value="Yoga Trainer">Yoga</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="trainers-profiles-container">
            <div className="trainers-list">
              {displayTrainers.map((trainer) => (
                <div key={trainer.id} className="trainers-card">
                  <img src={trainer.image} alt={trainer.name} className="trainers-image" />
                  <h2>{trainer.name}</h2>
                  <p>{trainer.expertise}</p>
                  <div className="ratings">
                    {'★'.repeat(trainer.rating)}{'☆'.repeat(5 - trainer.rating)}
                  </div>
                  <button
                    className="learn-more-button"
                    onClick={() => navigate(`/trainer/${trainer.id}`)} // Navigate to trainer profile
                  >
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
            <button className="book-session-button"
            onClick={() => navigate('/upcoming-sessions')}
            >
        Book a Session
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfiles;