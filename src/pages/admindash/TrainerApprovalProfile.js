import React , {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/TrainerApprovalProfile.css';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNav from '../../components/AdminNav';
import coach2 from '../../assets/coach2.png';
import coach3 from '../../assets/coach3.png';
import coach4 from '../../assets/coach.png';
import certificate1 from '../../assets/certificate1.png';
import { FaArrowLeft, FaEnvelope, FaPhone, FaFacebook, FaInstagram } from 'react-icons/fa';

const TrainerApprovalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // 'pending', 'approved', or 'rejected'


  // Mock data for trainers
  const trainers = [
    {
      id: '1',
      name: 'Islam Shalaby',
      expertise: 'Personal Trainer',
      rating: 5,
      bio: 'Dr. Islam Shalaby is a certified strength and conditioning coach with over 10 years of experience. He creates personalized training programs for all fitness levels. Specializing in strength, conditioning, and CrossFit, he helps clients achieve their goals. His expertise and dedication make him a trusted fitness professional.',
      email: 'islamshalaby@gmail.com',
      phone: '‪+20 010 1234 5678‬',
      socialMedia: {
        facebook: 'Islam Shalaby',
        instagram: 'coach_islam_shalaby',
      },
      specializations: ['Strength', '- Conditioning', '- CrossFit', '- BodyBuilding'],
      profilePic: coach2,
      certificate: certificate1,
      status: 'pending'
    },
    {
      id: '2',
      name: 'Ahmed Hamasa',
      expertise: 'Boxing Trainer',
      rating: 4,
      bio: 'Ahmed Hamasa is a professional boxing trainer with over 8 years of experience in the field. He has trained both amateur and professional boxers, helping them improve their technique, strength, and endurance. Ahmed is passionate about teaching the art of boxing and believes in the power of discipline and hard work to achieve success.',
      email: 'ahmedr@gmail.com',
      phone: '‪+20 010 9876 5432‬',
      socialMedia: {
        facebook: 'Ahmed Hamasa',
        instagram: 'coach_ahmed_hamasa',
      },
      specializations: ['Boxing', '- Strength Training', '- Endurance', '- Defense Techniques'],
      profilePic: coach3,
      certificate: certificate1,
      status: 'pending'

    },
    {
      id: '3',
      name: 'Sarah',
      expertise: 'Yoga Trainer',
      rating: 4.5,
      bio: 'Sarah is a certified yoga instructor with over 7 years of experience in teaching yoga and mindfulness. She specializes in Hatha, Vinyasa, and Yin yoga, helping her students improve flexibility, strength, and mental clarity. Sarah believes in the holistic benefits of yoga and is dedicated to creating a peaceful and inclusive environment for her students.',
      email: 'sarah@gmail.com',
      phone: '‪+20 010 1234 5678‬',
      socialMedia: {
        facebook: 'Sarah Yoga',
        instagram: 'yoga_with_sarah',
      },
      specializations: ['Hatha Yoga', '- Vinyasa Yoga', '- Yin Yoga', '- Mindfulness'],
      profilePic: coach4,
      certificate: certificate1,
      status: 'pending'

    },
  ];

  // Find the trainer by ID
  const trainer = trainers.find((t) => t.id === String(id));

  if (!trainer) {
    return <div>Trainer not found</div>;
  }

  if (status !== 'pending') {
    return (
      <div className="status-message">
        <h2>Trainer {status} successfully!</h2>
        <p>Redirecting back to approval list...</p>
      </div>
    );
  }
  const handleApprove = () => {
    const updatedTrainers = trainers.map(t => 
      t.id === id ? {...t, status: 'approved'} : t
    );
    localStorage.setItem('trainers', JSON.stringify(updatedTrainers));
    setStatus('approved');
    setTimeout(() => navigate('/trainer-approval'), 3000);
  };

  const handleReject = () => {
    setStatus('rejected');
    setTimeout(() => {
      navigate('/trainer-approval');
    }, 3000);
  };

  return (
    <div className="admin-dash">
      {/* Background Image with Overlay */}
      <div className="background-overlay"></div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <AdminNav />

        {/* Container for Content */}
        <div className="trainerapprove-container">
          {/* Go Back Button */}
          <button className="go-back-button" onClick={() => navigate('/trainer-approval')}>
            <FaArrowLeft />
          </button>

          {/* Header Section with Profile Picture */}
          <header className="header-container">
            <div className="profile-pic-container">
              <img src={trainer.profilePic} alt={trainer.name} className="profile-pic" />
            </div>

            <div className="contact-info">
              <h1>{trainer.name}</h1>
              <p className="expertise">{trainer.expertise}</p>
            </div>

            <section className="rating-section">
              <div className="rating">
                <span className="rating-value">{trainer.rating}</span>
                <span className="rating-star">★</span>
              </div>
            </section>

            {/* Contact Section */}
            <section className="contact">
              <ul>
                <p>
                  <FaEnvelope /> {trainer.email}
                </p>
                <p>
                  <FaPhone /> {trainer.phone}
                </p>
                <p>
                  <FaFacebook /> {trainer.socialMedia.facebook}
                </p>
                <p>
                  <FaInstagram /> {trainer.socialMedia.instagram}
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
              <section className="approval-buttons">
                <button className="approve-button" onClick={handleApprove}>
                  Approve
                </button>
                <button className="reject-button" onClick={handleReject}>
                  Reject
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

export default TrainerApprovalProfile;



