import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginDto, setLoginDto] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!loginDto.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginDto.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginDto.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    console.log('Sending login DTO:', loginDto);

    try {
      const response = await fetch('http://localhost:8083/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      });

      if (response.ok) {
        const userData = await response.json(); // Parse as JSON instead of text
        console.log('Received user data:', userData);
        
        const designation = userData.designation; // Extract designation from user data
        
        // Store user data in localStorage
        localStorage.setItem('userRole', designation.trim().toUpperCase());
        localStorage.setItem('employeeName', userData.employeeName);
        localStorage.setItem('employeeId', userData.id);
        localStorage.setItem('email', userData.email);
        if (userData.clientId) {
          localStorage.setItem('clientId', userData.clientId);
        }
        
        // Navigate based on role
        switch(designation.trim().toUpperCase()) {
          case 'HR':
            console.log('Navigating to HR dashboard');
            navigate('/hr/dashboard');
            break;
          case 'ADMIN':
            console.log('Navigating to Admin dashboard');
            navigate('/admin/dashboard');
            break;
          case 'EMPLOYEE':
            console.log('Navigating to Employee dashboard');
            navigate('/employee/dashboard');
            break;
          default:
            console.error('Invalid designation:', designation);
            setErrors({ api: 'Invalid designation received from server' });
        }
      } else {
        console.error('Login failed:', response.status);
        setErrors({ api: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button onClick={handleBack} className="back-btn">
        ← Back to Home
      </button>
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your credentials to login</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginDto.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginDto.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.api && <div className="api-error">{errors.api}</div>}

          <button 
            type="submit" 
            className="login-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;





