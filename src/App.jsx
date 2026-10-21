import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import SoundSelectionPage from './pages/SoundSelectionPage/SoundSelectionPage';
import CategorySelectionPage from './pages/CategorySelectionPage/CategorySelectionPage';
import GameSelectionPage from './pages/GameSelectionPage/GameSelectionPage';
import WordsPage from './pages/WordsPage/WordsPage';
import SentencesPage from './pages/SentencesPage/SentencesPage';
import TextsPage from './pages/TextsPage/TextsPage';
import ArticulationPage from './pages/ArticulationPage/ArticulationPage';
import VowelFlower from './games/VowelFlower/VowelFlower';
import SpeechLadder from './games/SpeechLadder/SpeechLadder';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        {/* Главная страница - выбор звука */}
        <Route path="/" element={<SoundSelectionPage />} />

        {/* Выбор категории для выбранного звука */}
        <Route path="/sound/:soundId/categories" element={<CategorySelectionPage />} />

        {/* Выбор игры для категории */}
        <Route path="/sound/:soundId/category/:categoryId/games" element={<GameSelectionPage />} />

        {/* Игры */}
        <Route path="/sound/:soundId/category/syllables/game/vowel-flower" element={<VowelFlower />} />
        <Route path="/sound/:soundId/category/syllables/game/speech-ladder" element={<SpeechLadder />} />

        {/* Контентные категории */}
        <Route path="/sound/:soundId/category/words" element={<WordsPage />} />
        <Route path="/sound/:soundId/category/sentences" element={<SentencesPage />} />
        <Route path="/sound/:soundId/category/texts" element={<TextsPage />} />
        <Route path="/sound/:soundId/category/articulation" element={<ArticulationPage />} />

        {/* Redirect для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
