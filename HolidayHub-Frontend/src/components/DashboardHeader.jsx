import React from 'react';
import '../styles/Header.css'; 
import logo from '../assets/logo.svg'; 

const Header = ({ onLogout, onProfileClick }) => {
  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <img src={logo} alt="Holiday Hub Logo" className="logo-image" />
      </div>
      <div className="user-options">
        <div className="profile-dropdown">
          <button className="profile-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              className="profile-icon"
            />
          </button>
          <div className="dropdown-content">
            <a onClick={onProfileClick}>View Profile</a>
            <a href="/change-password">Change Password</a>
            <a onClick={onLogout}>Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
