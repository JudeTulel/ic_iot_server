import React from 'react';
import Sidebar from '../components/SideBar';
import MainContent from '../components/MainContent';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;
