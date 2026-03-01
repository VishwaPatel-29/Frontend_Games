const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('timeLeft');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');
const bestScoreEl = document.getElementById('bestScore');
const overlay = document.getElementById('countdownOverlay');

const rows = 3; 
const cols = 6;
const totalPairs = 9;
const initialTime = 60; 

let firstCard = null;
let secondCard = null;
let busy = false;
let moves = 0;
let matchedPairs = 0;
let timeLeft = initialTime;
let timerId = null;
let pendingTimeouts = [];
let bestScore = null;

const values = Array.from({length: totalPairs}, (_, i) => i + 1);

loadBest();
createBoard();
updateUI();

function createBoard() {
    board.innerHTML = '';
    const deck = shuffle([...values, ...values]);
    deck.forEach(val => {
        const card = createCard(val);
        board.appendChild(card);
    });
}

function createCard(value){
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = value;
    const inner = document.createElement('div');
    inner.className = 'inner';
    const front = document.createElement('div'); front.className = 'front'; front.textContent = '';
    const back = document.createElement('div'); back.className = 'back'; back.textContent = value;
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener('click', () => onCardClick(card));
    return card;
}

function shuffle(array){
    for(let i = array.length -1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function onCardClick(card){
    if (busy) return;
    if (card === firstCard || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    busy = true;
    moves++;
    movesEl.innerText = moves;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        pairsEl.innerText = matchedPairs;
        firstCard = null;
        secondCard = null;
        busy = false;

        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        const id = setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;
            busy = false;
            pendingTimeouts = pendingTimeouts.filter(t => t !== id);
        }, 900);
        pendingTimeouts.push(id);
    }
}

startBtn.addEventListener('click', () => {
    resetBoardState();
    startCountdown();
});

function startCountdown(){
    clearInterval(timerId);
    timeLeft = initialTime;
    timeEl.innerText = timeLeft;
    timerId = setInterval(() => {
        timeLeft--;
        timeEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endGame(false);
        }
    }, 1000);
}

function resetBoardState(){
    clearInterval(timerId);
    clearAllPendingTimeouts();
    firstCard = null; secondCard = null; busy = false;
    moves = 0; matchedPairs = 0;
    movesEl.innerText = moves; pairsEl.innerText = matchedPairs;
    timeLeft = initialTime; timeEl.innerText = timeLeft;
    createBoard();
}

restartBtn.addEventListener('click', () => {
    resetBoardState();
    overlay.classList.add('visible');
    let c = 3; overlay.innerText = c;
    const id = setInterval(() => {
        c--; overlay.innerText = c;
        if (c <= 0){
            clearInterval(id);
            overlay.classList.remove('visible');
            startCountdown();
        }
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    if (confirm('Hard reset will clear saved best score. Continue?')){
        localStorage.removeItem('memoryBest');
        bestScore = null; bestScoreEl.innerText = '-';
        resetBoardState();
    }
});

function clearAllPendingTimeouts(){
    pendingTimeouts.forEach(id => clearTimeout(id));
    pendingTimeouts = [];
}

function endGame(won){
    clearInterval(timerId);
    clearAllPendingTimeouts();
    busy = true; 
    const score = won ? moves : Infinity;

    if (won) {
        setTimeout(()=> alert(`You won in ${moves} moves!`), 200);
        checkAndSaveBest(score);
        saveLastScore(moves);
    } else {
        setTimeout(()=> alert('Time up! Try again.'), 200);
        saveLastScore(Number.MAX_SAFE_INTEGER);
    }
}

function saveLastScore(val){
    localStorage.setItem('memoryLastScore', val);
}

function loadBest(){
    const raw = localStorage.getItem('memoryBest');
    bestScore = raw !== null ? parseInt(raw) : null;
    bestScoreEl.innerText = bestScore === null ? '-' : bestScore;
}

function checkAndSaveBest(score){
    const currentBest = localStorage.getItem('memoryBest');
    const best = currentBest !== null ? parseInt(currentBest) : Infinity;
    if (score < best) {
        localStorage.setItem('memoryBest', score);
        bestScoreEl.innerText = score;
        bestScoreEl.parentElement.classList.add('new-best');
        setTimeout(()=> bestScoreEl.parentElement.classList.remove('new-best'), 1200);
    }
}

function updateUI(){
    movesEl.innerText = moves;
    pairsEl.innerText = matchedPairs;
    timeEl.innerText = timeLeft;
}

window._mf = {resetBoardState, createBoard, startCountdown};