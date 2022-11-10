const board = document.querySelector('.board');
const spanTimer = document.querySelector('.timer');
const ctnTimer = document.querySelector('.timer-ctn');
const ctnRestart = document.querySelector('.restart-ctn');
const btnRestart = document.querySelector('#restart');
const hitScore = document.querySelector('.hitscore');
const pathList = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpg',
  '10.jpg',
  '11.jpg',
  '12.jpg',
];
const storage = localStorage;
const shufflePaths = [];
const selectedPaths = [];
const BOARD_SIZE = pathList.length * 2;
const NB_COLS = 6;
const NB_ROWS = BOARD_SIZE / NB_COLS;
let selectedImg = 0;
let isReadyToFlip = true;
let timer = 0;
let isRunning = false;
let isGameStart = false;

const handleHighScore = () => {
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

const createCard = () => {
  const card = `
  <div class="card">
  <div class="card-inner">
    <div class="card-front">
      <div class="card-content">
        <p>PlaceHolder</p>
      </div>
    </div>
    <div class="card-back">
      <div class="card-top">
        <div class="card-image">
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  return card;
};

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
          cardInner.classList.add('flip-card');
          selectedPaths.push(cardInner.querySelector('.card-image').style.backgroundImage);
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
    ctnTimer.innerHTML = '';
    ctnTimer.append(message);
    ctnRestart.classList.remove('hide');
    handleHighScore();
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
  handleHighScore();
  randomizeCards();
  setupBoard();
  handleFlipCards();
};

btnRestart.addEventListener('click', (e) => {
  window.location.reload();
});

gameInit();
