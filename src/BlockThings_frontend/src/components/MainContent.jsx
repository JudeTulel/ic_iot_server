import React, { useState, useEffect } from 'react';
import DeviceRegistrationModal from './DeviceRegistrationModal';
import DeviceDataModal from './DeviceDataModal';
import { getUserThings } from './api'; // Assume API function to fetch user devices
import '../styles/Maincontent.css';

const MainContent = () => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);

  // Fetch the devices on component load
  useEffect(() => {
    async function fetchDevices() {
      const userThings = await getUserThings();
      setDevices(userThings);
    }
    fetchDevices();
  }, []);

  const openRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const openDataModal = (device) => {
    setSelectedDevice(device);
    setIsDataModalOpen(true);
  };

  const closeDataModal = () => {
    setIsDataModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="subscription-info">
          <span>Current subscription: ThingsBoard Cloud Maker</span>
          <span>Status: Trial ends on Nov 2, 2024</span>
        </div>
        <div className="user-info">
          <span>Jude Yego</span>
          <span>Tenant Administrator</span>
        </div>
      </header>
      
      <div className="solution-templates">
        <h3>Solution Templates</h3>
        <div className="template-list">
          <div className="template-item">Temperature & Humidity</div>
          <div className="template-item">Smart Office</div>
          <div className="template-item">Fleet Tracking</div>
          <div className="template-item">Fuel Level Monitoring</div>
          <div className="template-item">Air Quality Monitoring</div>
        </div>
      </div>

      <div className="devices">
        <h3>Devices</h3>
        <button onClick={openRegistrationModal}>Add Device</button>
        <button>View Docs</button>
        <div className="device-list">
          {devices.map((device) => (
            <div key={device.id} className="device-item" onClick={() => openDataModal(device)}>
              <span>{device.name}</span>
              <span>{device.status.online ? 'Online' : 'Offline'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboards">
        <h3>Dashboards</h3>
        <button>Add Dashboard</button>
      </div>

      <DeviceRegistrationModal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} />
      <DeviceDataModal isOpen={isDataModalOpen} onClose={closeDataModal} device={selectedDevice} />
    </div>
  );
};

export default MainContent;
