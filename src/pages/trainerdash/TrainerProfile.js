import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/TrainerProfile.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import coach1 from '../../assets/coach1.png';
import coach2 from '../../assets/coach2.png';
import coach3 from '../../assets/coach3.png';
import coach4 from '../../assets/coach.png';
import certificate1 from '../../assets/certificate1.png';
import { FaArrowLeft, FaEnvelope, FaPhone, FaFacebook, FaInstagram } from 'react-icons/fa';




const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  // Mock data for trainers (replace with your actual data fetching logic)
  const trainers = [
    {
      id: '1',
      name: 'Ali Amr',
      expertise: 'Bodybuilding Trainer',
      rating: 4.8,
      bio: 'Ali is a professional bodybuilding trainer with 10 years of experience. He creates personalized programs for all fitness levels, helping clients achieve their strength and physique goals. His dedication and expertise make him a trusted coach in the fitness community..',
      email: 'aliamr@gmail.com',
      phone: '+20 010 1234 5678',
      socialMedia: {
        facebook: 'Ali Amr',
        instagram: 'coach_ali_amr',
      },
      specializations: ['Strength', '- Bodybuilding'],
      profilePic: coach1,
      certificate: certificate1,
    },
    {
      id: '2',
      name: 'Islam Shalaby',
      expertise: 'Personal Trainer',
      rating: 5,
      bio: 'Dr. Islam Shalaby is a certified strength and conditioning coach with over 10 years of experience. He creates personalized training programs for all fitness levels. Specializing in strength, conditioning, and CrossFit, he helps clients achieve their goals. His expertise and dedication make him a trusted fitness professional.',
      email: 'islamshalaby@gmail.com',
      phone: '+20 010 1234 5678',
      socialMedia: {
        facebook: 'Islam Shalaby',
        instagram: 'coach_islam_shalaby',
      },
      specializations: ['Strength', '- Conditioning', '- CrossFit', '- BodyBuilding'],
      profilePic: coach2,
      certificate: certificate1,
    },
    {
      id: '3',
      name: 'Ahmed Hamasa',
      expertise: 'Boxing Trainer',
      rating: 4,
      bio: 'Ahmed Hamasa is a professional boxing trainer with over 8 years of experience in the field. He has trained both amateur and professional boxers, helping them improve their technique, strength, and endurance. Ahmed is passionate about teaching the art of boxing and believes in the power of discipline and hard work to achieve success.',
      email: 'ahmedr@gmail.com',
      phone: '+20 010 9876 5432',
      socialMedia: {
        facebook: 'Ahmed Hamasa',
        instagram: 'coach_ahmed_hamasa',
      },
      specializations: ['Boxing', '- Strength Training', '- Endurance', '- Defense Techniques'],
      profilePic: coach3,
      certificate: certificate1,
    },
    {
      id: '4',
      name: 'Sarah',
      expertise: 'Yoga Trainer',
      rating: 4.5,
      bio: 'Sarah is a certified yoga instructor with over 7 years of experience in teaching yoga and mindfulness. She specializes in Hatha, Vinyasa, and Yin yoga, helping her students improve flexibility, strength, and mental clarity. Sarah believes in the holistic benefits of yoga and is dedicated to creating a peaceful and inclusive environment for her students.',
      email: 'sarah@gmail.com',
      phone: '+20 010 1234 5678',
      socialMedia: {
        facebook: 'Sarah Yoga',
        instagram: 'yoga_with_sarah',
      },
      specializations: ['Hatha Yoga', '- Vinyasa Yoga', '- Yin Yoga', '- Mindfulness'],
      profilePic: coach4,
      certificate: certificate1,
    },
  ];

  // Find the trainer by ID
  const trainer = trainers.find((t) => t.id === String(id));

  if (!trainer) {
    return <div>Trainer not found</div>;
  }
  if (!id) {
    console.error("Error: Trainer ID is undefined!");
    return;
}


const handleMembership = () => {
  console.log("Navigating to Membership Page with ID:", id); // Debugging
  if (!id) {
    console.error("Error: Trainer ID is undefined!");
    return;
  }
  navigate(`/trainer-packages/${id}`); // ✅ Pass id correctly
};


  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="content-container">
          {/* Go Back Button */}
          <button className="go-back-button" onClick={() => navigate('/trainer-profiles')}>
            <FaArrowLeft />
          </button>

          {/* Header Section with Profile Picture */}
          <header className="header-container">
            <div className="profile-pic-container">
              <img src={trainer.profilePic} alt={trainer.name} className="profile-pic" />
            </div>

            <div className="contact-info">
  <h1>{trainer.name}</h1>
   <section className="rating-section">
    <div className="rating">
      <span className="rating-value">{trainer.rating}</span>
      <span className="rating-star">★</span>
    </div>
  </section>
  <p className="expertise">{trainer.expertise}</p>
 
</div>


            {/* Contact Section */}
            <section className="contact">
              <ul>
                <p>
                  <FaEnvelope /> {trainer.email} {/* Mail Icon */}
                </p>
                <p>
                  <FaPhone /> {trainer.phone} {/* Phone Icon */}
                </p>
                <p>
                  <FaFacebook /> {trainer.socialMedia.facebook} {/* Facebook Icon */}
                </p>
                <p>
                  <FaInstagram /> {trainer.socialMedia.instagram} {/* Instagram Icon */}
                </p>
              </ul>
            </section>
          </header>

          {/* Bottom Container (Biography and Specializations/Certifications) */}
          <div className="bottom-container">
            {/* Biography Section (Bottom Left) */}
            <section className="biography">
              <h2>Biography</h2>
              <p>{trainer.bio}</p>
              <section className="choose-package">
                <button className="choose-package-button" onClick={handleMembership}>
                  Choose Package
                </button>
              </section>
            </section>

            {/* Specializations and Certifications Section (Bottom Right) */}
            <section className="specializations-certifications">
              <div className="specializations">
                <h2>Specializations</h2>
                <div className="specialization-grid">
                  {trainer.specializations.map((spec, index) => (
                    <div key={index} className="specialization-item">
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="certifications">
                <h2>Certifications</h2>
                <div className="certificate-image-container">
                  <img src={trainer.certificate} alt="Certificate" className="certificate-image" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;