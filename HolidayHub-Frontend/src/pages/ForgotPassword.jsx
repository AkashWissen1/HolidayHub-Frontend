import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import '../styles/Login.css';

// Add this after your imports
const debugEmailJSConfig = () => {
  console.log('EmailJS Configuration:', {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  });
};

// Initialize EmailJS at the component level
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    id: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    debugEmailJSConfig();
  }, []);

  const handleBack = () => {
    navigate('/login');
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.id.trim()) {
      newErrors.id = 'Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors.api) {
      setErrors(prev => ({ ...prev, api: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // First, verify the email and ID with backend
      const response = await fetch('http://localhost:8888/auth/forgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          id: formData.id
        }),
      });

      const responseText = await response.text();

      if (response.ok && responseText !== "Invalid Email!" && responseText !== "Invalid Employee ID!") {
        const emailParams = {
          to_email: formData.email,
          to_name: formData.id,
          current_password: responseText,
        };

        // Modified EmailJS send
        const emailResponse = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams
        );

        console.log('Email sent successfully:', emailResponse);
        setSuccessMessage('Your current password has been sent to your email address.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        if (responseText === "Invalid Email!") {
          setErrors({ api: 'Invalid Email Address' });
        } else if (responseText === "Invalid Employee ID!") {
          setErrors({ api: 'Invalid Employee ID' });
        }
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setErrors({ 
        api: 'Failed to send email. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button onClick={handleBack} className="back-btn">
        ← Back to Login
      </button>
      <div className="login-card">
        <h2>Forgot Password</h2>
        <p className="subtitle">Enter your email and employee ID to receive your password</p>

        {successMessage && (
          <div className="success-message" style={{
            backgroundColor: '#dff0d8',
            color: '#3c763d',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="id">Employee ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className={errors.id ? 'error' : ''}
              placeholder="Enter your employee ID"
              disabled={isLoading}
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
          </div>

          {errors.api && (
            <div className="error-message" style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {errors.api}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <span>Send Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;




