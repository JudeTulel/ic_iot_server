import React, { useEffect, useState } from 'react';
import { getThingData, getThingDataInRange } from '../utils/api'; // API functions for fetching device data
import '../styles/Modal.css'

const DeviceDataModal = ({ isOpen, onClose, device }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    if (device) {
      // Fetch real-time data
      async function fetchRealTimeData() {
        const data = await getThingData(device.id);
        setRealTimeData(data);
      }
      fetchRealTimeData();
      
      // Fetch historical data
      async function fetchHistoricalData() {
        const fromTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // Last 7 days
        const toTime = Date.now();
        const data = await getThingDataInRange(device.id, fromTime, toTime);
        setHistoricalData(data);
      }
      fetchHistoricalData();
    }
  }, [device]);

  if (!isOpen || !device) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{device.name} Data</h2>
        <h3>Real-Time Data</h3>
        <p>{realTimeData ? `Current Value: ${realTimeData.value}` : 'Loading...'}</p>

        <h3>Historical Data (Last 7 Days)</h3>
        <pre>{JSON.stringify(historicalData, null, 2)}</pre>

        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DeviceDataModal;
