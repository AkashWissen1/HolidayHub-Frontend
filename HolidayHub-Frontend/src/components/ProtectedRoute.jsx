import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  console.log('Protected Route Check:', {
    userRole,
    allowedRole,
    hasAccess: allowedRole === 'EMPLOYEE' ? 
      userRole !== 'ADMIN' && userRole !== 'HR' : 
      userRole === allowedRole
  });

  if (!userRole) {
    console.log('No user role found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Special handling for EMPLOYEE routes - allow any role that's not ADMIN or HR
  if (allowedRole === 'EMPLOYEE') {
    if (userRole === 'ADMIN' || userRole === 'HR') {
      console.log('Admin/HR trying to access employee route, redirecting to login');
      return <Navigate to="/login" replace />;
    }
  } 
  // For ADMIN and HR routes, require exact role match
  else if (userRole !== allowedRole) {
    console.log('Unauthorized access attempt, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;


