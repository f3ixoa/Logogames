import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getArticulation } from '../../data/articulation';
import BackButton from '../../components/BackButton/BackButton';
import './ArticulationPage.css';

const ArticulationPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const exercises = getArticulation(soundId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  if (!sound || exercises.length === 0) {
    navigate('/');
    return null;
  }

  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;
  const isCompleted = completedExercises.includes(currentIndex);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(currentExercise.duration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = () => {
    if (!completedExercises.includes(currentIndex)) {
      setCompletedExercises([...completedExercises, currentIndex]);
    }
  };

  const handleNext = () => {
    if (!isLastExercise) {
      setCurrentIndex(currentIndex + 1);
      setIsActive(false);
      setTimeLeft(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsActive(false);
      setTimeLeft(0);
    }
  };

  const handleBack = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  return (
    <div className="articulation-page">
      <div className="articulation-page__header">
        <BackButton onClick={handleBack} />
        <div className="articulation-page__progress">
          {currentIndex + 1} / {exercises.length}
        </div>
      </div>

      <div className="articulation-page__content">
        <div className="articulation-page__card">
          <div className="articulation-page__icon">{currentExercise.icon}</div>
          <div className="articulation-page__title">{currentExercise.title}</div>
          <div className="articulation-page__description">{currentExercise.description}</div>

          {isActive && (
            <div className="articulation-page__timer">
              <div className="articulation-page__timer-circle">
                <div className="articulation-page__timer-number">{timeLeft}</div>
                <div className="articulation-page__timer-label">сек</div>
              </div>
            </div>
          )}

          <div className="articulation-page__controls">
            {!isActive && !isCompleted && (
              <button
                className="articulation-page__button articulation-page__button--start"
                onClick={handleStart}
              >
                ▶️ Начать упражнение
              </button>
            )}

            {!isActive && isCompleted && (
              <div className="articulation-page__completed">
                <div className="articulation-page__completed-icon">✅</div>
                <div className="articulation-page__completed-text">Упражнение выполнено!</div>
                <button
                  className="articulation-page__button articulation-page__button--repeat"
                  onClick={handleStart}
                >
                  🔄 Повторить
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="articulation-page__navigation">
          <button
            className="articulation-page__nav-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Назад
          </button>

          <div className="articulation-page__dots">
            {exercises.map((_, index) => (
              <div
                key={index}
                className={`articulation-page__dot ${index === currentIndex ? 'active' : ''} ${completedExercises.includes(index) ? 'completed' : ''}`}
              />
            ))}
          </div>

          <button
            className="articulation-page__nav-button"
            onClick={handleNext}
            disabled={isLastExercise}
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticulationPage;
