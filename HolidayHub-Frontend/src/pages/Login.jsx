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
    console.log('Sending login DTO:', loginDto);

    try {
      const response = await fetch('http://localhost:8083/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      });

      const result = await response.json();
      const role = result.designation; 
      console.log('Backend response:', { status: response.status, result });

      if (response.ok) {
        console.log('Login successful.');
        //console.log('Role:', role);
        //console.log('Employee Name:', result.employeeName);
        //console.log('Employee ID:', result.id);
        localStorage.setItem("username", result.employeeName);
        localStorage.setItem("employeeId", result.id);  
        localStorage.setItem("email", result.email);
        switch(role.toUpperCase()) {
          case 'HR':
            navigate('/hr/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'EMPLOYEE':
            localStorage.setItem("clientId", result.clientId); 
            navigate('/employee/dashboard');
            break;
          default:
            setErrors({ api: 'Invalid role received from server' });
        }
      } else {
        console.log('Login failed. Server response:', role);
        setErrors({ api: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
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
          <a href="/register">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;







