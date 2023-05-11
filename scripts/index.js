const DEFAULT_FOCUS_DURATION = 25;
const DEFAULT_BREAK_DURATION = 5;

var focusDuration;
var breakDuration;
var timeRemaining;
var isFocus;

function pageLoad() {
    document.getElementById('focus-duration').value = DEFAULT_FOCUS_DURATION.toString();
    document.getElementById('short-break-duration').value = DEFAULT_BREAK_DURATION.toString();
    focusDuration = parseInt(document.getElementById('focus-duration').value) * 60;
    breakDuration = parseInt(document.getElementById('short-break-duration').value) * 60;
    timeRemaining = focusDuration;
    isFocus = true;
    isPause = false;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining - minutes * 60;

    const timerNumber = document.getElementById('display__duration');
    timerNumber.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const startButton = document.getElementById('play-btn');
startButton.addEventListener('click', () => {
    const timerNumber = document.getElementById('display__duration');
    const timerMode = document.getElementById('display__mode');
    const countdownBar = document.getElementById('countdown-bar');
    const pauseButton = document.getElementById('pause-btn');
    const replayButton = document.getElementById('replay-btn');
    const timeEndSound = new Audio('./assets/sounds/ring-bell.wav');
    let isPause = false;

    startButton.style.visibility = 'hidden';
    pauseButton.style.visibility = 'visible';

    const timervisibility = () => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining - minutes * 60;
        let countdownBarRatio = 360 / (isFocus ? focusDuration : breakDuration);

        timerNumber.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownBar.style.background = `conic-gradient(var(--body-background-color) ${countdownBarRatio * ((isFocus ? focusDuration : breakDuration) - timeRemaining)}deg, var(--countdown-cycle-bar-color) 0deg)`;
    };

    const timer = setInterval(() => {
        if (isPause) return;

        timervisibility();

        if (timeRemaining === 0) {
            isFocus ^= 1;
            timeEndSound.play();
            if (isFocus) {
                timerMode.textContent = 'focus';
                timeRemaining = focusDuration;
            } else {
                timerMode.textContent = 'break';
                timeRemaining = breakDuration;
            }
            pause();
            timervisibility();
        } else timeRemaining--;
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

        /* Reset visibility */
        timervisibility();
        timerMode.textContent = 'focus';
        startButton.style.visibility = 'visible';
        pauseButton.style.visibility = 'hidden';
    });
});

const settingButton = document.getElementById('setting-btn');
const settingWindow = document.getElementById('setting');
settingButton.addEventListener('click', () => {
    settingWindow.style.display = 'block';
});

const closeSettingWindow = document.getElementById('close-btn');
closeSettingWindow.addEventListener('click', () => {
    settingWindow.style.display = 'none';
});

const saveSetting = document.getElementById('save-btn');
saveSetting.addEventListener('click', () => {
    pageLoad();
    closeSettingPopup.click();
});

const resetSetting = document.getElementById('reset-btn');
resetSetting.addEventListener('click', () => {
    document.getElementById('focus-duration').value = DEFAULT_FOCUS_DURATION;
    document.getElementById('break-duration').value = DEFAULT_BREAK_DURATION;
});

document.addEventListener('DOMContentLoaded', pageLoad);
