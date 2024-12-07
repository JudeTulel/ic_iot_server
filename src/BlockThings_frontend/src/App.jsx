import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx'; // Import the LandingPage component
import Dashboard from './pages/Dashboard.jsx';
import Solutions from './pages/Solutions.jsx';
import Pricing from './pages/Pricing.jsx';
import Docs from './pages/Docs.jsx';
import Help from './pages/Help.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';

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
