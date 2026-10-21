import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getWords } from '../../data/words';
import BackButton from '../../components/BackButton/BackButton';
import GameResult from '../../components/GameResult/GameResult';
import './WordsPage.css';

const WordsPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const words = getWords(soundId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  if (!sound || words.length === 0) {
    navigate('/');
    return null;
  }

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  const handlePlayWord = () => {
    // Здесь будет воспроизведение слова через Speech API
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecord = () => {
    setIsRecording(true);
    // Имитация записи
    setTimeout(() => {
      setIsRecording(false);
      handleComplete();
    }, 1500);
  };

  const handleComplete = () => {
    const newCompleted = [...completedWords, currentWord.word];
    setCompletedWords(newCompleted);

    if (isLastWord) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRepeat = () => {
    setCurrentIndex(0);
    setCompletedWords([]);
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
        score={completedWords.length}
        total={words.length}
        onRepeat={handleRepeat}
        onBackToCategories={handleBackToCategories}
      />
    );
  }

  return (
    <div className="words-page">
      <div className="words-page__header">
        <BackButton onClick={handleBack} />
        <div className="words-page__progress">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      <div className="words-page__content">
        <div className="words-page__card">
          <div className="words-page__image">{currentWord.image}</div>
          <div className="words-page__word">{currentWord.word}</div>
          <div className="words-page__description">{currentWord.description}</div>
        </div>

        <div className="words-page__controls">
          <button
            className="words-page__button words-page__button--play"
            onClick={handlePlayWord}
          >
            🔊 Послушать
          </button>

          <button
            className={`words-page__button words-page__button--record ${isRecording ? 'recording' : ''}`}
            onClick={handleRecord}
            disabled={isRecording}
          >
            {isRecording ? '⏺️ Запись...' : '🎤 Повторить'}
          </button>

          <button
            className="words-page__button words-page__button--next"
            onClick={handleComplete}
          >
            {isLastWord ? '✅ Завершить' : '➡️ Следующее'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordsPage;
