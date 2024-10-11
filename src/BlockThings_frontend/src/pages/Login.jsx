import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

// Environment configuration
const IS_LOCAL = process.env.REACT_APP_DFX_NETWORK === 'local';
const NETWORK_CONFIG = {
  local: {
    host: "http://localhost:4943",
    canisterId: process.env.REACT_APP_LOCAL_CANISTER_ID || "be2us-64aaa-aaaaa-qaabq-cai",
  },
  production: {
    host: "https://icp0.io",
    canisterId: process.env.REACT_APP_PROD_CANISTER_ID || "your-prod-canister-id",
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Get current environment configuration
  const currentConfig = IS_LOCAL ? NETWORK_CONFIG.local : NETWORK_CONFIG.production;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPlugConfig = () => {
    const whitelist = [currentConfig.canisterId];
    return {
      whitelist,
      host: currentConfig.host,
      timeout: IS_LOCAL ? 50000 : 10000, // Longer timeout for local development
      onConnectionUpdate: () => {
        console.log("Connection status updated");
      },
    };
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const plugConfig = getPlugConfig();

      // Log connection attempt details in development
      if (IS_LOCAL) {
        console.log('Attempting connection with config:', plugConfig);
      }

      // Check if already connected
      const alreadyConnected = await window?.ic?.plug?.isConnected();
      if (alreadyConnected) {
        const currentNetwork = await window.ic.plug.networkPrincipal();
        console.log("Already connected to network:", currentNetwork);
        
        // Verify if connected to correct network
        const agent = await window.ic.plug.agent;
        if (agent) {
          const currentHost = agent._host;
          if (currentHost !== currentConfig.host) {
            console.log("Switching networks...");
            await window.ic.plug.createAgent(plugConfig);
          }
        }
      }

      // Request connection
      const publicKey = await window.ic.plug.requestConnect(plugConfig);

      if (publicKey) {
        // Create agent for current network
        await window.ic.plug.createAgent(plugConfig);
        
        // Get principal ID
        const principal = await window.ic.plug.agent.getPrincipal();
        setIsConnected(true);
        setPrincipalId(principal.toString());
        
        if (IS_LOCAL) {
          console.log("Connected successfully");
          console.log("Network:", currentConfig.host);
          console.log("Principal ID:", principal.toString());
        }

        // Call your authentication canister here if needed
        // const authActor = await window.ic.plug.createActor({
        //   canisterId: currentConfig.canisterId,
        //   interfaceFactory: authInterface,
        // });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(IS_LOCAL 
        ? `Connection failed: ${error.message}` 
        : 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e) => {
    if (isConnected){
    e.preventDefault();
    console.log('Login data:', formData);
    navigate('/dashboard');}
    else{
      alert("Connect Plug Wallet")
    }
  };

  const handleWalletLogin = async () => {
    if (!window.ic?.plug) {
      window.open('https://plugwallet.ooo/', '_blank');
      return;
    }
    await connectWallet();
  };

  // Get wallet button text based on state
  const getWalletButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return `Connected: ${principalId.slice(0, 10)}...`;
    return 'Connect with Plug Wallet';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login {IS_LOCAL && <span className="environment-badge">Local Dev</span>}</h2>
        <button 
          onClick={handleWalletLogin} 
          className={`wallet-button ${isConnecting ? 'connecting' : ''}`}
          type="button"
          disabled={isConnecting}
        >
          {getWalletButtonText()}
        </button>
        <div className="divider">
          <span>OR</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <p className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;