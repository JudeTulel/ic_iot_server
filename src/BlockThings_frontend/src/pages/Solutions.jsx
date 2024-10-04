import React from 'react';
import '../styles/Solutions.css';

const Solutions = () => {
  return (
    <div className="solutions-container">
      <h2>Our Solutions</h2>
      <p>Discover how BlockThings can transform your IoT experience with our innovative solutions.</p>

      <div className="solutions-list">
        <div className="solution-item">
          <h3>IoT Device Management</h3>
          <p>Effortlessly manage your IoT devices with our intuitive platform that offers real-time monitoring, control, and analytics.</p>
          <a href="#device-management" className="solution-link">Learn More</a>
        </div>
        <div className="solution-item">
          <h3>Data Analytics</h3>
          <p>Unlock the full potential of your data with advanced analytics tools designed to help you make informed decisions.</p>
          <a href="#data-analytics" className="solution-link">Learn More</a>
        </div>
        <div className="solution-item">
          <h3>Blockchain Integration</h3>
          <p>Seamlessly integrate blockchain technology to enhance security and transparency in your IoT applications.</p>
          <a href="#blockchain-integration" className="solution-link">Learn More</a>
        </div>
        <div className="solution-item">
          <h3>Smart Home Solutions</h3>
          <p>Transform your home into a smart haven with our innovative IoT solutions that provide convenience and efficiency.</p>
          <a href="#smart-home" className="solution-link">Learn More</a>
        </div>
        <div className="solution-item">
          <h3>Industrial IoT</h3>
          <p>Optimize your industrial operations with robust IoT solutions that improve efficiency, safety, and reliability.</p>
          <a href="#industrial-iot" className="solution-link">Learn More</a>
        </div>
      </div>

      <div className="contact-section">
        <h3>Contact Us</h3>
        <p>Have questions about our solutions? Reach out to our team for more information!</p>
        <button className="contact-button">Get in Touch</button>
      </div>
    </div>
  );
};

export default Solutions;

