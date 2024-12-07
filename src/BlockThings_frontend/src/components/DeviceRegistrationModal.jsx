import React, { useState } from 'react';
import { api } from '../utils/api'; // API function for registering a thing
import '../styles/Modal.css'
const DeviceRegistrationModal = ({ isOpen, onClose }) => {
  const registerThing = api.registerThing;
  const [deviceName, setDeviceName] = useState('');
  const [nonce, setNonce] = useState(null);
  const [endpoint, setEndpoint] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nonce, endpoint } = await registerThing(deviceName);
    setNonce(nonce);
    setEndpoint(endpoint);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Device Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {nonce && <p>Nonce: {nonce}</p>}
        {endpoint && <p>Endpoint: {endpoint}</p>}
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DeviceRegistrationModal;
