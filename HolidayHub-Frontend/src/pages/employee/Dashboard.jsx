import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <DashboardHeader />
      <div className="dashboard-content">
        <h1>Employee Dashboard</h1>
        <p>Welcome to the Employee Dashboard</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
