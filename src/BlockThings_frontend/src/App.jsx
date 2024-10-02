import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import Help from './pages/Help';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import './App.css';  // Import your CSS

function App() {
  return (
    <div className="app-container"> {/* Added this div for height & width management */}
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/docs" component={Docs} />
          <Route path="/help" component={Help} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
