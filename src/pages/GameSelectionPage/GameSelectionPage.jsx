import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getCategoryById } from '../../data/categories';
import { getGamesByCategory } from '../../data/games';
import GameCard from '../../components/GameCard/GameCard';
import BackButton from '../../components/BackButton/BackButton';
import './GameSelectionPage.css';

const GameSelectionPage = () => {
  const navigate = useNavigate();
  const { soundId, categoryId } = useParams();
  const sound = getSoundById(soundId);
  const category = getCategoryById(categoryId);
  const games = getGamesByCategory(categoryId);

  if (!sound || !category) {
    navigate('/');
    return null;
  }

  const handleGameSelect = (game) => {
    navigate(`/sound/${soundId}/category/${categoryId}/game/${game.id}`);
  };

  const handleBack = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  return (
    <div className="game-selection-page">
      <div className="game-selection-page__header">
        <BackButton onClick={handleBack} />
        <div className="game-selection-page__info">
          <div
            className="game-selection-page__sound-badge"
            style={{ background: sound.color }}
          >
            {sound.sound}
          </div>
          <div className="game-selection-page__text">
            <h1 className="game-selection-page__title">{category.title}</h1>
            <p className="game-selection-page__sound-name">{sound.title}</p>
          </div>
        </div>
      </div>

      <div className="game-selection-page__content">
        <p className="game-selection-page__subtitle">Выбери игру</p>
        <div className="game-selection-page__grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={handleGameSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelectionPage;
