import React, { useState, useEffect } from 'react';
import '../../styles/HRDashboard.css';
import logo from '../../assets/logo.svg';

const HRDashboard = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    totalEmployees: 150,
    onLeaveToday: 5,
    pendingRequests: 8,
    approvedLeaves: 45
  });

  useEffect(() => {
    const storedName = localStorage.getItem('employeeName');
    if (storedName) setEmployeeName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('clientId');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Holiday Hub Logo" className="logo-image" />
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

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="greeting">Welcome, {employeeName}</h1>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Employees</h3>
            <div className="metric">
              <span className="number">{analyticsData.totalEmployees}</span>
              <span className="icon">👥</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>On Leave Today</h3>
            <div className="metric">
              <span className="number">{analyticsData.onLeaveToday}</span>
              <span className="icon">🏖️</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Pending Requests</h3>
            <div className="metric">
              <span className="number">{analyticsData.pendingRequests}</span>
              <span className="icon">⏳</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Approved Leaves</h3>
            <div className="metric">
              <span className="number">{analyticsData.approvedLeaves}</span>
              <span className="icon">✅</span>
            </div>
          </div>

          {/* Department Stats */}
          <div className="analytics-card department-stats">
            <h3>Department Statistics</h3>
            <div className="department-list">
              <div className="department-item">
                <span className="dept-name">Engineering</span>
                <span className="dept-count">45</span>
              </div>
              <div className="department-item">
                <span className="dept-name">Marketing</span>
                <span className="dept-count">23</span>
              </div>
              <div className="department-item">
                <span className="dept-name">Sales</span>
                <span className="dept-count">34</span>
              </div>
              <div className="department-item">
                <span className="dept-name">Finance</span>
                <span className="dept-count">18</span>
              </div>
              <div className="department-item">
                <span className="dept-name">HR</span>
                <span className="dept-count">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
