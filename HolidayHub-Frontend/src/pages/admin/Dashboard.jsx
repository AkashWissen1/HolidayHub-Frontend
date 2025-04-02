import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <DashboardHeader />
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
