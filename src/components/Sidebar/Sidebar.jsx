import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'alphabet-hub',
      label: 'Азбука звуков',
      icon: '🔤',
      path: '/',
      color: 'primary'
    },
    {
      id: 'active-session',
      label: 'Текущая игра',
      icon: '🎮',
      path: '/current-game',
      color: 'secondary'
    },
    {
      id: 'exercise-categories',
      label: 'Категории упражнений',
      icon: '📚',
      path: '/categories',
      color: 'tertiary'
    },
    {
      id: 'articulation-gym',
      label: 'Артикуляционная гимнастика',
      icon: '😊',
      path: '/articulation',
      color: 'primary'
    },
    {
      id: 'slp-analytics',
      label: 'Журнал успехов',
      icon: '📊',
      path: '/analytics',
      color: 'outline'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label font-label-sm">Каталог звуков и игр</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
            className={`sidebar-item font-label-md ${isActive(item.path) ? 'active' : ''}`}
            data-color={item.color}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="reward-card">
          <span className="reward-icon">⭐</span>
          <div className="reward-content">
            <span className="reward-label font-label-sm">Награда дня</span>
            <span className="reward-value font-headline-sm">12 звёздочек</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
