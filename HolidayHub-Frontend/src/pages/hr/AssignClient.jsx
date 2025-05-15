import React, { useState, useEffect } from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/Sidebar";
import "../../styles/AssignClient.css";
import Footer from '../../components/Footer';

const AssignClient = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    clientId: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [username, setUsername] = useState("");
  const [empId, setEmpId] = useState("");
  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("employeeName");
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedEmailId = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmployeeId) setEmpId(storedEmployeeId);
    if (storedEmailId) setEmailId(storedEmailId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:8888/hr/assign', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage({ text: data, isError: false });
        setFormData({ employeeId: '', clientId: '' });
      } else {
        setMessage({ text: data, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Failed to connect to server', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="assign-client-container">
      <DashboardHeader
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
            <p><strong>Designation:</strong> HR</p>
          </div>
        </div>
      )}

      <div className="assign-client-content">
        <Sidebar />
        <div className="assign-client-main">
          <div className="login-card">
            <h2>Assign Client to Employee</h2>
            <p className="subtitle">Enter the Employee and Client details</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={message.isError ? 'error' : ''}
                  placeholder="Enter Employee ID"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="clientId">Client ID</label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={message.isError ? 'error' : ''}
                  placeholder="Enter Client ID"
                  required
                />
              </div>

              {message.text && (
                <div className={message.isError ? 'api-error' : 'success-message'}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                className="login-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Assigning...' : 'Assign Client'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AssignClient;
