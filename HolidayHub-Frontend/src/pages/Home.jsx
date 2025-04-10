import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import calendarImage from '../assets/calendar.svg';
import emailjs from '@emailjs/browser';
import aboutImage from '../assets/about-team.svg';
import '../styles/Home.css';

const Home = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          message: contactForm.message,
        }
      );
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home">
      <Header />
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              The Holiday Tracker<br />
              Every Team Trusts
            </h1>
            <p>
              Holiday Hub gives your team complete visibility, accurate reporting, and an easy way to manage everything in one central hub. When it comes to holiday tracking, <br /> we don't just do it all; <strong>we do it best</strong>.
            </p>
            <button className="cta-btn" onClick={handleLoginClick}>Let's Get Started</button>
          </div>
          <div className="hero-image">
            <img src={calendarImage} alt="Calendar illustration" />
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="card-icon">📅</div>
            <h3>Holiday Management</h3>
            <p>Streamlined holiday request and approval system with automated tracking and notifications.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">👥</div>
            <h3>Employee Management</h3>
            <p>Comprehensive employee database with profile management and client assignment capabilities.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🏢</div>
            <h3>Client Management</h3>
            <p>Efficient client database management with contact information and employee assignments.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">📊</div>
            <h3>Analytics & Reporting</h3>
            <p>Detailed reports and insights on holiday patterns and employee-client relationships.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🔍</div>
            <h3>Advanced Search</h3>
            <p>Quick and efficient search functionality by employee ID or client name.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">📱</div>
            <h3>User-Friendly Interface</h3>
            <p>Intuitive dashboard with easy navigation and responsive design.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <div className="about-text">
            <h2>About Us</h2>
            <h3>Simplifying Holiday Management Since 2025</h3>
            <p>
              Holiday Hub emerged from a simple yet powerful idea: to make holiday management 
              effortless for both employees and organizations. We understand that managing time-off 
              in a growing organization can be complex and time-consuming.
            </p>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h4>Our Mission</h4>
                  <p>To streamline holiday management processes and enhance workplace efficiency through 
                  innovative digital solutions.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">👥</div>
                <div className="feature-text">
                  <h4>Who We Serve</h4>
                  <p>From startups to large enterprises, we help organizations of all sizes manage their 
                  employee holidays effectively.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">💡</div>
                <div className="feature-text">
                  <h4>Our Approach</h4>
                  <p>We combine user-friendly interfaces with powerful features to create a seamless 
                  holiday management experience.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={contactForm.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitStatus === 'sending'}
            >
              {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <div className="success-message">Message sent successfully!</div>
            )}
            {submitStatus === 'error' && (
              <div className="error-message">Failed to send message. Please try again.</div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;


