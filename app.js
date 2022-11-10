import jsonPaths from './pathlist.json' assert { type: 'json' };
import { handleHighScore, clearBestScore } from './highscore.js';
import createCard from './card.js';
import reloadPage from './reloadPage.js';

const pathList = jsonPaths.pathlist;
const board = document.querySelector('.board');
const spanTimer = document.querySelector('.timer');
const ctnTimer = document.querySelector('.timer-ctn');
const ctnRestart = document.querySelector('.restart-ctn');
const btnRestart = document.querySelector('#restart');
const clearScore = document.querySelector('.clear-score');

const shufflePaths = [];
const selectedPaths = [];
const BOARD_SIZE = pathList.length * 2;
let selectedImg = 0;
let isReadyToFlip = true;
let timer = 0;
let isGameStart = false;

const randomizeCards = () => {
  pathList.forEach((path) => {
    shufflePaths.push(path, path);
  });
  shufflePaths.sort(() => Math.random() - 0.5);
};

const setupBoard = () => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    const card = createCard();
    board.innerHTML += card;
  }

  const cardImgList = document.querySelectorAll('.card-image');

  cardImgList.forEach((img, index) => {
    img.style.backgroundImage = `url('images/${shufflePaths[index]}')`;
  });
};

const handleFlipCards = () => {
  document.addEventListener('click', (e) => {
    if (isReadyToFlip) {
      if (e.target.classList.contains('card-front')) {
        if (!isGameStart) {
          isGameStart = true;
          handleTimer();
        }
        if (selectedImg < 2) {
          const cardInner = e.target.parentNode;
          if (!cardInner.classList.contains('flip-card')) {
            selectedPaths.push(cardInner.querySelector('.card-image').style.backgroundImage);
          }
          cardInner.classList.add('flip-card');
          selectedImg += 1;
        }
        if (selectedImg === 2) {
          isReadyToFlip = false;
          handlePreserveCards();
        }
      }
    }
  });
};

const handlePreserveCards = () => {
  const visibleCards = document.querySelectorAll('.flip-card');
  visibleCards.forEach((card) => {
    if (selectedPaths[0] === selectedPaths[1]) {
      if (!card.classList.contains('done')) {
        card.classList.add('done');
        handleGameWin();
      }
    } else {
      setTimeout(() => {
        handleHideCards(visibleCards);
      }, 600);
    }
  });
  selectedImg = 0;
  selectedPaths.length = 0;
  isReadyToFlip = true;
};

const handleHideCards = (visibleCards) => {
  visibleCards.forEach((card) => {
    if (!card.classList.contains('done')) {
      card.classList.remove('flip-card');
    }
  });
};

const handleGameWin = () => {
  const totalImgFound = document.querySelectorAll('.done').length;
  if (totalImgFound === shufflePaths.length) {
    isGameStart = false;
    const message = document.createElement('h3');
    message.textContent = `Bravo, tu as réussi en ${timer.toFixed(2)} secondes 😸`;
    message.classList.add('show');
    ctnTimer.innerHTML = '';
    ctnTimer.append(message);
    ctnRestart.classList.remove('hide');
    handleHighScore(timer);
  }
};

const handleTimer = () => {
  if (isGameStart) {
    setTimeout(() => {
      timer += 0.1;
      spanTimer.innerHTML = timer.toFixed(2);
      handleTimer();
    }, 100);
  }
};

const gameInit = () => {
  handleHighScore(timer);
  randomizeCards();
  setupBoard();
  handleFlipCards();
};

gameInit();

btnRestart.addEventListener('click', reloadPage);
clearScore.addEventListener('click', clearBestScore);
