// Игры для каждой категории
export const games = {
  sounds: [
    {
      id: "sound-path",
      title: "Дорожки-Бродилки",
      icon: "🛤️",
      description: "Пройди путь, правильно произнося звук",
      category: "sounds"
    },
    {
      id: "sound-flowers",
      title: "Звуковые цветы",
      icon: "🌺",
      description: "Выбери цветы с нужным звуком",
      category: "sounds"
    },
    {
      id: "catch-sound",
      title: "Поймай звук",
      icon: "🦜",
      description: "Поймай и повтори нужный звук",
      category: "sounds"
    }
  ],
  syllables: [
    {
      id: "vowel-flower",
      title: "Цветок гласных звуков",
      icon: "🌸",
      description: "Работа со слогами через цветок",
      category: "syllables"
    },
    {
      id: "speech-ladder",
      title: "Речевая лесенка",
      icon: "🪜",
      description: "Поднимайся по ступенькам",
      category: "syllables"
    }
  ]
};

export const getGamesByCategory = (categoryId) => {
  return games[categoryId] || [];
};

export const getGameById = (gameId) => {
  for (let category in games) {
    const game = games[category].find(g => g.id === gameId);
    if (game) return game;
  }
  return null;
};
