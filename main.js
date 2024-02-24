const tries = document.querySelector('.tries');
const mistakes = document.querySelector('.letters');
const scramble = document.querySelector('.scramble');
const random = document.querySelector('.random');
const reset = document.querySelector('.reset');
const inputs = document.querySelector('.inputs');
const circles = document.querySelectorAll('.circle');
// const circle1 = document.querySelector('#circle-one');
// const circle2 = document.querySelector('#circle-two');
// const circle3 = document.querySelector('#circle-three');
// const circle4 = document.querySelector('#circle-four');
// const circle5 = document.querySelector('#circle-five');

let guess = []; // stores what user inputs
let word = ''; // stores unscrambled word
let mistakesArr = [];
let numberOfTries = 0;

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
  console.log(guess);

  if (next && input.value) {
    next.focus();
  }

  if (input.nextElementSibling == null) {
    console.log('guess:', guess);
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
  let guessString = guess.join('');
  console.log(guessString);

  if (guessString == word) {
    console.log('correct');
  } else {
    console.log('wrong');
  }

  if (numberOfTries < circles.length) {
    circles[numberOfTries].style.backgroundColor = '#7429c6';
    numberOfTries++;
    tries.textContent = `Tries (${numberOfTries}/5):`;
  }
  resetAll();
}

// function isGameOver() {
//   if (numberOfTries === 5) {
//     // add a game over modal with a restart button
//   }
// }

function checkMistakes() {
  let letters = guess.filter((letter) => {
    return ![...word[0]].includes(letter);
  });
  mistakesArr.push(...letters); // push each individual letter to array
  let filtered = [...new Set(mistakesArr)]; // removes duplicates
  mistakes.textContent = filtered.join(', ');
}

function resetAll() {
  let inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });
  guess = [];
}

random.addEventListener('click', function () {
  resetAll();
  fetchWord();
});

reset.addEventListener('click', resetAll);
