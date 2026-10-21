import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getSyllables } from '../../data/syllables';
import { startSpeechRecognition } from '../../utils/speechRecognition';
import { speakText } from '../../utils/speechSynthesis';
import BackButton from '../../components/BackButton/BackButton';
import './VowelFlower.css';

const GAME_RULES = 'Потяни лепесток к букве в центре и произнеси получившийся слог!';
const PETAL_COLORS = ['#ff6b6b', '#ff9f43', '#feca57', '#a855f7', '#54a0ff', '#a29bfe', '#ff78fe', '#18dcff', '#ee5253', '#7ed6df'];
const Y_PETAL_COLOR = '#ff7a18';
const getPetalColor = (syllable, index) => syllable.includes('Ы') ? Y_PETAL_COLOR : PETAL_COLORS[index % PETAL_COLORS.length];
const getPetalPosition = (index, total, radius) => {
  const angle = (360 / total) * index - 90;
  const radians = (angle * Math.PI) / 180;
  return { x: 50 + Math.cos(radians) * radius, y: 50 + Math.sin(radians) * radius };
};
const getInitialPetalRadius = (total) => total <= 5 ? 38 : total <= 7 ? 40 : 42;
const getInitialPetalRotation = (index, total) => (360 / total) * index;

function Petal({ id, syllable, index, total, completed, locked, dragging, position, dragOffset, onPointerDown, onClick }) {
  const angle = (360 / total) * index - 90;
  const radians = (angle * Math.PI) / 180;
  const radius = getInitialPetalRadius(total);
  const initialRotation = getInitialPetalRotation(index, total);
  const style = {
    '--petal-color': getPetalColor(syllable, index),
    '--petal-x': `${position?.x ?? 50 + Math.cos(radians) * radius}%`,
    '--petal-y': `${position?.y ?? 50 + Math.sin(radians) * radius}%`,
    '--petal-rotation': `${position?.rotation ?? initialRotation}deg`,
    '--petal-index': index,
    ...(dragOffset ? { left: `${dragOffset.x}%`, top: `${dragOffset.y}%` } : {}),
  };

  return (
    <button
      type="button"
      className={`vf-petal${completed ? ' is-completed' : ''}${dragging ? ' is-dragging' : ''}${locked ? ' is-locked' : ''}${position?.frozen ? ' is-frozen' : ''}`}
      data-petal-id={id}
      data-syllable={syllable}
      style={style}
      onPointerDown={(event) => onPointerDown(event, { id, syllable, index })}
      onClick={() => onClick({ id, syllable, index })}
      aria-label={`Лепесток со слогом ${syllable}${locked ? ', выполнен' : ''}`}
      aria-pressed={locked}
      disabled={locked}
    >
      <svg className="vf-petal__shape" viewBox="0 0 120 150" aria-hidden="true">
        <defs>
          <linearGradient id={`vf-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--petal-color)" />
            <stop offset="1" stopColor="var(--petal-color)" stopOpacity=".82" />
          </linearGradient>
        </defs>
        <path d="M60 4C108 12 118 55 60 146 2 55 12 12 60 4Z" fill={`url(#vf-gradient-${index})`} stroke="white" strokeWidth="4" />
        <path d="M60 18Q60 70 60 110" stroke="rgba(255,255,255,.45)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <span className="vf-petal__label">{syllable}</span>
      {completed && <span className="vf-petal__check" aria-hidden="true">✓</span>}
    </button>
  );
}

function SyllableModal({ syllable, onSuccess, onCancel }) {
  const [status, setStatus] = useState('prompt');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const resolvedRef = useRef(false);
  const stopRecognition = useRef(null);
  const successTimeout = useRef(null);

  useEffect(() => {
    speakText(syllable);
    return () => {
      stopRecognition.current?.();
      if (successTimeout.current !== null) window.clearTimeout(successTimeout.current);
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    };
  }, [syllable]);

  const listenAgain = () => {
    setStatus('prompt');
    setError('');
    speakText(syllable);
  };

  const startListening = () => {
    if (resolvedRef.current || stopRecognition.current) return;
    setStatus('listening');
    setTranscript('');
    setError('');
    stopRecognition.current = startSpeechRecognition(syllable, {
      onListeningChange: (listening) => {
        if (!listening) {
          stopRecognition.current = null;
          setStatus((value) => value === 'listening' ? 'prompt' : value);
        }
      },
      onTranscript: setTranscript,
      onResult: ({ matched }) => {
        if (resolvedRef.current) return;
        if (matched) {
          resolvedRef.current = true;
          setFailedAttempts(0);
          setStatus('success');
          speakText('Молодец! Отлично!');
          successTimeout.current = window.setTimeout(onSuccess, 800);
        } else {
          setFailedAttempts((count) => count + 1);
          setStatus('retry');
          speakText('Давай попробуем ещё раз!');
        }
      },
      onError: (message) => {
        if (resolvedRef.current) return;
        stopRecognition.current = null;
        setError(message);
        setStatus('error');
      },
    });
  };

  const confirmPronunciation = () => {
    if (resolvedRef.current || failedAttempts < 3) return;
    resolvedRef.current = true;
    setFailedAttempts(0);
    setStatus('success');
    speakText('Молодец! Отлично!');
    successTimeout.current = window.setTimeout(onSuccess, 500);
  };

  return (
    <div className="vf-overlay" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="vf-dialog" role="dialog" aria-modal="true" aria-labelledby="vf-modal-title">
        <button type="button" className="vf-dialog__close" onClick={onCancel} aria-label="Закрыть">×</button>
        <span className="vf-dialog__eyebrow">Произнеси слог:</span>
        <h2 id="vf-modal-title" className="vf-dialog__syllable">{syllable}</h2>
        <div className={`vf-dialog__status vf-dialog__status--${status}`} aria-live="polite">
          {status === 'prompt' && 'Послушай и повтори слог'}
          {status === 'listening' && <><span className="vf-wave" />Микрофон включён — говори!</>}
          {status === 'success' && 'Молодец! Замечательно!'}
          {status === 'retry' && <>Попробуем ещё раз! {transcript && <span>Слышу: «{transcript}»</span>}</>}
          {status === 'error' && (error || 'Распознавание речи недоступно.')}
        </div>
        <div className="vf-dialog__actions">
          <button type="button" className="vf-action vf-action--listen" onClick={listenAgain}>🔊 Послушать ещё</button>
          <button type="button" className="vf-action vf-action--mic" onClick={startListening}>🎤 Сказать в микрофон</button>
        </div>
        {failedAttempts >= 3 && status !== 'success' && (
          <button type="button" className="vf-dialog__confirm" onClick={confirmPronunciation}>Я произнёс слог</button>
        )}
      </section>
    </div>
  );
}

function VictoryModal({ onRestart, onBack, announced }) {
  return (
    <div className="vf-overlay vf-overlay--victory">
      <section className="vf-dialog vf-victory" role="dialog" aria-modal="true" aria-labelledby="vf-victory-title">
        <div className="vf-victory__trophy" aria-hidden="true">🏆</div>
        <h2 id="vf-victory-title">Победа! Все слоги пройдены!</h2>
        <div className="vf-victory__stars" aria-hidden="true">★ ★ ★</div>
        <p className="vf-victory__message" aria-live="polite">{announced ? 'Молодец, ты собрал цветок полностью!' : 'Цветок собран!'}</p>
        <div className="vf-victory__actions">
          <button type="button" className="vf-action vf-action--mic" onClick={onRestart}>↻ Пройти ещё раз</button>
          <button type="button" className="vf-action vf-action--listen" onClick={onBack}>← К выбору игр</button>
        </div>
      </section>
    </div>
  );
}

export default function VowelFlower() {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const syllables = getSyllables(soundId);
  const flowerRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClick = useRef(false);
  const [completed, setCompleted] = useState(() => new Set());
  const [activePetal, setActivePetal] = useState(null);
  const [positions, setPositions] = useState({});
  const [pendingDrop, setPendingDrop] = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryAnnounced, setVictoryAnnounced] = useState(false);
  const celebrationSpoken = useRef(false);
  const [drag, setDrag] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [rulesSpeaking, setRulesSpeaking] = useState(false);

  const targets = useMemo(() => syllables.map((item, index) => ({
    id: `${soundId}:${item.toUpperCase()}:${index}`,
    syllable: item.toUpperCase(),
    index,
  })), [soundId, syllables]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowRules(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!drag) return undefined;
    const move = (event) => {
      const current = dragRef.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const bounds = flowerRef.current?.getBoundingClientRect() || current.container;
      const moved = current.moved || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 8;
      const next = {
        ...current,
        x: Math.max(0, Math.min(100, ((event.clientX + current.offsetX - bounds.left) / bounds.width) * 100)),
        y: Math.max(0, Math.min(100, ((event.clientY + current.offsetY - bounds.top) / bounds.height) * 100)),
        moved,
      };
      dragRef.current = next;
      setDrag(next);
    };
    const end = (event, cancelled = false) => {
      const current = dragRef.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const bounds = flowerRef.current?.getBoundingClientRect() || current.container;
      const finalPosition = {
        x: Math.max(0, Math.min(100, ((event.clientX + current.offsetX - bounds.left) / bounds.width) * 100)),
        y: Math.max(0, Math.min(100, ((event.clientY + current.offsetY - bounds.top) / bounds.height) * 100)),
        rotation: current.rotation,
      };
      const moved = current.moved || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 8;
      const flower = flowerRef.current;
      const center = flower?.querySelector('.vf-core')?.getBoundingClientRect();
      const petalCenter = flower ? {
        x: bounds.left + (finalPosition.x / 100) * bounds.width,
        y: bounds.top + (finalPosition.y / 100) * bounds.height,
      } : null;
      const distance = center && petalCenter
        ? Math.hypot(petalCenter.x - (center.left + center.width / 2), petalCenter.y - (center.top + center.height / 2))
        : Infinity;
      const threshold = Math.max(44, (center?.width || 80) * 0.9);
      if (moved) {
        suppressClick.current = true;
        window.setTimeout(() => { suppressClick.current = false; }, 0);
        if (!cancelled && distance <= threshold) {
          setPendingDrop({ petalId: current.petal.id, position: { ...finalPosition, frozen: true } });
          setActivePetal(current.petal);
        }
      }
      dragRef.current = null;
      setDrag(null);
    };
    const onPointerUp = (event) => end(event);
    const onPointerCancel = (event) => end(event, true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [Boolean(drag)]);

  if (!sound || targets.length === 0) {
    navigate('/');
    return null;
  }

  const handleSpeakRules = () => {
    setRulesSpeaking(true);
    speakText(GAME_RULES);
    window.setTimeout(() => setRulesSpeaking(false), 2500);
  };

  const openSyllable = (petal) => {
    if (suppressClick.current) return;
    if (!completed.has(petal.id)) {
      setPendingDrop(null);
      setActivePetal(petal);
    }
  };

  const reset = () => {
    setCompleted(new Set());
    setPositions({});
    setPendingDrop(null);
    setCelebrating(false);
    setShowVictory(false);
    setVictoryAnnounced(false);
    celebrationSpoken.current = false;
    setActivePetal(null);
  };

  const completeSyllable = () => {
    if (!activePetal) return;
    setCompleted((previous) => new Set(previous).add(activePetal.id));
    const droppedPosition = pendingDrop?.petalId === activePetal.id ? pendingDrop.position : null;
    const finalPetal = completed.size + 1 === targets.length;
    const completedPosition = droppedPosition
      ? { ...droppedPosition, frozen: true }
      : positions[activePetal.id] || {
          ...getPetalPosition(activePetal.index, targets.length, getInitialPetalRadius(targets.length)),
          rotation: getInitialPetalRotation(activePetal.index, targets.length),
        };
    setPositions((previous) => ({ ...previous, [activePetal.id]: completedPosition }));
    if (finalPetal) setCelebrating(true);
    setPendingDrop(null);
    setActivePetal(null);
  };

  const cancelSyllable = () => {
    if (pendingDrop?.petalId === activePetal?.id) setPendingDrop(null);
    setActivePetal(null);
  };

  useEffect(() => {
    if (!celebrating) return undefined;
    const timer = window.setTimeout(() => {
      setShowVictory(true);
      if (!celebrationSpoken.current) {
        celebrationSpoken.current = true;
        setVictoryAnnounced(true);
        speakText('Молодец, ты собрал цветок полностью!');
      }
    }, 950);
    return () => window.clearTimeout(timer);
  }, [celebrating]);

  const backToGames = () => navigate(`/sound/${soundId}/category/syllables/games`);
  const beginDrag = (event, petal) => {
    if (completed.has(petal.id) || activePetal || dragRef.current) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    const bounds = flowerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const existing = positions[petal.id] || getPetalPosition(petal.index, targets.length, getInitialPetalRadius(targets.length));
    const rect = event.currentTarget.getBoundingClientRect();
    const petalCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const start = {
      petal,
      index: petal.index,
      pointerId: event.pointerId,
      x: existing.x,
      y: existing.y,
      rotation: existing.rotation ?? getInitialPetalRotation(petal.index, targets.length),
      startX: event.clientX,
      startY: event.clientY,
      offsetX: petalCenter.x - event.clientX,
      offsetY: petalCenter.y - event.clientY,
      originX: existing.x,
      originY: existing.y,
      container: bounds,
      moved: false,
    };
    dragRef.current = start;
    setDrag(start);
  };

  const isVictory = completed.size === targets.length;

  return (
    <main className="vowel-flower">
      <div className="vf-topbar">
        <BackButton onClick={backToGames} />
        <div className="vf-topbar__progress" aria-label={`Выполнено ${completed.size} из ${targets.length}`}>
          {Array.from({ length: targets.length }, (_, index) => <span key={index} className={index < completed.size ? 'is-done' : ''} />)}
          <b>{completed.size} / {targets.length}</b>
        </div>
      </div>

      {showRules && <aside className="vf-rules">
        <div><b>Как играть</b><span>{GAME_RULES}</span></div>
        <button type="button" onClick={handleSpeakRules} aria-label="Повторить правила" className={rulesSpeaking ? 'is-speaking' : ''}>♫</button>
      </aside>}

      <section className={`vf-stage${celebrating ? ' is-celebrating' : ''}`} aria-label="Цветок слогов">
        <div className="vf-glow vf-glow--left" /><div className="vf-glow vf-glow--right" />
        <svg className="vf-hills" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120C180 40 300 170 500 100S850 150 1200 70V200H0Z" /></svg>
        <div className="vf-flower" ref={flowerRef}>
          <svg className="vf-stem" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 300C50 240 48 180 50 100" stroke="#4f9d69" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M48 215C15 200 8 175 8 150 35 155 48 175 48 215" fill="#66b878" />
            <path d="M52 175C85 160 92 135 92 110 65 120 52 140 52 175" fill="#7acb87" />
          </svg>
          {targets.map((petal) => {
            const position = positions[petal.id] || (pendingDrop?.petalId === petal.id ? pendingDrop.position : null);
            const petalDrag = drag?.petal.id === petal.id;
            return <Petal key={petal.id} id={petal.id} syllable={petal.syllable} index={petal.index} total={targets.length} completed={completed.has(petal.id)} locked={completed.has(petal.id)} dragging={petalDrag} position={position} dragOffset={petalDrag ? { x: drag.x, y: drag.y } : null} onPointerDown={beginDrag} onClick={openSyllable} />;
          })}
          <div className={`vf-core${drag?.moved ? ' is-target' : ''}`} style={{ '--core-color': sound.color }} aria-label={`Звук ${sound.sound}`}>
            <span className="vf-core__eyes"><i /><i /></span><span className="vf-core__smile" />
            <b>{sound.sound}</b><small>ЦЕНТР</small>
          </div>
        </div>
      </section>

      {activePetal && <SyllableModal key={activePetal.id} syllable={activePetal.syllable} onSuccess={completeSyllable} onCancel={cancelSyllable} />}
      {showVictory && isVictory && !activePetal && <VictoryModal onRestart={reset} onBack={backToGames} announced={victoryAnnounced} />}
    </main>
  );
}
