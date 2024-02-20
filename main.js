const tries = document.querySelector('.tries');
const mistakes = document.querySelector('.mistakes');
const scramble = document.querySelector('.scramble');
const random = document.querySelector('.random');
const reset = document.querySelector('.reset');
const type = document.querySelector('.type');
// const box1 = document.querySelector('#1');
// const box2 = document.querySelector('#2');
// const box3 = document.querySelector('#3');
// const box4 = document.querySelector('#4');
// const box5 = document.querySelector('#5');
// const box6 = document.querySelector('#6');

const guess = []; // stores what user types
let word = '';

async function fetchWord() {
  try {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?length=6'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    word = await response.json();
    console.log(word);
    scrambled(word.join(''));
    return word;
  } catch (error) {
    console.error('An error occured:', error);
  }
}

//scrambles word
function scrambled(str) {
  arr = str.split('');
  for (let i = 0; i < arr.length - 1; i++) {
    let j = Math.floor(Math.random() * arr.length);
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  console.log(arr);
  scramble.textContent = arr.join('');
  return arr.join('');
}

fetchWord();

// adds letters to ui when typed
type.addEventListener('input', function (e) {
  const input = e.target;

  if (input.value) {
    guess.splice(input.dataset.index - 1, 1, input.value);
  }

  const next = input.nextElementSibling;
  console.log(guess);

  if (next && input.value) {
    next.focus();
  }

  if (input.nextElementSibling == null) {
    checkGuess();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Backspace' || e.key === 'Del') {
    const index = e.target.dataset.index - 1;
    guess.splice(index, 1, '');
  }
});

function checkGuess() {
  let guessJoined = guess.join('');
  console.log(guessJoined);

  if (guessJoined == word) {
    console.log('correct');
  } else {
    console.log('wrong');
  }
}

random.addEventListener('click', function () {
  fetchWord();
});
