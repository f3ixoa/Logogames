import React from 'react';
import './GameCard.css';

const GameCard = ({ game, onClick }) => {
  return (
    <button
      className="game-card"
      onClick={() => onClick(game)}
    >
      <div className="game-card__icon">{game.icon}</div>
      <div className="game-card__content">
        <div className="game-card__title">{game.title}</div>
        <div className="game-card__description">{game.description}</div>
      </div>
    </button>
  );
};

export default GameCard;
