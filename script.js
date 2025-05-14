let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;
let isRunning = false;
let totalTime = 25 * 60; // Total time for the current mode

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

// Add these variables at the top with the other declarations
const focusModal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const focusSubmit = document.getElementById('focus-submit');
const currentFocusContainer = document.getElementById('current-focus-container');
const currentFocus = document.getElementById('current-focus');
let currentFocusText = '';

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
        // If timer is not running and we're about to start
        if (timeLeft === totalTime) {
            // Only show focus modal in work mode
            if (isWorkTime) {
                showFocusModal();
            } else {
                // In rest mode, just start the timer directly
                startTimer();
            }
        } else {
            // If we're just resuming after a pause, start the timer directly
            startTimer();
        }
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

function createFireworks() {
    const container = document.getElementById('firework-container');
    container.style.display = 'block';
    container.innerHTML = '';
    
    // Create more fireworks
    for (let i = 0; i < 8; i++) {  // Increased from 5 to 8
        setTimeout(() => {
            createFireworkBurst(container);
        }, i * 300);
    }
    
    // Hide container after animation completes
    setTimeout(() => {
        container.style.display = 'none';
    }, 4000);  // Increased from 3000 to 4000 to accommodate more fireworks
}

function createFireworkBurst(container) {
    // Create a burst point
    const burstX = Math.random() * window.innerWidth;
    const burstY = Math.random() * window.innerHeight * 0.6;  // Increased from 0.5 to 0.6
    
    // Create particles for this burst
    for (let i = 0; i < 40; i++) {  // Increased from 30 to 40
        const particle = document.createElement('div');
        particle.className = 'firework';
        
        // Random color with higher saturation and brightness
        const hue = Math.floor(Math.random() * 360);
        particle.style.backgroundColor = `hsl(${hue}, 100%, 65%)`;  // Increased brightness from 60% to 65%
        particle.style.boxShadow = `0 0 15px 5px hsl(${hue}, 100%, 65%)`;  // Increased glow
        
        // Random direction with greater distance
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 80;  // Increased from 100+50 to 150+80
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        
        // Position at burst point
        particle.style.left = `${burstX}px`;
        particle.style.top = `${burstY}px`;
        
        container.appendChild(particle);
    }
}

function showFocusModal() {
    focusModal.style.display = 'flex';
    focusInput.focus();
    
    // Handle Enter key press
    focusInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitFocus();
        }
    });
}

function submitFocus() {
    currentFocusText = focusInput.value.trim();
    
    if (currentFocusText) {
        currentFocus.textContent = `Focusing on: ${currentFocusText}`;
        currentFocusContainer.classList.remove('hidden');
    } else {
        currentFocusContainer.classList.add('hidden');
    }
    
    focusModal.style.display = 'none';
    focusInput.value = '';
    startTimer();
}

function resetTimer() {
    // Only show fireworks if timer was running and we're resetting after completion
    // AND we're in work mode
    const showCelebration = (isRunning || timeLeft < totalTime) && isWorkTime;
    
    pauseTimer();
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    totalTime = timeLeft;
    updateDisplay();
    startPauseButton.innerHTML = '<i class="fas fa-play"></i> Start';
    
    // Hide the current focus
    currentFocusContainer.classList.add('hidden');
    
    // Show fireworks if we were in the middle of a session and in work mode
    if (showCelebration) {
        createFireworks();
    }
}

startPauseButton.addEventListener('click', toggleStartPause);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

// Add event listener for the focus submit button
focusSubmit.addEventListener('click', submitFocus);

// Initialize display and button state
updateDisplay();
updateModeButton(); 