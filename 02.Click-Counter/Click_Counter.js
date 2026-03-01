const currentScoreDisplay = document.querySelector('#currentScore');
const highScoreDisplay = document.querySelector('#highScore');

const timerDisplay = document.querySelector('#timer');

const clickButton = document.querySelector('#clickButton');
const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');

const statusMessage = document.querySelector('#statusMessage');
let currentScore = 0;        
let highScore = 0;         
let timeRemaining = 10;     
let gameTimerId = null;    
let isGameActive = false;   

function initializeGame() {
    loadHighScore();
    updateDisplay();
}

function loadHighScore() {
    const savedHighScore = localStorage.getItem('clickGameHighScore');
    
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
    } else {
        highScore = 0;
    }
}

function saveHighScore() {
    localStorage.setItem('clickGameHighScore', currentScore);
    highScore = currentScore;
}

function updateDisplay() {
    currentScoreDisplay.innerText = currentScore;
    highScoreDisplay.innerText = highScore;
    timerDisplay.innerText = timeRemaining;
}

function updateStatus(message) {
    statusMessage.innerText = message;
}

function startGame() {
    currentScore = 0;
    timeRemaining = 10;
    isGameActive = true;
    clickButton.disabled = false;
    startButton.disabled = true;
    updateDisplay();
    updateStatus('Game in progress... Click fast!');

    gameTimerId = setInterval(function() {
        timeRemaining--;
        updateDisplay();
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000); 
}

function endGame() {
    clearInterval(gameTimerId);
    gameTimerId = null;
    isGameActive = false;
    clickButton.disabled = true;
    startButton.disabled = false;
    if (currentScore > highScore) {
        saveHighScore();
        updateStatus(`🎉 New High Score: ${currentScore}! Amazing!`);
    } else {
        updateStatus(`Game Over! Your score: ${currentScore}`);
    }
    
    updateDisplay();
}

function handleClick() {
    if (isGameActive) {
        currentScore++;
        updateDisplay();
    }
}

function resetHighScore() {
    const confirmed = confirm('Are you sure you want to reset your high score?');
    
    if (confirmed) {
        localStorage.removeItem('clickGameHighScore');
        highScore = 0;
        updateDisplay();
        updateStatus('High score has been reset!');
    }
}
clickButton.addEventListener('click', handleClick);
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetHighScore);
initializeGame();