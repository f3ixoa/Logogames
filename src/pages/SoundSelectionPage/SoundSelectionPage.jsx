import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sounds } from '../../data/sounds';
import SoundCard from '../../components/SoundCard/SoundCard';
import './SoundSelectionPage.css';

const SoundSelectionPage = () => {
  const navigate = useNavigate();

  const handleSoundSelect = (sound) => {
    navigate(`/sound/${sound.id}/categories`);
  };

  return (
    <div className="sound-selection-page">
      <div className="page-header">
        <h1 className="page-title font-headline-lg">Выбери звук для тренировки</h1>
        <p className="page-subtitle font-body-md">Нажми на карточку, чтобы начать работу со звуком</p>
      </div>

      <div className="sounds-grid">
        {sounds.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            onClick={handleSoundSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default SoundSelectionPage;
