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
    setErrors({});

    try {
      const response = await fetch('http://localhost:8888/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      });

      let responseData;
      try {
        // Try to parse as JSON first
        responseData = await response.json();
      } catch (parseError) {
        // If not JSON, get as text
        const text = await response.text();
        responseData = { message: text || 'Unknown error occurred' };
      }

      // Log the response for debugging
      console.log('Login response:', response.status, responseData);

      if (response.ok) {
        // Handle successful login
        const designation = responseData.designation;
        
        localStorage.setItem('userRole', designation.trim().toUpperCase());
        localStorage.setItem('employeeName', responseData.employeeName);
        localStorage.setItem('employeeId', responseData.id);
        localStorage.setItem('email', responseData.email);
        if (responseData.clientId) {
          localStorage.setItem('clientId', responseData.clientId);
        }
        
        switch(designation.trim().toUpperCase()) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'HR':
            navigate('/hr/dashboard');
            break;
          default:
            navigate('/employee/dashboard');
        }
      } else {
        // Handle error responses with user-friendly messages
        
        // Check for specific error messages in the response that indicate auth failures
        if (response.status === 500 && 
            (responseData.message?.toLowerCase().includes('invalid') || 
             responseData.error?.toLowerCase().includes('invalid') ||
             responseData.message?.toLowerCase().includes('password') ||
             responseData.error?.toLowerCase().includes('password') ||
             responseData.message?.toLowerCase().includes('credentials') ||
             responseData.error?.toLowerCase().includes('credentials'))) {
          
          setErrors({ api: 'Invalid email or password. Please try again.' });
        } else {
          // Handle other status codes
          switch (response.status) {
            case 400:
              setErrors({ 
                api: responseData.message || 'Invalid request. Please check your information.' 
              });
              break;
            case 401:
              setErrors({ api: 'Invalid email or password. Please try again.' });
              break;
            case 403:
              setErrors({ api: 'Your account is locked. Please contact an administrator.' });
              break;
            case 404:
              setErrors({ api: 'Account not found. Please check your email address.' });
              break;
            case 500:
              setErrors({ 
                api: 'Username or Password is incorrect. Please try again.' 
              });
              break;
            default:
              setErrors({ 
                api: responseData.message || 'Login failed. Please try again later.' 
              });
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Network or connection errors
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        setErrors({ 
          api: 'Cannot connect to the server. Please check your internet connection.' 
        });
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setErrors({ 
          api: 'Server is unreachable. Please try again later or contact IT support.' 
        });
      } else {
        setErrors({ 
          api: 'An unexpected error occurred. Please try again or contact support.' 
        });
      }
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





