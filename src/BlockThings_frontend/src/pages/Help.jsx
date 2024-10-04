import React from 'react';
import '../styles/Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h2>How Can We Help You?</h2>
      <p>If you have any questions or need assistance, you’re in the right place! Here are some resources to help you out:</p>
      
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <ul className="faq-list">
          <li>
            <h4>What is BlockThings?</h4>
            <p>BlockThings is an innovative platform that allows you to manage your IoT devices seamlessly on the blockchain.</p>
          </li>
          <li>
            <h4>How do I connect my IoT device?</h4>
            <p>To connect your IoT device, ensure it’s compatible with our platform and follow the setup instructions provided in the documentation.</p>
          </li>
          <li>
            <h4>Where can I find the documentation?</h4>
            <p>You can find comprehensive documentation <a href="#docs">here</a>.</p>
          </li>
          <li>
            <h4>Who can I contact for support?</h4>
            <p>If you need further assistance, please reach out to our support team via the contact form below.</p>
          </li>
        </ul>
      </div>

      <div className="contact-section">
        <h3>Contact Us</h3>
        <p>If you need personal assistance, feel free to contact us:</p>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Help;
