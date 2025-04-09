import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import HRDashboard from './pages/hr/Dashboard';
import ClientManagement from './pages/hr/ClientManagement'; // Import ClientManagement page
import SearchByID from './pages/hr/SearchByID'; 
import SearchByClient from './pages/hr/SearchByClient'; 
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import EmployeeManagement from './pages/hr/EmployeeManagement';
import AssignClient from './pages/hr/AssignClient';
import HolidayManagement from './pages/hr/HolidayManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route 
            path="/hr/dashboard" 
            element={
              <ProtectedRoute allowedRole="HR">
                <HRDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/clients" 
            element={
              <ProtectedRoute allowedRole="HR">
                <ClientManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/hr/employees" 
            element={
              <ProtectedRoute allowedRole="HR">
                <EmployeeManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/holidays" 
            element={
              <ProtectedRoute allowedRole="HR">
                <HolidayManagement/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/search-by-employee" 
            element={
              <ProtectedRoute allowedRole="HR">
                <SearchByID />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/search-by-client" 
            element={
              <ProtectedRoute allowedRole="HR">
                <SearchByClient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRole="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/assign-client" 
            element={
              <ProtectedRoute allowedRole="HR">
                <AssignClient />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
