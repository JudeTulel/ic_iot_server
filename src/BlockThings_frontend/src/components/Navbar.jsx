import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the CSS file for styling
import logo from '../assets/logo.png'; // Import the logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="BlockThings Logo" className="logo-img" />
        <h1 className="logo-text">BlockThings</h1>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/docs">Docs</Link>
        <Link to="/solutions">Solutions</Link>
        <Link to="/help">Help</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/signup" className="btn-signup">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
