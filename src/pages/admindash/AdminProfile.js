import '../../styles/AdminProfile.css';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNav from '../../components/AdminNav';
import React, { useState, useEffect } from 'react';
import { FaCamera, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [adminprofileImage, setAdProfileImage] = useState(null);
  const [adminformData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    nationalId: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
 

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedadminData = localStorage.getItem('adminprofileData');
    if (savedadminData) {
      const parsedadminData = JSON.parse(savedadminData);
      setFormData(parsedadminData);
      if (parsedadminData.adminprofileImage) {
        setAdProfileImage(parsedadminData.adminprofileImage);
      }
    }

  

    
  }, []);

   const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdProfileImage(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

  const handleSave = async () => {
    try {
      const admindataToSave = {
        ...adminformData,
        adminprofileImage
      };
      localStorage.setItem('adminprofileData', JSON.stringify(admindataToSave));
      alert("Profile saved successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to save profile");
    }
  };

 

  

  const handleCancel = () => {
    const savedadminData = localStorage.getItem('adminprofileData');
    if (savedadminData) {
      const parsedadminData = JSON.parse(savedadminData);
      setFormData(parsedadminData);
      if (parsedadminData.adminprofileImage) {
        setAdProfileImage(parsedadminData.adminprofileImage);
      }
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('adminprofileData'); 
    navigate('/sign-in');
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <div className="profile-pic-container">
              <img 
                src={adminprofileImage || "../assets/placeholder.jpg"} 
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
            
            <div className="adminforms-container">
              <div className="adminform-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name"
                    value={adminformData.fullName} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">{adminformData.fullName || 'Not provided'}</div>
                )}
              </div>
              
              <div className="adminform-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={adminformData.email} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">{adminformData.email || 'Not provided'}</div>
                )}
              </div>
              
              <div className="adminform-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={adminformData.phoneNumber} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">{adminformData.phoneNumber || 'Not provided'}</div>
                )}
              </div>
              
              <div className="adminform-field">
                <label>Emergency Contact</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="emergencyContact"
                    placeholder="Enter emergency contact"
                    value={adminformData.emergencyContact} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">{adminformData.emergencyContact || 'Not provided'}</div>
                )}
              </div>
              
              <div className="adminform-field">
                <label>National ID</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="nationalId"
                    placeholder="Enter national ID"
                    value={adminformData.nationalId} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">{adminformData.nationalId || 'Not provided'}</div>
                )}
              </div>
              
              <div className="adminform-field">
                <label>Password</label>
                {isEditing ? (
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Enter new password"
                    value={adminformData.password} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="adminprofile-info">••••••••</div>
                )}
              </div>
            </div>

            <div className="adminprofaction-btns">
              {isEditing ? (
                <>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="adminedit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
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
    <div className="admin-dash">
      <div className="background-overlay"></div>
      <AdminSidebar />
      <div className="main-content">
        <AdminNav />
        <div className="adminprofile-container">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
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

export default AdminProfile;