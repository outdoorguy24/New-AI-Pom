let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;
let isRunning = false;
let totalTime = 25 * 60; // Total time for the current mode
let sessionsCompleted = 0;
let totalMinutesWorked = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const modeToggleButton = document.getElementById('mode-toggle');
const modeText = document.getElementById('mode-text');
const progressRing = document.querySelector('.progress-ring-circle');
const startPauseIcon = startPauseButton.querySelector('i');

// Progress ring setup
const radius = progressRing.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = '0';

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update progress ring
    const progress = timeLeft / totalTime;
    const offset = circumference - (progress * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function updateModeButton() {
    // Button should show what you'll switch TO, not current mode
    modeToggleButton.innerHTML = isWorkTime ? 
        '<i class="fas fa-coffee"></i> Rest Mode' : 
        '<i class="fas fa-briefcase"></i> Work Mode';
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    // Change colors based on mode
    if (isWorkTime) {
        document.body.classList.remove('rest-mode');
    } else {
        document.body.classList.add('rest-mode');
    }
}

function toggleMode() {
    pauseTimer();
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    updateDisplay();
    updateModeButton();
}

function toggleStartPause() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timerId !== null) return; // Timer is already running
    
    isRunning = true;
    startPauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    timerId = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            isRunning = false;
            
            // Update stats
            if (isWorkTime) {
                sessionsCompleted++;
                totalMinutesWorked += Math.floor(totalTime / 60);
                updateStats();
            }
            
            // Switch modes automatically when timer ends
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
            totalTime = timeLeft;
            updateModeButton();
            startPauseButton.innerHTML = '<i class="fas fa-play"></i> Start';
            
            // Play sound or notification here if desired
            alert(isWorkTime ? 'Break is over! Time to work!' : 'Work session complete! Take a break!');
        }
        
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    if (timerId === null) return; // Timer is not running
    
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    startPauseButton.innerHTML = '<i class="fas fa-play"></i> Start';
}

function resetTimer() {
    pauseTimer();
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    updateDisplay();
    startPauseButton.innerHTML = '<i class="fas fa-play"></i> Start';
}

function updateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues[0].textContent = sessionsCompleted;
    statValues[1].textContent = totalMinutesWorked;
}

startPauseButton.addEventListener('click', toggleStartPause);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

// Initialize display and button state
updateDisplay();
updateModeButton();
updateStats(); 