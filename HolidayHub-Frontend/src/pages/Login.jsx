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

    try {
      const response = await fetch('http://localhost:8083/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      });

      if (response.ok) {
        const designation = await response.text(); // Change this to handle text response
        
        // Store the designation as the role
        localStorage.setItem('userRole', designation.toUpperCase());
        
        switch(designation.toUpperCase()) {
          case 'HR':
            navigate('/hr/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'EMPLOYEE':
            navigate('/employee/dashboard');
            break;
          default:
            setErrors({ api: 'Invalid designation received from server' });
        }
      } else {
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
      <button className="back-button" onClick={() => navigate('/')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>
      <div className="login-card">
        <h2>Please enter your credentials to login</h2>

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



