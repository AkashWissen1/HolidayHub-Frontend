import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import HRDashboard from './pages/hr/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


