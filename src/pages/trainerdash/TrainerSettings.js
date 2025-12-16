import '../../styles/TrainerSettings.css';
import TrainerSidebar from '../../components/TrainerSidebar';
import TrainerNav from '../../components/TrainerNav';
import React, { useState, useEffect } from 'react';
import { FaCamera, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [trainerProfileImage, setTrainerProfileImage] = useState(null);
  const [trainerFormData, setTrainerFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    nationalId: '',
    password: '',
    areaofexpertise: '',
    yearsofexperience: '',
    biography: '',
    facebookacc: '',
    instaacc: '',
    certifications: '',
    certificationsPreview: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [trainerKey, setTrainerKey] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const userData = res.data;
        setUser(userData);

        const key = `${userData.firstName}_${userData.lastName}`;
        setTrainerKey(key);

        const savedData = localStorage.getItem(`trainerProfileData_${key}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setTrainerFormData(parsedData);
          setTrainerProfileImage(parsedData.trainerProfileImage || null);
        }
      } catch (err) {
        console.error('Failed to fetch trainer profile:', err);
      }
    };

    fetchTrainerProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTrainerProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'certifications' && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setTrainerFormData((prevData) => ({
        ...prevData,
        certifications: file,
        certificationsPreview: previewUrl,
      }));
    } else {
      setTrainerFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const trainerDataToSave = {
        ...trainerFormData,
        trainerProfileImage,
      };
      localStorage.setItem(`trainerProfileData_${trainerKey}`, JSON.stringify(trainerDataToSave));
      alert('Profile saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem(`trainerProfileData_${trainerKey}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTrainerFormData(parsedData);
      setTrainerProfileImage(parsedData.trainerProfileImage || null);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(`trainerProfileData_${trainerKey}`);
    navigate('/sign-in');
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <div className="profile-pic-container">
              <img 
                src={trainerProfileImage || "../assets/placeholder.jpg"} 
                className="profile-pic"
                alt="Profile"
              />
              {isEditing && (
                <>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange} 
                    style={{ display: 'none' }} 
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="camera-icon">
                    <FaCamera />
                  </label>
                </>
              )}
            </div>
            
            <div className="trainerforms-container">
              <div className="trainerform-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name"
                    value={trainerFormData.fullName} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.fullName || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={trainerFormData.email} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.email || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={trainerFormData.phoneNumber} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.phoneNumber || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Emergency Contact</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="emergencyContact"
                    placeholder="Enter emergency contact"
                    value={trainerFormData.emergencyContact} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.emergencyContact || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>National ID</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="nationalId"
                    placeholder="Enter national ID"
                    value={trainerFormData.nationalId} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.nationalId || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Password</label>
                {isEditing ? (
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Enter new password"
                    value={trainerFormData.password} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">••••••••</div>
                )}
              </div>
            </div>

            <div className="trainerprofaction-btns">
              {isEditing ? (
                <>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="traineredit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </>
        );
      case 'professional details':
          return (
          <>
            
            <div className="trainerforms-container">
              <div className="trainerform-field">
                <label>Area of Expertise</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="areaofexpertise"
                    placeholder="Your area of expertise"
                    value={trainerFormData.areaofexpertise} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.areaofexpertise || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Years of Experience</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    name="yearsofexperience"
                    placeholder="Years of experience"
                    value={trainerFormData.yearsofexperience} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.yearsofexperience || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Biography</label>
                {isEditing ? (
                  <textarea 
                    type="text" 
                    name="biography"
                    placeholder="Your biography"
                    value={trainerFormData.biography} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.biography || 'Not provided'}</div>
                )}
              </div>
              
              <div className="trainerform-field">
                <label>Facebook Account</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="facebookacc"
                    placeholder="Your facebook account"
                    value={trainerFormData.facebookacc} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.facebookacc || 'Not provided'}</div>
                )}
              </div>
              
             <div className="trainerform-field">
                <label>Instagram Account</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="instaacc"
                    placeholder="Your instagram account"
                    value={trainerFormData.instaacc} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="trainerprofile-info">{trainerFormData.instaacc || 'Not provided'}</div>
                )}
              </div>
              
             <div className="trainerform-field">
             <label>Certifications</label>
  {isEditing ? (
    <input 
      type="file" 
      accept="image/*"
      name="certifications"
      onChange={handleInputChange}
    />
  ) : (
    trainerFormData.certificationsPreview || typeof trainerFormData.certifications === 'string' ? (
      <img 
        src={trainerFormData.certificationsPreview || trainerFormData.certifications} 
        alt="Certification" 
        style={{ width: '150px', height: 'auto' }} 
      />
    ) : (
      <div className="trainerprofile-info">Not provided</div>
    )
  )}
</div>

            </div>

            <div className="trainerprofaction-btns">
              {isEditing ? (
                <>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="traineredit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </>
        );
      case 'logout':
        return (
          <div className="logout-content">
            <h5>Are you sure you want to logout?</h5>
            <div className="logout-actions">
              <button className="cancel-logout" onClick={() => setActiveTab('account')}>Cancel</button>
              <button className="confirm-logout" onClick={handleLogout}>
                <FaSignOutAlt /> SignOut
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="trainer-dash">
      <div className="background-overlay"></div>
      <TrainerSidebar />
      <div className="main-content">
        <TrainerNav />
        <div className="trainersettings-container">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button 
              className={`tab-btn ${activeTab === 'professional details' ? 'active' : ''}`}
              onClick={() => setActiveTab('professional details')}
            >
              Professional Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'logout' ? 'active' : ''}`}
              onClick={() => setActiveTab('logout')}
            >
              Logout
            </button>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TrainerSettings;