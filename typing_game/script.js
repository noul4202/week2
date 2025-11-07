const quotes = [
 'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
 'There is nothing more deceptive than an obvious fact.',
 'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
 'I never make exceptions. An exception disproves the rule.',
 'What one man can invent another can discover.',
 'Nothing clears up a case so much as stating it to another person.',
 'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const inputField = document.getElementById('typed-value');
const modalBestScore = document.getElementById('modal-best-score');
const modalCurrentScore = document.getElementById('modal-current-score');
const modalCloseButton = document.getElementById('modal-close-button');

const modalContainer =  document.getElementById('modal-container');

showModal = (currentScore) => {
    let bestScore = localStorage.getItem('typingGameBestScore');

    if(currentScore < parseFloat(bestScore) || bestScore === null) {
        localStorage.setItem('typingGameBestScore', currentScore);
        bestScore = currentScore;
    }

    startButton.disabled = false;
    startButton.classList.remove('disabled-style');
    inputField.disabled = true;
    inputField.classList.add('disabled-style');

    modalBestScore.innerHTML = 'Best score: ' + bestScore;
    modalCurrentScore.innerHTML = 'Your score: ' + currentScore;

    quoteElement.style.fontSize = '20px';
    modalContainer.classList.remove('hidden');
};

document.getElementById('start').addEventListener('click',() => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.focus();
    startTime = new Date().getTime();
    startButton.disabled = true;
    startButton.classList.add('disabled-style');
    inputField.disabled = false;
    inputField.classList.remove('disabled-style');
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;
    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        const currentScore = (elapsedTime / 1000);

        const bestScore = localStorage.getItem('typingGameBestScore');
        if(bestScore === null || currentScore < parseFloat(bestScore)) {
            localStorage.setItem('typingGameBestScore', currentScore);
        }

        showModal(currentScore);

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) { //
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
        wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
        quoteElement.style.fontSize = '20px';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});

typedValueElement.addEventListener('input', () => {
    const currentSizeStr = window.getComputedStyle(quoteElement).fontSize;
    const currentSize = parseFloat(currentSizeStr);

    const newSize = currentSize + 1;

    quoteElement.style.fontSize = newSize + 'px';
}); 

modalCloseButton.addEventListener('click', () => {
    modalContainer.classList.add('hidden');
});
