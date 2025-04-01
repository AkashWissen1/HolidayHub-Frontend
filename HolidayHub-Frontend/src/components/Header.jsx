import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '../assets/logo.svg';

const Header = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoImage} alt="Holiday Hub Logo" className="logo-image" />
      </div>
      <nav className="nav">
        <a onClick={() => scrollToSection('top')}>Home</a>
        <a onClick={() => scrollToSection('services')}>Services</a>
        <a onClick={() => scrollToSection('about')}>About Us</a>
        <a onClick={() => scrollToSection('contact')}>Contact Us</a>
      </nav>
      <button className="login-btn" onClick={handleLoginClick}>Login</button>
    </header>
  );
};

export default Header;
