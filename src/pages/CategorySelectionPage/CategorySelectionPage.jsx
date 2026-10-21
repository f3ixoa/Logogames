import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getCategories } from '../../data/categories';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import BackButton from '../../components/BackButton/BackButton';
import './CategorySelectionPage.css';

const CategorySelectionPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const categories = getCategories();

  if (!sound) {
    navigate('/');
    return null;
  }

  const handleCategorySelect = (category) => {
    // Категории с несколькими играми идут на выбор игры
    if (category.id === 'sounds' || category.id === 'syllables') {
      navigate(`/sound/${soundId}/category/${category.id}/games`);
    } else {
      // Остальные категории открываются напрямую
      navigate(`/sound/${soundId}/category/${category.id}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="category-selection-page">
      <div className="category-selection-page__header">
        <BackButton onClick={handleBack} />
        <div className="category-selection-page__sound-info">
          <div
            className="category-selection-page__sound-badge"
            style={{ background: sound.color }}
          >
            {sound.sound}
          </div>
          <h1 className="category-selection-page__title">{sound.title}</h1>
        </div>
      </div>

      <div className="category-selection-page__content">
        <p className="category-selection-page__subtitle">Выбери категорию</p>
        <div className="category-selection-page__grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategorySelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionPage;
