import React, { useState } from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/Sidebar";
import "../../styles/AssignClient.css";

const AssignClient = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    clientId: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:8084/hr/assign', {
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

  return (
    <div className="assign-client-container">
      <DashboardHeader />
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
    </div>
  );
};

export default AssignClient;
