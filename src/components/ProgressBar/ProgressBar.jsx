import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, showText = true }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-bar">
      {showText && (
        <div className="progress-bar__text">
          {current} / {total}
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-bar__dots">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-bar__dot ${i < current ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
