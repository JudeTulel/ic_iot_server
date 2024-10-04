import React from 'react';
import '../styles/Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h2>Pricing Plans</h2>
      <p>Choose the plan that fits your needs and start your journey with BlockThings today!</p>

      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Basic Plan</h3>
          <p className="price">$19/mo</p>
          <p>Perfect for individuals or small teams getting started.</p>
          <ul>
            <li>Access to basic features</li>
            <li>1 IoT device</li>
            <li>Email support</li>
          </ul>
          <button className="pricing-button">Select Plan</button>
        </div>

        <div className="pricing-card">
          <h3>Pro Plan</h3>
          <p className="price">$49/mo</p>
          <p>Ideal for businesses looking for advanced tools.</p>
          <ul>
            <li>Access to all features</li>
            <li>Up to 5 IoT devices</li>
            <li>Priority email support</li>
          </ul>
          <button className="pricing-button">Select Plan</button>
        </div>

        <div className="pricing-card">
          <h3>Enterprise Plan</h3>
          <p className="price">$99/mo</p>
          <p>Custom solutions for large organizations.</p>
          <ul>
            <li>All Pro features</li>
            <li>Unlimited IoT devices</li>
            <li>Dedicated support</li>
            <li>Custom integrations</li>
          </ul>
          <button className="pricing-button">Contact Sales</button>
        </div>
      </div>

      <div className="icp-notice">
        <p>Secure your IoT investments with Blockchain and ICP technology, ensuring safety and transparency in every transaction.</p>
      </div>
    </div>
  );
};

export default Pricing;
