import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getWords } from '../../data/words';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../../utils/speechRecognition';
import { isSpeechSynthesisSupported, speakText } from '../../utils/speechSynthesis';
import BackButton from '../../components/BackButton/BackButton';
import GameResult from '../../components/GameResult/GameResult';
import './WordsPage.css';

const WordsPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const words = getWords(soundId);
  const [completedWords, setCompletedWords] = useState(() => new Set());
  const [failedAttempts, setFailedAttempts] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [recognitionState, setRecognitionState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionStateRef = useRef(recognitionState);
  recognitionStateRef.current = recognitionState;
  const stopRecognitionRef = useRef(null);
  const sessionRef = useRef(0);
  const dialogRef = useRef(null);
  const cardRefs = useRef([]);
  const isSupported = isSpeechRecognitionSupported();
  const canSpeak = isSpeechSynthesisSupported();
  const currentWord = selectedIndex === null ? null : words[selectedIndex];
  const currentComplete = selectedIndex !== null && completedWords.has(selectedIndex);
  const currentAttempts = selectedIndex === null ? 0 : (failedAttempts[selectedIndex] || 0);

  const stopListening = useCallback(() => {
    sessionRef.current += 1;
    stopRecognitionRef.current?.();
    stopRecognitionRef.current = null;
    setRecognitionState('idle');
  }, []);

  const closeDialog = useCallback(() => {
    stopListening();
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setSelectedIndex(null);
    setTranscript('');
    setFeedback('');
  }, [stopListening]);

  useEffect(() => () => {
    sessionRef.current += 1;
    stopRecognitionRef.current?.();
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    if (canSpeak) speakText(words[selectedIndex].word);
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && recognitionStateRef.current !== 'listening' && recognitionStateRef.current !== 'processing') closeDialog();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  // Open speech should occur once per selected card, not on recognition state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, canSpeak, closeDialog, words]);

  if (!sound || words.length === 0) {
    navigate('/');
    return null;
  }

  const openDialog = (index) => {
    stopListening();
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setTranscript('');
    setFeedback('');
    setRecognitionState('idle');
    setSelectedIndex(index);
  };

  const handleListenAgain = () => {
    if (!currentWord) return;
    if (!canSpeak) {
      setFeedback('Озвучивание не поддерживается в этом браузере.');
      return;
    }
    setFeedback('Послушай слово ещё раз.');
    speakText(currentWord.word);
  };

  const completeCurrentWord = (message, announce = false) => {
    if (selectedIndex === null) return;
    stopListening();
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    setCompletedWords((previous) => new Set(previous).add(selectedIndex));
    setFeedback(message);
    setRecognitionState('success');
    if (announce && canSpeak) speakText('Молодец! Отлично!');
  };

  const handleRepeat = () => {
    if (!currentWord || currentComplete || recognitionState === 'listening' || recognitionState === 'processing') return;
    if (!isSupported) {
      setFeedback('Распознавание речи не поддерживается в этом браузере.');
      setRecognitionState('error');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setFeedback('Браузер не предоставляет доступ к микрофону. Открой страницу через HTTPS или localhost.');
      setRecognitionState('error');
      return;
    }

    stopListening();
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    const session = sessionRef.current;
    let resultHandled = false;
    let errorHandled = false;
    setTranscript('');
    setFeedback('Запрашиваю доступ к микрофону…');
    setRecognitionState('processing');
    stopRecognitionRef.current = startSpeechRecognition(currentWord.word, {
      onListeningChange: (listening) => {
        if (session !== sessionRef.current) return;
        if (!listening) {
          stopRecognitionRef.current = null;
          if (!resultHandled && !errorHandled) {
            setFeedback('Речь не распознана. Нажми «Повторить», чтобы попробовать ещё раз.');
            setRecognitionState('retry');
          }
          return;
        }
        if (listening) {
          setRecognitionState('listening');
          setFeedback('Слушаю… произнеси слово.');
        }
      },
      onTranscript: (value) => {
        if (session === sessionRef.current) {
          setTranscript(value);
          if (value) setRecognitionState('processing');
        }
      },
      onResult: ({ matched, transcript: finalTranscript }) => {
        if (session !== sessionRef.current) return;
        resultHandled = true;
        stopRecognitionRef.current?.();
        stopRecognitionRef.current = null;
        setTranscript(finalTranscript);
        if (matched) {
          setCompletedWords((previous) => new Set(previous).add(selectedIndex));
          setFeedback('Правильно! Карточка пройдена 🎉');
          setRecognitionState('success');
          if (canSpeak) speakText('Молодец! Отлично!');
        } else {
          setFailedAttempts((previous) => ({ ...previous, [selectedIndex]: (previous[selectedIndex] || 0) + 1 }));
          setFeedback('Не получилось распознать это слово. Попробуй ещё раз.');
          setRecognitionState('retry');
          if (canSpeak) speakText('Попробуй ещё раз');
        }
      },
      onError: (message) => {
        if (session !== sessionRef.current) return;
        errorHandled = true;
        stopRecognitionRef.current?.();
        stopRecognitionRef.current = null;
        setFeedback(message);
        setRecognitionState('error');
      },
    }, { matchMode: 'exact-word' });
  };

  const handleManualComplete = () => {
    if (currentAttempts < 3 || currentComplete) return;
    completeCurrentWord('Ты отлично справился! Карточка пройдена ✓');
  };

  const handleRepeatGame = () => {
    closeDialog();
    setCompletedWords(new Set());
    setFailedAttempts({});
  };

  const handleBack = () => {
    closeDialog();
    navigate(`/sound/${soundId}/categories`);
  };

  if (completedWords.size === words.length && selectedIndex === null) {
    return <GameResult score={completedWords.size} total={words.length} onRepeat={handleRepeatGame} onBackToCategories={handleBack} />;
  }

  return (
    <main className="words-page">
      <header className="words-page__header">
        <BackButton onClick={handleBack} />
        <div className="words-page__heading">
          <h1>Слова со звуком {sound.sound}</h1>
          <p>Выбери карточку и произнеси слово</p>
        </div>
        <div className="words-page__progress" aria-live="polite">{completedWords.size} / {words.length}</div>
      </header>

      <section className="words-page__board-wrap" aria-label="Карточки со словами">
        <div className="words-page__board">
          {words.map((item, index) => (
            <button
              type="button"
              className={`words-page__card${completedWords.has(index) ? ' is-complete' : ''}`}
              key={`${item.word}-${index}`}
              ref={(element) => { cardRefs.current[index] = element; }}
              onClick={() => openDialog(index)}
              aria-label={`${item.word}${completedWords.has(index) ? ', пройдено' : ''}. Открыть карточку`}
            >
              {completedWords.has(index) && <span className="words-page__check" aria-hidden="true">✓</span>}
              <span className="words-page__image" aria-hidden="true">{item.image}</span>
              <span className="words-page__word">{item.word}</span>
            </button>
          ))}
        </div>
      </section>
      <p className="words-page__note">Проверяется распознанное слово, а не точность произношения звуков.</p>

      {currentWord && (
        <div
          className="words-modal-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && recognitionState !== 'listening' && recognitionState !== 'processing') closeDialog();
          }}
        >
          <section
            className="words-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="words-modal-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <button
              type="button"
              className="words-modal__close"
              onClick={closeDialog}
              aria-label="Закрыть карточку"
            >×</button>
            <span className="words-modal__image" aria-hidden="true">{currentWord.image}</span>
            <h2 id="words-modal-title" className="words-modal__word">{currentWord.word}</h2>
            <div className={`words-modal__status words-modal__status--${recognitionState}`} role="status" aria-live="polite">
              {feedback || (currentComplete ? 'Карточка уже пройдена.' : 'Послушай слово и повтори его.')}
              {transcript && <span className="words-modal__transcript">Распознано: «{transcript}»</span>}
              {recognitionState === 'listening' && <span className="words-modal__listening-dot" aria-hidden="true" />}
            </div>
            <div className="words-modal__actions">
              <button type="button" className="words-modal__button words-modal__button--listen" onClick={handleListenAgain}>
                🔊 Послушать ещё раз
              </button>
              <button
                type="button"
                className="words-modal__button words-modal__button--repeat"
                onClick={handleRepeat}
                disabled={currentComplete || recognitionState === 'listening' || recognitionState === 'processing' || !isSupported}
              >
                {recognitionState === 'listening' ? '🎤 Слушаю…' : recognitionState === 'processing' ? '⏳ Обработка…' : '🎤 Повторить'}
              </button>
            </div>
            {currentAttempts >= 3 && !currentComplete && (
              <button type="button" className="words-modal__manual" onClick={handleManualComplete}>
                Я произнёс правильно
              </button>
            )}
            {currentComplete && <div className="words-modal__success-mark" aria-label="Карточка пройдена">✓</div>}
            {!isSupported && <p className="words-modal__hint">Распознавание речи недоступно в этом WebView.</p>}
            <p className="words-modal__attempts">Неудачных попыток: {currentAttempts}{currentAttempts >= 3 ? ' · Можно подтвердить ответ' : ''}</p>
          </section>
        </div>
      )}
    </main>
  );
};

export default WordsPage;
