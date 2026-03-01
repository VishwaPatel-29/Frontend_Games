const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');

const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace.",
    "Typing speed is an essential skill for anyone working with computers in today’s fast-paced and technology-driven professional environment.",
    "Developing strong typing skills not only improves productivity but also enhances confidence when communicating through emails, reports, and online platforms.",
    "Regular typing practice helps individuals increase their speed while maintaining high levels of accuracy during complex documentation tasks.",
    "In modern workplaces, employees are expected to complete digital tasks efficiently, which makes fast and accurate typing a valuable asset.",
    "Mastering keyboard techniques allows professionals to focus more on creative thinking rather than struggling with manual input errors.",
    "Consistent typing exercises can significantly reduce mistakes and improve overall performance during timed assessments or competitive exams.",
    "Strong typing abilities are particularly important for programmers, writers, data entry operators, and administrative professionals.",
    "Maintaining proper posture and correct finger placement while typing helps prevent fatigue and improves long-term efficiency.",
    "Many organizations rely on digital documentation systems that require employees to enter information quickly and without errors.",
    "The ability to type fluently enables students and professionals to complete assignments and projects within strict deadlines.",
    "Accurate typing reduces the need for constant editing and proofreading, ultimately saving valuable time during busy workdays.",
    "Practicing structured typing lessons daily can lead to noticeable improvement in both speed and precision over time.",
    "Employers often consider typing speed as an indicator of efficiency and overall computer literacy in technical roles.",
    "Developing muscle memory through repeated practice makes it easier to type long paragraphs without looking at the keyboard.",
    "Effective communication in the digital era depends heavily on the ability to type messages clearly and efficiently.",
    "Timed typing tests provide measurable feedback that helps individuals track their progress and identify areas for improvement.",
    "Fast and accurate typing skills are essential when handling large amounts of data in corporate or academic settings.",
    "The integration of technology into everyday tasks has increased the importance of mastering basic keyboard skills.",
    "Practicing with challenging paragraphs can improve concentration, endurance, and overall typing consistency.",
    "Efficient typing allows professionals to multitask effectively while maintaining the quality of their written content.",
    "Building typing endurance is important for individuals who spend long hours drafting documents or coding software applications.",
    "A well-designed typing speed test game can motivate users to practice regularly and compete with their previous scores.",
    "Learning advanced keyboard shortcuts alongside typing skills can significantly enhance workflow efficiency.",
    "Consistent performance tracking encourages users to set realistic goals and gradually improve their typing benchmarks.",
    "High typing proficiency provides a competitive advantage in academic examinations and professional recruitment processes.",
    "In a digitally connected world, the demand for fast and precise typists continues to grow across various industries.",
    "Investing time in improving typing speed today can lead to greater productivity and success in future professional endeavors."
];

let currentText = '';
let timeLeft = 45;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;

loadBestWPM();

function loadBestWPM() {
    const saved = sessionStorage.getItem('typingTestBestWPM');
    bestWPM = saved !== null ? parseInt(saved) : 0;
    bestWPMDisplay.innerText = bestWPM;
}

function saveBestWPM(wpm) {
    if (wpm > bestWPM) {
        bestWPM = wpm;
        sessionStorage.setItem('typingTestBestWPM', bestWPM);
        bestWPMDisplay.innerText = bestWPM;
    }
}

function startTest() {
    
    timeLeft = 45;
    isTestActive = true;
    startTime = null;
    
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.innerText = currentText;
    
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
   
    startBtn.disabled = true;
    
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    
    if (timeLeft <= 0) {
        endTest();
    }
    
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff6b6b';
    }
}

typingArea.addEventListener('input', function() {
    if (!isTestActive) return;
    
    if (!startTime) {
        startTime = Date.now();
    }
    updateStats();
    highlightText();
});

function updateStats() {
    const typedText = typingArea.value;
    
    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    const words = typedText.trim().split(/\s+/).filter(w => w.length > 0);
    const wpm = elapsedMinutes > 0 ? Math.round(words.length / elapsedMinutes) : 0;
    wpmDisplay.innerText = wpm;
    
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    const accuracy = typedText.length > 0 
        ? (correctChars / typedText.length * 100).toFixed(1)
        : 100;
    accuracyDisplay.innerText = `${accuracy}%`;
}

function highlightText() {
    const typedText = typingArea.value;
    let highlightedHTML = '';
    
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedHTML += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedHTML += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else if (i === typedText.length) {
            highlightedHTML += `<span class="current">${currentText[i]}</span>`;
        } else {
            highlightedHTML += currentText[i];
        }
    }
    
    textDisplay.innerHTML = highlightedHTML;
}

function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    typingArea.disabled = true;
    startBtn.disabled = false;
    
    const finalWPM = parseInt(wpmDisplay.innerText);
    saveBestWPM(finalWPM);
    
    alert(`Test Complete!\nWPM: ${finalWPM}\nAccuracy: ${accuracyDisplay.innerText}`);
}
function resetSession() {
    if (confirm('Reset session best score?')) {
        sessionStorage.removeItem('typingTestBestWPM');
        bestWPM = 0;
        bestWPMDisplay.innerText = 0;
    }
}
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetSession);