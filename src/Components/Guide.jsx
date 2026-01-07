import React from 'react';
import './Guide.css';

const Guide = () => {
  return (
    <div className="guide-container">
      <h2 className="guide-title">User Guide — How to Use Jarvis</h2>
      <div className="guide-content">
        <p><strong>Welcome, Commander!</strong> Jarvis is your personal AI assistant, designed to help you interact with the system quickly and efficiently. Follow this guide to get the most out of your command interface.</p>

        <div className="guide-section">
          <h3>⚡ Getting Started</h3>
          <p>When you load the interface, Jarvis will greet you in the Command Box. You can issue commands either by voice or by typing in the chat.</p>
        </div>

        <div className="guide-section">
          <h3>🎤 Using Voice Commands</h3>
          <p>Click the 🎤 Speak button in the top right corner of the right panel. Wait for the microphone indicator to turn active. Speak your command clearly (e.g., “Show power level”, “Scan surroundings”). Jarvis will process your request and respond instantly.</p>
        </div>

        <div className="guide-section">
          <h3>💬 Using Text Chat</h3>
          <p>Scroll to the chat footer at the bottom of the right panel. Type your message (e.g., “Activate defense mode”) and hit Enter or click ▲ to send. Jarvis will respond in the Chat Box above.</p>
        </div>

        <div className="guide-section">
          <h3>🧠 Example Commands</h3>
          <p>“Status report”, “Open communications”, “Run diagnostics”, “Shutdown” — try them all to explore Jarvis's capabilities.</p>
        </div>

        <div className="guide-section">
          <h3>🚀 Tips for Best Experience</h3>
          <p>Speak slowly and clearly. Use short, direct commands. Keep your panel in full-screen. Jarvis learns as you go.</p>
        </div>

        <div className="guide-section">
          <h3>👋 Ending the Session</h3>
          <p>Simply close the browser tab or say “Goodbye Jarvis” to end your session.</p>
        </div>
      </div>
    </div>
  );
};

export default Guide;
