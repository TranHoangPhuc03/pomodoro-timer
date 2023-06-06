const DEFAULT_FOCUS_DURATION = 25;
const DEFAULT_SHORT_BREAK_DURATION = 5;
const DEFAULT_LONG_BREAK_DURATION = 15;
const DEFAULT_NUMBERS_CYCLE = 4;

var focusDuration;
var shortBreakDuration;
var longBreakDuration;
var numbersCycle;
var timeRemaining;
var isFocus;
var isEnableLongBreak;

const inputFocusDuration = document.getElementById('focus-duration');
const inputShortBreakDuration = document.getElementById('short-break-duration');
const inputLongBreakDuration = document.getElementById('long-break-duration');
const inputNumbersCycle = document.getElementById('cycles');
const displayTimerNumber = document.getElementById('display__duration');
const checkboxLongBreak = document.getElementById('enable-long-break');

function pageLoading(isSetToDefault = true) {
    if (isSetToDefault) {
        inputFocusDuration.value = DEFAULT_FOCUS_DURATION.toString();
        inputShortBreakDuration.value = DEFAULT_SHORT_BREAK_DURATION.toString();
        inputLongBreakDuration.value = DEFAULT_LONG_BREAK_DURATION.toString();
        inputNumbersCycle.value = DEFAULT_NUMBERS_CYCLE.toString();
        checkboxLongBreak.checked = false;
        document.querySelector('#long-break-box').style.opacity = 0.5;
        inputLongBreakDuration.disabled = false;
        inputNumbersCycle.disabled = false;
    }

    document.getElementById('countdown-bar').style.background = `conic-gradient(var(--body-background-color) 0deg, var(--countdown-cycle-bar-color) 0deg)`;

    focusDuration = parseInt(inputFocusDuration.value) * 60;
    shortBreakDuration = parseInt(inputShortBreakDuration.value) * 60;
    longBreakDuration = parseInt(inputLongBreakDuration.value) * 60;
    numbersCycle = parseInt(inputNumbersCycle.value);

    timeRemaining = focusDuration;
    isFocus = true;
    isPause = false;
    isEnableLongBreak = checkboxLongBreak.checked;

    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining - minutes * 60;

    displayTimerNumber.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const startButton = document.getElementById('play-btn');
startButton.addEventListener('click', () => {
    const timerMode = document.getElementById('display__mode');
    const countdownBar = document.getElementById('countdown-bar');
    const pauseButton = document.getElementById('pause-btn');
    const replayButton = document.getElementById('replay-btn');
    const timeEndSound = new Audio('./assets/sounds/ring-bell.wav');
    let isPause = false;

    startButton.style.visibility = 'hidden';
    pauseButton.style.visibility = 'visible';

    var countdownBarRatios = [focusDuration, shortBreakDuration, longBreakDuration];

    const timerVisibility = () => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining - minutes * 60;
        let countdownBarDegree;
        switch (timerMode.textContent) {
            case 'focus':
                countdownBarDegree = (360 / countdownBarRatios[0]) * (focusDuration - timeRemaining);
                break;
            case 'long break':
                countdownBarDegree = (360 / countdownBarRatios[2]) * (longBreakDuration - timeRemaining);
                break;
            default:
                countdownBarDegree = (360 / countdownBarRatios[1]) * (shortBreakDuration - timeRemaining);
        }

        displayTimerNumber.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownBar.style.background = `conic-gradient(var(--body-background-color) ${countdownBarDegree}deg, var(--countdown-cycle-bar-color) 0deg)`;
    };

    const timer = setInterval(() => {
        if (isPause) return;

        timerVisibility();

        if (timeRemaining === 0) {
            isFocus ^= 1;
            timeEndSound.play();

            if (isFocus) {
                timerMode.textContent = 'focus';
                timeRemaining = focusDuration;
            } else {
                if (isEnableLongBreak) numbersCycle--;
                if (numbersCycle <= 0) {
                    timerMode.textContent = 'long break';
                    timeRemaining = longBreakDuration;
                    numbersCycle = parseInt(inputNumbersCycle.value);
                } else {
                    timerMode.textContent = isEnableLongBreak ? 'short break' : 'break';
                    timeRemaining = shortBreakDuration;
                }
            }
            pause();
            timerVisibility();
        } else timeRemaining--;
    }, 1);

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
        timerVisibility();
        timerMode.textContent = 'focus';
        startButton.style.visibility = 'visible';
        pauseButton.style.visibility = 'hidden';
    });
});

const settingWindow = document.getElementById('setting');

document.getElementById('setting-btn').addEventListener('click', () => {
    settingWindow.style.display = 'block';
});

const closeSettingWindow = document.getElementById('close-btn');
closeSettingWindow.addEventListener('click', () => {
    settingWindow.style.display = 'none';
});

document.getElementById('save-btn').addEventListener('click', () => {
    pageLoading(false);
    closeSettingWindow.click();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    pageLoading();
});

checkboxLongBreak.addEventListener('change', function () {
    let longBreakBox = document.querySelector('#long-break-box');
    if (this.checked) {
        longBreakBox.style.opacity = 1;
        inputLongBreakDuration.disabled = false;
        inputNumbersCycle.disabled = false;
    } else {
        longBreakBox.style.opacity = 0.5;
        inputLongBreakDuration.disabled = true;
        inputNumbersCycle.disabled = true;
    }
});

document.addEventListener('DOMContentLoaded', pageLoading());
