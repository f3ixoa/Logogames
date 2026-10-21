// Слова для каждого звука
export const words = {
  "hard-r": [
    { word: "РАК", image: "🦀", description: "Рак" },
    { word: "РОЗА", image: "🌹", description: "Роза" },
    { word: "РУКА", image: "✋", description: "Рука" },
    { word: "РЫБА", image: "🐟", description: "Рыба" },
    { word: "РАДУГА", image: "🌈", description: "Радуга" },
    { word: "РАКЕТА", image: "🚀", description: "Ракета" }
  ],
  "soft-r": [
    { word: "РЯБИНА", image: "🌳", description: "Рябина" },
    { word: "РЯЖЕНКА", image: "🥛", description: "Ряженка" },
    { word: "РЮКЗАК", image: "🎒", description: "Рюкзак" },
    { word: "РЕКА", image: "🏞️", description: "Река" },
    { word: "РИС", image: "🍚", description: "Рис" }
  ],
  "hard-l": [
    { word: "ЛУК", image: "🧅", description: "Лук" },
    { word: "ЛАМПА", image: "💡", description: "Лампа" },
    { word: "ЛОДКА", image: "🚣", description: "Лодка" },
    { word: "ЛУНА", image: "🌙", description: "Луна" },
    { word: "ЛЕС", image: "🌲", description: "Лес" }
  ],
  "soft-l": [
    { word: "ЛИМОН", image: "🍋", description: "Лимон" },
    { word: "ЛИСА", image: "🦊", description: "Лиса" },
    { word: "ЛЕНТА", image: "🎀", description: "Лента" },
    { word: "ЛЕБЕДЬ", image: "🦢", description: "Лебедь" },
    { word: "ЛИСТ", image: "🍃", description: "Лист" }
  ],
  "hard-s": [
    { word: "СОК", image: "🧃", description: "Сок" },
    { word: "СЛОН", image: "🐘", description: "Слон" },
    { word: "СОВА", image: "🦉", description: "Сова" },
    { word: "СОЛНЦЕ", image: "☀️", description: "Солнце" },
    { word: "СОБАКА", image: "🐕", description: "Собака" }
  ],
  "soft-s": [
    { word: "СИТО", image: "🥄", description: "Сито" },
    { word: "СИНИЦА", image: "🐦", description: "Синица" },
    { word: "СЕМЬ", image: "7️⃣", description: "Семь" },
    { word: "СИРЕНЬ", image: "💜", description: "Сирень" }
  ],
  "hard-z": [
    { word: "ЗАЯЦ", image: "🐰", description: "Заяц" },
    { word: "ЗОНТ", image: "☂️", description: "Зонт" },
    { word: "ЗАМОК", image: "🏰", description: "Замок" },
    { word: "ЗЕБРА", image: "🦓", description: "Зебра" }
  ],
  "soft-z": [
    { word: "ЗИМА", image: "❄️", description: "Зима" },
    { word: "ЗЕМЛЯ", image: "🌍", description: "Земля" },
    { word: "ЗЕРКАЛО", image: "🪞", description: "Зеркало" }
  ],
  "hard-sh": [
    { word: "ШАР", image: "🎈", description: "Шар" },
    { word: "ШАПКА", image: "🧢", description: "Шапка" },
    { word: "ШУБА", image: "🧥", description: "Шуба" },
    { word: "МЫШЬ", image: "🐭", description: "Мышь" }
  ],
  "hard-zh": [
    { word: "ЖУК", image: "🪲", description: "Жук" },
    { word: "ЖИРАФ", image: "🦒", description: "Жираф" },
    { word: "ЁЖ", image: "🦔", description: "Ёж" },
    { word: "ЖАБА", image: "🐸", description: "Жаба" }
  ],
  "soft-shch": [
    { word: "ЩЁТКА", image: "🪥", description: "Щётка" },
    { word: "ЩУКА", image: "🐟", description: "Щука" },
    { word: "ЩЕНОК", image: "🐶", description: "Щенок" },
    { word: "ПЛАЩ", image: "🧥", description: "Плащ" }
  ]
};

export const getWords = (soundId) => {
  return words[soundId] || [];
};
