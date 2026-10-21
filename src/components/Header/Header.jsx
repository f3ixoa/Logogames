import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Парсим путь для хлебных крошек
  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (pathParts.length > 0 && pathParts[0] === 'sound') {
      const soundId = pathParts[1];
      breadcrumbs.push({ label: `Звук [${soundId.toUpperCase()}]`, active: false });

      if (pathParts[2] === 'categories') {
        breadcrumbs.push({ label: 'Выбор категории', active: true });
      } else if (pathParts[2] === 'category') {
        const categoryId = pathParts[3];
        const categoryNames = {
          'articulation': 'Артикуляция',
          'sounds': 'Звуки',
          'syllables': 'Слоги',
          'words': 'Слова',
          'sentences': 'Предложения',
          'texts': 'Тексты'
        };
        breadcrumbs.push({ label: categoryNames[categoryId] || categoryId, active: false });

        if (pathParts[4] === 'games') {
          breadcrumbs.push({ label: 'Выбор игры', active: true });
        } else if (pathParts[4] === 'game') {
          breadcrumbs.push({ label: 'Игра', active: true });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-icon">
              <span className="logo-emoji">🎯</span>
            </div>
            <span className="logo-text font-headline-sm">ЛогоИгры</span>
          </div>

          {breadcrumbs.length > 0 && (
            <nav className="breadcrumbs" aria-label="Хлебные крошки">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span
                    className={`breadcrumb-item font-label-md ${crumb.active ? 'active' : ''}`}
                  >
                    {crumb.label}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <span className="breadcrumb-separator">›</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        <div className="header-right">
          <div className="child-profile">
            <span className="status-indicator"></span>
            <span className="child-name font-label-md">Мунара (67 лет)</span>
            <span className="dropdown-icon">▾</span>
          </div>

          <div className="header-divider"></div>

          <button
            className="header-btn"
            aria-label="Звук в игре"
            title="Управление звуком"
          >
            <span className="btn-icon">🔊</span>
          </button>

          <button
            className="header-btn"
            aria-label="Настройки"
            title="Настройки и профиль логопеда"
          >
            <span className="btn-icon">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
