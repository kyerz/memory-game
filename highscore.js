const storage = localStorage;
const hitScore = document.querySelector('.hitscore');

export const handleHighScore = (timer) => {
  const currentTimer = timer.toFixed(2);
  if (storage.getItem('score') === null) {
    storage.setItem('score', 0);
  } else if (+storage.getItem('score') === 0) {
    storage.setItem('score', currentTimer);
  } else if (+storage.getItem('score') > timer && timer !== 0) {
    storage.setItem('score', currentTimer);
  }
  hitScore.textContent = storage.getItem('score');
};

export const clearBestScore = () => {
  storage.setItem('score', 0);
  hitScore.textContent = storage.getItem('score');
};
