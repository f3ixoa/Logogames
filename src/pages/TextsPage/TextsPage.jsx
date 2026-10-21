import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getTexts } from '../../data/texts';
import BackButton from '../../components/BackButton/BackButton';
import './TextsPage.css';

const TextsPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const texts = getTexts(soundId);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!sound || texts.length === 0) {
    navigate('/');
    return null;
  }

  const currentText = texts[currentIndex];
  const isFirstText = currentIndex === 0;
  const isLastText = currentIndex === texts.length - 1;

  const handlePrevious = () => {
    if (!isFirstText) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastText) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  return (
    <div className="texts-page">
      <div className="texts-page__header">
        <BackButton onClick={handleBack} />
        <div className="texts-page__progress">
          {currentIndex + 1} / {texts.length}
        </div>
      </div>

      <div className="texts-page__content">
        <div className="texts-page__card">
          <div className="texts-page__title">{currentText.title}</div>
          <div className="texts-page__text">{currentText.text}</div>
        </div>

        <div className="texts-page__navigation">
          <button
            className="texts-page__nav-button"
            onClick={handlePrevious}
            disabled={isFirstText}
          >
            ← Назад
          </button>

          <div className="texts-page__dots">
            {texts.map((_, index) => (
              <div
                key={index}
                className={`texts-page__dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <button
            className="texts-page__nav-button"
            onClick={handleNext}
            disabled={isLastText}
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextsPage;
