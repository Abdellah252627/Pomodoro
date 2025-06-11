/**
 * Timer Module
 * Handles the Pomodoro timer functionality
 */

const Timer = (() => {
    // Private variables
    let timerInterval;
    let currentTime = 0;
    let isRunning = false;
    let isPaused = false;
    let currentSession = 'work'; // 'work', 'shortBreak', 'longBreak'
    let sessionsCompleted = 0;
    let isFocusMode = false;

    // DOM Elements
    let timerElement;
    let sessionTypeElement;
    let startButton;
    let pauseButton;
    let resetButton;
    let completedSessionsElement;
    let sessionIndicators;
    let focusModeTimerElement;
    let focusModeSessionTypeElement;

    // Settings
    let workDuration = 25 * 60; // 25 minutes in seconds
    let shortBreakDuration = 5 * 60; // 5 minutes in seconds
    let longBreakDuration = 15 * 60; // 15 minutes in seconds
    let autoStartBreaks = true;
    let autoStartPomodoros = false;

    /**
     * Initialize the timer module
     */
    function init() {
        // Get DOM elements
        timerElement = document.getElementById('timer');
        sessionTypeElement = document.getElementById('session-type');
        startButton = document.getElementById('start-timer');
        pauseButton = document.getElementById('pause-timer');
        resetButton = document.getElementById('reset-timer');
        completedSessionsElement = document.getElementById('completed-sessions');
        sessionIndicators = document.querySelectorAll('.indicator');
        focusModeTimerElement = document.getElementById('focus-mode-timer');
        focusModeSessionTypeElement = document.getElementById('focus-mode-session-type');

        // Load settings from storage
        loadSettings();

        // Set initial timer value
        currentTime = workDuration;
        updateTimerDisplay();

        // Set up event listeners
        startButton.addEventListener('click', startTimer);
        pauseButton.addEventListener('click', pauseTimer);
        resetButton.addEventListener('click', resetTimer);

        // Load session state from storage if available
        loadSessionState();
    }

    /**
     * Load timer settings from storage
     */
    function loadSettings() {
        const settings = Storage.getItem('timerSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            workDuration = parsedSettings.workDuration || workDuration;
            shortBreakDuration = parsedSettings.shortBreakDuration || shortBreakDuration;
            longBreakDuration = parsedSettings.longBreakDuration || longBreakDuration;
            autoStartBreaks = parsedSettings.autoStartBreaks !== undefined ? parsedSettings.autoStartBreaks : autoStartBreaks;
            autoStartPomodoros = parsedSettings.autoStartPomodoros !== undefined ? parsedSettings.autoStartPomodoros : autoStartPomodoros;
        }
    }

    /**
     * Save timer settings to storage
     */
    function saveSettings() {
        const settings = {
            workDuration,
            shortBreakDuration,
            longBreakDuration,
            autoStartBreaks,
            autoStartPomodoros
        };
        Storage.setItem('timerSettings', JSON.stringify(settings));
    }

    /**
     * Load session state from storage
     */
    function loadSessionState() {
        const state = Storage.getItem('sessionState');
        if (state) {
            const parsedState = JSON.parse(state);
            sessionsCompleted = parsedState.sessionsCompleted || 0;
            updateCompletedSessions();
        }
    }

    /**
     * Save session state to storage
     */
    function saveSessionState() {
        const state = {
            sessionsCompleted
        };
        Storage.setItem('sessionState', JSON.stringify(state));
    }

    /**
     * Start the timer
     */
    function startTimer() {
        if (isPaused) {
            isPaused = false;
        } else {
            // If timer is not paused, set the current time based on session type
            if (!isRunning) {
                if (currentSession === 'work') {
                    currentTime = workDuration;
                } else if (currentSession === 'shortBreak') {
                    currentTime = shortBreakDuration;
                } else {
                    currentTime = longBreakDuration;
                }
            }
        }

        isRunning = true;

        // Update button states
        startButton.disabled = true;
        pauseButton.disabled = false;
        resetButton.disabled = false;

        // Start the interval
        timerInterval = setInterval(() => {
            currentTime--;
            updateTimerDisplay();

            if (currentTime <= 0) {
                clearInterval(timerInterval);
                handleSessionComplete();
            }
        }, 1000);
    }

    /**
     * Pause the timer
     */
    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = true;

        // Update button states
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    /**
     * Reset the timer
     */
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = false;

        // Reset time based on current session
        if (currentSession === 'work') {
            currentTime = workDuration;
        } else if (currentSession === 'shortBreak') {
            currentTime = shortBreakDuration;
        } else {
            currentTime = longBreakDuration;
        }

        updateTimerDisplay();

        // Update button states
        startButton.disabled = false;
        pauseButton.disabled = true;
        resetButton.disabled = true;
    }

    /**
     * Handle session completion
     */
    function handleSessionComplete() {
        // Play notification sound
        Notifications.playSound();

        // Show browser notification
        if (currentSession === 'work') {
            Notifications.show('Work session complete!', 'Time for a break.');
            sessionsCompleted++;
            updateCompletedSessions();
            saveSessionState();

            // Log completed session for statistics
            Statistics.logSession({
                type: 'work',
                duration: workDuration,
                timestamp: new Date()
            });

            // Check for achievements
            Achievements.checkAchievements();

            // Determine next break type
            if (sessionsCompleted % 4 === 0) {
                switchToSession('longBreak');
            } else {
                switchToSession('shortBreak');
            }
        } else {
            Notifications.show('Break complete!', 'Time to focus.');

            // Log completed break for statistics
            Statistics.logSession({
                type: currentSession,
                duration: currentSession === 'shortBreak' ? shortBreakDuration : longBreakDuration,
                timestamp: new Date()
            });

            switchToSession('work');
        }

        // Auto-start next session if enabled
        if ((currentSession === 'work' && autoStartBreaks) ||
            (currentSession !== 'work' && autoStartPomodoros)) {
            startTimer();
        } else {
            // Reset button states
            startButton.disabled = false;
            pauseButton.disabled = true;
            resetButton.disabled = false;
        }
    }

    /**
     * Switch to a different session type
     * @param {string} sessionType - Type of session ('work', 'shortBreak', 'longBreak')
     */
    function switchToSession(sessionType) {
        currentSession = sessionType;

        // Update session type display and timer classes
        if (sessionType === 'work') {
            // Update text content
            sessionTypeElement.textContent = 'Work Session';
            sessionTypeElement.style.color = 'var(--primary-color)';
            if (isFocusMode) {
                focusModeSessionTypeElement.textContent = 'Work Session';
            }

            // Update timer classes
            timerElement.classList.add('work-session');
            timerElement.classList.remove('break-session');
            if (isFocusMode) {
                focusModeTimerElement.classList.add('work-session');
                focusModeTimerElement.classList.remove('break-session');
            }
        } else {
            // For both short and long breaks
            const breakText = sessionType === 'shortBreak' ? 'Short Break' : 'Long Break';
            sessionTypeElement.textContent = breakText;
            sessionTypeElement.style.color = 'var(--secondary-color)';
            if (isFocusMode) {
                focusModeSessionTypeElement.textContent = breakText;
            }

            // Update timer classes
            timerElement.classList.add('break-session');
            timerElement.classList.remove('work-session');
            if (isFocusMode) {
                focusModeTimerElement.classList.add('break-session');
                focusModeTimerElement.classList.remove('work-session');
            }
        }

        // Set timer duration based on session type
        if (sessionType === 'work') {
            currentTime = workDuration;
        } else if (sessionType === 'shortBreak') {
            currentTime = shortBreakDuration;
        } else {
            currentTime = longBreakDuration;
        }

        updateTimerDisplay();
    }

    /**
     * Update the timer display
     */
    function updateTimerDisplay() {
        const formattedTime = formatTime(currentTime);

        // Check if we should use Arabic numerals
        const isArabic = document.documentElement.getAttribute('dir') === 'rtl';
        const displayTime = isArabic ? I18n.toArabicNumerals(formattedTime) : formattedTime;

        timerElement.textContent = displayTime;
        if (isFocusMode) {
            focusModeTimerElement.textContent = displayTime;
        }

        // Update document title
        const sessionType = currentSession === 'work' ?
            (isArabic ? 'عمل' : 'Work') :
            (isArabic ? 'استراحة' : 'Break');
        const appName = isArabic ? 'مؤقت بومودورو' : 'Pomodoro Timer';
        document.title = `${displayTime} - ${sessionType} - ${appName}`;
    }

    /**
     * Update completed sessions display
     */
    function updateCompletedSessions() {
        completedSessionsElement.textContent = sessionsCompleted;

        // Update session indicators
        sessionIndicators.forEach((indicator, index) => {
            if (index < (sessionsCompleted % 4)) {
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('completed');
            }
        });
    }

    /**
     * Sync focus mode with main timer
     * @param {boolean} enabled - Whether focus mode is enabled
     */
    function syncFocusMode(enabled) {
        isFocusMode = enabled;
    }

    /**
     * Update timer settings
     * @param {Object} settings - New timer settings
     */
    function updateSettings(settings) {
        workDuration = settings.workDuration * 60;
        shortBreakDuration = settings.shortBreakDuration * 60;
        longBreakDuration = settings.longBreakDuration * 60;
        autoStartBreaks = settings.autoStartBreaks;
        autoStartPomodoros = settings.autoStartPomodoros;

        // If timer is not running, update current time based on session
        if (!isRunning && !isPaused) {
            if (currentSession === 'work') {
                currentTime = workDuration;
            } else if (currentSession === 'shortBreak') {
                currentTime = shortBreakDuration;
            } else {
                currentTime = longBreakDuration;
            }
            updateTimerDisplay();
        }

        saveSettings();
    }

    // Public API
    return {
        init,
        startTimer,
        pauseTimer,
        resetTimer,
        updateSettings,
        syncFocusMode
    };
})();
