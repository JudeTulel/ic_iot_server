import React from 'react';
import Sidebar from '../components/SideBar.jsx';
import MainContent from '../components/MainContent.jsx';
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
