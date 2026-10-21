import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  return (
    <button
      className="category-card"
      onClick={() => onClick(category)}
    >
      <div className="category-card__icon">{category.icon}</div>
      <div className="category-card__content">
        <div className="category-card__title">{category.title}</div>
        <div className="category-card__description">{category.description}</div>
      </div>
    </button>
  );
};

export default CategoryCard;
