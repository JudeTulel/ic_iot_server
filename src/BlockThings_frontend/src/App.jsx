// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage'; // Import the LandingPage component
import Dashboard from './pages/Dashboard';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import Help from './pages/Help';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import './styles/LandingPage.css'; // Import styles for Home page if needed

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Updated to use LandingPage */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
