import React from 'react';
import './JarvisPopup.css';

const JarvisPopup = ({ message, onClose }) => {
  return (
    <div className="jarvis-overlay">
      <div className="jarvis-box">
        <h2 className="jarvis-title">🛡 J.A.R.V.I.S</h2>
        <p>{message}</p>
        <button className="jarvis-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default JarvisPopup;
