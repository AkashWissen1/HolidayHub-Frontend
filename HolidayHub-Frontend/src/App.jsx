import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import HRDashboard from './pages/hr/Dashboard';
import ClientManagement from './pages/hr/ClientManagement'; // Import ClientManagement page
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
