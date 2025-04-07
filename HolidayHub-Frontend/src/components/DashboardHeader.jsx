import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardHeader.css';
import logoImage from '../assets/logo.svg';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('employeeName');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('clientId');
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <img src={logoImage} alt="Holiday Hub Logo" className="logo-image" />
      </div>

      <div className="user-options">
        <span className="username">Hi, {employeeName}</span>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button className="profile-btn">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              alt="Profile" 
              className="profile-icon" 
            />
          </button>
          <div className="dropdown-content">
            <a href="/profile">View Profile</a>
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;


