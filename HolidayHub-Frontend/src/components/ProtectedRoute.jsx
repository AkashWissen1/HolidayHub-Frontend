import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  // Get the role from localStorage or your auth state management
  const userRole = localStorage.getItem('userRole');
  
  // If there's no role, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role doesn't match the allowed role, redirect to login
  if (userRole.toUpperCase() !== allowedRole.toUpperCase()) {
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;