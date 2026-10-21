import React from 'react';
import './GameResult.css';

const GameResult = ({ score, total, onRepeat, onNextGame, onBackToCategories }) => {
  const percentage = Math.round((score / total) * 100);

  const getEmoji = () => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 50) return '👍';
    return '💪';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Отлично!';
    if (percentage >= 70) return 'Хорошо!';
    if (percentage >= 50) return 'Неплохо!';
    return 'Попробуй ещё раз!';
  };

  return (
    <div className="game-result">
      <div className="game-result__content">
        <div className="game-result__emoji">{getEmoji()}</div>
        <div className="game-result__message">{getMessage()}</div>
        <div className="game-result__score">
          <div className="game-result__score-number">
            {score} / {total}
          </div>
          <div className="game-result__score-text">
            Правильных ответов
          </div>
        </div>
        <div className="game-result__buttons">
          <button className="game-result__button game-result__button--primary" onClick={onRepeat}>
            🔄 Повторить
          </button>
          {onNextGame && (
            <button className="game-result__button game-result__button--secondary" onClick={onNextGame}>
              🎮 Другая игра
            </button>
          )}
          <button className="game-result__button game-result__button--secondary" onClick={onBackToCategories}>
            📚 К категориям
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
