export const isSpeechSynthesisSupported = () => (
  typeof window !== 'undefined'
  && 'speechSynthesis' in window
  && typeof window.SpeechSynthesisUtterance === 'function'
);

export const speakText = (text) => {
  if (!isSpeechSynthesisSupported()) return false;

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
  return true;
};
