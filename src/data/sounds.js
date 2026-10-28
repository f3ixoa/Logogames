// Все 11 звуков для логопедических игр
export const sounds = [
  {
    id: "hard-r",
    title: "Твёрдая Р",
    sound: "Р",
    type: "hard",
    color: "#94B3FD"
  },
  {
    id: "soft-r",
    title: "Мягкая Р",
    sound: "Р`",
    type: "soft",
    color: "#4ECDC4"
  },
  {
    id: "hard-l",
    title: "Твёрдая Л",
    sound: "Л",
    type: "hard",
    color:  "#94B3FD"
  },
  {
    id: "soft-l",
    title: "Мягкая Л",
    sound: "Л`",
    type: "soft",
    color: "#4ECDC4"
  },
  {
    id: "hard-s",
    title: "Твёрдая С",
    sound: "С",
    type: "hard",
    color: "#94B3FD"
  },
  {
    id: "soft-s",
    title: "Мягкая С",
    sound: "С`",
    type: "soft",
    color: "#4ECDC4"
  },
  {
    id: "hard-z",
    title: "Твёрдая З",
    sound: "З",
    type: "hard",
    color: "#94B3FD"
  },
  {
    id: "soft-z",
    title: "Мягкая З",
    sound: "З`",
    type: "soft",
    color: "#4ECDC4"
  },
  {
    id: "hard-sh",
    title: "Твёрдая Ш",
    sound: "Ш",
    type: "hard",
    color: "#94B3FD"
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
    color: "#4ECDC4"
  }
];

export const getSoundById = (soundId) => {
  return sounds.find(sound => sound.id === soundId);
};
