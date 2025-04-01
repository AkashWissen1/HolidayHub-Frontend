import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import calendarImage from '../assets/calendar.svg';
import '../styles/Home.css';

const Home = () => {
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
            <button className="cta-btn">Let's Get Started</button>
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
            <h3>Leave Management</h3>
            <p>Efficiently manage employee leave requests and approvals in one place.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive reports and insights about your team's leave patterns.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Stay updated with automated notifications and reminders.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Holiday Hub is dedicated to simplifying leave management for teams of all sizes. 
            Our platform combines powerful features with an intuitive interface to create 
            the perfect solution for modern workplaces.
          </p>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <div className="contact-content">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;




