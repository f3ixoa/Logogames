import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getSentences } from '../../data/sentences';
import BackButton from '../../components/BackButton/BackButton';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import GameResult from '../../components/GameResult/GameResult';
import './SentencesPage.css';

const SentencesPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const sentences = getSentences(soundId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!sound || sentences.length === 0) {
    navigate('/');
    return null;
  }

  const currentSentence = sentences[currentIndex];
  const isLastSentence = currentIndex === sentences.length - 1;

  const handleAnswerSelect = (answer) => {
    if (isCorrect !== null) return; // Уже проверено

    setSelectedAnswer(answer);
    const correct = answer === currentSentence.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastSentence) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleRepeat = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setIsCompleted(false);
  };

  const handleBackToCategories = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  const handleBack = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  if (isCompleted) {
    return (
      <GameResult
        score={score}
        total={sentences.length}
        onRepeat={handleRepeat}
        onBackToCategories={handleBackToCategories}
      />
    );
  }

  return (
    <div className="sentences-page">
      <div className="sentences-page__header">
        <BackButton onClick={handleBack} />
        <ProgressBar current={currentIndex + 1} total={sentences.length} showText={true} />
      </div>

      <div className="sentences-page__content">
        <div className="sentences-page__question-card">
          <div className="sentences-page__question-number">
            Вопрос {currentIndex + 1} из {sentences.length}
          </div>

          <div className="sentences-page__sentence">
            {currentSentence.sentence}
          </div>

          <div className="sentences-page__options">
            {currentSentence.options.map((option, index) => {
              let buttonClass = 'sentences-page__option';

              if (selectedAnswer === option) {
                if (isCorrect === true) {
                  buttonClass += ' correct';
                } else if (isCorrect === false) {
                  buttonClass += ' incorrect';
                }
              }

              if (isCorrect === false && option === currentSentence.correctAnswer) {
                buttonClass += ' show-correct';
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isCorrect !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <div className={`sentences-page__feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? (
                <>
                  <div className="sentences-page__feedback-icon">✓</div>
                  <div className="sentences-page__feedback-text">
                    <div className="sentences-page__feedback-title">Правильно!</div>
                    <div className="sentences-page__feedback-sentence">
                      {currentSentence.sentence.replace('_____', currentSentence.correctAnswer)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="sentences-page__feedback-icon">✗</div>
                  <div className="sentences-page__feedback-text">
                    <div className="sentences-page__feedback-title">Попробуй ещё раз!</div>
                    <div className="sentences-page__feedback-sentence">
                      Правильный ответ: {currentSentence.correctAnswer}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {isCorrect !== null && (
          <button
            className="sentences-page__next-button"
            onClick={handleNext}
          >
            {isLastSentence ? '✅ Завершить' : '➡️ Далее'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SentencesPage;
