import React from 'react';
import './Loading.css';
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-text">Loading</div>
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
