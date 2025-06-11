/**
 * Settings Module
 * Handles user preferences and application settings
 */

const Settings = (() => {
    // DOM Elements
    let workDurationInput;
    let shortBreakDurationInput;
    let longBreakDurationInput;
    let autoStartBreaksCheckbox;
    let autoStartPomodorosCheckbox;
    let enableNotificationsCheckbox;
    let enableSoundsCheckbox;
    let notificationSoundSelect;
    let saveSettingsButton;
    let resetSettingsButton;
    let exportDataButton;
    let importDataButton;
    let importFileInput;

    // Default settings
    const defaultSettings = {
        timer: {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            autoStartBreaks: true,
            autoStartPomodoros: false
        },
        notifications: {
            enabled: true,
            sounds: true,
            soundType: 'bell'
        }
    };

    /**
     * Initialize the settings module
     */
    function init() {
        // Get DOM elements
        workDurationInput = document.getElementById('work-duration');
        shortBreakDurationInput = document.getElementById('short-break-duration');
        longBreakDurationInput = document.getElementById('long-break-duration');
        autoStartBreaksCheckbox = document.getElementById('auto-start-breaks');
        autoStartPomodorosCheckbox = document.getElementById('auto-start-pomodoros');
        enableNotificationsCheckbox = document.getElementById('enable-notifications');
        enableSoundsCheckbox = document.getElementById('enable-sounds');
        notificationSoundSelect = document.getElementById('notification-sound');
        saveSettingsButton = document.getElementById('save-settings');
        resetSettingsButton = document.getElementById('reset-settings');
        exportDataButton = document.getElementById('export-data');
        importDataButton = document.getElementById('import-data');
        importFileInput = document.getElementById('import-file');

        // Set up event listeners
        saveSettingsButton.addEventListener('click', saveSettings);
        resetSettingsButton.addEventListener('click', resetSettings);
        exportDataButton.addEventListener('click', exportAllData);
        importDataButton.addEventListener('click', () => {
            importFileInput.click();
        });
        importFileInput.addEventListener('change', importData);

        // Load settings from storage
        loadSettings();
    }

    /**
     * Load settings from storage
     */
    function loadSettings() {
        // Load timer settings
        const timerSettings = Storage.getItem('timerSettings');
        if (timerSettings) {
            const parsedSettings = JSON.parse(timerSettings);
            workDurationInput.value = parsedSettings.workDuration / 60 || defaultSettings.timer.workDuration;
            shortBreakDurationInput.value = parsedSettings.shortBreakDuration / 60 || defaultSettings.timer.shortBreakDuration;
            longBreakDurationInput.value = parsedSettings.longBreakDuration / 60 || defaultSettings.timer.longBreakDuration;
            autoStartBreaksCheckbox.checked = parsedSettings.autoStartBreaks !== undefined ?
                parsedSettings.autoStartBreaks : defaultSettings.timer.autoStartBreaks;
            autoStartPomodorosCheckbox.checked = parsedSettings.autoStartPomodoros !== undefined ?
                parsedSettings.autoStartPomodoros : defaultSettings.timer.autoStartPomodoros;
        } else {
            // Use default settings
            workDurationInput.value = defaultSettings.timer.workDuration;
            shortBreakDurationInput.value = defaultSettings.timer.shortBreakDuration;
            longBreakDurationInput.value = defaultSettings.timer.longBreakDuration;
            autoStartBreaksCheckbox.checked = defaultSettings.timer.autoStartBreaks;
            autoStartPomodorosCheckbox.checked = defaultSettings.timer.autoStartPomodoros;
        }

        // Load notification settings
        const notificationSettings = Storage.getItem('notificationSettings');
        if (notificationSettings) {
            const parsedSettings = JSON.parse(notificationSettings);
            enableNotificationsCheckbox.checked = parsedSettings.enabled !== undefined ?
                parsedSettings.enabled : defaultSettings.notifications.enabled;
            enableSoundsCheckbox.checked = parsedSettings.sounds !== undefined ?
                parsedSettings.sounds : defaultSettings.notifications.sounds;
            notificationSoundSelect.value = parsedSettings.soundType || defaultSettings.notifications.soundType;
        } else {
            // Use default settings
            enableNotificationsCheckbox.checked = defaultSettings.notifications.enabled;
            enableSoundsCheckbox.checked = defaultSettings.notifications.sounds;
            notificationSoundSelect.value = defaultSettings.notifications.soundType;
        }
    }

    /**
     * Save settings
     */
    function saveSettings() {
        // Validate inputs
        const workDuration = parseInt(workDurationInput.value, 10);
        const shortBreakDuration = parseInt(shortBreakDurationInput.value, 10);
        const longBreakDuration = parseInt(longBreakDurationInput.value, 10);

        if (isNaN(workDuration) || workDuration < 1 || workDuration > 120) {
            alert('Work duration must be between 1 and 120 minutes.');
            return;
        }

        if (isNaN(shortBreakDuration) || shortBreakDuration < 1 || shortBreakDuration > 30) {
            alert('Short break duration must be between 1 and 30 minutes.');
            return;
        }

        if (isNaN(longBreakDuration) || longBreakDuration < 1 || longBreakDuration > 60) {
            alert('Long break duration must be between 1 and 60 minutes.');
            return;
        }

        // Save timer settings
        const timerSettings = {
            workDuration: workDuration * 60, // Convert to seconds
            shortBreakDuration: shortBreakDuration * 60, // Convert to seconds
            longBreakDuration: longBreakDuration * 60, // Convert to seconds
            autoStartBreaks: autoStartBreaksCheckbox.checked,
            autoStartPomodoros: autoStartPomodorosCheckbox.checked
        };

        Storage.setItem('timerSettings', JSON.stringify(timerSettings));

        // Save notification settings
        const notificationSettings = {
            enabled: enableNotificationsCheckbox.checked,
            sounds: enableSoundsCheckbox.checked,
            soundType: notificationSoundSelect.value
        };

        Storage.setItem('notificationSettings', JSON.stringify(notificationSettings));

        // Update timer with new settings
        Timer.updateSettings({
            workDuration,
            shortBreakDuration,
            longBreakDuration,
            autoStartBreaks: autoStartBreaksCheckbox.checked,
            autoStartPomodoros: autoStartPomodorosCheckbox.checked
        });

        // Update notifications with new settings
        Notifications.updateSettings({
            enabled: enableNotificationsCheckbox.checked,
            sounds: enableSoundsCheckbox.checked,
            soundType: notificationSoundSelect.value
        });

        // Show success message
        alert('Settings saved successfully!');
    }

    /**
     * Reset settings to defaults
     */
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            // Reset timer settings
            workDurationInput.value = defaultSettings.timer.workDuration;
            shortBreakDurationInput.value = defaultSettings.timer.shortBreakDuration;
            longBreakDurationInput.value = defaultSettings.timer.longBreakDuration;
            autoStartBreaksCheckbox.checked = defaultSettings.timer.autoStartBreaks;
            autoStartPomodorosCheckbox.checked = defaultSettings.timer.autoStartPomodoros;

            // Reset notification settings
            enableNotificationsCheckbox.checked = defaultSettings.notifications.enabled;
            enableSoundsCheckbox.checked = defaultSettings.notifications.sounds;
            notificationSoundSelect.value = defaultSettings.notifications.soundType;

            // Save default settings
            saveSettings();
        }
    }

    /**
     * Export all application data
     */
    function exportAllData() {
        // Get all data from storage
        const data = Storage.exportData();

        if (data) {
            // Convert to JSON
            const jsonData = JSON.stringify(data, null, 2);

            // Create a blob and download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Create filename with date
            const date = new Date().toISOString().slice(0, 10);
            const filename = `pomodoro_data_${date}.json`;

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

            // Show success message
            alert(I18n.translate('export_success'));
        } else {
            alert(I18n.translate('export_error'));
        }
    }

    /**
     * Import data from file
     * @param {Event} event - Change event from file input
     */
    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                // Import data
                const success = Storage.importData(data);

                if (success) {
                    alert(I18n.translate('import_success'));
                    // Reload the page to apply imported data
                    window.location.reload();
                } else {
                    alert(I18n.translate('import_error'));
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert(I18n.translate('import_error'));
            }
        };

        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    // Public API
    return {
        init,
        exportAllData,
        importData
    };
})();
