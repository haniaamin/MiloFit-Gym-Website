import React, { useState, useEffect } from 'react';
import { FaCamera, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/TraineeProfile.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import SubscriptionOverlay from '../../components/SubscriptionOverlay';
import axios from 'axios';

const TraineeProfile = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  const [userKey, setUserKey] = useState(null);
  const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [membership, setMembership] = useState(null);
  const handleChoosePackage = (price, packageName) => {
    navigate('/payment', { state: { price, packageName } });
  };
  
  const [activeTab, setActiveTab] = useState('account');
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    nationalId: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    workoutTimes: [],
    favoriteWorkouts: [],
    preferredTrainer: 'No Preference',
    dietType: 'No Restrictions',
    allergies: [],
    fitnessGoals: [],
    notificationFrequency: 'Daily',
    communicationMethod: 'Email',
    receivePromotions: false
  });
  const [paymentSettings, setPaymentSettings] = useState({
    autoPayout: false,
    notifyPayments: false
  });
  const [paymentCredentials, setPaymentCredentials] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Step 1: Get logged-in user's ID
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUserId = res.data._id;
        setUserId(fetchedUserId);

        // Step 2: Get user's subscription
        const subRes = await axios.get(`http://localhost:5000/api/subscriptions/${fetchedUserId}`);
        setMembership(subRes.data);
      } catch (err) {
        console.error('Error fetching user or subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
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
        setUserKey(key);

        // Load profile data
        const savedData = localStorage.getItem(`profileData_${key}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          setProfileImage(parsedData.profileImage || null);
        }

        // Load preferences
        const savedPrefs = localStorage.getItem(`userPreferences_${key}`);
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }

        // Load payment settings
        const savedPaymentSettings = localStorage.getItem(`paymentSettings_${key}`);
        if (savedPaymentSettings) {
          setPaymentSettings(JSON.parse(savedPaymentSettings));
        }

        // Load payment credentials
        const savedPaymentCredentials = localStorage.getItem(`paymentCredentials_${key}`);
        if (savedPaymentCredentials) {
          setPaymentCredentials(JSON.parse(savedPaymentCredentials));
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatCardNumber = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\s+/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setPaymentCredentials(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => {
      if (name === 'receivePromotions') {
        return { ...prev, [name]: checked };
      }

      const currentValue = prev[name] || [];
      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: checked
            ? [...currentValue, value]
            : currentValue.filter(item => item !== value)
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handlePaymentSettingChange = (e) => {
    const { name, checked } = e.target;
    setPaymentSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    try {
      const dataToSave = { ...formData, profileImage };
      localStorage.setItem(`profileData_${userKey}`, JSON.stringify(dataToSave));
      alert("Profile saved successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to save profile");
    }
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(`userPreferences_${userKey}`, JSON.stringify(preferences));
      alert("Preferences saved successfully");
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert("Failed to save preferences");
    }
  };

  const handleSavePaymentSettings = () => {
    try {
      localStorage.setItem(`paymentSettings_${userKey}`, JSON.stringify(paymentSettings));
      alert("Payment settings saved successfully");
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert("Failed to save payment settings");
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setSaveStatus({ loading: true, success: false, error: null });

    const { cardholderName, cardNumber, expiryDate, cvv } = paymentCredentials;
    if (!cardholderName.trim() || cardNumber.replace(/\s/g, '').length !== 16 || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
      setSaveStatus({
        loading: false,
        success: false,
        error: 'Please fill in all payment fields correctly.'
      });
      return;
    }

    try {
      await new Promise(res => setTimeout(res, 1000));
      localStorage.setItem(`paymentCredentials_${userKey}`, JSON.stringify(paymentCredentials));
      setSaveStatus({ loading: false, success: true, error: null });
      alert('Payment details saved successfully!');
      setPaymentCredentials({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
    } catch (err) {
      setSaveStatus({ loading: false, success: false, error: 'Failed to save payment details' });
      console.error('Save error:', err);
    }
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem(`profileData_${userKey}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      setProfileImage(parsedData.profileImage || null);
    }
    setIsEditing(false);
  };

  const handleCancelPayment = () => {
    setPaymentCredentials({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
    setSaveStatus({ loading: false, success: false, error: null });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/sign-in');
  };

  const isChecked = (name, value) => {
    return preferences[name] && preferences[name].includes(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <div className="profile-pic-container">
              <img 
                src={profileImage || "../assets/placeholder.jpg"} 
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
            
            <div className="forms-container">
              <div className="form-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">{formData.fullName || 'Not provided'}</div>
                )}
              </div>
              
              <div className="form-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">{formData.email || 'Not provided'}</div>
                )}
              </div>
              
              <div className="form-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">{formData.phoneNumber || 'Not provided'}</div>
                )}
              </div>
              
              <div className="form-field">
                <label>Emergency Contact</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="emergencyContact"
                    placeholder="Enter emergency contact"
                    value={formData.emergencyContact} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">{formData.emergencyContact || 'Not provided'}</div>
                )}
              </div>
              
              <div className="form-field">
                <label>National ID</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="nationalId"
                    placeholder="Enter national ID"
                    value={formData.nationalId} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">{formData.nationalId || 'Not provided'}</div>
                )}
              </div>
              
              <div className="form-field">
                <label>Password</label>
                {isEditing ? (
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password} 
                    onChange={handleInputChange} 
                  />
                ) : (
                  <div className="profile-info">••••••••</div>
                )}
              </div>
            </div>

            <div className="profaction-btns">
              {isEditing ? (
                <>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </>
        );
      case 'membership':
        return (
          <div className="membership-content">
                <div className="current-membership">
            {loading ? (
              <p>Loading...</p>
            ) : membership ? (
              <div className="membership-info">
                <h4>Current Membership:</h4>
                <h5>"{membership.packageName}"</h5>
                <p>Valid until: {new Date(membership.validUntil).toLocaleDateString()}</p>
                <button onClick={() => handleChoosePackage(membership.price, membership.packageName)}>
                  Renew your membership now
                </button>
              </div>
            ) : (
              <p>You don't have an active membership.</p>
            )}
          </div>
            
            <div className="membership-columns-container">
              <div className="payment-container">
                <div className="payment-header">
                  <h4>Payments</h4>
                  <div className="tooltip">
                    <FaQuestionCircle className="tooltip-icon" />
                    <span className="tooltip-text">You can change your payment credentials here.</span>
                  </div>
                </div>
                
                <div className="payment-settings">
                  <div className="toggle-option">
                    <div className="toggle-label-with-tooltip">
                      <label htmlFor="autoPayout">Enable Auto Payout</label>
                      <div className="tooltip">
                        <FaQuestionCircle className="tooltip-icon" />
                        <span className="tooltip-text">Autopayout occurs at the end of each month</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="autoPayout"
                        name="autoPayout"
                        checked={paymentSettings.autoPayout}
                        onChange={handlePaymentSettingChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="toggle-option">
                    <div className="toggle-label-with-tooltip">
                      <label htmlFor="notifyPayments">Notify New Payments</label>
                      <div className="tooltip">
                        <FaQuestionCircle className="tooltip-icon" />
                        <span className="tooltip-text">You will be notified when a payment has been made</span>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="notifyPayments"
                        name="notifyPayments"
                        checked={paymentSettings.notifyPayments}
                        onChange={handlePaymentSettingChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="payment-credentials">
                    <div className="form-row">
                      <label className="form-label">Cardholder Name</label>
                      <input 
                        type="text" 
                        name="cardholderName"
                        className="form-input"
                        value={paymentCredentials.cardholderName} 
                        placeholder="Hania Mohamed" 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text"
                        name="cardNumber"
                        className="form-input"
                        inputMode="numeric"  
                        value={paymentCredentials.cardNumber}
                        placeholder="1234 5678 9012 3456" 
                        onChange={formatCardNumber}
                        maxLength="19"
                      />
                    </div>

                    <div className="form-row-group">
                      <div className="form-row">
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="text"
                          name="expiryDate"
                          className="form-input"
                          value={paymentCredentials.expiryDate}
                          placeholder="MM/YY" 
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-row">
                        <label className="form-label">CVV</label>
                        <input 
                          type="password"
                          name="cvv"
                          className="form-input"
                          value={paymentCredentials.cvv}
                          placeholder="•••" 
                          onChange={handleChange}
                        />
                        
                      </div>
                    </div>
                    
                    <div className="payment-actions">
                      <button className="cancel-btn" onClick={handleCancelPayment}>
                        Cancel
                      </button>
                      <button className={`save-btn ${saveStatus.error ? 'error-state' : ''}`} onClick={handleSavePayment} disabled={saveStatus.loading} >
                      {saveStatus.loading ? (
      <span className="loading-spinner">🌀</span>
    ) : (
      'Save Changes'
    )}                      </button>
                      {saveStatus.error && (
    <div className="save-status error">
      <span className="icon">⚠️</span>
      {saveStatus.error}
    </div>
  )}
   
   {saveStatus.success && (
    <div className="save-status success">
      <span className="icon">✓</span>
      Payment details saved successfully!
    </div>
  )}
  
  {saveStatus.loading && (
    <div className="save-status loading">
      <span className="icon">⏳</span>
      Saving your payment details...
    </div>
  )}

                    </div>
                  </div>
                </div>
              </div>
              
              <div className="billing-container">
                <div className="billing-header">
                  <h4>Billing History</h4>
                  <div className="tooltip">
                    <FaQuestionCircle className="tooltip-icon" />
                    <span className="tooltip-text">You can view your billing history here.</span>
                  </div>
                </div>
                
                <div className="billing-history">
                  <div className="billing-item">
                    <h5>Premium Monthly Membership</h5>
                    <p>Amount: EGP 3000</p>
                    <p>Date: 15 October 2024</p>
                    <p>Status: Paid</p>
                  </div>
                  
                  <div className="billing-item">
                    <h5>Session with Coach Ahmed Hamasa</h5>
                    <p>Amount: EGP 200</p>
                    <p>Date: 25 October 2024</p>
                    <p>Status: Paid</p>
                  </div>
                  
                  <div className="billing-item">
                    <h5>New Year Discount (20% Off)</h5>
                    <p>Amount: -EGP 1,600</p>
                    <p>Date: 1 January 2025</p>
                    <p>Status: Applied</p>
                  </div>
                  
                  <div className="billing-item">
                    <h5>Referral Bonus</h5>
                    <p>Amount: -EGP 200</p>
                    <p>Date: 15 September 2024</p>
                    <p>Status: Applied</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="preferences-content">            
            <div className="preference-section">
              <h5>Preferred Workout Times:</h5>
              <div className="checkbox-group">
                {['Morning (8 AM - 10 AM)', 'Afternoon (12 PM - 3 PM)', 'Evening (6 PM - 9 PM)'].map(time => (
                  <label key={time} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="workoutTimes"
                      value={time}
                      checked={isChecked('workoutTimes', time)}
                      onChange={handlePreferenceChange}
                    />
                    <span className="checkmark"></span>
                    {time}
                  </label>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <h5>Favorite Workout Types:</h5>
              <div className="checkbox-group">
                {['Cardio', 'Yoga/Pilates', 'HIT', 'Strength Training'].map(workout => (
                  <label key={workout} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="favoriteWorkouts"
                      value={workout}
                      checked={isChecked('favoriteWorkouts', workout)}
                      onChange={handlePreferenceChange}
                    />
                    <span className="checkmark"></span>
                    {workout}
                  </label>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <div className="inline-preferences">
                <div className="preference-group">
                  <h5>Preferred Trainer:</h5>
                  <select 
                    name="preferredTrainer" 
                    className="preference-select"
                    value={preferences.preferredTrainer}
                    onChange={handlePreferenceChange}
                  >
                    <option>Coach Ali</option>
                    <option>Coach Sarah</option>
                    <option>Coach Islam</option>
                    <option>Coach Ahmed</option>
                    <option>No Preference</option>
                  </select>
                </div>
                <div className="preference-group">
                  <h5>Diet Type:</h5>
                  <select 
                    name="dietType" 
                    className="preference-select"
                    value={preferences.dietType}
                    onChange={handlePreferenceChange}
                  >
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Gluten-Free</option>
                    <option>Low-Carb</option>
                    <option>No Restrictions</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="preference-section">
              <h5>Allergies or Intolerances:</h5>
              <div className="checkbox-group">
                {['Dairy', 'Nuts', 'Shellfish', 'None'].map(allergy => (
                  <label key={allergy} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="allergies"
                      value={allergy}
                      checked={isChecked('allergies', allergy)}
                      onChange={handlePreferenceChange}
                    />
                    <span className="checkmark"></span>
                    {allergy}
                  </label>
                ))}
                <label className="checkbox-option">
                  <input 
                    type="checkbox" 
                    name="allergies" 
                    value="Other"
                    checked={isChecked('allergies', 'Other')}
                    onChange={handlePreferenceChange}
                  />
                  <span className="checkmark"></span>
                  Other
                </label>
              </div>
            </div>

            <div className="preference-section">
              <h5>Fitness Goals:</h5>
              <div className="checkbox-group">
                {['Weight Loss', 'Muscle Gain', 'General Fitness', 'Improve Flexibility', 'Increase Strength'].map(goal => (
                  <label key={goal} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="fitnessGoals"
                      value={goal}
                      checked={isChecked('fitnessGoals', goal)}
                      onChange={handlePreferenceChange}
                    />
                    <span className="checkmark"></span>
                    {goal}
                  </label>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <div className="notification-preferences-row">
                <div className="preference-item">
                  <label>Notification Frequency:</label>
                  <select 
                    name="notificationFrequency" 
                    className="preference-select"
                    value={preferences.notificationFrequency}
                    onChange={handlePreferenceChange}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Only Important Updates</option>
                  </select>
                </div>
                <div className="preference-item">
                  <label>Communication Method:</label>
                  <select 
                    name="communicationMethod" 
                    className="preference-select"
                    value={preferences.communicationMethod}
                    onChange={handlePreferenceChange}
                  >
                    <option>Email</option>
                    <option>SMS</option>
                  </select>
                </div>
                <div className="preference-item">
                  <label>Receive Promotions:</label>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="receivePromotions"
                      checked={preferences.receivePromotions}
                      onChange={handlePreferenceChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <button className="save-prefs-btn" onClick={handleSavePreferences}>
              Save Preferences
            </button>
          </div>
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
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="traineeprofile-container">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button 
              className={`tab-btn ${activeTab === 'membership' ? 'active' : ''}`}
              onClick={() => setActiveTab('membership')}
            >
              Membership Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
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

export default TraineeProfile;