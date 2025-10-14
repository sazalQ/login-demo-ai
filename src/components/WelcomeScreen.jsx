import { useState } from 'react';
import './WelcomeScreen.css';
import { sleep, calculateDiscount } from '../services/utils';

const WelcomeScreen = ({ user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="welcome-title">
            {getCurrentGreeting()}, {user?.name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="welcome-subtitle">
            Welcome to Agilechain Dashboard
          </p>
        </div>

        <div className="welcome-body">
          <div className="welcome-message">
            <h2>🎉 Login Successful!</h2>
            <p>You have successfully logged into your account.</p>
            <div className="user-info">
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Login Time:</span>
                <span className="info-value">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <button 
              className="primary-button"
              onClick={() => {
                // Intentional blocking call to demonstrate performance issue
                sleep(300);
                const price = 199.99;
                const discount = calculateDiscount(price);
                alert(`Dashboard coming soon! Discount for ${price} is ${discount}`);
              }}
            >
              Go to Dashboard
            </button>
            <button 
              className="secondary-button"
              onClick={() => alert('Profile feature coming soon!')}
            >
              View Profile
            </button>
          </div>
        </div>

        <div className="welcome-footer">
          <button 
            className="logout-button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button 
                className="confirm-button"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;