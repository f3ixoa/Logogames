// 6 основных категорий для каждого звука
export const categories = [
  {
    id: "articulation",
    title: "Артикуляционная гимнастика",
    icon: "🗣️",
    description: "Упражнения для постановки звука"
  },
  {
    id: "sounds",
    title: "Звуки",
    icon: "🔊",
    description: "Изолированное произношение звука"
  },
  {
    id: "syllables",
    title: "Слоги",
    icon: "🌸",
    description: "Работа со слогами"
  },
  {
    id: "words",
    title: "Слова",
    icon: "📝",
    description: "Произношение слов"
  },
  {
    id: "sentences",
    title: "Предложения",
    icon: "💬",
    description: "Работа с предложениями"
  },
  {
    id: "texts",
    title: "Тексты",
    icon: "📖",
    description: "Чтение и произношение текстов"
  }
];

export const getCategories = () => {
  return categories;
};

export const getCategoryById = (categoryId) => {
  return categories.find(cat => cat.id === categoryId);
};
