import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getSyllables } from '../../data/syllables';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../../utils/speechRecognition';
import { isSpeechSynthesisSupported, speakText } from '../../utils/speechSynthesis';
import BackButton from '../../components/BackButton/BackButton';
import GameResult from '../../components/GameResult/GameResult';
import './SpeechLadder.css';

const SpeechLadder = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const syllables = getSyllables(soundId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Нажми на микрофон и произнеси слог.');
  const [isCompleted, setIsCompleted] = useState(false);
  const stopRecognitionRef = useRef(null);
  const isSupported = isSpeechRecognitionSupported();
  const canSpeak = isSpeechSynthesisSupported();

  const handleStepSpeak = (syllable) => {
    if (!canSpeak) {
      setFeedback('Озвучивание не поддерживается в этом браузере.');
      return;
    }
    const didSpeak = speakText(syllable);
    setFeedback(didSpeak ? `Тоти произносит: «${syllable}»` : 'Не удалось включить озвучивание.');
  };

  const stopListening = () => {
    stopRecognitionRef.current?.();
    stopRecognitionRef.current = null;
    setIsListening(false);
  };

  useEffect(() => () => stopRecognitionRef.current?.(), []);

  if (!sound || syllables.length === 0) {
    navigate('/');
    return null;
  }

  const finishStep = () => {
    stopListening();
    setCompletedSteps((steps) => (steps.includes(currentIndex) ? steps : [...steps, currentIndex]));
    setFailedAttempts(0);
    setFeedback('Правильно! Ступенька пройдена 🎉');
    if (currentIndex === syllables.length - 1) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((index) => index + 1);
      setTranscript('');
    }
  };

  const handleStartListening = () => {
    if (!isSupported || isListening) return;
    setTranscript('');
    setFeedback('Слушаю… произнеси слог вслух.');
    stopRecognitionRef.current = startSpeechRecognition(syllables[currentIndex], {
      onListeningChange: setIsListening,
      onTranscript: setTranscript,
      onError: (message) => {
        setFeedback(message);
        setIsListening(false);
      },
      onResult: ({ matched }) => {
        if (matched) {
          finishStep();
        } else {
          setFailedAttempts((attempts) => attempts + 1);
          setFeedback('Не распознано. Попробуй произнести слог ещё раз.');
        }
      }
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isListening) {
      setCurrentIndex((index) => index - 1);
      setFailedAttempts(0);
      setTranscript('');
      setFeedback('Нажми на микрофон и произнеси слог.');
    }
  };

  const handleRepeat = () => {
    setCurrentIndex(0);
    setCompletedSteps([]);
    setFailedAttempts(0);
    setTranscript('');
    setFeedback('Нажми на микрофон и произнеси слог.');
    setIsCompleted(false);
  };

  const handleBackToGames = () => {
    stopListening();
    navigate(`/sound/${soundId}/category/syllables/games`);
  };

  if (isCompleted) {
    return (
      <GameResult
        score={completedSteps.length}
        total={syllables.length}
        onRepeat={handleRepeat}
        onNextGame={handleBackToGames}
        onBackToCategories={() => navigate(`/sound/${soundId}/categories`)}
      />
    );
  }

  return (
    <div className="speech-ladder">
      <header className="speech-ladder__header">
        <BackButton onClick={handleBackToGames} />
        <h1 className="speech-ladder__title">Речевая лесенка</h1>
        <div className="speech-ladder__progress" aria-live="polite">
          {currentIndex + 1} / {syllables.length}
        </div>
      </header>

      <main className="speech-ladder__content">
        <p className="speech-ladder__instruction">Произнеси слог, чтобы подняться на следующую ступеньку</p>

        <div className="speech-ladder__stage">
          <div className="speech-ladder__scenery" aria-hidden="true">
            <span className="speech-ladder__sun">☀️</span>
            <span className="speech-ladder__cloud speech-ladder__cloud--one">☁️</span>
            <span className="speech-ladder__cloud speech-ladder__cloud--two">☁️</span>
            <span className="speech-ladder__canopy">🌿 🌳 🌿</span>
            <span className="speech-ladder__ground" />
            <span className="speech-ladder__vine speech-ladder__vine--left">🌿<br />〰<br />🍃</span>
            <span className="speech-ladder__vine speech-ladder__vine--right">🍃<br />〰<br />🌿</span>
            <span className="speech-ladder__butterfly speech-ladder__butterfly--one">🦋</span>
            <span className="speech-ladder__butterfly speech-ladder__butterfly--two">🦋</span>
            <span className="speech-ladder__animal speech-ladder__animal--monkey">🐒</span>
            <span className="speech-ladder__animal speech-ladder__animal--toucan">🐦</span>
            <span className="speech-ladder__undergrowth">🌱 🌺 🍄 🌼 🌱</span>
          </div>
          <div className="speech-ladder__tree-trunk" aria-hidden="true">
            <div className="speech-ladder__treehouse">
              <span className="speech-ladder__treehouse-roof" />
              <span className="speech-ladder__treehouse-sign">Домик Тоти</span>
              <span className="speech-ladder__treehouse-window speech-ladder__treehouse-window--left" />
              <span className="speech-ladder__treehouse-door"><span /></span>
              <span className="speech-ladder__treehouse-window speech-ladder__treehouse-window--right" />
              <span className="speech-ladder__treehouse-platform" />
            </div>
          </div>
          <div className="speech-ladder__sound" style={{ backgroundColor: sound.color }} aria-label={sound.title}>
            {sound.sound}
          </div>
          <div className="speech-ladder__steps" role="group" aria-label={`Слоги на прямой лесенке: ${currentIndex + 1} из ${syllables.length}`}>
            {syllables.map((syllable, index) => {
              const isCurrent = index === currentIndex;
              const isStepCompleted = completedSteps.includes(index);
              const progress = index / Math.max(syllables.length - 1, 1);
              const stepX = 50;
              const stepY = 85 - progress * 40;
              return (
                <button
                  type="button"
                  className={`speech-ladder__step ${isStepCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  key={`${syllable}-${index}`}
                  style={{ '--step-x': `${stepX}%`, '--step-y': `${stepY}%` }}
                  onClick={() => handleStepSpeak(syllable)}
                  aria-label={`Ступенька ${index + 1}: слог ${syllable}. Нажми, чтобы услышать произношение${isCurrent ? '. Текущая ступенька' : ''}${isStepCompleted ? '. Пройдена' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-pressed={isStepCompleted}
                >
                  <span className="speech-ladder__step-number" aria-hidden="true">{index + 1}</span>
                  <span className="speech-ladder__step-syllable">{syllable}</span>
                  <span className="speech-ladder__step-audio" aria-hidden="true">🔊</span>
                  {isCurrent && (
                    <span className="speech-ladder__step-marker" aria-hidden="true">
                      <span>🦜</span>
                      <span className="speech-ladder__step-mascot-name">Тоти</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="speech-ladder__prompt" aria-live="polite">
          <span className="speech-ladder__prompt-label">Скажи:</span>
          <span className="speech-ladder__prompt-syllable">{syllables[currentIndex]}</span>
        </div>

        <div className={`speech-ladder__feedback ${isListening ? 'listening' : ''}`} role="status">
          {feedback}
          {transcript && <span className="speech-ladder__transcript">Распознано: «{transcript}»</span>}
        </div>

        <div className="speech-ladder__controls">
          <button
            className="speech-ladder__button speech-ladder__button--secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isListening}
          >
            ← Назад
          </button>
          <button
            className={`speech-ladder__button speech-ladder__button--primary ${isListening ? 'is-listening' : ''}`}
            onClick={isListening ? stopListening : handleStartListening}
            disabled={!isSupported}
            aria-label={isListening ? 'Остановить микрофон' : 'Начать распознавание речи'}
          >
            {isListening ? '⏹ Остановить' : '🎙️ Нажми и произнеси'}
          </button>
        </div>

        {failedAttempts >= 3 && (
          <button
            className="speech-ladder__button speech-ladder__button--assist"
            onClick={finishStep}
            disabled={isListening}
          >
            Я правильно сказал! (Засчитать)
          </button>
        )}

        {!isSupported && (
          <p className="speech-ladder__notice">
            Этот браузер не поддерживает распознавание речи. Открой игру в Chrome или Edge, чтобы использовать микрофон.
          </p>
        )}
        {isSupported && !window.isSecureContext && (
          <p className="speech-ladder__notice">
            Для доступа к микрофону открой страницу через HTTPS или localhost.
          </p>
        )}
      </main>
    </div>
  );
};

export default SpeechLadder;
