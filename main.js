// make so it can only accept letters

const tries = document.querySelector('.tries');
const mistakes = document.querySelector('.letters');
const scramble = document.querySelector('.scramble');
const random = document.querySelector('.random');
const clear = document.querySelector('.clear');
const inputs = document.querySelector('.inputs');
const circles = document.querySelectorAll('.circle');

let guess = []; // stores what user inputs
let word = ''; // stores unscrambled word
let mistakesArr = []; // stores incorrect letters that user guesses
let guessString = '';
let numberOfTries = 0;
let isGuessCorrect = false;

async function fetchWord() {
  try {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?length=6'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    word = await response.json();
    console.log('word:', word);
    scrambled(word);
    return word;
  } catch (error) {
    console.error('An error occured:', error);
  }
}

// scrambles word
function scrambled(word) {
  let split = [...word[0]];
  console.log('word split:', split);
  for (let i = 0; i < split.length - 1; i++) {
    let j = Math.floor(Math.random() * split.length);
    let temp = split[i];
    split[i] = split[j];
    split[j] = temp;
  }
  console.log('scrambled:', split);
  scramble.textContent = split.join('');
}

fetchWord();

// adds letters to ui when typed
inputs.addEventListener('input', function (e) {
  const input = e.target;

  if (input.value) {
    guess.splice(input.dataset.index - 1, 1, input.value);
  }

  const next = input.nextElementSibling;

  if (next && input.value) {
    next.focus();
  }

  if (input.nextElementSibling == null) {
    checkMistakes();
    checkGuess();
    document.querySelector('input').focus(); // puts focus back on first input box
  }
});

// deletes letter when backspace/delete key is pressed
document.addEventListener('keydown', function (e) {
  if (e.key === 'Backspace' || e.key === 'Del') {
    const index = e.target.dataset.index - 1;
    guess.splice(index, 1, '');
  }
});

// checks to see if guess is correct
function checkGuess() {
  guessString = guess.join('');

  if (guessString == word) {
    isGuessCorrect = true;
    // console.log('correct');
    isGameOver();
  } else {
    // console.log('wrong');
    isGameOver();
  }
  resetInput();
}

function isGameOver() {
  let modalContainer = document.querySelector('.modal-container');
  if (!modalContainer) {
    modalContainer = createModalContainer();
  }

  const showWord = modalContainer.querySelector('.show-word');
  const img = document.querySelector('img');

  if (numberOfTries >= 4) {
    updateTries();
    showModal(modalContainer, 'Game Over!');
    img.src = './images/undraw_feeling_blue_-4-b7q.svg';
    showWord.textContent = `The word was ${word}`;
  } else if (isGuessCorrect) {
    showModal(modalContainer, 'Congrats!');
    showWord.textContent = `The word was ${word}`;
    img.src = './images/undraw_celebrating_rtuv.svg';
  } else {
    updateTries();
  }
}

function showModal(modalContainer, message) {
  modalContainer.classList.remove('hidden');
  const h2 = modalContainer.querySelector('h2');
  h2.textContent = message;
}

function updateTries() {
  if (numberOfTries <= circles.length) {
    circles[numberOfTries].style.backgroundColor = '#7429c6';
    numberOfTries++;
    tries.textContent = `Tries (${numberOfTries}/5):`;
  }
}

function createModalContainer() {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container', 'hidden');

  const modal = document.createElement('div');
  modal.className = 'modal';

  const h2 = document.createElement('h2');

  const img = document.createElement('img');

  const showWord = document.createElement('p');
  showWord.className = 'show-word';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'restart';
  restartBtn.textContent = 'Restart';
  restartBtn.addEventListener('click', function () {
    isGuessCorrect = false;
    modalContainer.classList.add('hidden');
    resetGame();
  });

  modal.append(h2, img, showWord, restartBtn);

  modalContainer.append(modal);

  document.body.appendChild(modalContainer);

  return modalContainer;
}

function checkMistakes() {
  let letters = guess.filter((letter) => {
    return ![...word[0]].includes(letter);
  });
  mistakesArr.push(...letters); // push each individual letter to array
  let filtered = [...new Set(mistakesArr)]; // removes duplicates
  mistakes.textContent = filtered.join(', ');
}

function resetInput() {
  let inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
  guess = [];
}

function resetGame() {
  circles.forEach((circle) => {
    circle.style.backgroundColor = '#4A5567';
  });
  numberOfTries = 0;
  tries.textContent = 'Tries (0/5):';

  mistakes.textContent = '';
  mistakesArr = [];
  resetInput();
  fetchWord();
}

random.addEventListener('click', resetGame);
clear.addEventListener('click', resetInput);
