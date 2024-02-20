const tries = document.querySelector('.tries');
const mistakes = document.querySelector('.mistakes');
const scramble = document.querySelector('.scramble');
const random = document.querySelector('.random');
const reset = document.querySelector('.reset');
const type = document.querySelector('.type');
const box1 = document.querySelector('.box-1');
const box2 = document.querySelector('.box-2');
const box3 = document.querySelector('.box-3');
const box4 = document.querySelector('.box-4');
const box5 = document.querySelector('.box-5');
const box6 = document.querySelector('.box-6');

let guess = [];

async function fetchWord() {
  try {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?length=6'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const word = await response.json();
    console.log(word);
    scrambled([word].join(''));
    return word;
  } catch (error) {
    console.error('An error occured:', error);
  }
}

function scrambled(str) {
  arr = Array.from(str);
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

type.addEventListener('input', function (e) {
  const input = e.target;
  guess.push(input.value);
  const next = input.nextElementSibling;
  console.log(guess);

  if (next && input.value) {
    next.focus();
  }
});

random.addEventListener('click', function () {
  fetchWord();
});
