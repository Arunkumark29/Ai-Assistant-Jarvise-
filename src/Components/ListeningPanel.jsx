import React from "react";
import "./ListeningPanel.css";

function ListeningPanel({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="listening-panel">
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Listening...</p>
    </div>
  );
}

export default ListeningPanel;
