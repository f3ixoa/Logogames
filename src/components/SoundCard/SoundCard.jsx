import React from 'react';
import './SoundCard.css';

const SoundCard = ({ sound, onClick }) => {
  return (
    <button
      className="sound-card"
      onClick={() => onClick(sound)}
      style={{ '--card-color': sound.color }}
    >
      <div className="sound-card__icon">{sound.sound}</div>
      <div className="sound-card__title">{sound.title}</div>
    </button>
  );
};

export default SoundCard;
