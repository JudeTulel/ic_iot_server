import React from 'react';
import '../styles/Docs.css';

const Docs = () => {
  return (
    <div className="docs-container">
      <h2>Documentation</h2>
      <p>Your guide to using BlockThings effectively. Explore the resources below to get started!</p>

      <div className="docs-list">
        <div className="doc-item">
          <h3>Getting Started</h3>
          <p>A comprehensive guide to help you set up and start using BlockThings.</p>
          <a href="#getting-started" className="doc-link">Read More</a>
        </div>
        <div className="doc-item">
          <h3>API Reference</h3>
          <p>Explore our API documentation for developers to integrate with our services.</p>
          <a href="#api-reference" className="doc-link">Read More</a>
        </div>
        <div className="doc-item">
          <h3>User Guides</h3>
          <p>Step-by-step guides for different user scenarios and common tasks.</p>
          <a href="#user-guides" className="doc-link">Read More</a>
        </div>
        <div className="doc-item">
          <h3>Troubleshooting</h3>
          <p>Solutions to common issues and how to resolve them.</p>
          <a href="#troubleshooting" className="doc-link">Read More</a>
        </div>
        <div className="doc-item">
          <h3>FAQ</h3>
          <p>Answers to the most frequently asked questions about BlockThings.</p>
          <a href="#faq" className="doc-link">Read More</a>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Feedback</h3>
        <p>We value your feedback! Let us know how we can improve our documentation.</p>
        <form className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <textarea id="feedback" name="feedback" rows="4" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Docs;
