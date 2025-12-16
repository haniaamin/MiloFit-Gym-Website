import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/PaymentMethod.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { price = 0, packageName = 'Package' } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handlePay = () => {
    // Simple validation for Visa form fields if Visa selected
    if (paymentMethod === 'Visa') {
      if (!cardNumber.match(/^\d{16}$/)) {
        setError('Card number must be 16 digits.');
        return;
      }
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        setError('Expiry must be in MM/YY format.');
        return;
      }
      if (!cvv.match(/^\d{3}$/)) {
        setError('CVV must be 3 digits.');
        return;
      }
    }

    setError('');
    alert(`Payment of EGP ${price} via ${paymentMethod} successful.`);
navigate('/payment-confirmation', { state: { price, method: paymentMethod, packageName } });
  };

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="content-container">
          <h1>Choose Your Payment Method for {packageName} Package:</h1>
          <div className="paymentmethod-options">
            <button
              className={`paymentmethod-option ${paymentMethod === 'Visa' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Visa')}
            >
              Visa/Mastercard
            </button>
            <button
              className={`paymentmethod-option ${paymentMethod === 'Cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Cash')}
            >
              Cash at Gym Reception
            </button>
          </div>

          {paymentMethod === 'Visa' && (
            <div className="cardmethod-payment">
              <h2>Visa/Mastercard Payment</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePay();
                }}
              >
                <div className='carddetailsmethod'>
                  <label>Card Number:</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234123412341234"
                    required
                  />
                
              
                  <label>Expiry (MM/YY):</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                  <label>CVV:</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    required
                  />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Pay EGP {price}</button>
              </form>
            </div>
          )}

          {paymentMethod === 'Cash' && (
            <div className="cashmethod-payment">
              <h2>Cash at Gym Reception</h2>
              <p>Visit the gym reception to complete your payment in cash.</p>
              <p>Please bring your membership ID for verification.</p>
              <p>Payment must be made within 24 hours to confirm your membership.</p>
              <button
                onClick={() => {
                  alert(`You selected cash payment of EGP ${price}.`);
                  navigate('/payment-confirmation', { state: { price, method: 'Cash' } });
                }}
              >
                Reserve Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
