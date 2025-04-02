import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import '../../styles/HRDashboard.css';

const HRDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    totalHRs: 0,
    totalClients: 0,
    departmentStats: []
  });

  useEffect(() => {
    // Fetch employees data
    fetch('http://localhost:8085/employees')
      .then(response => response.json())
      .then(data => {
        // Process the data to get analytics
        setAnalytics(prevState => ({
          ...prevState,
          totalEmployees: data.length,
          totalHRs: data.filter(emp => emp.designation === 'HR').length,
          departmentStats: calculateDepartmentStats(data)
        }));
      })
      .catch(error => console.error('Error fetching employees:', error));

    // Fetch clients data
    fetch('http://localhost:8081/clients')
      .then(response => response.json())
      .then(data => {
        setAnalytics(prevState => ({
          ...prevState,
          totalClients: data.length
        }));
      })
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const calculateDepartmentStats = (employees) => {
    const departments = {};
    employees.forEach(emp => {
      const designation = emp.designation || 'Unassigned';
      departments[designation] = (departments[designation] || 0) + 1;
    });
    return Object.entries(departments).map(([name, count]) => ({ name, count }));
  };

  return (
    <div className="hr-dashboard">
      <DashboardHeader />
      <div className="dashboard-content">
        <h1>HR Dashboard</h1>
        
        <div className="analytics-grid">
          {/* Key Metrics */}
          <div className="analytics-card total-employees">
            <h3>Total Employees</h3>
            <div className="metric">
              <span className="number">{analytics.totalEmployees}</span>
              <span className="icon">👥</span>
            </div>
          </div>

          <div className="analytics-card total-hr">
            <h3>HR Staff</h3>
            <div className="metric">
              <span className="number">{analytics.totalHRs}</span>
              <span className="icon">👔</span>
            </div>
          </div>

          <div className="analytics-card total-clients">
            <h3>Total Clients</h3>
            <div className="metric">
              <span className="number">{analytics.totalClients}</span>
              <span className="icon">🏢</span>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="analytics-card department-stats">
            <h3>Designation Distribution</h3>
            <div className="department-list">
              {analytics.departmentStats.map(dept => (
                <div key={dept.name} className="department-item">
                  <span className="dept-name">{dept.name}</span>
                  <span className="dept-count">{dept.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;


