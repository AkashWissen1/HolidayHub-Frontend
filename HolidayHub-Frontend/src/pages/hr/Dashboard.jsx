import React, { useState, useEffect } from 'react';
import '../../styles/HRDashboard.css';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

const HRDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalClients: 0,
    totalEmployees: 0,
    totalHolidays: 0,
    upcomingHolidays: 0,
    employeeDistribution: []
  });

  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [username, setUsername] = useState("");
  const [empId, setEmpId] = useState("");
  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    const employeeName = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedEmailId = localStorage.getItem("email");

    if (employeeName) setUsername(employeeName);
    if (storedEmployeeId) setEmpId(storedEmployeeId);
    if (storedEmailId) setEmailId(storedEmailId);
  }, []);

  useEffect(() => {
    // Fetch clients first
    fetch('http://localhost:8081/clients')
      .then(response => response.json())
      .then(clientsData => {
        const clientsMap = clientsData.reduce((acc, client) => {
          acc[client.id] = {
            clientId: client.id,
            clientName: client.clientName,
            employeeCount: 0
          };
          return acc;
        }, {});

        // Fetch all employees
        fetch('http://localhost:8085/employees')
          .then(response => response.json())
          .then(employeesData => {
            employeesData.forEach(employee => {
              if (clientsMap[employee.clientId]) {
                clientsMap[employee.clientId].employeeCount++;
              }
            });

            const distribution = Object.values(clientsMap);

            setDashboardStats(prev => ({
              ...prev,
              totalClients: clientsData.length,
              totalEmployees: employeesData.length,
              employeeDistribution: distribution
            }));
          })
          .catch(error => console.error('Error fetching employees:', error));
      })
      .catch(error => console.error('Error fetching clients:', error));

    // Fetch holidays
    fetch('http://localhost:8082/holidays')
      .then(response => response.json())
      .then(data => {
        const today = new Date();
        const upcoming = data.filter(holiday => new Date(holiday.holidayDate) >= today);

        setDashboardStats(prev => ({
          ...prev,
          totalHolidays: data.length,
          upcomingHolidays: upcoming.length
        }));
      })
      .catch(error => console.error('Error fetching holidays:', error));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader
        username={username}
        emailId={emailId}
        empId={empId}
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileOverlay(true)}
      />

      {showProfileOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowProfileOverlay(false)}>X</button>
            <div className="overlay-title">Profile Details</div>
            <p><strong>Employee ID:</strong> {empId}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email ID:</strong> {emailId}</p>
            <p><strong>Designation:</strong> Employee</p>
          </div>
        </div>
      )}

      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="greeting">Welcome, {username}</h1>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Clients</h3>
              <div className="metric">
                <span className="number">{dashboardStats.totalClients}</span>
                <span className="icon">🏢</span>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Total Employees</h3>
              <div className="metric">
                <span className="number">{dashboardStats.totalEmployees}</span>
                <span className="icon">👥</span>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Total Holidays</h3>
              <div className="metric">
                <span className="number">{dashboardStats.totalHolidays}</span>
                <span className="icon">📅</span>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Upcoming Holidays</h3>
              <div className="metric">
                <span className="number">{dashboardStats.upcomingHolidays}</span>
                <span className="icon">🎉</span>
              </div>
            </div>

            <div className="analytics-card distribution-stats">
              <h3>Employee Distribution by Client</h3>
              <div className="distribution-list">
                {dashboardStats.employeeDistribution.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <div className="distribution-info">
                      <span className="client-name">{item.clientName}</span>
                      <span className="employee-count">{item.employeeCount}</span>
                    </div>
                    <div className="distribution-bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.employeeCount / dashboardStats.totalEmployees * 100) || 0}%`,
                          backgroundColor: '#7a00ff'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HRDashboard;
