const focusDuration = 25 * 60; //in seconds
const breakDuration = 5 * 60;
const focusTitle = document.getElementById('focus');
const breakTitle = document.getElementById('break');

var timeRemaining = focusDuration;
var isFocus = true;

function startTimer() {
    const timerNumber = document.getElementById('clock');
    const countdownBar = document.getElementById('countdown-bar');
    const pauseButton = document.getElementById('pause-button');
    const replayButton = document.getElementById('replay-button');
    const timeEndSound = new Audio("./ring-bell.wav");
    let isPause = false;

    startButton.style.visibility = 'hidden';
    pauseButton.style.visibility = 'visible';

    const timerDisplay = () => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining - minutes * 60;
        let countdownBarRatio = 360 / (isFocus ? focusDuration : breakDuration);
        
        timerNumber.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownBar.style.background = `conic-gradient(var(--color-primary) ${countdownBarRatio * ((isFocus ? focusDuration : breakDuration) - timeRemaining)}deg, var(--color-font-active) 0deg)`;
    };

    const timer = setInterval(() => {
        if (isPause) return;
        
        timerDisplay();

        if (timeRemaining === 0) {
            isFocus ^= 1;
            timeEndSound.play();
            if (isFocus) {
                focusTitle.classList.add('active');
                breakTitle.classList.remove('active');
                timeRemaining = focusDuration;
            }
            else {
                focusTitle.classList.remove('active');
                breakTitle.classList.add('active');
                timeRemaining = breakDuration;
            }
            pause();
            timerDisplay();
        }
        else timeRemaining--;
    }, 1000);

    const pause = () => {
        isPause = true;
        startButton.style.visibility = 'visible';
        pauseButton.style.visibility = 'hidden';
    };

    pauseButton.addEventListener('click', pause);

    replayButton.addEventListener('click', () => {
        clearInterval(timer);
        
        /* Reset variable */
        timeRemaining = focusDuration;
        isFocus = true;

        /* Reset display */
        timerDisplay();
        focusTitle.classList.add('active');
        breakTitle.classList.remove('active');
        startButton.style.visibility = 'visible';
        pauseButton.style.visibility = 'hidden';
    });
}

focusTitle.classList.add('active');

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startTimer);