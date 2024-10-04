import React, { useState, useEffect } from "react";
import "../styles/LandingPage.css";
import image0 from '../assets/image0.jpg';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
const images = [image0, image1, image2, image3, image4, image5];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-content">
          <div
            className="big-container"
            style={{
              backgroundImage: `url(${images[currentImageIndex]})`,
              transition: "background-image 1s ease-in-out", // Smooth transition
            }}
          >
            <h1 className="animated-text">Experience IoT Like Never Before</h1>
            <p>Your gateway to seamless IoT management on the blockchain.</p>
            <a href="#connectWallet" className="cta-button">Connect Wallet</a>
          </div>
        </div>
      </header>

      <div className="text-left">
        <h2>Unlock the Full Potential of IoT</h2>
        <p>Transform your devices into intelligent assets with BlockThings.</p>
      </div>

      <div className="small-containers">
        <div className="small-container" style={{ backgroundImage: `url(${image1})` }}>Image 1</div>
        <div className="small-container" style={{ backgroundImage: `url(${image2})` }}>Image 2</div>
        <div className="small-container" style={{ backgroundImage: `url(${image3})` }}>Image 3</div>
        <div className="small-container" style={{ backgroundImage: `url(${image4})` }}>Image 4</div>
        <div className="small-container" style={{ backgroundImage: `url(${image4})` }}>Image 5</div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 BlockThings. All rights reserved.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
