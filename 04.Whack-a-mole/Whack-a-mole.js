const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');

let score = 0;
let maxScore = 0;
let timeLeft = 30;
let gameActive = false;
let gameTimer = null;
loadMaxScore();
function loadMaxScore() {
    const saved = localStorage.getItem('whackAMoleMaxScore');
    maxScore = saved !== null ? parseInt(saved) : 0;
    maxScoreDisplay.innerText = maxScore;
}

function saveMaxScore() {
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem('whackAMoleMaxScore', maxScore);
        maxScoreDisplay.innerText = maxScore;
    }
}

function randomHole() {
    const randomIndex = Math.floor(Math.random() * holes.length);
    return holes[randomIndex];
}

function randomTime(min, max) {
    return Math.random() * (max - min) + min;
}

function popUp() {
    if (!gameActive) return;
    
    const time = randomTime(500, 1500);
    const hole = randomHole();
    const mole = hole.querySelector('.mole');
    
    mole.classList.add('up');
    
    setTimeout(function() {
        mole.classList.remove('up');
        if (gameActive) popUp();
    }, time);
}

function bonk(event) {
    if (!event.isTrusted) return;
    if (!this.classList.contains('up')) return;
    
    score++;
    this.classList.remove('up');
    this.classList.add('bonked');
    scoreDisplay.innerText = score;
    
    setTimeout(() => this.classList.remove('bonked'), 300);
}

function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    scoreDisplay.innerText = 0;
    timeLeftDisplay.innerText = 30;
    startBtn.disabled = true;
    
    popUp();
    
    gameTimer = setInterval(function() {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    startBtn.disabled = false;
    saveMaxScore();
    
    if (score > maxScore - score) {
        alert(`🎉 New Record! Score: ${score}`);
    } else {
        alert(`Game Over! Score: ${score}`);
    }
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);