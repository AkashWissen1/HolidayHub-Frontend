import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  console.log('Protected Route Check:', {
    userRole,
    allowedRole,
    hasAccess: userRole?.toUpperCase() === allowedRole?.toUpperCase()
  });

  if (!userRole) {
    console.log('No user role found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (userRole.toUpperCase() !== allowedRole.toUpperCase()) {
    console.log('Unauthorized access attempt, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

