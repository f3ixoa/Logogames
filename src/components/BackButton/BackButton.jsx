import React from 'react';
import './BackButton.css';

const BackButton = ({ onClick }) => {
  return (
    <button
      className="back-button"
      onClick={onClick}
      aria-label="Назад"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Назад</span>
    </button>
  );
};

export default BackButton;
