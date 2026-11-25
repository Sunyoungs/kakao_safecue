import React from 'react';
import styles from "./circleButton.module.css";

function CircleControlButton({ icon, innerText, label, isActive = false, onClick }) {
  return (
    <div className="circle-btn-wrapper">
      <button
        type="button"
        className={`circle-btn ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        {innerText ? <span className="circle-btn-inner-text">{innerText}</span> : icon}
      </button>
      <span className="circle-btn-label">{label}</span>
    </div>
  );
}

export default CircleControlButton;