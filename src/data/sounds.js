// Все 11 звуков для логопедических игр
export const sounds = [
  {
    id: "hard-r",
    title: "Твёрдая Р",
    sound: "Р",
    type: "hard",
    color: "#FF6B6B"
  },
  {
    id: "soft-r",
    title: "Мягкая Р",
    sound: "Р`",
    type: "soft",
    color: "#FFB6C1"
  },
  {
    id: "hard-l",
    title: "Твёрдая Л",
    sound: "Л",
    type: "hard",
    color: "#4ECDC4"
  },
  {
    id: "soft-l",
    title: "Мягкая Л",
    sound: "Л`",
    type: "soft",
    color: "#A8E6CF"
  },
  {
    id: "hard-s",
    title: "Твёрдая С",
    sound: "С",
    type: "hard",
    color: "#95E1D3"
  },
  {
    id: "soft-s",
    title: "Мягкая С",
    sound: "С`",
    type: "soft",
    color: "#C7ECEE"
  },
  {
    id: "hard-z",
    title: "Твёрдая З",
    sound: "З",
    type: "hard",
    color: "#FFD93D"
  },
  {
    id: "soft-z",
    title: "Мягкая З",
    sound: "З`",
    type: "soft",
    color: "#FFF89C"
  },
  {
    id: "hard-sh",
    title: "Твёрдая Ш",
    sound: "Ш",
    type: "hard",
    color: "#B983FF"
  },
  {
    id: "hard-zh",
    title: "Твёрдая Ж",
    sound: "Ж",
    type: "hard",
    color: "#94B3FD"
  },
  {
    id: "soft-shch",
    title: "Мягкая Щ",
    sound: "Щ`",
    type: "soft",
    color: "#C9B6E4"
  }
];

export const getSoundById = (soundId) => {
  return sounds.find(sound => sound.id === soundId);
};
